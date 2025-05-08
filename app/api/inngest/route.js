import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { CreateNewUser, GenerateCourseOutline, GenerateFillContent, GenerateMaterialContent, GenerateNotes, GenerateQuiz, helloWorld } from "@/inngest/functions";
import Course from "@/app/course/[courseId]/page";
export const runtime = 'edge'
// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  streaming:'allow',
  functions: [
    helloWorld,
    CreateNewUser,
    GenerateNotes,
    GenerateMaterialContent,
    GenerateFillContent,
    GenerateCourseOutline,
    GenerateQuiz,
  ],
});
