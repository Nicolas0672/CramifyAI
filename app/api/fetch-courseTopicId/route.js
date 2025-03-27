import { db } from "@/configs/db";
import { AI_TEXT_RESPONSE_TABLE, TEACH_ME_FEEDBACK_TABLE, TEACH_ME_QUESTIONS_TABLE } from "@/configs/schema";
import { and, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST (req){
    const {createdBy, selectOption, selectedTopic } = await req.json()
    if(selectOption =='Exam' || selectOption == 'Practice'){
        const dbResult = await db.select().from(AI_TEXT_RESPONSE_TABLE)
                .where(
                    and(
                        eq(AI_TEXT_RESPONSE_TABLE.createdBy, createdBy),
                        sql`${AI_TEXT_RESPONSE_TABLE.aiResponse} ->> 'courseTitle' = ${selectedTopic}`
                    )
                );



            const firstItem = dbResult[0]

            const chapters = firstItem?.aiResponse?.chapters

            const combinedCourseLayout = chapters.map(chapter => {
                const title = chapter.title;
                const summary = chapter.summary
                const topic = (chapter.topics || []).join(", ");
                return `${title}: ${summary}. Topics covered: ${topic}`;
            })
                .join(' || ')
            return NextResponse.json({courseLayout: combinedCourseLayout, firstItem: firstItem})
    } else {
        const dbResult = await db
        .select()
        .from(TEACH_ME_QUESTIONS_TABLE)
        .where(
            and(
                eq(TEACH_ME_QUESTIONS_TABLE.createdBy, createdBy),
                sql`${TEACH_ME_QUESTIONS_TABLE.topics} ->> 'courseTitle' = ${selectedTopic}`
            )
        );
    
         const courseId = dbResult[0].courseId
         const combinedCourseLayout = await db.select().from(TEACH_ME_FEEDBACK_TABLE)
         .where(eq(TEACH_ME_FEEDBACK_TABLE?.courseId, courseId))

         

         return NextResponse.json({courseLayout: combinedCourseLayout[0].aiFeedback, firstItem: dbResult[0]})
    }
}