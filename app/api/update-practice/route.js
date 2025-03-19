import { db } from "@/configs/db"
import { PRACTICE_QUIZ_TABLE } from "@/configs/schema"

import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req){
    try{
    const {courseId} = await req.json()
    const session = await db.select().from(PRACTICE_QUIZ_TABLE)
    .where(eq(PRACTICE_QUIZ_TABLE.courseId, courseId))
    
    if(!session) return NextResponse.json({resp: 'session not found'})

    const newCount = parseInt((session[0].progress || 0) + 50)
    await db.update(PRACTICE_QUIZ_TABLE).set({
        progress : newCount
    }).where(eq(PRACTICE_QUIZ_TABLE.courseId, courseId))

    return NextResponse.json({resp : 'sucess'})
}
catch(err){
    return NextResponse.json({err: "error"+err.message})
}
}

