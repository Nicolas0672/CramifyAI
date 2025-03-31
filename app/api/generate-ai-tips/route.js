import { GenerateStudyTip } from "@/configs/AiModel";

import { NextResponse } from "next/server";

export async function POST(req) {
    const {createdBy} = await req.json()
    try {
        const prompt = 'Generate one short concise study tip to motivate students to learn and study in {motivationTips: **Place tip here**} JSON format';
        console.log("Sending AI Request...");
        const aiResp = await GenerateStudyTip.sendMessage(prompt);

        if (!aiResp || !aiResp.response || typeof aiResp.response.text !== "function") {
            console.error("Invalid AI Response Object:", aiResp);
            return NextResponse.json({ error: "Invalid AI Response" }, { status: 500 });
        }

        let aiText = await aiResp.response.text();
        console.log("Raw AI Response:", aiText);

        const aiResult = JSON.parse(aiText);
        return NextResponse.json({ res: aiResult });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error",  aiResp }, { status: 500 });
    }
}
