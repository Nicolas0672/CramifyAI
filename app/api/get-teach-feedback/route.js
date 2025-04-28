import { db } from "@/configs/db"
import { TEACH_ME_FEEDBACK_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { rateLimiter } from "../rateLimiter"; 
export async function GET(req) {
    const reqUrl = req.url 
    const {searchParams} = new URL(reqUrl)
    const courseId = searchParams?.get('courseId')

    const { userId } = getAuth(req);
    if (!userId) return { error: "Unauthorized: No userId", status: 401 };

    const client = await clerkClient()
const user = await client.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress;

    // Rate limiting check for the user (based on email)
    // const { success } = await rateLimiter.limit(userId);  // Apply rate limiter

    // if (!success) {
    //     return NextResponse.json({
    //         success: false,
    //         message: "Rate limit exceeded. Please try again later.",
    //     }, { status: 429 });  // HTTP 429 Too Many Requests
    // }

    const dbRes= await db.select().from(TEACH_ME_FEEDBACK_TABLE)
    .where(eq(TEACH_ME_FEEDBACK_TABLE.courseId, courseId))

    const record = dbRes[0];
    if (record != null && record.createdBy !== email) {
        return NextResponse.json({ error: "Forbidden: You are not authorized to access this record." }, { status: 403 });
    }

    return NextResponse.json({result : dbRes[0]})

}