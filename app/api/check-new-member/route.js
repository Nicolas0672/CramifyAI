import { db } from "@/configs/db"
import { USER_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req){
    const {createdBy} = await req.json()
    const dbRes = await db.select().from(USER_TABLE)
    .where(eq(USER_TABLE.email, createdBy))

    return NextResponse.json({res: dbRes[0]})
}