import { boolean, integer, json, text, timestamp } from "drizzle-orm/gel-core";
import { date, pgTable, serial, time, varchar } from "drizzle-orm/pg-core";

export const USER_TABLE=pgTable('users',{
    id:serial().primaryKey(),
    name:varchar().notNull(),
    email:varchar().notNull(),
    isMember:boolean().default(false)
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
    studyMaterialId: varchar().notNull(),
    aiResponse: json(),
    status:varchar().default('Generating'),
    createdAt: varchar('createdAt'),
    createdBy:varchar().notNull(),
})

export const CHAPTER_NOTE_TABLE=pgTable('chapterNotes',{
    id:serial().primaryKey(),
    courseId:varchar().notNull(),
    chapterId: integer().notNull(),
    notes:text()
})

export const FLASHCARD_CONTENT = pgTable('flashCardContent',{
    id:serial().primaryKey(),
    courseId:varchar().notNull(),
    content: json(),
    type: varchar().notNull(),
    status: varchar().default('Generating')
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
})

export const FILL_BLANK_TABLE = pgTable('Fill-Blank',{
    id:serial().primaryKey(),
    aiResponse: json(),
    courseId: varchar().notNull(),
    type: varchar().notNull(),
    status: varchar().default('Generating')
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
    difficultyLevel:varchar().default('Easy')

})
