import { db } from "@/configs/db";
import { EXAM_SESSION_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { rateLimiter } from "../rateLimiter";

export async function POST(req) {
    const { courseId, question, userAns } = await req.json();
    
    // Get the authenticated user's email
    const { userId } = getAuth(req);
    if (!userId) return { error: "Unauthorized: No userId", status: 401 };

    const client = await clerkClient()
const user = await client.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress;

    // Rate limiting check for the user (based on email)
    // const { success } = await rateLimiter.limit(email);

    // if (!success) {
    //     return NextResponse.json({
    //         success: false,
    //         message: "Rate limit exceeded. Please try again later.",
    //     }, { status: 429 });  // HTTP 429 Too Many Requests
    // }

    try {
        // Fetch the exam session to check if the user is allowed to update
        const existingSession = await db.select().from(EXAM_SESSION_TABLE)
            .where(eq(EXAM_SESSION_TABLE.courseId, courseId))
            .limit(1);

        if (!existingSession || existingSession[0].createdBy !== email) {
            // If the session doesn't exist or the user is not the one who created it, return Forbidden
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Update the exam session with the provided question and answer
        const dbUpdate = await db.update(EXAM_SESSION_TABLE).set({
            question: question || "test",
            userAns: userAns || "test",
        }).where(eq(EXAM_SESSION_TABLE.courseId, courseId));

        // Fetch the updated row and return the response
        const updatedRow = await db.select().from(EXAM_SESSION_TABLE)
            .where(eq(EXAM_SESSION_TABLE.courseId, courseId))
            .limit(1);

        return NextResponse.json({ res: updatedRow[0] });
    } catch (err) {
        console.error("Error during update:", err);
        return NextResponse.json({ error: 'Update failed: ' + err.message }, { status: 500 });
    }
}
