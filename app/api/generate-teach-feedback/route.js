import { GenereateTeachFeedback } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { TEACH_ME_FEEDBACK_TABLE, TEACH_ME_QUESTIONS_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server"

export async function POST(req) {
    const { courseId, createdBy, transcript, title } = await req.json()

    try {
        const formattedTranscript = transcript.map(sentence =>
            `- ${sentence.role}: ${sentence.content}\n`
        ).join('');

        const prompt = `You are an AI tutor evaluating a learning session. Below is a transcript of a student explaining a topic to an AI assistant. Provide feedback on their explanation based on clarity, accuracy, depth, and confidence. Also, suggest two areas for improvement.

                        Transcript:
                        """
                        ${formattedTranscript}
                        """
                        **Please return in JSON FORMAT and DO NOT OTHER CATEGORIES BESIDES THE ONE PROVIDED. ENSURE THAT IT IS ABLE TO PARSE AS JSON. DO NOT ADD ANYTHING THAT WILL BREAK THE PARSE
                        
                        ### Feedback:
                        - courseTitle of the transcript
                        - **Clarity:** (Was the explanation easy to understand?)
                        - **Accuracy:** (Did they provide correct information?)
                        - **Depth:** (Did they cover the topic in enough detail?)
                        - **Confidence:** (Did they sound sure of their answer?)
                        - **Suggestions for improvement:** (Give two actionable tips to help them improve.)
                        `
        const aiResp = await GenereateTeachFeedback.sendMessage(prompt)
        const aiText = aiResp.response.text()

        const cleanedText = aiText
            .replace(/^```json\n/, '')   // Remove leading ```json followed by a newline
            .replace(/```$/, '')         // Remove trailing ```
            .replace(/\\n/g, ' ')        // Replace escaped newlines with spaces
            .replace(/\\"/g, '"')        // Replace escaped quotes with regular quotes
            .trim();

        const aiResult = JSON.parse(cleanedText)
        try{
            const dbUpdate = await db.update(TEACH_ME_QUESTIONS_TABLE).set({
                progress: 100
            }).where(eq(TEACH_ME_QUESTIONS_TABLE.courseId, courseId))

        }catch(err){
            return NextResponse.json({'error updating db': err})
        }
        try{
            const dbRes = await db.insert(TEACH_ME_FEEDBACK_TABLE).values({
                courseId: courseId,
                createdBy: createdBy,
                aiFeedback: aiResult,
                topic: title
            })
            return NextResponse.json({sucess: true, courseId: courseId})
        } catch(err){return NextResponse.json({'error inserting' : err})}

       


    } catch (err) { return NextResponse.json({"err": err}) }
}