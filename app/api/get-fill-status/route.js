import { db } from "@/configs/db"
import { FILL_BLANK_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { rateLimiter } from "../rateLimiter";

export async function GET (req){
    const {searchParams} = new URL(req.url)
    const recordId = searchParams?.get('id')

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
    const res = await db.select().from(FILL_BLANK_TABLE)
    .where(eq(FILL_BLANK_TABLE.id, recordId))

    if (res.length === 0) {
        return NextResponse.json({ error: "No data found for this recordId." }, { status: 404 });
    }

    // Ensure the record is owned by the authenticated user
    const record = res[0];
    if (record.createdBy !== email) {
        return NextResponse.json({ error: "Forbidden: You are not authorized to access this record." }, { status: 403 });
    }

    return NextResponse.json({status: record.status})
}