import { db } from "@/configs/db";
import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";

const { FILL_BLANK_TABLE } = require("@/configs/schema");

export async function POST(req) {
    try {
        const body = await req.text(); // Debugging step
        console.log("Raw request body:", body);

        const { courseId, courseLayout, topic, difficultyLevel } = JSON.parse(body);

        if (!courseId || !courseLayout || !topic || !difficultyLevel) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const prompt = `
        Generate 5 **fill-in-the-blank** questions based on the given Topic: ${topic}, ContentType: ${courseLayout}, DifficultyLevel: ${difficultyLevel}.
        Ensure the question has **only one correct answer**. Provide the correct answer separately.

        Requirements:
        - Keep the question concise but clear.
        - Ensure only **one** word, phrase, or number is missing.
        - If it's a **math question**, format the question using LaTeX syntax and return it as a **string** that can be rendered with MathJax.
        - The correct answer should also be formatted properly but kept as a plain string.

        Make SURE TO Output THIS Format (JSON-compatible):
        [
          {
            "question": "Solve for x: \\( 2x + 3 = 7 \\), so \\( x = \\) ____",
            "answer": "2"
          },
          ...
        ]
        `;

        const result = await db.insert(FILL_BLANK_TABLE).values({
            courseId: courseId,
            type: 'Fill-Blank'
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
