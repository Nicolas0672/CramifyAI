import { db } from "@/configs/db"
import { TEACH_ME_QUESTIONS_TABLE } from "@/configs/schema"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req) {
    const {createdBy} = await req.json()
    try{
    const dbResult = await db.select().from(TEACH_ME_QUESTIONS_TABLE)
    .where(eq(TEACH_ME_QUESTIONS_TABLE.createdBy, createdBy))
      .orderBy(desc(TEACH_ME_QUESTIONS_TABLE.id))

    return NextResponse.json({result : dbResult})
    } catch(err){ return NextResponse.json({error: err})}
}

