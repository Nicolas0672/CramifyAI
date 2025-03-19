import { db } from "@/configs/db"
import { AI_TEXT_RESPONSE_TABLE, CHAPTER_NOTE_TABLE, FILL_BLANK_TABLE, FLASHCARD_CONTENT, PRACTICE_QUIZ_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req) {
    const { courseId, studyType, type } = await req.json()
    try{
    if (type == 'study') {
        if (studyType == 'notes') {
            const noteUpdate = await db.update(CHAPTER_NOTE_TABLE).set({
                isDone: true
            }).where(eq(CHAPTER_NOTE_TABLE.courseId, courseId))
        }
        else if (studyType == 'flashcard') {
            const flashcardUpdate = await db.update(FLASHCARD_CONTENT).set({
                isDone: true
            }).where(eq(FLASHCARD_CONTENT.courseId, courseId))
        }
        const session = await db.select().from(AI_TEXT_RESPONSE_TABLE)
            .where(eq(AI_TEXT_RESPONSE_TABLE.studyMaterialId, courseId))

        if (!session) return NextResponse.json({ resp: 'session not found' })

        const newCount = parseInt((session[0].progress || 0) + 50)
        await db.update(AI_TEXT_RESPONSE_TABLE).set({
            progress: newCount
        }).where(eq(AI_TEXT_RESPONSE_TABLE.studyMaterialId, courseId))

        return NextResponse.json({ resp: 'sucess' })
    }
    else if(type == 'practice'){
        if(studyType == 'quiz'){
            const quizUpdate = await db.update(PRACTICE_QUIZ_TABLE).set({
                isDone: true
            }).where(eq(PRACTICE_QUIZ_TABLE.courseId, courseId))
        }
        else if(studyType == 'fill-blank'){
            const fillUpdate = await db.update(FILL_BLANK_TABLE).set({
                isDone: true
            }).where(eq(FLASHCARD_CONTENT.courseId, courseId))
        }
        const session = await db.select().from(PRACTICE_QUIZ_TABLE)
            .where(eq(PRACTICE_QUIZ_TABLE.courseId, courseId))

        if (!session) return NextResponse.json({ resp: 'session not found' })

        const newCount = parseInt((session[0].progress || 0) + 50)
        await db.update(PRACTICE_QUIZ_TABLE).set({
            progress: newCount
        }).where(eq(PRACTICE_QUIZ_TABLE.courseId, courseId))

        return NextResponse.json({ resp: 'sucess' })
    }
}catch(err){return NextResponse.json({error: 'errpr' + err})}

}

