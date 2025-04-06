import { db } from "@/configs/db"
import { USER_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import moment from "moment"
import { NextResponse } from "next/server"

export async function POST(req){
    const {createdBy} = await req.json()
    const userDb = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, createdBy))

    if(userDb[0].createdAt == null){
        const dbRes = await db.update(USER_TABLE).set({
            createdAt:moment().format("DD-MM-yyyy")
        }).where(eq(USER_TABLE.email, createdBy))
    }
   
    return NextResponse.json({sucess: true})
}