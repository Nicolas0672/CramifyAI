import { db } from "@/configs/db";
import { AI_TEXT_RESPONSE_TABLE } from "@/configs/schema";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { validateUser } from "../validate-user/route";

export async function POST(req) {
  try {
    // Get the authenticated user's email
  


    // Ensure the request includes createdBy and that it matches the authenticated user's email
    const { createdBy } = await req.json();
    
    const validation = await validateUser(req, createdBy)

    if (validation.error) {
      return NextResponse.json({ error: validation.error, ...validation.debug }, { status: validation.status })
    }

    // Perform the query using the authenticated user's email
    const result = await db.select().from(AI_TEXT_RESPONSE_TABLE)
      .where(eq(AI_TEXT_RESPONSE_TABLE.createdBy, createdBy))
      .orderBy(desc(AI_TEXT_RESPONSE_TABLE.id));

    return NextResponse.json({ result });

  } catch (error) {
    console.error("Error in POST /api/check-user", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    // Get the authenticated user's email
    const { userId } = getAuth(req);
    if (!userId) return { error: "Unauthorized: No userId", status: 401 };

    const client = await clerkClient()
const user = await client.users.getUser(userId)
    const userEmail = user.emailAddresses[0]?.emailAddress;


    // Get the courseId from the request URL
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const courseId = searchParams?.get("courseId");

    if (!courseId) {
      return NextResponse.json(
        { error: "courseId is required" },
        { status: 400 }
      );
    }

    // Perform the query using the courseId and authenticated user's email
    const course = await db
  .select()
  .from(AI_TEXT_RESPONSE_TABLE)
  .where(
    and(
      eq(AI_TEXT_RESPONSE_TABLE.courseId, courseId),
      eq(AI_TEXT_RESPONSE_TABLE.createdBy, userEmail)
    )
  );

    return NextResponse.json({ result: course[0] });

  } catch (error) {
    console.error("Error in GET /api/check-course", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: error.message }
    );
  }
}
