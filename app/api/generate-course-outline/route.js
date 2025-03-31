import { courseOutline } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { AI_TEXT_RESPONSE_TABLE } from "@/configs/schema";
import { inngest } from "@/inngest/client";
import moment from "moment/moment";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        // Parse request body
        const { courseId, topic, courseType, courseLayout, difficultyLevel, createdBy } = await req.json();
        console.log("Request Data:", { courseId, topic, courseType, courseLayout, difficultyLevel, createdBy });

        // Generate course layout using AI
        const prompt = `
Generate a high-quality study guide for the course. The topic is "${topic}", the course type is "${courseType}", the difficulty level is "${difficultyLevel}", and the course layout is "${courseLayout}".
**IF COURSELAYOUT IS RECEIVED AS A JSON WHICH CONTAINS INFO ABOUT A USER CONVERSATION SUMMARY, STRENGTH, IMPROVEMENTS AND RATING, USE THIS TO GENERATE CONTENT 
TO HELP ACCOMODATE WEAKPOINTS

1. **Introduction**: Provide a clear and engaging introduction to the course topic "${topic}". Explain why this topic is important, its relevance, and what learners can expect to gain from studying it.

2. **Chapter Breakdown**: Break down the course into 3 chapters and 2 topics based on the provided course layout ("${courseLayout}" as a guide). For each chapter, provide:
   - **Chapter Title**: A descriptive and engaging title for the chapter.
   - **Chapter Summary**: A concise yet insightful summary of the chapter, outlining the key concepts and objectives.
   - **Topic List**: 3 topics name that will be covered in this chapter. For each topic, provide:
     

3. **Content Quality**: Ensure the content is:
   - **Insightful**: Provide deep, meaningful explanations that go beyond surface-level descriptions.
   - **Engaging**: Use clear, concise language and include examples or analogies to make the content relatable.
   - **Structured**: Organize the content logically, with a clear flow from one topic to the next.
   - **Actionable**: Include practical tips or insights that learners can apply immediately.

4. **Output in JSON Format**: Output the entire study guide in a well-structured JSON format. Each chapter should be an object with the following keys: "title", "summary", and "topics". Each topic should only include the topic name.
5. DO NOT INCLUDE ANYTHING IN THE CONTENT THAT WILL RUIN A JSON PARSE** ENSURE THAT THE CONTENT GENERATED CAN PARSE THROUGH AS A JSON**
Please output in the following JSON structure:
6. **INCLUDE EMOJI ICON FOR EACH CHAPTER**

{
  "courseTitle": "Course Title Here",
  "courseType": "${courseType}",
  "difficultyLevel": "${difficultyLevel}",
  "courseSummary" : summary
  "courseLayout": "${courseLayout}",
  
  "chapters": [
    {
      "title": "Chapter 1: Introduction to ${topic}",
        "emoji: "
      "summary": "Brief yet insightful summary of the chapter.",
      "  topics": [
        "Topic 1",
        "Topic 2"
      ]
    }
  ]
}
`;

        console.log("Prompt:", prompt);

        // Call AI to generate course content
        const aiResp = await courseOutline.sendMessage(prompt);
        console.log("Raw AI Response:", aiResp);

        if (!aiResp || !aiResp.response || !aiResp.response.text()) {
            throw new Error("No response text found from AI model");
        }

        // Get the AI response text
        const aiText = aiResp.response.text();
        console.log("AI Response Text:", aiText);

        // Clean up the response
        const cleanedText = aiText
            .replace(/^```json\n/, '')   // Remove leading ```json followed by a newline
            .replace(/```$/, '')         // Remove trailing ```
            .replace(/\\n/g, ' ')        // Replace escaped newlines with spaces
            .replace(/\\"/g, '"')        // Replace escaped quotes with regular quotes
            .trim();                     // Remove leading/trailing whitespace

        console.log("Cleaned AI Response Text:", cleanedText);

        // Validate and parse the cleaned response
        try {
            const aiResult = JSON.parse(cleanedText);
            console.log("Parsed AI Result:", aiResult);


            const dbResult = await db.insert(AI_TEXT_RESPONSE_TABLE).values({
                courseId: courseId,
                aiResponse: aiResult,
                createdBy: createdBy,
                createdAt: moment().format("DD-MM-yyyy")

            }).returning({ resp: AI_TEXT_RESPONSE_TABLE });

            // Triggering INGEST FUNCTION

            const result = await inngest.send({
                name:'notes.generate',
                data:{
                    course: dbResult[0].resp
                }
            })


            return NextResponse.json({ result: dbResult[0] });

        } catch (parseError) {
            console.error("Error parsing AI response:", parseError);
            console.error("Cleaned AI Response Text that failed to parse:", cleanedText);

            // Return the raw AI response for debugging
            return NextResponse.json({
                success: false,
                error: "AI response is not valid JSON",
                rawAIResponse: aiText,
                cleanedText: cleanedText
            }, { status: 500 });
        }

    } catch (error) {
        console.error("Error in generating or saving course outline:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}