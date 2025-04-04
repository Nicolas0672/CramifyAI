import { db } from "@/configs/db"
import { FILL_BLANK_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET (req){
    const {searchParams} = new URL(req.url)
    const recordId = searchParams?.get('id')

    const res = await db.select().from(FILL_BLANK_TABLE)
    .where(eq(FILL_BLANK_TABLE.id, recordId))

    return NextResponse.json({status: res[0].status})
}