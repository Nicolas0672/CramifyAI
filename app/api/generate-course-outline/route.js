import { courseOutline } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { AI_TEXT_RESPONSE_TABLE, PROGRESS_CREDITS_COMPLETED_TABLE, USER_TABLE } from "@/configs/schema";
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
        let amount
        const { userId } = getAuth(req);
        if (!userId) return { error: "Unauthorized: No userId", status: 401 };
    
        const client = await clerkClient()
const user = await client.users.getUser(userId)
        const userEmail = user.emailAddresses[0]?.emailAddress;

        if (!userEmail || userEmail !== createdBy) {
          return {
            error: "Unauthorized: Email mismatch",
            status: 401,
            debug: {
              userEmail,
              createdBy,
            },
          };
        }
    
        
            const { success } = await rateLimiter.limit(userId);  // Check if user has exceeded the limit
        
            if (!success) {
                return NextResponse.json({
                    success: false,
                    message: "Rate limit exceeded. Please try again later.",
                }, { status: 429 });  // HTTP 429 Too Many Requests
            }

      
        const userRes = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, createdBy))
        if(userRes[0].isMember == true){
          amount = 5
        } else {
          amount = 3
        }
        
        // Generate course layout using AI
        const prompt = `
Generate a high-quality study guide for the course. The topic is "${topic}", the course type is "${courseType}", the difficulty level is "${difficultyLevel}", and the course layout is provided as "${courseLayout}".

**IMPORTANT INSTRUCTIONS:**
1. If courseLayout is provided as JSON containing user conversation data (summary, strengths, weaknesses, improvements, rating), parse this information and prioritize addressing the identified WEAKNESSES in your generated content.
2. Ensure the output is valid, parseable JSON with properly escaped characters.

**Content Requirements:**
1. **Introduction**: Provide a clear and engaging introduction to "${topic}", explaining its importance, relevance, and learning objectives.

2. **Chapter Breakdown**: Create 3 chapters with ${amount} topics each:
   - If user weaknesses are identified, design chapters that specifically target these weak areas
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
        "Topic 1",
        "Topic 2"
      ]
    }
  ]
}

**CRITICAL: Ensure the output is valid JSON that can be parsed without errors. Double-check all quotes, commas, and special characters are properly escaped.**
`;

        console.log("Prompt:", prompt);

        // Call AI to generate course content
        const aiResp = await courseOutline.sendMessage(prompt);
        console.log("Raw AI Response:", aiResp);

        if (!aiResp || !aiResp.response || !aiResp.response.text()) {
            throw new Error("No response text found from AI model");
        }

        // Get the AI response text
        const aiText = aiResp.response.text();
        console.log("AI Response Text:", aiText);

        // Clean up the response
        const cleanedText = aiText
            .replace(/^```json\n/, '')   // Remove leading ```json followed by a newline
            .replace(/```$/, '')         // Remove trailing ```
            .replace(/\\n/g, ' ')        // Replace escaped newlines with spaces
            .replace(/\\"/g, '"')        // Replace escaped quotes with regular quotes
            .trim();                     // Remove leading/trailing whitespace

        console.log("Cleaned AI Response Text:", cleanedText);

        // Validate and parse the cleaned response
        try {
            const aiResult = JSON.parse(cleanedText);
            console.log("Parsed AI Result:", aiResult);


            const dbResult = await db.insert(AI_TEXT_RESPONSE_TABLE).values({
                courseId: courseId,
                aiResponse: aiResult,
                createdBy: createdBy,
                createdAt: moment().format("DD-MM-yyyy")

            }).returning({ resp: AI_TEXT_RESPONSE_TABLE });

            // Triggering INGEST FUNCTION

           

            const result = await inngest.send({
                name:'notes.generate',
                data:{
                    course: dbResult[0].resp
                }
            })

       
          
              const userInfo= await db.select().from(USER_TABLE).where(eq(USER_TABLE?.email, createdBy))
              const newTotal = 1 + userInfo[0]?.totalCredits

              const remainingCredits = (userInfo[0]?.newFreeCredits + userInfo[0]?.newPurchasedCredit) - 1
              const newFreeCredits = userInfo[0]?.newFreeCredits - 1 
          
              const updateCredits = await db.update(USER_TABLE).set({
                totalCredits: newTotal,
                newFreeCredits: newFreeCredits < 0 ? 0 : newFreeCredits,
                remainingCredits: remainingCredits < 0 ? 0 : remainingCredits
              }).where(eq(USER_TABLE?.email, createdBy))


            return NextResponse.json({ result: dbResult[0] });

        } catch (parseError) {
            console.error("Error parsing AI response:", parseError);
            console.error("Cleaned AI Response Text that failed to parse:", cleanedText);

            // Return the raw AI response for debugging
            return NextResponse.json({
                success: false,
                error: "AI response is not valid JSON",
                rawAIResponse: aiText,
                cleanedText: cleanedText
            }, { status: 500 });
        }

    } catch (error) {
        console.error("Error in generating or saving course outline:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}