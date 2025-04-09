import { db } from "@/configs/db"
import { PRACTICE_QUIZ_TABLE } from "@/configs/schema"
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { rateLimiter } from "../rateLimiter";

import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req){
    try{
    const {courseId} = await req.json()
    const { userId } = getAuth(req);
    if (!userId) return { error: "Unauthorized: No userId", status: 401 };

    const client = await clerkClient()
const user = await client.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress;


    // Rate limiting check for the user (based on email)
    // const { success } = await rateLimiter.limit(userId);

    // if (!success) {
    //     return NextResponse.json({
    //         success: false,
    //         message: "Rate limit exceeded. Please try again later.",
    //     }, { status: 429 });  // HTTP 429 Too Many Requests
    // }
    const session = await db.select().from(PRACTICE_QUIZ_TABLE)
    .where(eq(PRACTICE_QUIZ_TABLE.courseId, courseId))
    
    if (!session || session[0].createdBy !== email) {
        // If the session doesn't exist or the user is not the one who created it, return Forbidden
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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

