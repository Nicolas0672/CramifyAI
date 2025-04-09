import { db } from "@/configs/db";
import { 
  AI_TEXT_RESPONSE_TABLE, 
  EXAM_SESSION_TABLE, 
  PRACTICE_QUIZ_TABLE, 
  TEACH_ME_QUESTIONS_TABLE 
} from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    // Retrieve the user email from the authentication session
     // Extract the email from the user object
    const { courseId } = await req.json();
    const { userId } = getAuth(req);
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if(!userId){
      return {
        error: "Unauthorized: Email mismatch",
        status: 401,
      }
    }
    // Ensure the user is authenticated
    

    // Ensure the courseId is provided
    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    // Query for the user's data based on email and courseId
    const [teachResult, studyResult, practiceResult, examResult] = await Promise.all([
      db.select()
        .from(TEACH_ME_QUESTIONS_TABLE)
        .where(and(
          eq(TEACH_ME_QUESTIONS_TABLE.courseId, courseId),
          eq(TEACH_ME_QUESTIONS_TABLE.createdBy, userEmail) // Use email instead of userId
        )),

      db.select()
        .from(AI_TEXT_RESPONSE_TABLE)
        .where(and(
          eq(AI_TEXT_RESPONSE_TABLE.courseId, courseId),
          eq(AI_TEXT_RESPONSE_TABLE.createdBy, userEmail) // Use email instead of userId
        )),

      db.select()
        .from(PRACTICE_QUIZ_TABLE)
        .where(and(
          eq(PRACTICE_QUIZ_TABLE.courseId, courseId),
          eq(PRACTICE_QUIZ_TABLE.createdBy, userEmail) // Use email instead of userId
        )),

      db.select()
        .from(EXAM_SESSION_TABLE)
        .where(and(
          eq(EXAM_SESSION_TABLE.courseId, courseId),
          eq(EXAM_SESSION_TABLE.createdBy, userEmail) // Use email instead of userId
        )),
    ]);

    // Return the results as a JSON response
    return NextResponse.json({
      teach: teachResult.length > 0,
      study: studyResult.length > 0,
      practice: practiceResult.length > 0,
      exam: examResult.length > 0
    });

  } catch (error) {
    console.error("Error in POST /api/check-course", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
