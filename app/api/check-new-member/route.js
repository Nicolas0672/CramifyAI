import { db } from "@/configs/db";
import { USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getAuth, clerkClient  } from "@clerk/nextjs/server";

export async function POST(req) {
  const { userId  } = getAuth(req);
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  const userEmail = user.emailAddresses[0]?.emailAddress;
  try {
    // Get the authenticated user email
   
   

    // Extract the createdBy from the request body
    const { createdBy } = await req.json();

    // Check if the email from the request matches the authenticated user's email
    if (!userEmail || userEmail !== createdBy) {
      return NextResponse.json(
        { error: "Unauthorized",    debug: {
          userObject: user,
          extractedEmail: email,
          requestEmail: createdBy
        } },
        { status: 401 }
      );
    }

    // Proceed to query the database based on the authenticated user's email
    const dbRes = await db.select().from(USER_TABLE)
      .where(eq(USER_TABLE.email, createdBy));

    // Return the user data from the database
    return NextResponse.json({ res: dbRes[0] });

  } catch (error) {
    console.error("Error in POST /api/check-user", error);
    return NextResponse.json(
      { error: "Internal server error", userObject: userEmail },
      { status: 500 }
    );
  }
}
