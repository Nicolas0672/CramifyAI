import { courseOutline } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { AI_TEXT_RESPONSE_TABLE, USER_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import { eq } from "drizzle-orm";
import moment from "moment/moment";
import { NextResponse } from "next/server";

import { getAuth, clerkClient } from "@clerk/nextjs/server"
import { rateLimiter } from "../rateLimiter";

export async function POST(req) {
    try {
        // Parse request body
        const { courseId, topic, courseType, courseLayout, difficultyLevel, createdBy } = await req.json();
        let amount;
        
        // Authentication check
        const { userId } = getAuth(req);
        if (!userId) return NextResponse.json({ error: "Unauthorized: No userId" }, { status: 401 });
    
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const userEmail = user.emailAddresses[0]?.emailAddress;

        if (!userEmail || userEmail !== createdBy) {
          return NextResponse.json({
            error: "Unauthorized: Email mismatch",
            status: 401,
            debug: {
              userEmail,
              createdBy,
            },
          }, { status: 401 });
        }
    
        // Rate limiting check
        const { success } = await rateLimiter.limit(userId);
        if (!success) {
            return NextResponse.json({
                success: false,
                message: "Rate limit exceeded. Please try again later.",
            }, { status: 429 });
        }

        // Get user and determine amount of topics
        const userRes = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, createdBy));
        amount = userRes[0].isMember ? 5 : 3;
        
        // Generate course layout using AI with improved prompt
        const prompt = `
Generate a high-quality study guide for "${topic}" (type: ${courseType}, level: ${difficultyLevel}).

**CRITICAL INSTRUCTIONS - READ CAREFULLY:**
1. IMPORTANT: If ${courseLayout} contains user weaknesses, PRIORITIZE addressing these weaknesses
2. ESSENTIAL: All math expressions MUST be written in plain text format (NO LaTeX, NO dollar signs, NO backslashes)
3. CRITICAL: Output MUST be valid, parseable JSON with properly escaped characters

**Content Structure:**
- Introduction to "${topic}" explaining importance and learning objectives
- 3 chapters with ${amount} topics each
- Each chapter should target specific knowledge gaps if identified in ${courseLayout}

**Quality Requirements:**
- TARGETED: Address specific weaknesses identified
- INSIGHTFUL: Provide deep explanations beyond surface-level
- STRUCTURED: Organize content with clear progression

**REQUIRED JSON FORMAT:**
{
  "courseTitle": "Descriptive Title for ${topic}",
  "courseType": "${courseType}",
  "difficultyLevel": "${difficultyLevel}",
  "courseSummary": "Concise overview focusing on key weaknesses",
  "chapters": [
    {
      "title": "Chapter Title",
      "emoji": "📊",
      "summary": "Chapter summary addressing weaknesses",
      "topics": [
        {
          "topicName": "Topic Name",
          "description": "Clear description with plain text math (if needed)"
        }
      ]
    }
  ]
}

**JSON FORMATTING RULES - EXTREMELY IMPORTANT:**
1. Math expressions: Write "summation from i=1 to n" NOT "\\$\\sum_{i=1}^{n}\\$"
2. NO backslashes (\\) in output - they cause JSON parsing errors
3. ALL quotes within strings MUST be escaped with a single backslash
4. NO markdown code blocks or LaTeX formatting

REMEMBER: Valid JSON syntax is THE MOST CRITICAL requirement.
`;

        console.log("Sending prompt to AI...");

        // Call AI to generate course content
        const aiResp = await courseOutline.sendMessage(prompt);
        console.log("Received response from AI");

        if (!aiResp || !aiResp.response) {
            throw new Error("No response received from AI model");
        }

        // Get the AI response text
        const aiText = aiResp.response.text();
        
        // Enhanced JSON extraction and parsing
        const extractAndParseJson = (text) => {
            // First, try to find JSON content between curly braces
            const jsonRegex = /\{[\s\S]*\}/;
            const match = text.match(jsonRegex);
            
            let jsonString = match ? match[0] : text;
            
            // Remove any code block markers
            jsonString = jsonString
                .replace(/```json\s*/, '')
                .replace(/```\s*$/, '')
                .trim();
            
            try {
                return JSON.parse(jsonString);
            } catch (error) {
                console.error("First parsing attempt failed:", error);
                
                // Try another approach - if there are unescaped quotes or other issues
                try {
                    // Handle common JSON formatting issues
                    const fixedJson = jsonString
                        // Fix unescaped quotes within string values
                        .replace(/(?<="[^"]*)(")(?=[^"]*")/g, '\\"')
                        // Remove any remaining markdown formatting
                        .replace(/\*\*/g, '')
                        // Remove any remaining LaTeX-style formatting
                        .replace(/\\\$/g, '')
                        .replace(/\\\\/g, '\\');
                    
                    return JSON.parse(fixedJson);
                } catch (secondError) {
                    console.error("Second parsing attempt failed:", secondError);
                    throw new Error("Unable to parse AI response as JSON");
                }
            }
        };

        try {
            console.log("Attempting to parse AI response...");
            const aiResult = extractAndParseJson(aiText);
            console.log("Successfully parsed AI response");

            // Store in database
            const dbResult = await db.insert(AI_TEXT_RESPONSE_TABLE).values({
                courseId: courseId,
                aiResponse: aiResult,
                createdBy: createdBy,
                createdAt: moment().format("DD-MM-yyyy")
            }).returning({ resp: AI_TEXT_RESPONSE_TABLE });

            // Trigger Inngest function
            await inngest.send({
                name: 'notes.generate',
                data: {
                    course: dbResult[0].resp
                }
            });

            // Update user credits
            const userInfo = await db.select().from(USER_TABLE).where(eq(USER_TABLE?.email, createdBy));
            const newTotal = 1 + userInfo[0]?.totalCredits;
            const remainingCredits = (userInfo[0]?.newFreeCredits + userInfo[0]?.newPurchasedCredit) - 1;
            const newFreeCredits = userInfo[0]?.newFreeCredits - 1;
          
            await db.update(USER_TABLE).set({
                totalCredits: newTotal,
                newFreeCredits: newFreeCredits < 0 ? 0 : newFreeCredits,
                remainingCredits: remainingCredits < 0 ? 0 : remainingCredits
            }).where(eq(USER_TABLE?.email, createdBy));

            return NextResponse.json({ 
                success: true,
                result: dbResult[0] 
            });

        } catch (parseError) {
            console.error("Failed to parse AI response:", parseError);
            
            return NextResponse.json({
                success: false,
                error: "Failed to parse AI response as valid JSON",
                message: parseError.message
            }, { status: 500 });
        }

    } catch (error) {
        console.error("Error in course generation API:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}