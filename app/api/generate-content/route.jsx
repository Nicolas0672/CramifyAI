import { db } from "@/configs/db"
import { FLASHCARD_CONTENT } from "@/configs/schema"
import { inngest } from "@/inngest/client"
import { getAuth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { rateLimiter } from "../rateLimiter"

export async function POST(req) {
    const { userId } = getAuth(req);
    if (!userId) return { error: "Unauthorized: No userId", status: 401 };

    const client = await clerkClient()
const user = await client.users.getUser(userId)
    const email = user.emailAddresses[0]?.emailAddress;


     const { success } = await rateLimiter.limit(userId);  // Check if user has exceeded the limit
            
                if (!success) {
                    return NextResponse.json({
                        success: false,
                        message: "Rate limit exceeded. Please try again later.",
                    }, { status: 429 });  // HTTP 429 Too Many Requests
                }
    

    const { chapters, courseId, type } = await req.json()

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
        courseId,
        type,
        createdBy: email
    }).returning({ id: FLASHCARD_CONTENT.id })

    await inngest.send({
        name: 'studyType.content',
        data: {
            studyType: type,
            prompt: PROMPT,
            courseId,
            recordId: result[0].id
        }
    })

    return NextResponse.json({ id: result[0].id })
}
