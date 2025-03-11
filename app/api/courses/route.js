import { db } from "@/configs/db";
import { AI_TEXT_RESPONSE_TABLE } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req){

    const {createdBy} = await req.json()

    const result = await db.select().from(AI_TEXT_RESPONSE_TABLE)
    .where(eq(AI_TEXT_RESPONSE_TABLE?.createdBy, createdBy))
    .orderBy(desc(AI_TEXT_RESPONSE_TABLE.id))

    return NextResponse.json({result:result})
}

export async function GET(req) {
    const reqUrl = req.url;
    const {searchParams} = new URL(reqUrl)
    const studyMaterialId = searchParams?.get('courseId');

    const course= await db.select().from(AI_TEXT_RESPONSE_TABLE)
    .where(eq(AI_TEXT_RESPONSE_TABLE.studyMaterialId, studyMaterialId))

    return NextResponse.json({result:course[0]})
}