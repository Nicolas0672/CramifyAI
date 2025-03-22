import { GenerateTeachQuestions } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { TEACH_QUESTIONS_TABLE } from "@/configs/schema";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: true }, { status: 200 });
}

export async function POST(req) {
  try {
    const { difficultyLevel, amount, courseLayout, topic } = await req.json();

    if (!difficultyLevel || !amount || !courseLayout || !topic) {
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
    const cleanedText = aiText
      .replace(/^```json\n/, "") // Remove leading ```json followed by a newline
      .replace(/```$/, "") // Remove trailing ```
      .replace(/\\n/g, " ") // Replace escaped newlines with spaces
      .replace(/\\"/g, '"') // Replace escaped quotes with regular quotes
      .trim();

    let aiResult;
    try {
      aiResult = JSON.parse(cleanedText);
      if (!Array.isArray(aiResult)) {
        throw new Error("AI response is not an array");
      }
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return NextResponse.json({ success: false, error: "Failed to parse AI response" }, { status: 500 });
    }

    // Insert into DB
    const dbRes = await db.insert(TEACH_QUESTIONS_TABLE).values({
      courseId: uuidv4(),
      question: aiResult,
      createdAt: moment().format("DD-MM-yyyy"),
      difficultyLevel,
      status: "Ready",
      createdBy: 'hi',
      topic: topic,
    }).returning({ resp: TEACH_QUESTIONS_TABLE });

    return NextResponse.json({ success: true, aiResp: aiResult, dbRes }, { status: 200 });

  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ success: false, error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
