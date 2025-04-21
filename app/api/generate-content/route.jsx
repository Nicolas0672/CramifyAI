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

    const PROMPT = `Generate up to 10 high-quality flashcards on the topic: "${chapters}" that target common areas of difficulty. Review the topic to identify concepts students typically struggle with and focus your flashcards on these challenging areas.

    REQUIREMENTS FOR WEAKNESS-FOCUSED FLASHCARDS:
    1. Analyze "${chapters}" to identify challenging concepts, common misconceptions, or typically difficult material
    2. Focus flashcards on these weak areas to strengthen understanding
    3. Create questions that address foundational concepts students must master
    4. Include examples that highlight nuanced distinctions or common error patterns
    5. For mathematical topics, include application problems that test conceptual understanding
    
    FLASHCARD FORMAT:
    - Each flashcard must include:
      * A clear, concise question for the front
      * A detailed yet simple answer for the back
      * A boolean 'isMath' indicator (true for math-related content)
      * A unique 'id' field (UUID format)
    
    TECHNICAL SPECIFICATIONS:
    - For math questions, format using LaTeX syntax that can be rendered with MathJax
    - DO NOT include chapter numbers in the content
    - Return EXACTLY valid JSON array format with no additional text
    - Ensure all special characters are properly escaped
    - Verify the output is parseable JSON before returning
    
    EXAMPLE OUTPUT FORMAT:
    [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "front": "What is the Chain Rule?",
        "back": "The Chain Rule is a formula for computing the derivative of a composite function. If f(x) = g(h(x)), then f'(x) = g'(h(x)) · h'(x).",
        "isMath": true
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "front": "What is a limiting reagent in a chemical reaction?",
        "back": "The limiting reagent is the reactant that is completely consumed in a chemical reaction and determines the amount of product formed.",
        "isMath": false
      }
    ]
    
    ENSURE THE OUTPUT IS VALID JSON THAT CAN BE PARSED WITHOUT ERRORS.
    `;

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
