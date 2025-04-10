import { db } from "@/configs/db"
import { AI_TEXT_RESPONSE_TABLE, CHAPTER_NOTE_TABLE, EXAM_SESSION_TABLE, FILL_BLANK_TABLE, FLASHCARD_CONTENT, PRACTICE_QUIZ_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getAuth, clerkClient } from "@clerk/nextjs/server";  // Import getAuth for email validation
import { rateLimiter } from "../rateLimiter"; 
export async function POST(req) {
    const {courseId, studyType} = await req.json()
    const { userId } = getAuth(req);
    if (!userId) return { error: "Unauthorized: No userId", status: 401 };

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress;

    // Rate limiting check for the user (based on email)
    // const { success } = await rateLimiter.limit(userId);  // Apply rate limiter

    // if (!success) {
    //     return NextResponse.json({
    //         success: false,
    //         message: "Rate limit exceeded. Please try again later.",
    //     }, { status: 429 });  // HTTP 429 Too Many Requests
    // }
    if(studyType=='ALL'){
        const notes = await db.select().from(CHAPTER_NOTE_TABLE)
        .where(eq(CHAPTER_NOTE_TABLE?.courseId, courseId))

        const contentList = await db.select().from(FLASHCARD_CONTENT)
        .where(eq(FLASHCARD_CONTENT?.courseId, courseId))

        const result = {
            notes:notes,
            flashcard: contentList?.filter(item=>item.type=='Flashcard'),
        }
        return NextResponse.json(result)
    }
    else if(studyType == 'notes'){
        const notes = await db.select().from(CHAPTER_NOTE_TABLE)
        .where(eq(CHAPTER_NOTE_TABLE?.courseId, courseId))

        return NextResponse.json(notes)
    }
    else if(studyType == 'Flashcard'){
        const flashcard = await db.select().from(FLASHCARD_CONTENT)
        .where(eq(FLASHCARD_CONTENT?.courseId, courseId))
        

        return NextResponse.json(flashcard[0])
    }
    else if(studyType == 'quizAll'){
        const practiceSheet = await db.select().from(PRACTICE_QUIZ_TABLE)
        .where(eq(PRACTICE_QUIZ_TABLE?.courseId, courseId))

        const fillBlank = await db.select().from(FILL_BLANK_TABLE)
        .where(eq(FILL_BLANK_TABLE?.courseId, courseId))

        const result = {
            quiz: practiceSheet[0],
            Fill: fillBlank[0]
        }
        
        return NextResponse.json(result)
    }
    else if(studyType == 'quiz'){
        const practiceSheet = await db.select().from(PRACTICE_QUIZ_TABLE)
        .where(eq(PRACTICE_QUIZ_TABLE?.courseId, courseId))

        return NextResponse.json(practiceSheet[0])
    }
    else if(studyType == 'fill'){
        const fillBlank = await db.select().from(FILL_BLANK_TABLE)
        .where(eq(FILL_BLANK_TABLE?.courseId, courseId))

        return NextResponse.json(fillBlank[0])
    }
    else if(studyType == 'exam'){
        const examSheet = await db.select().from(EXAM_SESSION_TABLE)
        .where(eq(EXAM_SESSION_TABLE?.courseId, courseId))

        return NextResponse.json(examSheet[0])
    }
    else if(studyType == 'study'){
        const studySheet = await db.select().from(AI_TEXT_RESPONSE_TABLE)
        .where(eq(AI_TEXT_RESPONSE_TABLE?.courseId, courseId))

        return NextResponse.json(studySheet[0])
    }
}