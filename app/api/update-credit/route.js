import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm"; // Import sql for raw SQL expressions

export async function POST(req) {
  try {
    const { createdBy, lastCreditReset } = await req.json();
    
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