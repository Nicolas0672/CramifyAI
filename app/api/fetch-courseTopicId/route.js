import { db } from "@/configs/db"
import {
  AI_TEXT_RESPONSE_TABLE,
  TEACH_ME_FEEDBACK_TABLE,
  TEACH_ME_QUESTIONS_TABLE
} from "@/configs/schema"
import { and, eq, sql } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getAuth, clerkClient } from "@clerk/nextjs/server";

// POST function: Get exam list for a specific user
export async function POST(req) {
  const { userId } = getAuth(req);
  if (!userId) return { error: "Unauthorized: No userId", status: 401 };

  const client = await clerkClient()
const user = await client.users.getUser(userId)
  const email = user.emailAddresses[0]?.emailAddress;

  const { createdBy, selectOption, selectedTopic } = await req.json()

  if (createdBy !== email) {
    return NextResponse.json({ error: "Forbidden: You can only access your own data" }, { status: 403 })
  }

  try {
    if (selectOption === "Exam" || selectOption === "Practice") {
      const dbResult = await db.select().from(AI_TEXT_RESPONSE_TABLE)
        .where(
          and(
            eq(AI_TEXT_RESPONSE_TABLE.createdBy, createdBy),
            sql`${AI_TEXT_RESPONSE_TABLE.aiResponse} ->> 'courseTitle' = ${selectedTopic}`
          )
        )

      const firstItem = dbResult[0]
      const chapters = firstItem?.aiResponse?.chapters ?? []

      const combinedCourseLayout = chapters.map(chapter => {
        const title = chapter.title
        const summary = chapter.summary
        const topic = (chapter.topics || []).join(", ")
        return `${title}: ${summary}. Topics covered: ${topic}`
      }).join(" || ")

      return NextResponse.json({ courseLayout: combinedCourseLayout, firstItem })
    } else {
      const dbResult = await db.select().from(TEACH_ME_QUESTIONS_TABLE)
        .where(
          and(
            eq(TEACH_ME_QUESTIONS_TABLE.createdBy, createdBy),
            sql`${TEACH_ME_QUESTIONS_TABLE.topics} ->> 'courseTitle' = ${selectedTopic}`
          )
        )

      const firstItem = dbResult[0]
      const courseId = firstItem?.courseId

      const feedbackResult = await db.select().from(TEACH_ME_FEEDBACK_TABLE)
        .where(eq(TEACH_ME_FEEDBACK_TABLE.courseId, courseId))

      return NextResponse.json({ courseLayout: feedbackResult[0]?.aiFeedback, firstItem })
    }
  } catch (err) {
    return NextResponse.json({ error: "Server error", err }, { status: 500 })
  }
}
