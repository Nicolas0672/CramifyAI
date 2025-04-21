import { GenerateStartExam } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { EXAM_SESSION_TABLE, USER_TABLE } from "@/configs/schema";
import { getAuth, clerkClient } from "@clerk/nextjs/server"

import { eq } from "drizzle-orm";
import moment from "moment";
import { NextResponse } from "next/server";
import { rateLimiter } from "../rateLimiter";


export async function POST(req) {
    const { courseId, topic, courseType, courseLayout, difficultyLevel, createdBy, exam_time } = await req.json();
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


    const prompt = `As an expert teacher, create an assessment targeting learning weaknesses based on these parameters:

- Topic: ${topic}
- Course Layout: ${courseLayout}
- Difficulty Level: ${difficultyLevel}
- Time to complete: 5 minutes

ASSESSMENT DEVELOPMENT PROCESS:
1. First, analyze ${courseLayout} to identify potential knowledge gaps, challenging concepts, or areas where students typically struggle
2. Focus your question on these identified weak areas to provide targeted assessment and learning
3. Design a question that tests understanding of fundamental concepts rather than memorization
4. Ensure the question challenges critical thinking but remains solvable within the 5-minute timeframe
5. For mathematical topics, create problems that address common misconceptions or error patterns

RESPONSE REQUIREMENTS:
- Generate a courseTitle that clearly identifies the topic area
- Create a courseSummary outlining what knowledge/skills are being tested, with emphasis on challenging areas
- Develop ONE high-quality question requiring a short or long answer (not multiple choice)
- Provide the correct answer (final result only, no steps required)
- For math questions, use proper LaTeX formatting for mathematical expressions

OUTPUT FORMAT:
Return the response as a valid JSON object with this structure:

{
  "courseTitle": "Clear title identifying the topic area",
  "courseSummary": "Concise summary of what will be tested, focusing on challenging concepts",
  "question": "A challenging but solvable question targeting a common weakness area",
  "answer": "The correct final answer"
}

SPECIAL INSTRUCTIONS FOR MATH QUESTIONS:
- Present the complete problem without breaking it into steps
- Format all mathematical expressions using LaTeX syntax (e.g., $\\frac{x^2}{y}$ for fractions)
- Ensure the answer is the simplified final result only

ENSURE THE OUTPUT IS VALID JSON THAT CAN BE PARSED WITHOUT ERRORS.
`;

    const aiResponse = await GenerateStartExam.sendMessage(prompt)
    const aiText = aiResponse.response.text();
    const cleanedText = aiText
    .replace(/^```json\n/, '')   // Remove leading ```json followed by a newline
    .replace(/```$/, '')         // Remove trailing ```
    .replace(/\\n/g, ' ')        // Replace escaped newlines with spaces
    .replace(/\\"/g, '"')        // Replace escaped quotes with regular quotes
    .trim(); 

    const aiRes = JSON.parse(cleanedText)
    
    const dbResult = await db.insert(EXAM_SESSION_TABLE).values({
        courseLayout: courseLayout,
        courseId: courseId,
        createdBy: createdBy,
        createdAt: moment().format("DD-MM-yyyy"),
        topic: topic,
        difficultyLevel: difficultyLevel,
        exam_time: exam_time,
        currQuestionAiResp: aiRes,
        question: aiRes.question,
        status: 'Ready'
    }).returning({ resp: EXAM_SESSION_TABLE });

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
    

        




}