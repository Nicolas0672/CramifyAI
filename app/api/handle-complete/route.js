import { db } from "@/configs/db";
import { AI_TEXT_RESPONSE_TABLE, CHAPTER_NOTE_TABLE, FILL_BLANK_TABLE, FLASHCARD_CONTENT, PRACTICE_QUIZ_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";  // Import getAuth for email validation
import { rateLimiter } from "../rateLimiter";  // Assuming rateLimiter is set up

export async function POST(req) {
    const { courseId, studyType, type } = await req.json();
    
    // Get email from the authenticated user
    const { userId } = getAuth(req);
    if (!userId) return { error: "Unauthorized: No userId", status: 401 };

    const client = await clerkClient()
const user = await client.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress;

    // Rate limiting check for the user (based on email)
    // const { success } = await rateLimiter.limit(email);  // Apply rate limiter

    // if (!success) {
    //     return NextResponse.json({
    //         success: false,
    //         message: "Rate limit exceeded. Please try again later.",
    //     }, { status: 429 });  // HTTP 429 Too Many Requests
    // }

    try {
        if (type == 'study') {
            if (studyType == 'notes') {
                const noteUpdate = await db.update(CHAPTER_NOTE_TABLE).set({
                    isDone: true
                }).where(eq(CHAPTER_NOTE_TABLE.courseId, courseId));

                // Ensure the update is successful
                if (!noteUpdate) return NextResponse.json({ resp: 'Failed to update notes' });
            }
            else if (studyType == 'flashcard') {
                const flashcardUpdate = await db.update(FLASHCARD_CONTENT).set({
                    isDone: true
                }).where(eq(FLASHCARD_CONTENT.courseId, courseId));

                // Ensure the update is successful
                if (!flashcardUpdate) return NextResponse.json({ resp: 'Failed to update flashcard' });
            }

            // Fetch session data for progress update
            const session = await db.select().from(AI_TEXT_RESPONSE_TABLE)
                .where(eq(AI_TEXT_RESPONSE_TABLE.courseId, courseId));

            if (!session || session.length === 0) return NextResponse.json({ resp: 'Session not found' });

            // Update progress
            const newCount = parseInt((session[0].progress || 0) + 50);
            await db.update(AI_TEXT_RESPONSE_TABLE).set({
                progress: newCount
            }).where(eq(AI_TEXT_RESPONSE_TABLE.courseId, courseId));

            return NextResponse.json({ resp: 'Success' });
        }
        else if (type == 'practice') {
            if (studyType == 'quiz') {
                const quizUpdate = await db.update(PRACTICE_QUIZ_TABLE).set({
                    isDone: true
                }).where(eq(PRACTICE_QUIZ_TABLE.courseId, courseId));

                // Ensure the update is successful
                if (!quizUpdate) return NextResponse.json({ resp: 'Failed to update quiz' });
            }
            else if (studyType === 'fill-blank') {
                try {
                    await db.update(FILL_BLANK_TABLE).set({
                        isDone: true
                    }).where(eq(FILL_BLANK_TABLE.courseId, courseId));
                    console.log("Fill-blank update successful");
                } catch (err) {
                    console.error("Error updating fill-blank:", err);
                    return NextResponse.json({ error: "Error updating fill-blank", details: err }, { status: 500 });
                }
            }

            // Fetch session data for progress update
            const session = await db.select().from(PRACTICE_QUIZ_TABLE)
                .where(eq(PRACTICE_QUIZ_TABLE.courseId, courseId));

            if (!session || session.length === 0) return NextResponse.json({ resp: 'Session not found' });

            // Update progress
            const newCount = parseInt((session[0].progress || 0) + 50);
            await db.update(PRACTICE_QUIZ_TABLE).set({
                progress: newCount
            }).where(eq(PRACTICE_QUIZ_TABLE.courseId, courseId));

            return NextResponse.json({ resp: 'Success' });
        }
    } catch (err) {
        console.error("Error processing request:", err);
        return NextResponse.json({ error: 'Error: ' + err.message }, { status: 500 });
    }
}
