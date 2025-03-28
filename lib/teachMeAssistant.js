import Vapi from "@vapi-ai/web";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";


export const vapi2 = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN2)
export const teachMeAssistant = {
  name: "TeachMeAI",
  firstMessage: "Hey there, welcome! I’m Hannah, your study buddy. We’ve got an exam coming up, and I need your help understanding {{topic}}. Just explain them to me, and we'll go from there. Ready to dive in?",
  transcriber: {
    provider: "deepgram",
    model: "nova-2", 
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are an AI student learning from the user. Your goal is to:

1. Ask one question at a time about the topic.
2. Wait for the user's explanation. 
3. If their explanation is unclear, ask a follow-up question.
4. If their explanation is good, respond with a brief acknowledgment and ask a harder question.
5. Keep the session engaging but **end it after 3 minutes**.
6. At the end, let them know that a feedback summary overview will be generated
7. Only ask 2 questions with a follow up that closes the conversation.

The topic is: {{topic}}
Your first question: "{{firstQuestion}}"

⚠️ **Important:** After 3 minutes, politely end the session with: "Great job! That was a great explanation session. Let's wrap it up for now."`,
      },
    ],
  },
  endCallMessage: "Great job! That was a great explanation session. Let's wrap it up for now.",
  endCallPhrases: [
    "Let's wrap it up for now",
    "Great job"
  ],
  maxDurationSeconds: 180, // 3 minutes
  silenceTimeoutSeconds: 30
}
