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
   
IMPORTANT: Each question MUST contain exactly one blank space represented by "____" (four underscores) where the answer would go.

Requirements:
- Keep questions concise but clear
- Each question must include exactly one "____" placeholder where the answer belongs
- The correct answer should be ONE specific word, phrase, or number
- Format the response as an array of objects with this structure:

[
  {
    "question": "The capital of France is ____.",
    "answer": "Paris"
  },
  {
    "question": "Water boils at ____ degrees Celsius.",
    "answer": "100"
  }
]

DO NOT PROVIDE ANY ADDITIONAL TEXT. ENSURE EACH QUESTION CONTAINS THE ____ PLACEHOLDER.
`


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
