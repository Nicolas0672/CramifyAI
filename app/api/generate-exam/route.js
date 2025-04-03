import { GenerateStartExam } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { EXAM_SESSION_TABLE } from "@/configs/schema";
import moment from "moment";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { courseId, topic, courseType, courseLayout, difficultyLevel, createdBy, exam_time } = await req.json();

    const prompt = `Pretend that you are a teacher giving a student an exam. Generate courseTitle, a courseSummary on what student will be tested on and a randomized question based on the following parameters:

    - Topic: ${topic}
    - Course Layout: ${courseLayout}
    - Difficulty Level: ${difficultyLevel}
    - Time to complete the question: 5 minutes
    
    The question should require a **short or long answer** (no multiple choices) and should challenge the student but be solvable within 5 minutes. Only the final answer is required (no steps or intermediate reasoning needed).
    
    For **math-related questions**:
    - Provide the complete problem without breaking it into steps.
    - Ensure that the answer is the final result, and use LaTeX formatting for rendering.
    
    Example:
    
    {
      "question": "A particle's position in space is given by the vector function $\\mathbf{r}(t) = \\langle \\cos(t^2), \\sin(t^2), t \\rangle$. Find the magnitude of the particle's acceleration vector at time $t = \\sqrt{\\frac{\\pi}{2}}$.",
      "answer": "2\\sqrt{1 + \\pi^2}"
    }`

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