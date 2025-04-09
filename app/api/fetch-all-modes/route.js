import { db } from "@/configs/db"
import {
  AI_TEXT_RESPONSE_TABLE,
  EXAM_SESSION_TABLE,
  PRACTICE_QUIZ_TABLE,
  TEACH_ME_QUESTIONS_TABLE
} from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getAuth, clerkClient } from "@clerk/nextjs/server";

// POST function: Get exam list for a specific user
export async function POST(req) {
  const { userId } = getAuth(req);
  if (!userId) return { error: "Unauthorized: No userId", status: 401 };

  const client = await clerkClient()
const user = await client.users.getUser(userId)
  const email = user.emailAddresses[0]?.emailAddress;

  const { createdBy, mode } = await req.json()

  // Check if the provided email matches the logged-in user's email
  if (createdBy !== email) {
    return NextResponse.json({ error: "Forbidden: You can only access your own data" }, { status: 403 })
  }

  let res = []

  try {
    if (mode === "teach") {
      res = await db
        .select()
        .from(TEACH_ME_QUESTIONS_TABLE)
        .where(eq(TEACH_ME_QUESTIONS_TABLE.createdBy, createdBy))
    } else if (mode === "study") {
      res = await db
        .select()
        .from(AI_TEXT_RESPONSE_TABLE)
        .where(eq(AI_TEXT_RESPONSE_TABLE.createdBy, createdBy))
    } else if (mode === "practice") {
      res = await db
        .select()
        .from(PRACTICE_QUIZ_TABLE)
        .where(eq(PRACTICE_QUIZ_TABLE.createdBy, createdBy))
    } else if (mode === "exam") {
      res = await db
        .select()
        .from(EXAM_SESSION_TABLE)
        .where(eq(EXAM_SESSION_TABLE.createdBy, createdBy))
    } else {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 })
    }

    return NextResponse.json(res)
  } catch (err) {
    return NextResponse.json({ error: "Internal server error", err }, { status: 500 })
  }
}
