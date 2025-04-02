import { db } from "@/configs/db"
import { AI_TEXT_RESPONSE_TABLE, EXAM_SESSION_TABLE, PRACTICE_QUIZ_TABLE, TEACH_ME_QUESTIONS_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req){
    const {createdBy, mode} = await req.json()
    let res = []
    if(mode == 'teach'){
        res = await db.select().from(TEACH_ME_QUESTIONS_TABLE).where(eq(TEACH_ME_QUESTIONS_TABLE.createdBy, createdBy))
    } else if(mode == 'study'){
        res = await db.select().from(AI_TEXT_RESPONSE_TABLE).where(eq(AI_TEXT_RESPONSE_TABLE.createdBy, createdBy))
    } else if(mode == 'practice'){
        res = await db.select().from(PRACTICE_QUIZ_TABLE).where(eq(PRACTICE_QUIZ_TABLE.createdBy, createdBy))
    } else if(mode == 'exam'){
        res = await db.select().from(EXAM_SESSION_TABLE).where(eq(EXAM_SESSION_TABLE.createdBy, createdBy))
    }
    return NextResponse.json(res)
}