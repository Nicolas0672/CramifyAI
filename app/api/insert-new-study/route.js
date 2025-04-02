import { db } from "@/configs/db"
import { STUDY_MATERIAL_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function POST(req){
    const{courseType, topic, difficultyLevel, courseLayout, createdBy} = await req.json()
    const courseId = uuidv4()

    const resp = await db.insert(STUDY_MATERIAL_TABLE).values({
        courseId: courseId,
        courseType: courseType,
        topic: topic,
        difficultyLevel: difficultyLevel,
        courseLayout: courseLayout,
        createdBy: createdBy,
        storageId: null,  // Save only if provided
    })

    const newDb = await db.select().from(STUDY_MATERIAL_TABLE).where(eq(STUDY_MATERIAL_TABLE?.courseId, courseId))
    return NextResponse.json(newDb[0])
}