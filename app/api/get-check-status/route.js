import { db } from "@/configs/db";
import { FLASHCARD_CONTENT } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { rateLimiter } from "../rateLimiter";  // Assuming rateLimiter is set up

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const recordId = searchParams?.get('id');

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

    // Query the database for flashcard content based on recordId
    const res = await db.select().from(FLASHCARD_CONTENT).where(eq(FLASHCARD_CONTENT.id, recordId));

    // If no data is found for the given recordId
    if (res.length === 0) {
        return NextResponse.json({ error: "No data found for this recordId." }, { status: 404 });
    }

    // Ensure the record is owned by the authenticated user
    const record = res[0];
    if (record.createdBy !== email) {
        return NextResponse.json({ error: "Forbidden: You are not authorized to access this record." }, { status: 403 });
    }

    // If rate limit and email check passed, return the status of the record
    return NextResponse.json({ status: record.status });
}
