import { db } from "@/configs/db"
import { TEACH_ME_FEEDBACK_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(req) {
    const reqUrl = req.url 
    const {searchParams} = new URL(reqUrl)
    const courseId = searchParams?.get('courseId')

    const dbRes= await db.select().from(TEACH_ME_FEEDBACK_TABLE)
    .where(eq(TEACH_ME_FEEDBACK_TABLE.courseId, courseId))

    return NextResponse.json({result : dbRes[0]})

}