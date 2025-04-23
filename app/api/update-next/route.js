import { db } from "@/configs/db";
import { EXAM_RESPONSE_TABLE, EXAM_SESSION_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";


export async function POST(req) {
    const { courseId } = await req.json();

    // Get the authenticated user's email
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

    try {
        // Fetch the exam session and exam response to validate user ownership
        const session = await db.select().from(EXAM_SESSION_TABLE)
            .where(eq(EXAM_SESSION_TABLE.courseId, courseId))
            .limit(1);

        if (!session || session[0].createdBy !== email) {
            // If the session doesn't exist or the user is not the one who created it, return Forbidden
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const feedbackSession = await db.select().from(EXAM_RESPONSE_TABLE)
            .where(eq(EXAM_RESPONSE_TABLE.courseId, courseId))
            .limit(1);

        if (!feedbackSession) {
            return NextResponse.json({ error: "Feedback session not found" }, { status: 404 });
        }

       
        const newCount = (parseInt(session[0].questionCount || 0) + 1);

        // Update the EXAM_SESSION_TABLE and EXAM_RESPONSE_TABLE with new question counts
         await db.update(EXAM_SESSION_TABLE)
            .set({
                questionCount: newCount
            })
            .where(eq(EXAM_SESSION_TABLE.courseId, courseId));

            const updateDb = await db.select().from(EXAM_SESSION_TABLE)
            .where(eq(EXAM_SESSION_TABLE.courseId, courseId))
            .limit(1);

        if(newCount >= 5){
            await db.update(EXAM_RESPONSE_TABLE)
            .set({
                questionCounts: 5
            })
            .where(eq(EXAM_RESPONSE_TABLE.courseId, courseId));
        }

        return NextResponse.json({ res: updateDb[0] });

    } catch (err) {
        console.error("Error updating exam session and response:", err);
        return NextResponse.json({ error: "Failed to update data into database: " + err.message }, { status: 500 });
    }
}
