import { db } from "@/configs/db"
import { FLASHCARD_CONTENT } from "@/configs/schema"
import { inngest } from "@/inngest/client"
import { NextResponse } from "next/server"

export async function POST(req) {
    const {chapters, courseId, type} = await req.json()

    const PROMPT = `Generate up to 10 high-quality flashcards on the topic: "${chapters}" in JSON format. 
Each flashcard should include:
- A clear and concise **question** for the front.
- A detailed yet simple **answer** for the back. 
- If the content involves a math equation, include a key called "isMath" set to true.
Format the output as an array of objects with "front", "back", and "isMath" keys.
** DO NOT INCLUDE CHAPTER NUMBER
MAKE SURE IT'S IN JSON FORMAT
If it's a **math question**, format the question using LaTeX syntax and return it as a **string** that can be rendered with MathJax.
Each flashcard should have:
- a 'front' field (question)
- a 'back' field (answer)
- an 'isMath' boolean (true if math-related, false otherwise)
- a unique 'id' (UUID)

Return the response as a JSON array, e.g.:
[
  { "id": "uuid1", "front": "What is the Chain Rule?", "back": "hi", "isMath": false },
  { "id": "uuid2", "front": "What is Derivative?", "back": "A function's rate of change", "isMath": true }
]

`


    const result = await db.insert(FLASHCARD_CONTENT).values({
        courseId:courseId,
        type:type
    }).returning({id:FLASHCARD_CONTENT.id})  

    await inngest.send({
        name:'studyType.content',
        data:{
            studyType: type,
            prompt: PROMPT,
            courseId: courseId,
            recordId: result[0].id
        }
    })

    return NextResponse.json({id: result[0].id})

}