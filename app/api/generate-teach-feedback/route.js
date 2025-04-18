import { GenereateTeachFeedback } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { TEACH_ME_FEEDBACK_TABLE, TEACH_ME_QUESTIONS_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server"
import { rateLimiter } from "../rateLimiter";
import { getAuth, clerkClient} from "@clerk/nextjs/server"
export async function POST(req) {
    const { courseId, createdBy, transcript, title } = await req.json()
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
        
    try {
        const formattedTranscript = transcript.map(sentence =>
            `- ${sentence.role}: ${sentence.content}\n`
        ).join('');

        const prompt = `You are an AI tutor evaluating a learning session. Below is a transcript of a student explaining a topic to an AI assistant. Provide feedback on their explanation based on , accuracy, depth,. Also, suggest two areas for improvement.

                        Transcript:
                        """
                        ${formattedTranscript}
                        """
                        **Please return in JSON FORMAT and DO NOT OTHER CATEGORIES BESIDES THE ONE PROVIDED. ENSURE THAT IT IS ABLE TO PARSE AS JSON. DO NOT ADD ANYTHING THAT WILL BREAK THE PARSE
                        
                        ### Feedback:
                        
                        - **Summary:** (What the conversation was about)
                        - **Strength:** (Did they cover the topic in enough detail?)
                       - Weakness (What can user improve on in terms of study materials)
                        - **Improvements:** (Give two actionable tips to help them improve.)
                        - Overall rating out of 10. Ensure that the rating is lighthearted
                        **PLEASE OUTPUT IN THIS JSON FORMAT**
                        {
                            "summary": "<AI-generated summary here>",
                            "strengths": ["<AI-generated strength 1>", "<AI-generated strength 2>", "..."],
                            "weaknesses": ["<AI-generated weakness 1>", "<AI-generated weakness 2>", "..."],
                            "improvements": ["<AI-generated improvement 1>", "<AI-generated improvement 2>", "..."],
                            "overallScore": "<PLEASE ENSURE THAT THAT THE OUTPUT IS A NUMBER FOR EXAMPLE: 8/10>"
                        }
                        
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
                topic: title,
                progress: 100
            })
            return NextResponse.json({sucess: true, courseId: courseId})
        } catch(err){return NextResponse.json({'error inserting' : err})}

       


    } catch (err) { return NextResponse.json({"err": err}) }
}