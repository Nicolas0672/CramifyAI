import { db } from "@/configs/db";
import { AI_TEXT_RESPONSE_TABLE } from "@/configs/schema";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams?.get('courseId');

    // Get email from the authenticated user
    const { userId } = getAuth(req);
    if (!userId) return { error: "Unauthorized: No userId", status: 401 };

    const client = await clerkClient()
const user = await client.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress;
    const res = await db.select().from(AI_TEXT_RESPONSE_TABLE).where(eq(AI_TEXT_RESPONSE_TABLE.courseId, courseId))

     const record = res[0];
        if (record.createdBy !== email) {
            return NextResponse.json({ error: "Forbidden: You are not authorized to access this record." }, { status: 403 });
        }
    
        // If rate limit and email check passed, return the status of the record
        return NextResponse.json({ status: record.status });
}