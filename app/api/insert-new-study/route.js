import { db } from "@/configs/db"
import { STUDY_MATERIAL_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { getAuth, clerkClient } from "@clerk/nextjs/server";  // Import getAuth for email validation
import { rateLimiter } from "../rateLimiter"; 

export async function POST(req){
    const{courseType, topic, difficultyLevel, courseLayout, createdBy} = await req.json()
    const courseId = uuidv4()
    const { userId } = getAuth(req);
    if (!userId) return { error: "Unauthorized: No userId", status: 401 };

    const client = await clerkClient()
const user = await client.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress;

    // Rate limiting check for the user (based on email)
    const { success } = await rateLimiter.limit(userId);  // Apply rate limiter

    if (!success) {
        return NextResponse.json({
            success: false,
            message: "Rate limit exceeded. Please try again later.",
        }, { status: 429 });  // HTTP 429 Too Many Requests
    }
    const resp = await db.insert(STUDY_MATERIAL_TABLE).values({
        courseId: courseId,
        courseType: courseType,
        topic: topic,
        difficultyLevel: difficultyLevel,
        courseLayout: "",
        createdBy: email,
        storageId: null,  // Save only if provided
    })

    const newDb = await db.select().from(STUDY_MATERIAL_TABLE).where(eq(STUDY_MATERIAL_TABLE?.courseId, courseId))
    
    return NextResponse.json(newDb[0])
}