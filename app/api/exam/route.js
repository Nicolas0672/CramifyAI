import { db } from "@/configs/db"
import { EXAM_SESSION_TABLE } from "@/configs/schema"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req){
    const {createdBy} = await req.json()
    const examList = await db.select().from(EXAM_SESSION_TABLE)
    .where(eq(EXAM_SESSION_TABLE.createdBy, createdBy))
    .orderBy(desc(EXAM_SESSION_TABLE.id))

    return NextResponse.json({result: examList})
}

export async function GET(req){
    const reqUrl = req.url
    const {searchParams} = new URL(reqUrl)
    const courseId = searchParams.get('courseId')

    const res = await db.select().from(EXAM_SESSION_TABLE)
    .where(eq(EXAM_SESSION_TABLE.courseId, courseId))
    return NextResponse.json({result:res[0]})
}