import { db } from "@/configs/db";
import { FLASHCARD_CONTENT } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { rateLimiter } from "../rateLimiter";

export async function POST(req) {
    const { courseId, flashcards } = await req.json();

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
        // Fetch the flashcard content to check if the user is allowed to update
        const existingFlashcard = await db.select().from(FLASHCARD_CONTENT)
            .where(eq(FLASHCARD_CONTENT.courseId, courseId))
            .limit(1);

        if (!existingFlashcard || existingFlashcard[0].createdBy !== email) {
            // If the flashcard content doesn't exist or the user is not the one who created it, return Forbidden
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Update the flashcards content
        await db.update(FLASHCARD_CONTENT).set({
            content: { data: flashcards }
        }).where(eq(FLASHCARD_CONTENT.courseId, courseId));

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Error updating flashcard content:", err);
        return NextResponse.json({ error: "Update failed: " + err.message }, { status: 500 });
    }
}
