import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
    id: "cramify-ai",
    name: "CramifyAI",
    eventKey: process.env.INNGEST_EVENT_KEY,  // Ensure this is set in Vercel
  });