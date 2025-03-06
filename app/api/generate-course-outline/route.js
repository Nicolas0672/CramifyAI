import { courseOutline } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { AI_TEXT_RESPONSE_TABLE } from "@/configs/schema";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Parse request body
        const { courseId, topic, courseType, courseLayout, difficultyLevel, createdBy } = await req.json();
        console.log("Request Data:", { courseId, topic, courseType, courseLayout, difficultyLevel, createdBy });

        // Generate course layout using AI
        const prompt = `
Generate a high-quality study guide for the course. The topic is "${topic}", the course type is "${courseType}", the difficulty level is "${difficultyLevel}", and the course layout is "${courseLayout}".

1. **Introduction**: Provide a clear and engaging introduction to the course topic "${topic}". Explain why this topic is important, its relevance, and what learners can expect to gain from studying it.

2. **Chapter Breakdown**: Break down the course into 3 chapters and 3 topics based on the provided course layout ("${courseLayout}" as a guide). For each chapter, provide:
   - **Chapter Title**: A descriptive and engaging title for the chapter.
   - **Chapter Summary**: A concise yet insightful summary of the chapter, outlining the key concepts and objectives.
   - **Topic List**: A detailed list of topics that will be covered in this chapter. For each topic, provide:
     - **Topic Name**: A clear and specific title for the topic.
     - **Description**: A detailed, insightful, and engaging explanation of the topic. Include examples, analogies, and practical insights to help learners deeply understand the concept.
   - **Key Takeaways**: A bullet-point list of the most important insights or concepts from the chapter.

3. **Content Quality**: Ensure the content is:
   - **Insightful**: Provide deep, meaningful explanations that go beyond surface-level descriptions.
   - **Engaging**: Use clear, concise language and include examples or analogies to make the content relatable.
   - **Structured**: Organize the content logically, with a clear flow from one topic to the next.
   - **Actionable**: Include practical tips or insights that learners can apply immediately.

4. **Output in JSON Format**: Output the entire study guide in a well-structured JSON format. Each chapter should be an object with the following keys: "title", "summary", "topics", and "keyTakeaways". Each topic should have a detailed description.
5. DO NOT INCLUDE ANYTHING IN THE CONTENT THAT WILL RUIN A JSON PARSE** ENSURE THAT THE CONTENT GENERATED CAN PARSE THROUGH AS A JSON**
Please output in the following JSON structure:

{
  "courseTitle": "Course Title Here",
  "courseType": "${courseType}",
  "difficultyLevel": "${difficultyLevel}",
  "courseLayout": "${courseLayout}",
  "chapters": [
    {
      "title": "Chapter 1: Introduction to ${topic}",
      "summary": "Brief yet insightful summary of the chapter.",
      "topics": [
        {
          "topicName": "Topic 1",
          "description": "Detailed, insightful, and engaging explanation of the topic. Include examples, analogies, and practical insights."
        }
      ],
      "keyTakeaways": [
        "Key insight 1",
        "Key insight 2"
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
                studyMaterialId: courseId,
                aiResponse: aiResult,
                createdBy: createdBy
            }).returning({ AI_TEXT_RESPONSE_TABLE });

            

            
            return NextResponse.json({result:dbResult[0] });

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