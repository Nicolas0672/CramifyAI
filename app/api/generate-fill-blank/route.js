import { db } from "@/configs/db";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server"
import { rateLimiter } from "../rateLimiter";
const { FILL_BLANK_TABLE } = require("@/configs/schema");

export async function POST(req) {
    try {
        const body = await req.text(); // Debugging step
        console.log("Raw request body:", body);

        const { courseId, courseLayout, topic, difficultyLevel } = JSON.parse(body);
        const { userId } = getAuth(req);
        if (!userId) return { error: "Unauthorized: No userId", status: 401 };
    
        const client = await clerkClient()
const user = await client.users.getUser(userId)
        const email = user.emailAddresses[0]?.emailAddress;
    
                
                    const { success } = await rateLimiter.limit(userId);  // Check if user has exceeded the limit
                
                    if (!success) {
                        return NextResponse.json({
                            success: false,
                            message: "Rate limit exceeded. Please try again later.",
                        }, { status: 429 });  // HTTP 429 Too Many Requests
                    }
        if (!courseId || !courseLayout || !topic || !difficultyLevel) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const prompt = `
        IMPORTANT: Generate fill-in-the-blank questions that specifically target learning weaknesses based on these parameters:
        
        - Course Layout: ${courseLayout}
        - Topic: ${topic}
        - Difficulty Level: ${difficultyLevel}
        
        WEAKNESS-BASED LEARNING REQUIREMENTS:
        1. PRIORITY: Analyze the courseLayout for any identified weaknesses, struggling areas, or knowledge gaps.
        2. Generate questions that SPECIFICALLY target these weak areas to reinforce learning.
        3. If courseLayout contains performance data or assessment results, focus on concepts where performance was lowest.
        4. Calibrate question difficulty to challenge understanding without frustrating learners.
        5. Create questions that address common misconceptions or error patterns related to the topic.
        
        TECHNICAL REQUIREMENTS:
        1. Each question MUST contain EXACTLY one blank space represented by "____" (four underscores).
        2. Each question must have ONLY ONE specific word, phrase, or number as the correct answer.
        3. Questions must be directly relevant to the ${topic} at the specified ${difficultyLevel} difficulty.
        4. Ensure all questions are factually correct and academically sound.
        
        FORMAT SPECIFICATIONS:
        - Return ONLY a valid JSON array of question objects.
        - Each object must have exactly two properties: "question" and "answer".
        - Ensure all quotes, special characters, and formatting are properly escaped to maintain valid JSON.
        - The blank placeholder must be exactly four underscores "____" (no more, no less).
        
        EXAMPLE OF CORRECT FORMAT:
        [
          {
            "question": "In photosynthesis, plants convert carbon dioxide and water into glucose and ____.",
            "answer": "oxygen"
          },
          {
            "question": "The quadratic formula states that x equals negative b plus or minus the square root of b squared minus ____, all divided by two a.",
            "answer": "4ac"
          }
        ]
        
        DO NOT INCLUDE ANY EXPLANATORY TEXT, NOTES, OR ADDITIONAL FORMATTING OUTSIDE THE JSON ARRAY.
        VERIFY THAT YOUR RESPONSE IS VALID JSON BEFORE SUBMITTING.
        `;

        const result = await db.insert(FILL_BLANK_TABLE).values({
            courseId: courseId,
            type: 'Fill-Blank',
            createdBy: email
        }).returning({ id: FILL_BLANK_TABLE.id });

        console.log("Database insert result:", result);

        if (!result || result.length === 0) {
            throw new Error("Database insert failed");
        }
        
        try {
            const response = await inngest.send({
                name: 'fill-blank.content',
                data: {
                    prompt,
                    courseId,
                    recordId: result[0]?.id
                }
            });
            console.info("✅ Inngest event sent successfully:", response);
        } catch (error) {
            console.error("❌ Error sending Inngest event:", error);
        }

        return NextResponse.json({ id: result[0].id });

    } catch (error) {
        console.error("Error in POST /api/generate-fill-blank:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
