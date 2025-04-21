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

        const prompt = `You are an AI tutor evaluating a student's learning session. Below is a transcript of a student explaining a topic to an AI assistant. Provide a focused evaluation that identifies strengths and weaknesses to help them improve their understanding.

        Transcript:
        """
        ${formattedTranscript}
        """
        
        EVALUATION INSTRUCTIONS:
        1. Analyze the student's explanation for conceptual understanding, accuracy, and depth
        2. Identify specific knowledge gaps or misconceptions that need addressing
        3. Note areas where the student demonstrates strong understanding
        4. Provide actionable improvement suggestions targeting their specific weaknesses
        5. Rate their overall performance on a scale of 1-10
        
        OUTPUT REQUIREMENTS:
        - Return ONLY valid, parseable JSON with the EXACT structure shown below
        - Do not include additional categories beyond those specified
        - Ensure all JSON syntax is correct (quotes, commas, brackets)
        - Keep weaknesses and improvements focused on addressable learning gaps
        - Make the overall score a simple number out of 10 (e.g., 7)
        
        {
          "summary": "Brief overview of what the conversation covered",
          "strengths": [
            "Specific strength 1 focused on what the student understood well",
            "Specific strength 2 with examples from the transcript"
          ],
          "weaknesses": [
            "Specific knowledge gap or misconception 1 that requires attention",
            "Specific weakness 2 in understanding core concepts"
          ],
          "improvements": [
            "Concrete, actionable suggestion 1 addressing a specific weakness",
            "Concrete, actionable suggestion 2 for developing deeper understanding"
          ],
          "overallScore": 7
        }
        
        DO NOT INCLUDE ANY TEXT BEFORE OR AFTER THE JSON OBJECT.
        ENSURE THE JSON IS PROPERLY FORMATTED AND CAN BE PARSED WITHOUT ERRORS.
        THE OVERALL SCORE MUST BE A NUMBER WITHOUT ANY ADDITIONAL TEXT.
        `;
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