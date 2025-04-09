import { db } from "@/configs/db"
import { PRACTICE_QUIZ_TABLE } from "@/configs/schema"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getAuth, clerkClient } from "@clerk/nextjs/server";  // Import getAuth for email validation

export async function POST(req){
    const {createdBy} = await req.json()
    const { userId } = getAuth(req);
    if (!userId) return { error: "Unauthorized: No userId", status: 401 };

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress;

    if (createdBy !== email) {
        return { valid: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
    }

    // Rate limiting check for the user (based on email)
    // const { success } = await rateLimiter.limit(userId);  // Apply rate limiter

    // if (!success) {
    //     return NextResponse.json({
    //         success: false,
    //         message: "Rate limit exceeded. Please try again later.",
    //     }, { status: 429 });  // HTTP 429 Too Many Requests
    // }
    const quizList = await db.select().from(PRACTICE_QUIZ_TABLE)
    .where(eq(PRACTICE_QUIZ_TABLE.createdBy, createdBy))
    .orderBy(desc(PRACTICE_QUIZ_TABLE.id))

    return NextResponse.json({result : quizList})
}

export async function GET(req){
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

    const res = await db.select().from(PRACTICE_QUIZ_TABLE)
    .where(eq(PRACTICE_QUIZ_TABLE.courseId, courseId))

    const record = res[0];
    if (record.createdBy !== email) {
        return NextResponse.json({ error: "Forbidden: You are not authorized to access this record." }, { status: 403 });
    }

    return NextResponse.json({result:res[0]})
}