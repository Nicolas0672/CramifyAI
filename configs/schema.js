import { boolean, integer, json, text } from "drizzle-orm/gel-core";
import { date, pgTable, serial, time, timestamp, varchar } from "drizzle-orm/pg-core";

export const USER_TABLE=pgTable('users',{
    id:serial().primaryKey(),
    name:varchar().notNull(),
    email:varchar().notNull(),
    isMember:boolean().default(false),
    isNewMember: boolean().default(true),
    totalCredits: integer().default(0),
    newFreeCredits: integer().default(10),
    newPurchasedCredit: integer().default(0),
    remainingCredits: integer().default(10),
    totalCreditSize: integer().default(10),
    lastCreditReset: timestamp("lastCreditReset").defaultNow(),
    nextCreditReset: timestamp("nextCreditReset"),
    createdAt: varchar(),

})

export const PAYMENT_USER_TABLE=pgTable('PaymentTable',{
    id: serial().primaryKey(),
    createdBy: varchar().notNull(),
    transactionId: varchar().notNull(),
    amountPaid: integer().notNull(),
    status: varchar().default('pending'),
    creditAmount: integer().notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    customerId: varchar(), 
})

export const STUDY_MATERIAL_TABLE=pgTable('studyMaterial',{
    id:serial().primaryKey(),
    courseId:varchar().notNull(),
    courseType:varchar().notNull(),
    topic:varchar().notNull(),
    difficultyLevel:varchar().default('Easy'),
    courseLayout:text(),
    createdBy:varchar().notNull(),
    storageId:varchar(),

})

export const AI_TEXT_RESPONSE_TABLE=pgTable('aiTextResp',{
    id:serial().primaryKey(),
    courseId: varchar().notNull(),
    aiResponse: json(),
    status:varchar().default('Generating'),
    createdAt: varchar('createdAt'),
    createdBy:varchar().notNull(),
    progress: integer().default(0)
})

export const CHAPTER_NOTE_TABLE=pgTable('chapterNotes',{
    id:serial().primaryKey(),
    courseId:varchar().notNull(),
    chapterId: integer().notNull(),
    notes:text(),
    isDone: boolean().default(false)
})

export const FLASHCARD_CONTENT = pgTable('flashCardContent',{
    id:serial().primaryKey(),
    courseId:varchar().notNull(),
    content: json(),
    type: varchar().notNull(),
    status: varchar().default('Generating'),
    isDone: boolean().default(false)
})

export const PRACTICE_QUIZ_TABLE = pgTable('PracticeQuiz',{
    id:serial().primaryKey(),
    aiResponse: json(),
    courseId:varchar().notNull(),
    status: varchar().default('Ready'),
    createdBy:varchar().notNull(),
    createdAt: varchar(),
    quiz:varchar().default('quiz'),
    courseLayout:text(),
    topic:varchar().notNull(),
    difficultyLevel:varchar().default('Easy'),
    progress: integer().default(0),
    isDone: boolean().default(false)
})

export const FILL_BLANK_TABLE = pgTable('Fill-Blank',{
    id:serial().primaryKey(),
    aiResponse: json(),
    courseId: varchar().notNull(),
    type: varchar().notNull(),
    status: varchar().default('Generating'),
    isDone: boolean().default(false)
})

export const EXAM_SESSION_TABLE = pgTable('Exam-Session',{
    id: serial().primaryKey(),
    courseLayout: text(),
    courseId: varchar().notNull(),
    createdBy: varchar().notNull(),
    createdAt: varchar().notNull(),
    status: varchar().default('Generating'),
    questionCount: integer().default(0),
    topic: varchar().notNull(),
    difficultyLevel:varchar().default('Easy'),
    exam_time: integer().default(30),
    currQuestionAiResp: json(),
    question: text(),
    userAns: text(),
    remainingTime: integer()
})

export const EXAM_RESPONSE_TABLE = pgTable('Exam-Response',{
    id:serial().primaryKey(),
    userAns: text(),
    exam_time: integer().notNull(),
    start_time: text().notNull(),
    aiResponse: json(),
    courseId: varchar().notNull(),
    status: varchar().default('Generating'),
    createdBy: varchar().notNull(),
    question: text(),

})



export const TEACH_ME_QUESTIONS_TABLE = pgTable('TeachQuestion',{
    id: serial().primaryKey(),
    courseId: varchar().notNull(),
    question: text(),
    createdBy: varchar().notNull(),
    createdAt: varchar(),
    status: varchar().default('Generating'),   
    topics: json(),
    progress: integer().default(0)
})

export const TEACH_ME_FEEDBACK_TABLE = pgTable('TeachFeedback',{
    id: serial().primaryKey(),
    courseId: varchar().notNull(),
    aiFeedback: json(),
    createdBy: varchar().notNull(),
    topic: varchar().notNull()
})

export const PROGRESS_CREDITS_COMPLETED_TABLE = pgTable('CreditsProgress',{
    id: serial().primaryKey(),
    courseId: varchar().notNull(),
    createdBy: varchar().notNull(),
    creditsClaimed: boolean().default(false),
    
})
