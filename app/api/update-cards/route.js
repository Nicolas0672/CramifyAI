import { db } from "@/configs/db"
import { FLASHCARD_CONTENT } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req){
    const {courseId, flashcards} = await req.json()
    try{
        await db.update(FLASHCARD_CONTENT).set({
            content: {data: flashcards}
        }).where(eq(FLASHCARD_CONTENT.courseId, courseId))
        return NextResponse.json({sucess : true})
    }
    catch(err){
        return NextResponse.json(err)
    }
  

  
}