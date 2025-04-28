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
Generate a high-quality study guide for the course. The topic is "${topic}", the course type is "${courseType}", the difficulty level is "${difficultyLevel}", and the course layout is provided as "${courseLayout}".

**IMPORTANT INSTRUCTIONS:**
1. If courseLayout is provided as JSON containing user conversation data (summary, strengths, weaknesses, improvements, rating), parse this information and prioritize addressing the identified WEAKNESSES in your generated content.
2. Ensure the output is valid, parseable JSON with properly escaped characters.
3. CRITICAL: When including math expressions, DO NOT use LaTeX format with dollar signs and backslashes. Instead, write math expressions in plain text format that JSON can handle without escaping issues.

**Content Requirements:**
1. **Introduction**: Provide a clear and engaging introduction to "${topic}", explaining its importance, relevance, and learning objectives.

2. **Chapter Breakdown**: Create 3 chapters with ${amount} topics each:
   - If user weaknesses are identified on ${courseLayout}, design chapters that specifically target these weak areas
   - Otherwise, follow the general course layout provided

3. **Content Quality Standards**:
   - **Targeted**: Address specific knowledge gaps or weaknesses identified
   - **Insightful**: Provide deep, meaningful explanations beyond surface-level
   - **Engaging**: Use clear language with relevant examples
   - **Structured**: Organize content logically with clear progression
   - **Actionable**: Include practical application tips

4. **Output Format**: Provide a complete study guide in the following JSON structure:

{
  "courseTitle": "Descriptive Title for ${topic} Course",
  "courseType": "${courseType}",
  "difficultyLevel": "${difficultyLevel}",
  "courseSummary": "Concise overview of the course focusing on addressing key weaknesses if identified",
  "courseLayout": "Custom structure based on ${courseLayout} with focus on weak areas",
  "chapters": [
    {
      "title": "Chapter Title",
      "emoji": "📊",
      "summary": "Chapter summary with emphasis on addressing weaknesses",
      "topics": [
        {
          "topicName": "Topic 1",
          "description": "Description of topic 1 with plain text math (if needed)"
        },
        {
          "topicName": "Topic 2",
          "description": "Description of topic 2 with plain text math (if needed)"
        }
      ]
    }
  ]
}

**CRITICAL JSON FORMATTING INSTRUCTIONS:**
1. Write math expressions in plain text (e.g., "summation from i=1 to n of f(x_i) * delta x" instead of "\\$\\sum_{i=1}^{n} f(x_i) \\Delta x\\$")
2. Avoid using backslashes (\\) in your output as they cause JSON parsing issues
3. If you need to include special characters, ensure they are properly JSON-encoded
4. Ensure all quotes within strings are properly escaped with a single backslash
5. Only include valid JSON syntax - no markdown code blocks, no LaTeX formatting

The MOST IMPORTANT thing is to ensure your response can be correctly parsed as JSON, even if it means simplifying mathematical notation.
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