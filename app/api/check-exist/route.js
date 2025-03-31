import { db } from "@/configs/db"
import { 
  AI_TEXT_RESPONSE_TABLE, 
  EXAM_SESSION_TABLE, 
  PRACTICE_QUIZ_TABLE, 
  TEACH_ME_QUESTIONS_TABLE 
} from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { courseId } = await req.json()
    
    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      )
    }

    // Correct way to check existence in Drizzle
    const [teachResult, studyResult, practiceResult, examResult] = await Promise.all([
        db.select()
        .from(TEACH_ME_QUESTIONS_TABLE)
        .where(eq(TEACH_ME_QUESTIONS_TABLE.courseId, courseId))
        ,
      
        db.select()
        .from(AI_TEXT_RESPONSE_TABLE)
        .where(eq(AI_TEXT_RESPONSE_TABLE.courseId, courseId))
        ,
    
      db.select()
        .from(PRACTICE_QUIZ_TABLE)
        .where(eq(PRACTICE_QUIZ_TABLE.courseId, courseId))
        ,
      db.select()
        .from(EXAM_SESSION_TABLE)
        .where(eq(EXAM_SESSION_TABLE.courseId, courseId))
        
    ])

    return NextResponse.json({
      teach: teachResult.length > 0,
      study: studyResult.length > 0,
      practice: practiceResult.length>0 ,
      exam: examResult.length >0
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}