import { db } from "@/configs/db"
import { EXAM_SESSION_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST (req){
    const {courseId} = await req.json()
    try{
        const session = await db.select().from(EXAM_SESSION_TABLE)
        .where(eq(EXAM_SESSION_TABLE.courseId, courseId))
       
        const newCount = (parseInt(session[0].questionCount ||0) + 1)
        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
          }

    await db.update(EXAM_SESSION_TABLE)
        .set({
            questionCount: newCount
        })
        .where(eq(EXAM_SESSION_TABLE.courseId, courseId))

        
        return NextResponse.json({res: session[0]})

    } catch(err){
        return NextResponse.json({ error: "Failed to update data into database"+err }, { status: 500 });
    }
}