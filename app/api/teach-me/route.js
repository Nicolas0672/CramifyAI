import { db } from "@/configs/db"
import { TEACH_ME_QUESTIONS_TABLE } from "@/configs/schema"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { getAuth, clerkClient } from "@clerk/nextjs/server";  // Import getAuth for email validation
import { rateLimiter } from "../rateLimiter";
export async function POST(req) {
    const {createdBy} = await req.json()
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
    //     return NextResponse.json({
    //         success: false,
    //         message: "Rate limit exceeded. Please try again later.",
    //     }, { status: 429 });  // HTTP 429 Too Many Requests
    // }
    try{
    const dbResult = await db.select().from(TEACH_ME_QUESTIONS_TABLE)
    .where(eq(TEACH_ME_QUESTIONS_TABLE.createdBy, createdBy))
      .orderBy(desc(TEACH_ME_QUESTIONS_TABLE.id))

    return NextResponse.json({result : dbResult})
    } catch(err){ return NextResponse.json({error: err})}
}

export async function GET(req){
    const reqUrl = req.url
    const {searchParams} = new URL(reqUrl)
    const courseId = searchParams?.get('courseId')

    const { userId } = getAuth(req);
    if (!userId) return { error: "Unauthorized: No userId", status: 401 };

    const client = await clerkClient()
const user = await client.users.getUser(userId)
    const userEmail = user.emailAddresses[0]?.emailAddress;

    const dbRes = await db.select().from(TEACH_ME_QUESTIONS_TABLE)
    .where(eq(TEACH_ME_QUESTIONS_TABLE?.courseId, courseId))

    if (dbRes[0].createdBy !== userEmail) {
        return NextResponse.json({ error: "Forbidden: You are not authorized to access this record." }, { status: 403 });
    }

    return NextResponse.json({result: dbRes[0]})
}

