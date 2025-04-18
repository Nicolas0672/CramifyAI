import { db } from "@/configs/db";
import { inngest } from "./client";
import { AI_TEXT_RESPONSE_TABLE, CHAPTER_NOTE_TABLE, FILL_BLANK_TABLE, FLASHCARD_CONTENT, USER_TABLE } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { GenerateFillBlank, GenerateFlashCardAI, generateNotesAIModel } from "@/configs/AiModel";
import moment from "moment";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const CreateNewUser = inngest.createFunction(
  { id: 'create-user' },
  { event: 'user.create' },
  async ({ event, step }) => {
    const {user} = event.data;
    const result = await step.run('Check User and create New if not in DB', async () => {
      const result = await db.select().from(USER_TABLE)
        .where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress))

        const currentDate = new Date();
        const formattedDate = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`;
      const nextMonthDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));

    // Format nextMonthDate to the database format, for example: '2025-05-01T00:00:00Z'
    
      if (result?.length == 0) {
        const userResp = await db.insert(USER_TABLE).values({
          name: user?.fullName,
          email: user?.primaryEmailAddress?.emailAddress,
          nextCreditReset: sql`${nextMonthDate.toISOString()}::timestamp`,
          
        }).returning({ id: USER_TABLE.id })
        await db.update(USER_TABLE).set({
          createdAt: moment().format('MM-DD-YYYY')
        }).where(eq(USER_TABLE.email, user?.primaryEmailAddress?.emailAddress))

        return userResp;
       
      }
      return result
    })
    return "Success"
  },


)

export const GenerateNotes=inngest.createFunction(
  {id:'generateCourse'},
  {event:'notes.generate'},
  async({event, step}) =>{
    const {course} = event.data;
    

    // Generate Notes for Each Chapter With AI

    const notesResult = await step.run('Generate Chapter Notes', async() => {
      const Chapters = course?.aiResponse?.chapters;
      
      try {
        console.log(`Starting to process ${Chapters.length} chapters for course ${course?.courseId}`);
        
        // Process chapters sequentially
        for (let index = 0; index < Chapters.length; index++) {
          const chapter = Chapters[index];
          
          console.log(`Processing chapter ${index} of ${Chapters.length}`);
          
          const PROMPT = `
          Generate concise and student-friendly content for the following chapter. Follow these rules:
          
          1. **Content**:
             - Focus only on the most important concepts and avoid unnecessary details.
             - Break down complex ideas into simple, easy-to-understand steps.
             - Include methods or tips to help students learn and remember the material.
             - Use analogies or real-world examples where helpful.
          
          2. **Format**:
             - Use modern HTML tags for formatting (e.g., <h2> for headings, <p> for paragraphs, <ul> and <li> for lists, <strong> for emphasis, <blockquote> for key points, and <code> for code snippets).
             - For mathematical equations, use **MathJax** or **LaTeX** syntax wrapped in appropriate delimiters:
               - Inline equations: \\( ... \\)
               - Block equations: \\[ ... \\]
               Example:
               \`\`\`html
               <p>To find the derivative of \(y = \sin(u)\) where \(u = x^2\), we use the chain rule:</p>
               \\[
               \\frac{dy}{dx} = \\cos(u) \\cdot \\frac{du}{dx} = \\cos(x^2) \\cdot 2x
               \\]
               \`\`\`
               ** PLEASE ONLY USE CODING EXAMPLE IF RELATED TO CODING OTHERWISE DO NOT OUTPUT AS CODE FORMAT AS IT WILL BREAK MATHJAX RENDER**
             - Wrap ALL code snippets in <pre><code> tags for proper formatting. For example:
               \`\`\`html
               <pre class="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
                 <code class="font-mono text-sm">
                   // Example code
                   function example() {
                     console.log("Hello, world!");
                   }
                 </code>
               </pre>
               \`\`\`
                 ** PLEASE ONLY USE CODING EXAMPLE IF RELATED TO CODING OTHERWISE DO NOT OUTPUT AS CODE FORMAT AS IT WILL BREAK MATHJAX RENDER**
               
             - Add inline styles or Tailwind CSS classes for better visual appeal (e.g., use classes like "text-lg", "font-bold", "bg-gray-100", "p-4", "rounded-lg", etc.).
             - Structure the content into sections with clear headings and subheadings.
             - Use spacing and dividers (<hr>) to separate sections for better readability.
             
          
          3. **Layout**:
             - Ensure the layout is clean, modern, and responsive.
             - Use a combination of headings, paragraphs, lists, and visual elements (e.g., icons or emojis) to make the content engaging.
             - MAKE SURE THAT ALL CHAPTERS CONTAIN CONSISTENT FORMAT.
             - Ensure code snippets and mathematical equations are properly formatted and do not overflow. Use horizontal scrolling for long lines of code or equations.
            -MAKE SURE ALL CHAPTERS TITLE ARE BOLDED AND HAVE CONSISTENT FORMATTING THROUGHOUT EACH CHAPTER
          4. **Accuracy**:
             - Ensure all mathematical formulas, examples, and explanations are factually correct and free of errors.
          
          Here is the chapter data:
          \`\`\`json
          ${JSON.stringify(chapter, null, 2)}
          \`\`\`
          
          Return only the HTML content without additional notes or irrelevant information.
          `;
    
          try {
            console.log(`Sending AI request for chapter ${index}`);
            const result = await generateNotesAIModel.sendMessage(PROMPT);
            const aiResp = result.response.text();
            console.log(`Received AI response for chapter ${index}, length: ${aiResp.length} chars`);
            
            // Insert into database with explicit await
            console.log(`Inserting chapter ${index} into database`);
            await db.insert(CHAPTER_NOTE_TABLE).values({
              chapterId: index,
              courseId: course?.courseId,
              notes: aiResp,
              createdBy: course?.createdBy
            });
            console.log(`Successfully inserted chapter ${index}`);
            
            // Optional: Add a small delay between operations to prevent any potential rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (error) {
            console.error(`Error processing chapter ${index}:`, error);
            // Continue with next chapter instead of failing completely
            // You could also choose to throw and abort the entire process if preferred
          }
        }
        
        console.log(`Completed processing all ${Chapters.length} chapters`);
        return 'Completed';
        
      } catch (error) {
        console.error("Failed to process chapters:", error);
        throw error; // Re-throw to properly fail the Inngest function
      }
    });
    
    const updateCourseStatus = await step.run('Update Course Status to Ready', async() => {
      try {
        console.log(`Updating status for course ${course?.courseId} to Ready`);
        const result = await db.update(AI_TEXT_RESPONSE_TABLE).set({
          status: 'Ready'
        }).where(eq(AI_TEXT_RESPONSE_TABLE?.courseId, course?.courseId));
        
        console.log(`Successfully updated course ${course?.courseId} status to Ready`);
        return 'Success';
      } catch (error) {
        console.error(`Failed to update course status:`, error);
        throw error;
      }
    });
  }
)

