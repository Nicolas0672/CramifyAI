import { boolean, integer, json, text, timestamp } from "drizzle-orm/gel-core";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

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
    createdBy:varchar().notNull(),
})
