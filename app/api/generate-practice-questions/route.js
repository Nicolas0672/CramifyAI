import { GenerateQuizAiModel } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { PRACTICE_QUIZ_TABLE } from "@/configs/schema";
import moment from "moment";

export async function POST (req) {
    const { courseId, topic, courseType, courseLayout, difficultyLevel, createdBy } = await req.json();

    const prompt = `Generate quiz on topic: ${topic} with difficulty level: ${difficultyLevel} and content: ${courseLayout} including a title of the topic in simple terms and what will i learn after completing this set. 
                Provide 5 multiple-choice questions with the following format:
                - Question: [Text of the question]
                - Options: [Multiple choice options]
                - Correct Answer: [Text of the correct answer]
                - Explanation: [Detailed explanation of why the answer is correct]
                The questions should cover key concepts and provide value for the user. Please output this in JSON format.`;

    const aiResp = await GenerateQuizAiModel.sendMessage(prompt)
    const aiText = aiResp.response.text()

    const cleanedText = aiText
            .replace(/^```json\n/, '')   // Remove leading ```json followed by a newline
            .replace(/```$/, '')         // Remove trailing ```
            .replace(/\\n/g, ' ')        // Replace escaped newlines with spaces
            .replace(/\\"/g, '"')        // Replace escaped quotes with regular quotes
            .trim();  

    const aiResult = JSON.parse(cleanedText)

    const dbResult = await db.insert(PRACTICE_QUIZ_TABLE).values({
        courseId:courseId,
        aiResponse:aiResult,
        createdBy: createdBy,
        createdAt: moment().format("DD-MM-yyyy")
    }).returning({ resp: PRACTICE_QUIZ_TABLE });

     return NextResponse.json({ result: dbResult[0] });
}