const fakeJson = {
  flashcards: [
    {
      front: "What is recursion?",
      back: "A process in which a function calls itself as a subroutine."
    },
    {
      front: "Explain the Big O of binary search.",
      back: "Binary search has a time complexity of O(log n)."
    },
    {
      front: "What is a closure in JavaScript?",
      back: "A closure is a function that retains access to its outer scope, even after the outer scope has closed."
    }
  ]
}


// GENERATING FLASHCARDS
export const GenerateMaterialContent= inngest.createFunction(
  {id: 'Generate Material Content'},
  {event:'studyType.content'},

  async({event, step}) =>{
    const {prompt, courseId, recordId} = event.data;
    
    const FlashCardAiResult = await step.run('Generating Flashcard using AI', async() => {
      const result = await GenerateFlashCardAI.sendMessage(prompt)
      const AIResult = JSON.parse(
         result.response.text()
          .replace(/\\"/g, '"') // Fix double-escaped quotes
          .replace(/\\n/g, '')  // Clean newlines
          .trim()
      );
      console.log(AIResult)
      return AIResult
    })

    const DbResult = await step.run('Save Result to DB', async() => {
      console.log(FlashCardAiResult)
      const result = await db.update(FLASHCARD_CONTENT).set({
        
        content: { data: FlashCardAiResult },
        status:'Ready'
      }).where(eq(FLASHCARD_CONTENT.id, recordId))

      return 'Data Inserted'

    })
  }
)

export const GenerateFillContent= inngest.createFunction(
  {id: 'Generating Fill-Blank Content'},
  {event: 'fill-blank.content'},

  async({event, step}) => {
    const {prompt, recordId} = event.data;

    const FillAiResult = await step.run('Generating Fill Cards', async()=>{
      const result = await GenerateFillBlank.sendMessage(prompt)
      const AIResult = JSON.parse(
        result.response.text()
         .replace(/\\"/g, '"') // Fix double-escaped quotes
         .replace(/\\n/g, '')  // Clean newlines
         .trim()
     );
     return AIResult
    })

    const DbResult = await step.run('Saving to DB', async()=>{
      const result = await db.update(FILL_BLANK_TABLE).set({
        aiResponse: {data : FillAiResult},
        status: 'Ready'
      }).where(eq(FILL_BLANK_TABLE.id, recordId))
      return 'Data Inserted'
    })

  }
)


