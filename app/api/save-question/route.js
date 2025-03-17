import { db } from "@/configs/db"
import { EXAM_SESSION_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req){
    const {courseId, question, userAns} = await req.json()
    try{
        const dbUpdate = await db.update(EXAM_SESSION_TABLE).set({
            question: question || "test",
            userAns: userAns || "test"
        }).where(eq(EXAM_SESSION_TABLE.courseId, courseId))

        const updatedRow = await db.select().from(EXAM_SESSION_TABLE)
        .where(eq(EXAM_SESSION_TABLE.courseId, courseId))
        .limit(1)

        return NextResponse.json({res: updatedRow[0]})
    }
    catch(err){
        return NextResponse.json({error: 'update didnt went thru' + err})
    }
}