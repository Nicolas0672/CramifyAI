import { db } from "@/configs/db"
import { EXAM_RESPONSE_TABLE, EXAM_SESSION_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req){
    const {createdBy, courseId} = await req.json()
    await db.update(EXAM_SESSION_TABLE).set({
        exam_time: 0
    }).where(eq(EXAM_SESSION_TABLE?.courseId, courseId))

    await db.update(EXAM_RESPONSE_TABLE).set({
        exam_time: 0
    }).where(eq(EXAM_RESPONSE_TABLE?.createdBy, createdBy))

    return NextResponse.json({sucess: true})
}