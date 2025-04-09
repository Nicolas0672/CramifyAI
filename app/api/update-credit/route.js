import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm"; // Import sql for raw SQL expressions
import { getAuth, clerkClient } from "@clerk/nextjs/server";  // Import getAuth for email validation
import { rateLimiter } from "../rateLimiter";
export async function POST(req) {
  try {
    const { createdBy, lastCreditReset } = await req.json();
    const { userId } = getAuth(req);
    if (!userId) return { error: "Unauthorized: No userId", status: 401 };

    const client = await clerkClient()
const user = await client.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress;
    if (createdBy !== email) {
      return { valid: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
    }

    // const { success } = await rateLimiter.limit(userId);  // Check if user has exceeded the limit

    // if (!success) {
    //   return NextResponse.json({
    //     success: false,
    //     message: "Rate limit exceeded. Please try again later.",
    //   }, { status: 429 });  // HTTP 429 Too Many Requests
    // }
    // Create the next month date
    const currentDate = new Date();
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(currentDate.getMonth() + 1);

    const res = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, createdBy))
    const newTotalCreditSize = res[0].totalCreditSize + 10
    const newRemainCredit = res[0].remainingCredits + 10

    // Update the database using sql expressions for timestamps
    const dbRes = await db.update(USER_TABLE).set({
      lastCreditReset: sql`${lastCreditReset}::timestamp`,
      nextCreditReset: sql`${nextMonthDate.toISOString()}::timestamp`,
      newFreeCredits: 10,
      remainingCredits: newRemainCredit,
      totalCreditSize: newTotalCreditSize
    }).where(eq(USER_TABLE.email, createdBy));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating credits:", error);
    return NextResponse.json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
}