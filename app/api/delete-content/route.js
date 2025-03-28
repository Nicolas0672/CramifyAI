import { db } from "@/configs/db"
import { AI_TEXT_RESPONSE_TABLE, CHAPTER_NOTE_TABLE, EXAM_RESPONSE_TABLE, FILL_BLANK_TABLE, FLASHCARD_CONTENT, PRACTICE_QUIZ_TABLE, STUDY_MATERIAL_TABLE, TEACH_ME_FEEDBACK_TABLE, TEACH_ME_QUESTIONS_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function DELETE(req) {
    const { courseId, type } = await req.json()
    let schemasToDeleteFrom = []

    try {
        if (type == 'study') {
            schemasToDeleteFrom = [AI_TEXT_RESPONSE_TABLE, FLASHCARD_CONTENT, CHAPTER_NOTE_TABLE]
        }
        else if (type == 'practice') {
            schemasToDeleteFrom = [PRACTICE_QUIZ_TABLE, FILL_BLANK_TABLE]
        } 
        else if (type == 'exam') {
            schemasToDeleteFrom = [EXAM_RESPONSE_TABLE]
        }
        else if (type == 'teach Me') {
            schemasToDeleteFrom = [TEACH_ME_FEEDBACK_TABLE, TEACH_ME_QUESTIONS_TABLE]
        }

        // Ensure schemasToDeleteFrom is populated correctly
        if (schemasToDeleteFrom.length === 0) {
            return NextResponse.json({ error: 'Invalid type or no schemas to delete' })
        }

        // Perform delete operation on all selected schemas
        for (const schema of schemasToDeleteFrom) {
            try {
                await db.delete(schema).where(eq(schema.courseId, courseId))
            } catch (err) {
                console.error(`Failed to delete from ${schema.name}:`, err)
                return NextResponse.json({ error: `Can't delete from ${schema.name}`, err })
            }
        }

        return NextResponse.json({ message: 'Content is deleted' })
    } catch (err) {
        return NextResponse.json({ error: 'General error', err })
    }
}
