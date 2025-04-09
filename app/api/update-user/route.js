import { db } from "@/configs/db"
import { USER_TABLE } from "@/configs/schema"
import { eq } from "drizzle-orm"
import moment from "moment"
import { NextResponse } from "next/server"
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { rateLimiter } from "../rateLimiter";

export async function POST(req){
    try {
      const { userId } = getAuth(req);
        
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized: No userId" }, { status: 401 });
        }

        const client = await clerkClient()
        const user = await client.users.getUser(userId)
        const userEmail = user.emailAddresses[0]?.emailAddress;
        const {createdBy} = await req.json()
        

        if (!userEmail || userEmail !== createdBy) {
            return NextResponse.json({
                error: "Unauthorized: Email mismatch",
                debug: {
                    userEmail,
                    createdBy,
                },
            }, { status: 401 });
        }
        
        // const { success } = await rateLimiter.limit(userId);

        // if (!success) {
        //     return NextResponse.json({
        //         success: false,
        //         message: "Rate limit exceeded. Please try again later.",
        //     }, { status: 429 });
        // }
        
        const userDb = await db.select().from(USER_TABLE).where(eq(USER_TABLE.email, createdBy))

        if(userDb[0].createdAt == null){
            await db.update(USER_TABLE).set({
                createdAt: moment().format("DD-MM-yyyy")
            }).where(eq(USER_TABLE.email, createdBy))
        }
       
        return NextResponse.json({success: true}) // Fixed typo in "success"
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}