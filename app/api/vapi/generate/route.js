import { GenerateTeachQuestions } from "@/configs/AiModel";
import { db } from "@/configs/db";
import { TEACH_QUESTIONS_TABLE } from "@/configs/schema";
import moment from "moment";
import { NextResponse } from "next/server";

export async function GET(){
    return NextResponse.json({sucess: true}, {status: 200})
}

export async function POST(req){
    // dont forget to add topic
    const {difficultyLevel, amount, courseLayout, userid, courseId, topic} = await req.json()
    try{
        const prompt = `Imagine you are new to the concept of ${courseLayout} ${topic} and want to learn it. 
        Generate 5 questions to ask the user, progressively increasing in difficulty. 
        Each question should be categorized under the difficulty level '${difficultyLevel}'.
        Please return only questions without any additional text.
        The questions are going to be read by a voice assistant so do not use'/' or any other special characters which might break the voice assistant
        Role: 'student'  
        Amount: ${amount}  
        Course Topic: ${courseLayout}
        
        return the question formatted like this : ["Question 1", "Question 2"]`;
        
        const aiResp = await GenerateTeachQuestions.sendMessage(prompt)
            const aiText =  aiResp.response.text()
        
            const cleanedText = aiText
                    .replace(/^```json\n/, '')   // Remove leading ```json followed by a newline
                    .replace(/```$/, '')         // Remove trailing ```
                    .replace(/\\n/g, ' ')        // Replace escaped newlines with spaces
                    .replace(/\\"/g, '"')        // Replace escaped quotes with regular quotes
                    .trim();  
        
            const aiResult = JSON.parse(cleanedText)

        const dbRes = await db.insert(TEACH_QUESTIONS_TABLE).values({
            courseId: courseId,
            question: aiResult,
            createdAt: moment().format("DD-MM-yyyy"),
            difficultyLevel: difficultyLevel,
            status: 'Ready',
            createdBy: userid

        }).returning({resp: TEACH_QUESTIONS_TABLE})
        
        return NextResponse.json({sucess: true, aiResp: aiResult}, {status: 200})
       
    
    }catch(err){
        return NextResponse.json({sucess: false, err})
    }

}