import { db } from "@/configs/db"
import { TEACH_QUESTIONS_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req){
    const {courseId, createdBy} = await req.json()
    const dbRes = await db.update(TEACH_QUESTIONS_TABLE).set({
        createdBy: createdBy,
    }).where(eq(TEACH_QUESTIONS_TABLE.courseId, courseId))
   

    return NextResponse.json({res: dbRes[0]})
}