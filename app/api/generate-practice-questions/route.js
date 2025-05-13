import { GenerateQuizAiModel } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { PRACTICE_QUIZ_TABLE, PROGRESS_CREDITS_COMPLETED_TABLE, USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import moment from "moment";
import { NextResponse } from "next/server";
import { rateLimiter } from "../rateLimiter";
import { getAuth, clerkClient } from "@clerk/nextjs/server"
import { inngest } from "@/inngest/client";
export async function POST(req) {
  const { courseId, topic, courseType, courseLayout, difficultyLevel, createdBy } = await req.json();

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

  const prompt = `Generate a quiz on topic: ${topic} with difficulty level: ${difficultyLevel} that specifically targets student weaknesses based on: ${courseLayout}

            WEAKNESS-TARGETING APPROACH:
            1. First, analyze ${courseLayout} for any identified weaknesses, challenging concepts, or knowledge gaps.
            2. If performance data or assessment results are available, prioritize concepts where performance was lowest.
            3. Create questions that address common misconceptions, error patterns, or difficult theoretical concepts.
            4. Include questions that test understanding of subtle distinctions that students often struggle with.
            5. Focus on concepts that typically require reinforcement based on the ${difficultyLevel} level.
            
            QUIZ STRUCTURE:
            1. Include a title that clearly reflects the ${topic} in simple terms.
            2. Add specific learning objectives detailing what skills/knowledge students will demonstrate after completing the quiz.
            3. Provide exactly 5 multiple-choice questions.
            4. Questions should progressively increase in difficulty, with emphasis on challenging areas.
            5. Ensure explanations are thorough and address WHY incorrect options are wrong in addition to why the correct answer is right.
            
            FORMAT REQUIREMENTS:
            - Output must be valid, parseable JSON with the following structure:
            
            {
              "quizTitle": "Clear, concise title related to ${topic}",
              "learningObjectives": "Specific skills/knowledge students will gain, with emphasis on addressing weaknesses",
              "questions": [
                {
                  "question": "Text of the question targeting a specific weakness or challenging concept",
                  "options": [
                    "Option A",
                    "Option B",
                    "Option C",
                    "Option D"
                  ],
                  "correctAnswer": "Text of the correct answer (must match exactly one of the options)",
                  "explanation": "Detailed explanation of why this answer is correct and why others are incorrect, with emphasis on clarifying common misconceptions"
                }
              ]
            }
            
            ENSURE THE OUTPUT IS VALID JSON THAT CAN BE PARSED WITHOUT ERRORS. Verify all brackets, quotes, and special characters are properly formatted.
            `;

  const initialRecord = await db.insert(PRACTICE_QUIZ_TABLE).values({
    courseId: courseId,
    status: "Generating",
    aiResponse: {
      quizTitle: `${topic.charAt(0).toUpperCase() + topic.slice(1)} Practice Guide`,  // Add basic info immediately
      courseType: courseType,
      difficultyLevel: difficultyLevel,
      learningObjectives: "Generating content...",
    },
    createdBy: createdBy,
    createdAt: moment().format("DD-MM-yyyy"),
    courseLayout: courseLayout,
    topic: topic,
    difficultyLevel: difficultyLevel
  }).returning({ resp: PRACTICE_QUIZ_TABLE });

  const userInfo = await db.select().from(USER_TABLE).where(eq(USER_TABLE?.email, createdBy))
  const newTotal = 1 + userInfo[0]?.totalCredits

  const remainingCredits = (userInfo[0]?.newFreeCredits + userInfo[0]?.newPurchasedCredit) - 1
  const newFreeCredits = userInfo[0]?.newFreeCredits - 1

  const updateCredits = await db.update(USER_TABLE).set({
    totalCredits: newTotal,
    newFreeCredits: newFreeCredits < 0 ? 0 : newFreeCredits,
    remainingCredits: remainingCredits < 0 ? 0 : remainingCredits
  }).where(eq(USER_TABLE?.email, createdBy))

  await inngest.send({
    name: 'generate.quiz',
    data: {
      prompt,
      recordId: initialRecord[0].id,
      courseId,
    }
  })

  return NextResponse.json({ result: initialRecord[0] });
}