import { db } from "@/configs/db"
import { PRACTICE_QUIZ_TABLE } from "@/configs/schema"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req){
    const {createdBy} = await req.json()

    const quizList = await db.select().from(PRACTICE_QUIZ_TABLE)
    .where(eq(PRACTICE_QUIZ_TABLE.createdBy, createdBy))
    .orderBy(desc(PRACTICE_QUIZ_TABLE.id))

    return NextResponse.json({result : quizList})
}

export async function GET(req){
    const reqUrl = req.url 
    const {searchParams} = new URL(reqUrl)
    const courseId = searchParams?.get('courseId')

    const res = await db.select().from(PRACTICE_QUIZ_TABLE)
    .where(eq(PRACTICE_QUIZ_TABLE.courseId, courseId))

    

    return NextResponse.json({result:res[0]})
}