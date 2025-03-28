import { db } from "@/configs/db"
import { FLASHCARD_CONTENT } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET (req){
    const {searchParams} = new URL(req.url)
    const recordId = searchParams?.get('id')

    const res = await db.select().from(FLASHCARD_CONTENT)
    .where(eq(FLASHCARD_CONTENT.id, recordId))

    return NextResponse.json({status: res[0].status})
}