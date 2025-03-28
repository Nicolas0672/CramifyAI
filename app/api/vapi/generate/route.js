import { GenerateTeachQuestions } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { TEACH_ME_QUESTIONS_TABLE, USER_TABLE } from "@/configs/schema";
import { v4 as uuidv4 } from 'uuid';
import moment from "moment";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function GET() {
  return NextResponse.json({ success: true }, { status: 200 });
}

export async function POST(req) {
  try {
    const { difficultyLevel, amount, courseLayout, topic, createdBy} = await req.json();

    if (!difficultyLevel || !amount || !courseLayout || !topic ) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const prompt = `Imagine you are new to the concept of ${courseLayout} ${topic} and want to learn it. 
    Generate ${amount} questions to ask the user, progressively increasing in difficulty. 
    Each question should be categorized under the difficulty level '${difficultyLevel}'.
    Please return only questions without any additional text.
    The questions are going to be read by a voice assistant so do not use '/' or any other special characters which might break the voice assistant.
    Return the questions formatted like this: ["Question 1", "Question 2", "Question 3"]`;

   
    
    // Call AI to generate questions
    const aiResp = await GenerateTeachQuestions.sendMessage(prompt);
    const aiText =  aiResp.response.text(); // Ensure we await this

    console.log("Raw AI Response:", aiText); // Debugging

    // Clean the response
    // Clean the response more thoroughly
const cleanedText = aiText
.replace(/^```(?:json)?\n?/, "") // Remove leading code block markers with or without json
.replace(/```$/, "") // Remove trailing code block markers
.replace(/\\n/g, " ") // Replace escaped newlines
.replace(/\\"/g, '"') // Replace escaped quotes
.trim();

 const prompt2 = `Generate one courseTitle that fits the concept of ${courseLayout} and ${topic} and a summary of what will what users will gain from engaging in a conversation about this course.`
    const aiCourseTitle = await GenerateTeachQuestions.sendMessage(prompt2)
    const aiTitleText = aiCourseTitle.response.text()
    const cleanedTitle = aiTitleText.replace(/^```(?:json)?\n?/, "") // Remove leading code block markers with or without json
    .replace(/```$/, "") // Remove trailing code block markers
    .replace(/\\n/g, " ") // Replace escaped newlines
    .replace(/\\"/g, '"') // Replace escaped quotes
    .trim();

    let aiResult;
    let aiTitleResult;
try {
// Try direct parsing first
aiResult = JSON.parse(cleanedText);

// If it's not an array, check if it's an object with a data property
if (!Array.isArray(aiResult)) {
  if (aiResult.data && Array.isArray(aiResult.data)) {
    aiResult = aiResult.data;
  } else {
    // Try to extract array from text using regex as last resort
    const arrayMatch = cleanedText.match(/\[(.*)\]/s);
    if (arrayMatch) {
      aiResult = JSON.parse(arrayMatch[0]);
    } else {
      throw new Error("AI response is not an array");
    }
  }
}
} catch (error) {
console.error("Error parsing AI response:", error, "Raw text:", cleanedText);
return NextResponse.json({ success: false, error: "Failed to parse AI response", rawResponse: cleanedText }, { status: 500 });
}
    
   
    aiTitleResult = JSON.parse(cleanedTitle)
    const dbRes = await db.insert(TEACH_ME_QUESTIONS_TABLE).values({
        courseId: uuidv4(),
        question: aiResult,
        createdAt: moment().format("DD-MM-yyyy"),
       
        status: "Ready",
        createdBy: createdBy || 'unknown', // initially inserting with a placeholder
        topics: cleanedTitle,
    })

    const updateNewUser = await db.update(USER_TABLE).set({
      isNewMember: false
    }).where(eq(USER_TABLE.email, createdBy))

    
 

    return NextResponse.json({ success: true, aiResp: dbRes }, { status: 200 });

  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
