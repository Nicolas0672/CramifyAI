import { GenerateNextQuestion } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { EXAM_RESPONSE_TABLE, EXAM_SESSION_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { getAuth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server";
import { rateLimiter } from "../rateLimiter";

export async function POST(req) {
    console.log("API endpoint hit");
    try {
        // Parse request body
        let userAns, difficultyLevel, correctAns, question, courseId, createdBy, exam_time, start_time;
        try {
            const data = await req.json();
            ({ userAns, difficultyLevel, correctAns, question, courseId, createdBy, exam_time, start_time } = data);
        } catch (err) {
            console.error("Error parsing request body:", err);
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

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

        // Generate AI feedback
        let aiResp;
        try {
            const prompt = `Based on the student's answer: "${userAns}", the difficulty level: "${difficultyLevel}", and the question: "${question}", please assume the role of a professional educator grading the student's response.

GRADING RULES:
- Correct answer: 10/10
- Partially correct answer: 5-9/10 (depending on how close)
- Completely incorrect answer: 0-4/10
- Responses like "idk", "I don't know", or clearly off-topic answers: MAXIMUM 4/10
- For math questions: Only award 10/10 if the final numerical answer is EXACTLY correct (including units if applicable)

Your response MUST be a **100% valid, parseable JSON object** with the **exact** following structure:

**PLS ENSURE THAT RATING IS A NUMBER AND NOT A STRING** IF OUTPUT AS A STRING, CONVERT INTO A NUMBER

{
    "feedback": {
        "rating": 7,
        "explanation": "Your explanation here...",
        "question": "Your new question here..."
    }
}

CRITICAL FORMATTING RULES FOR JSON OUTPUT:
0. ENSURE THAT EACH QUESTION CAN BE ANSWERED IN A INPUT BOX. THAT MEANS NO QUESTION WHICH INVOLVES DRAWING 

1. **OUTPUT FORMAT**: Return ONLY valid, parseable JSON—NO markdown formatting, code blocks, backticks, explanatory text, or commentary before or after the JSON.

2. **STRING FORMATTING**:
   - Use double quotes (") for ALL strings and property names
   - NEVER use single quotes (') anywhere in the JSON
   - Escape all special characters within strings: \\" for quotes, \\\\ for backslashes, \\n for newlines

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

Return only the JSON object. Any response that does not meet these criteria must be corrected automatically before returning.`;
            aiResp = await GenerateNextQuestion.sendMessage(prompt);
        } catch (err) {
            console.error("Error generating AI response:", err);
            return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });
        }

        // Super robust cleaning of AI response - handles almost any malformed JSON
        let aiResult;
        try {
            const aiText = aiResp.response.text();

            // Step 1: Extract what appears to be JSON
            let jsonText = aiText;

            // Remove code blocks if present
            jsonText = jsonText.replace(/```json\s*|\s*```/g, '');

            // Find content between { and final }
            const openBraceIndex = jsonText.indexOf('{');
            const closeBraceIndex = jsonText.lastIndexOf('}');

            if (openBraceIndex !== -1 && closeBraceIndex !== -1 && openBraceIndex < closeBraceIndex) {
                jsonText = jsonText.substring(openBraceIndex, closeBraceIndex + 1);
            }

            // Step 2: Fix common JSON issues

            // Fix newlines in JSON (critical fix for your example)
            jsonText = jsonText.replace(/\n\s*/g, ' ');

            // Fix unescaped quotes within string values
            let inString = false;
            let fixedText = '';
            for (let i = 0; i < jsonText.length; i++) {
                const char = jsonText[i];
                const nextChar = i < jsonText.length - 1 ? jsonText[i + 1] : '';

                if (char === '"' && (i === 0 || jsonText[i - 1] !== '\\')) {
                    inString = !inString;
                    fixedText += char;
                } else if (inString && char === '\\' && nextChar !== '\\' && nextChar !== '"' && nextChar !== 'n' && nextChar !== 't' && nextChar !== 'r') {
                    // Add extra backslash for escape characters in strings
                    fixedText += '\\\\';
                } else {
                    fixedText += char;
                }
            }

            // Try parsing the fixed JSON
            try {
                aiResult = JSON.parse(fixedText);
            } catch (innerErr) {
                // Fallback handling - create a valid default structure
                console.error("Error parsing fixed JSON, using fallback:", innerErr);

                // Extract probable content using regex
                const ratingMatch = fixedText.match(/"rating":\s*(\d+)/);
                const explanationMatch = fixedText.match(/"explanation":\s*"([^"]*)"/);
                const questionMatch = fixedText.match(/"question":\s*"([^"]*)"/);

                aiResult = {
                    feedback: {
                        rating: ratingMatch ? parseInt(ratingMatch[1]) : 5,
                        explanation: explanationMatch ? explanationMatch[1] : "Unable to parse explanation.",
                        question: questionMatch ? questionMatch[1] : "What is the derivative of x²?"
                    }
                };
            }
        } catch (err) {
            console.error("Error processing AI response:", err);

            // Ultra fallback - never fail completely
            aiResult = {
                feedback: {
                    rating: 5,
                    explanation: "The system was unable to process the AI's feedback. Please try again.",
                    question: "What is the derivative of x²?"
                }
            };
        }

        // Insert into the database
        let nextDbRes;
        try {
            nextDbRes = await db.insert(EXAM_RESPONSE_TABLE).values({
                userAns: userAns,
                exam_time: exam_time,
                start_time: start_time,
                aiResponse: aiResult,
                courseId: courseId,
                createdBy: createdBy,
                question: question,
                status: 'Ready'
            }).returning({ resp: EXAM_RESPONSE_TABLE });
        } catch (err) {
            console.error("Error inserting data into database:", err);
            return NextResponse.json({ error: "Failed to insert data into database" }, { status: 500 });
        }

        // Return the database response
        return NextResponse.json({
            dbResponse: nextDbRes[0],  // Return the first item in the response array
            aiResponse: aiResult       // Also return the cleaned AI response for debugging
        });

    } catch (err) {
        console.error("Unexpected error:", err);
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
}