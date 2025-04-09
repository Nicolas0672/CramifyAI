import { db } from "@/configs/db";
import { EXAM_SESSION_TABLE } from "@/configs/schema";
import { desc, eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";

// POST function: Get exam list for a specific user
export async function POST(req) {
  const { userId } = getAuth(req);
  if (!userId) return { error: "Unauthorized: No userId", status: 401 };

  const client = await clerkClient()
const user = await client.users.getUser(userId)
  const email = user.emailAddresses[0]?.emailAddress;

  const { createdBy } = await req.json();

  // Check if the provided 'createdBy' matches the authenticated user's email
  if (createdBy !== email) {
    return NextResponse.json({ error: "Unauthorized: You can only access your own exam sessions" }, { status: 403 });
  }

  const examList = await db.select().from(EXAM_SESSION_TABLE)
    .where(eq(EXAM_SESSION_TABLE.createdBy, createdBy))
    .orderBy(desc(EXAM_SESSION_TABLE.id));

  return NextResponse.json({ result: examList });
}

// GET function: Get exam session by courseId
export async function GET(req) {
  const { userId } = getAuth(req);
  if (!userId) return { error: "Unauthorized: No userId", status: 401 };

  const client = await clerkClient()
const user = await client.users.getUser(userId)
  const email = user.emailAddresses[0]?.emailAddress;
  // Ensure the user is authenticated
  if (!userId || !email) {
    return NextResponse.json({ error: "Unauthorized: User must be authenticated" }, { status: 401 });
  }

  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const courseId = searchParams.get('courseId');

  if (!courseId) {
    return NextResponse.json({ error: "courseId is required" }, { status: 400 });
  }

  const res = await db.select().from(EXAM_SESSION_TABLE)
    .where(eq(EXAM_SESSION_TABLE.courseId, courseId));

  // Optionally, check if the user has access to the course or exam session
  if (res.length > 0 && res[0].createdBy !== email) {
    return NextResponse.json({ error: "Unauthorized: You can only access your own exam sessions" }, { status: 403 });
  }

  return NextResponse.json({ result: res[0] });
}
