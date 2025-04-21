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
          Generate concise, student-friendly content for the following chapter with special focus on addressing identified learning weaknesses. Follow these rules:
          
          1. **Content Strategy (PRIORITY)**:
             - Analyze the chapter data for any specified weaknesses or difficult concepts
             - Prioritize and emphasize content that addresses these weak areas
             - Provide extra examples, practice problems, or explanations for challenging topics
             - Create memory aids, shortcuts, or learning techniques specifically for difficult concepts
             - Include confidence-building elements for areas where students typically struggle
          
          2. **Core Content Requirements**:
             - Focus on essential concepts while eliminating unnecessary details
             - Break complex ideas into simple, sequential steps
             - Include effective learning methods tailored to the topic
             - Use relevant analogies or real-world applications that clarify difficult concepts
             - Provide progressive learning paths (basic → intermediate → advanced) for key topics
          
          3. **Format**:
             - Use modern HTML tags (&lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;blockquote&gt;, &lt;code&gt;)
             - Format mathematical equations with MathJax/LaTeX syntax:
               - Inline equations: \\( ... \\)
               - Block equations: \\[ ... \\]
               Example:
               \`\`\`html
               <p>To find the derivative of \\(y = \\sin(u)\\) where \\(u = x^2\\), we use the chain rule:</p>
               \\[
               \\frac{dy}{dx} = \\cos(u) \\cdot \\frac{du}{dx} = \\cos(x^2) \\cdot 2x
               \\]
               \`\`\`
             - **IMPORTANT:** ONLY use coding examples with &lt;pre&gt;&lt;code&gt; tags when content is programming-related, otherwise avoid this format as it will break MathJax rendering
             - Wrap code snippets in proper tags:
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
          
          4. **Enhanced Visual Structure**:
             - Use Tailwind CSS classes for visual appeal (text-lg, font-bold, bg-gray-100, etc.)
             - Implement consistent heading styles across all chapters
             - Create visual hierarchy with proper spacing and section dividers
             - Add progress indicators for difficult concepts (e.g., "Mastery Challenge" sections)
             - Include targeted practice exercises for weak areas
             - Use callout boxes to highlight common misconceptions or error patterns
             - Bold all chapter titles consistently across chapters
          
          5. **Weakness-Based Learning Elements**:
             - Include "Common Pitfalls" sections for frequently misunderstood concepts
             - Create "Checkpoint" review questions targeting weak areas
             - Provide alternative explanations for difficult topics using different learning modalities
             - Include scaffolded examples that gradually increase in difficulty
             - Add visual cues or icons to mark content addressing known weakness areas
          
          6. **Quality Assurance**:
             - Ensure mathematical formulas, examples, and explanations are accurate
             - Verify all content flows logically from foundational to more complex concepts
             - Confirm that challenging concepts receive proportionally more attention
             - Check that all HTML tags are properly closed and formatted
          
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


