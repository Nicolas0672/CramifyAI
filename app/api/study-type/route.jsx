import { db } from "@/configs/db"
import { CHAPTER_NOTE_TABLE, FLASHCARD_CONTENT } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req) {
    const {courseId, studyType} = await req.json()

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
}