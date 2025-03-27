import { db } from "@/configs/db";
import { PRACTICE_QUIZ_TABLE, TEACH_ME_QUESTIONS_TABLE, AI_TEXT_RESPONSE_TABLE } from "@/configs/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { createdBy, selectedOption } = await req.json();

        let topicsList = [];

        if (selectedOption === "Study") {
            const dbRes = await db
                .select()
                .from(TEACH_ME_QUESTIONS_TABLE)
                .where(eq(TEACH_ME_QUESTIONS_TABLE.createdBy, createdBy))
                .orderBy(desc(TEACH_ME_QUESTIONS_TABLE.id));

            topicsList = dbRes.map(item => item?.topics?.courseTitle);
        } 
        else if (selectedOption === "Practice") {
            const res = await db
                .select()
                .from(AI_TEXT_RESPONSE_TABLE)
                .where(eq(AI_TEXT_RESPONSE_TABLE.createdBy, createdBy))
                .orderBy(desc(AI_TEXT_RESPONSE_TABLE.id));

            topicsList = res.map(item => item?.aiResponse?.courseTitle);
        } 
        else if (selectedOption === "Exam") {
            const practiceDb = await db
                .select()
                .from(PRACTICE_QUIZ_TABLE)
                .where(eq(PRACTICE_QUIZ_TABLE.createdBy, createdBy))
                .orderBy(desc(PRACTICE_QUIZ_TABLE.id));

            const studyDb = await db
                .select()
                .from(AI_TEXT_RESPONSE_TABLE)
                .where(eq(AI_TEXT_RESPONSE_TABLE.createdBy, createdBy))
                .orderBy(desc(AI_TEXT_RESPONSE_TABLE.id));

            topicsList = [
                ...practiceDb.map(item => item?.topic),
                ...studyDb.map(item => item?.aiResponse?.courseTitle),
            ];
        }

        return NextResponse.json({ topics: topicsList }, { status: 200 });
    } catch (err) {
        console.error("Error fetching topics:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
