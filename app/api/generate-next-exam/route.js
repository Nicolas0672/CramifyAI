import { GenerateNextQuestion } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { EXAM_RESPONSE_TABLE, EXAM_SESSION_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";

import { NextResponse } from "next/server";

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

        // Generate AI feedback
        let aiResp;
        try {
            const prompt = `
Based on the student's answer: "${userAns}", the difficulty level: "${difficultyLevel}", and the question: "${question}", please assume the role of a professional educator grading the student's response. If the answer is correct, it's a 10/10; if it is partially correct, grade lightly. You are more interested in the result than the process.

Your response MUST be a **100% valid, parseable JSON object** with the **exact** following structure:

{
    "feedback": {
        "rating": 7,
        "explanation": "Your explanation here...",
        "question": "Your new question here..."
    }
}

CRITICAL FORMATTING RULES:
1. **Return ONLY valid JSON**—NO markdown, backticks, extra text, or commentary.
2. Use **double quotes** for all strings and property names.
3. **Escape special characters** within strings properly (especially quotes and backslashes).
4. If using LaTeX, use **double backslashes** for proper formatting (e.g., "$\\\\alpha$").
5. **No newlines inside string values**—keep everything on one line.
6. **No trailing commas** in arrays or objects.
7. **No comments** of any kind.
8. The output **must be 100% valid JSON**—if not, reformat and retry.

Return only the JSON object. Any response that does not meet these criteria must be corrected automatically before returning.
`;
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