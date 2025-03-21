import { db } from "@/configs/db"
import { EXAM_RESPONSE_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(req){
    
    const reqUrl = req.url
    const {searchParams} = new URL(reqUrl)
    const courseId = searchParams?.get('courseId')

    const dbRes = await db.select().from(EXAM_RESPONSE_TABLE)
    .where(eq(EXAM_RESPONSE_TABLE.courseId, courseId))

    return NextResponse.json({result:dbRes})
}