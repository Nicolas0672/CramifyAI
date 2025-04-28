import { db } from "@/configs/db";
import { EXAM_RESPONSE_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuth,clerkClient } from "@clerk/nextjs/server";
import { rateLimiter } from "../rateLimiter";


export async function GET(req) {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const courseId = searchParams?.get('courseId');

    // Get email from the authenticated user
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

    // Query the database for exam responses for the courseId
    const dbRes = await db.select().from(EXAM_RESPONSE_TABLE).where(eq(EXAM_RESPONSE_TABLE.courseId, courseId));

    // If no data is found for the given courseId
    if (dbRes.length === 0) {
        return NextResponse.json({ error: "No data found for this courseId." }, { status: 404 });
    }

    // Check if the email in the database matches the authenticated user's email
    const matchingData = dbRes.filter(res => res.createdBy === email);

    // If no matching data is found, return Forbidden response
    if (matchingData.length === 0) {
        return NextResponse.json({ error: "Forbidden: You are not authorized to access this data." }, { status: 403 });
    }

    // If rate limit and email check passed, return the data
    return NextResponse.json({ result: matchingData });
}