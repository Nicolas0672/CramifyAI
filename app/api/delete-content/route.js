import { db } from "@/configs/db";
import { 
  AI_TEXT_RESPONSE_TABLE, 
  CHAPTER_NOTE_TABLE, 
  EXAM_RESPONSE_TABLE, 
  EXAM_SESSION_TABLE, 
  FILL_BLANK_TABLE, 
  FLASHCARD_CONTENT, 
  PRACTICE_QUIZ_TABLE, 
  STUDY_MATERIAL_TABLE, 
  TEACH_ME_FEEDBACK_TABLE, 
  TEACH_ME_QUESTIONS_TABLE 
} from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";

export async function DELETE(req) {
  const { userId } = getAuth(req);
  if (!userId) return { error: "Unauthorized: No userId", status: 401 };

  const client = await clerkClient()
const user = await client.users.getUser(userId)
  const email = user.emailAddresses[0]?.emailAddress;

  const { courseId, type } = await req.json();
  let schemasToDeleteFrom = [];

  // Authentication check: ensure the user is logged in
  if (!userId || !email) {
    return NextResponse.json(
      { error: "Unauthorized: User must be authenticated" },
      { status: 401 }
    );
  }

  // Validate the provided courseId and type
  if (!courseId) {
    return NextResponse.json(
      { error: "courseId is required" },
      { status: 400 }
    );
  }

  if (!type) {
    return NextResponse.json(
      { error: "type is required" },
      { status: 400 }
    );
  }

  // Determine which schemas to delete based on the `type`
  if (type === 'study') {
    schemasToDeleteFrom = [AI_TEXT_RESPONSE_TABLE, FLASHCARD_CONTENT, CHAPTER_NOTE_TABLE];
  } else if (type === 'practice') {
    schemasToDeleteFrom = [PRACTICE_QUIZ_TABLE, FILL_BLANK_TABLE];
  } else if (type === 'exam') {
    schemasToDeleteFrom = [EXAM_RESPONSE_TABLE, EXAM_SESSION_TABLE];
  } else if (type === 'teach Me') {
    schemasToDeleteFrom = [TEACH_ME_FEEDBACK_TABLE, TEACH_ME_QUESTIONS_TABLE];
  }

  // Check if schemasToDeleteFrom has been populated correctly
  if (schemasToDeleteFrom.length === 0) {
    return NextResponse.json({ error: 'Invalid type provided' }, { status: 400 });
  }

  try {
    // Perform the delete operation on all selected schemas
    for (const schema of schemasToDeleteFrom) {
      try {
        // Add an authorization check to ensure the user can delete this data
        const result = await db
          .select()
          .from(schema)
          .where(and(eq(schema.courseId, courseId), eq(schema.createdBy, email)));

        if (result.length === 0) {
          return NextResponse.json(
            { error: `Unauthorized: No content found for courseId: ${courseId} and user email: ${email}` },
            { status: 403 }
          );
        }

        // Proceed with deletion if authorization is successful
        await db.delete(schema).where(eq(schema.courseId, courseId));
        console.log(`Deleted content from ${schema.name} for courseId: ${courseId}`);
        
      } catch (err) {
        console.error(`Failed to delete from ${schema.name} for courseId: ${courseId}:`, err);
        return NextResponse.json(
          { error: `Failed to delete from ${schema.name}`, err },
          { status: 500 }
        );
      }
    }

    // Return success response after all deletions
    return NextResponse.json({ message: 'Content deleted successfully' });

  } catch (err) {
    console.error("General error in DELETE /api/delete-content:", err);
    return NextResponse.json(
      { error: 'Internal server error', err },
      { status: 500 }
    );
  }
}
