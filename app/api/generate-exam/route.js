import { GenerateStartExam } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { EXAM_SESSION_TABLE, USER_TABLE } from "@/configs/schema";
import { getAuth, clerkClient } from "@clerk/nextjs/server"

import { eq } from "drizzle-orm";
import moment from "moment";
import { NextResponse } from "next/server";
import { rateLimiter } from "../rateLimiter";


export async function POST(req) {
    const { courseId, topic, courseType, courseLayout, difficultyLevel, createdBy, exam_time } = await req.json();
    const { userId } = getAuth(req);
    if (!userId) return { error: "Unauthorized: No userId", status: 401 };

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const userEmail = user.emailAddresses[0]?.emailAddress;

    if (!userEmail || userEmail !== createdBy) {
      return {
        error: "Unauthorized: Email mismatch",
        status: 401,
        debug: {
          userEmail,
          createdBy,
        },
      };
    }

    const { success } = await rateLimiter.limit(userId);  // Check if user has exceeded the limit

    if (!success) {
        return NextResponse.json({
            success: false,
            message: "Rate limit exceeded. Please try again later.",
        }, { status: 429 });  // HTTP 429 Too Many Requests
    }

    // Updated prompt with more specific LaTeX escape instructions
    const prompt = `Pretend that you are a teacher giving a student an exam. Generate courseTitle, a courseSummary on what student will be tested on and a randomized question based on the following parameters:

    Topic: ${topic}
    Course Layout: ${courseLayout}
    Difficulty Level: ${difficultyLevel}
    Time to complete the question: 5 minutes

    FOLLOW THESE JSON FORMAT CAREFULLY:
    {
    "courseTitle": "REQUIRED - Add a clear title here",
    "courseSummary": "REQUIRED - Add a brief summary here",
    "question": "REQUIRED - Add the question here",
    "answer": "REQUIRED - Add the answer here"
    }

         3. **MATHEMATICAL NOTATION**:
               Use double backslashes (\\\\) for LaTeX commands (e.g., \\\\alpha for α, \\\\frac{x}{y} for fractions).
               Avoid using triple backslashes (\\\\\\\\) unless required by JavaScript string escaping rules. Only use \\\\ inside LaTeX expressions.
               Ensure LaTeX commands are written correctly and don't have extra spaces or escapes (e.g., use \\\\frac{x}{y}, not \\\\ frac{x}{y}).
               Test expressions to verify they render correctly with MathJax.
               
            4. **STRUCTURAL INTEGRITY**:
               - NO line breaks within string values
               - NO trailing commas after the last element in arrays or objects
               - Ensure all arrays and objects are properly closed with matching brackets/braces
               - Ensure all property names are quoted
            
            5. **VALIDATION REQUIREMENTS**:
               - Check that the output passes JSON.parse() without errors
               - Verify LaTeX expressions are properly escaped for MathJax compatibility
               - Double-check the entire structure before finalizing response
            
            6. **ABSOLUTELY NO**:
               - Comments (// or /**/)
               - Undefined values
               - NaN or Infinity literals (use strings instead)
               - Extra text outside the JSON structure
               - Explanations of the JSON structure
            
            7. **OUTPUT VERIFICATION**:
               - After generating JSON, mentally parse it to confirm validity
               - If any question about validity arises, rewrite the problematic section
            
            Return only the JSON object. Any response that does not meet these criteria must be corrected automatically before returning.
    
    The question should require a short or long answer (no multiple choices) and should challenge the student but be solvable within 5 minutes. Only the final answer is required (no steps or intermediate reasoning needed).
    
    For math-related questions:
    
    Provide the complete problem without breaking it into steps.
    Ensure that the answer is the final result, and use LaTeX formatting for rendering.
    
    **Example of the JSON structure you should return:**
    Example:
    
    {
    "courseTitle": title here,
    "courseSummary": summary here,
    "question": "A particle's position in space is given by the vector function $\\mathbf{r}(t) = \\langle \\cos(t^2), \\sin(t^2), t \\rangle$. Find the magnitude of the particle's acceleration vector at time $t = \\sqrt{\\frac{\\pi}{2}}$.",
    "answer": "2\\sqrt{1 + \\pi^2}"
    }
    IF NOT RETURNED IN THIS FORMAT, PLEASE REWRITE THE RESPONSE TO MEET THE CRITERIA.
    The question should require a short or long answer (no multiple choices) and should challenge the student but be solvable within 5 minutes. Only the final answer is required (no steps or intermediate reasoning needed).
    `
    
    try {
        const aiResponse = await GenerateStartExam.sendMessage(prompt);
        const aiText = aiResponse.response.text();
        
        // More robust cleaning of the response
        let cleanedText = aiText
            .replace(/^```json\n/, '')   // Remove leading ```json followed by a newline
            .replace(/\n```$/, '')       // Remove trailing newline and ```
            .replace(/```$/, '')         // Remove trailing ```
            .trim();
        
        // Handle common LaTeX escape sequences that cause issues
        // Handle common LaTeX escape sequences that cause issues
cleanedText = cleanedText
.replace(/\\(?!\\|\{|\}|\[|\]|,|;|:|\s)/g, '\\\\') // Better escaping for LaTeX commands
.replace(/\\,/g, ' ')      // Replace \, with space
.replace(/\\;/g, ' ')      // Replace \; with space
.replace(/\\:/g, ' ')      // Replace \: with space
.replace(/\\\s/g, ' ');    // Replace "\ " with space       // Replace "\ " with space
        
        let aiRes;
        try {
            // Use a more robust parsing approach
            // First try to parse the cleaned text directly
            aiRes = JSON.parse(cleanedText);
        } catch (firstError) {
            try {
                // If that fails, try a manual approach to extract question and answer
                const questionMatch = cleanedText.match(/"question"\s*:\s*"([^"]+)"/);
                const answerMatch = cleanedText.match(/"answer"\s*:\s*"([^"]+)"/);
                
                if (questionMatch && answerMatch) {
                    aiRes = {
                        question: questionMatch[1],
                        answer: answerMatch[1]
                    };
                } else {
                    // If all else fails, create a simple structure with minimal data
                    return NextResponse.json({
                        success: false,
                        message: "Failed to parse AI response",
                        error: "Could not extract question and answer",
                        rawResponse: aiText
                    }, { status: 500 });
                }
            } catch (error) {
                return NextResponse.json({
                    success: false,
                    message: "Failed to parse AI response",
                    error: firstError.message,
                    rawResponse: aiText,
                    cleanedResponse: cleanedText
                }, { status: 500 });
            }
        }
        
        const dbResult = await db.insert(EXAM_SESSION_TABLE).values({
            courseLayout: courseLayout,
            courseId: courseId,
            createdBy: createdBy,
            createdAt: moment().format("DD-MM-yyyy"),
            topic: topic,
            difficultyLevel: difficultyLevel,
            exam_time: exam_time,
            currQuestionAiResp: aiRes,
            question: aiRes.question,
            status: 'Ready'
        }).returning({ resp: EXAM_SESSION_TABLE });

        const userInfo = await db.select().from(USER_TABLE).where(eq(USER_TABLE?.email, createdBy));
        const newTotal = 1 + userInfo[0]?.totalCredits;

        const remainingCredits = (userInfo[0]?.newFreeCredits + userInfo[0]?.newPurchasedCredit) - 1;
        const newFreeCredits = userInfo[0]?.newFreeCredits - 1;
        
        const updateCredits = await db.update(USER_TABLE).set({
            totalCredits: newTotal,
            newFreeCredits: newFreeCredits < 0 ? 0 : newFreeCredits,
            remainingCredits: remainingCredits < 0 ? 0 : remainingCredits
        }).where(eq(USER_TABLE?.email, createdBy));
        
        return NextResponse.json({ result: dbResult[0] });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error processing exam generation",
            error: error.message
        }, { status: 500 });
    }
}