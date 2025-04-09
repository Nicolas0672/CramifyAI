import { db } from "@/configs/db"
import { EXAM_RESPONSE_TABLE, EXAM_SESSION_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getAuth, clerkClient } from "@clerk/nextjs/server";  // Import getAuth for email validation
import { rateLimiter } from "../rateLimiter";
export async function POST(req){
    const {createdBy, courseId} = await req.json()

    const { userId } = getAuth(req);
    if (!userId) return { error: "Unauthorized: No userId", status: 401 };

    const client = await clerkClient()
const user = await client.users.getUser(userId)
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail || userEmail !== createdBy) {
      return {
        error: "Unauthorized: Email mismatch",
        status: 401,
        debug: {
          userEmail,
          createdBy,
        },
      };
    }

    // const { success } = await rateLimiter.limit(userId);  // Check if user has exceeded the limit

    // if (!success) {
    //   return NextResponse.json({
    //     success: false,
    //     message: "Rate limit exceeded. Please try again later.",
    //   }, { status: 429 });  // HTTP 429 Too Many Requests
    // }
    

    await db.update(EXAM_SESSION_TABLE).set({
        exam_time: 0
    }).where(eq(EXAM_SESSION_TABLE?.courseId, courseId))

    await db.update(EXAM_RESPONSE_TABLE).set({
        exam_time: 0
    }).where(eq(EXAM_RESPONSE_TABLE?.createdBy, createdBy))

    return NextResponse.json({sucess: true})
}