"use client";
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

function ViewNotes() {
  const { courseId } = useParams();
  const [notes, setNotes] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const [showComplete, setShowComplete] = useState(true)
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    GetNotes();
  }, []);

  const GetNotes = async () => {
    const result = await axios.post('/api/study-type', {
      courseId: courseId,
      studyType: 'notes',
    });
    setNotes(result?.data || []);
  };

  // Handle step count changes
  const handleNext = () => {
    if (stepCount < notes.length - 1) {
      setStepCount(stepCount + 1);
    }
  };



  

  const handlePrevious = () => {
    if (stepCount > 0) {
      setStepCount(stepCount - 1);
    }
  };

  // Re-render MathJax when stepCount or notes change
  useEffect(() => {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  }, [stepCount, notes]);

  const handleComplete=async()=>{
    setLoading(true)
    const res = await axios.post('/api/handle-complete',{
      courseId: courseId,
      studyType: 'notes',
      type: 'study'
    })
    toast('Congratulations on finishing this section!')
    setLoading(false)
    setShowComplete(false)
    
  }
  useEffect(() => {
    setShowComplete(!notes[0]?.isDone);
    console.log(notes);
  }, [notes]);

  

  return (
    <MathJaxContext>
      <MathJax>
        <div className="relative overflow-hidden p-2 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 shadow-lg border-0 w-full">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -mr-20 -mt-20 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full -ml-16 -mb-16 blur-xl"></div>
          
          <div className="relative z-10 w-full">
            {/* Navigation Buttons and Progress Bar - Mobile optimized */}
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-5 items-center mb-4 sm:mb-6 w-full'>
              {/* Progress Bar - Full width on mobile */}
              <div className='w-full order-2 sm:order-1 flex gap-1 sm:gap-2 sm:flex-1 min-w-0 my-2 sm:my-0'>
                {notes?.map((item, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full flex-1 transition-all duration-300 ${
                      index <= stepCount
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm'
                        : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
              
              {/* Navigation Buttons - Full width on mobile */}
              <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2 order-1 sm:order-2">
                {stepCount !== 0 && (
                  <Button
                    className='cursor-pointer shadow-sm bg-white hover:bg-gray-50 border-0 text-gray-700 hover:text-gray-900 transition-all duration-300 w-full sm:w-auto'
                    onClick={handlePrevious}
                    variant='outline'
                    size='sm'
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                )}
                
                {stepCount < notes.length - 1 ? (
                  <Button
                    className='cursor-pointer shadow-sm bg-white hover:bg-gray-50 border-0 text-gray-700 hover:text-gray-900 transition-all duration-300 w-full sm:w-auto'
                    onClick={handleNext}
                    variant='outline'
                    size='sm'
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => router.back()}
                    className='cursor-pointer shadow-sm bg-white hover:bg-gray-50 border-0 text-gray-700 hover:text-gray-900 transition-all duration-300 w-full sm:w-auto'
                    variant='outline'
                    size='sm'
                  >
                    Go to Course Page
                  </Button>
                )}
              </div>
            </div>
            
            {/* Notes Content - Optimized for mobile screens */}
            <div className='mt-4 sm:mt-6 w-full'>
              <div
                className='notes-content prose prose-sm sm:prose max-w-none w-full space-y-3 sm:space-y-4 bg-white/70 backdrop-blur-sm p-2 sm:p-6 rounded-xl shadow-sm'
                style={{ 
                  overflowWrap: 'break-word', 
                  wordWrap: 'break-word', 
                  hyphens: 'auto',
                  width: '100%'
                }}
                dangerouslySetInnerHTML={{
                  __html: formatNotes(notes[stepCount]?.notes || '')
                }}
              />
              {showComplete && stepCount == notes.length - 1 &&
                <div className='flex justify-center sm:justify-end mt-4'>
                  <Button
                    disabled={loading}
                    onClick={() => handleComplete()}
                    variant='outline'
                    className='mt-3 sm:mt-5 cursor-pointer shadow-sm bg-white hover:bg-gray-50 border-0 text-gray-700 hover:text-gray-900 transition-all duration-300 w-full sm:w-auto'
                  >
                    Mark as completed
                  </Button>
                </div>
              }
            </div>
          </div>
        </div>
      </MathJax>
    </MathJaxContext>
  );
  
  // Add this formatNotes function above your component or in a utils file
  function formatNotes(content) {
    if (!content) return '';
    
    let formatted = DOMPurify.sanitize(content)
  // Fix Gemini's escaped newlines and replace them with <br> for line breaks
  .replace(/\\n\s*\\n\s*/g, '<br>') 
  .replace(/\\n/g, '<br>') 

  // Replace escaped quotes with regular quotes
  .replace(/\\"/g, '"')  
  .replace(/\\"([^"]+)\\"/g, '"$1"')

  // Handle math expressions
  .replace(/\$\$(.*?)\$\$/gs, (match, p1) => `$$${p1}$$`) // Block math
  .replace(/\\\((.*?)\\\)/g, (match, p1) => `\\(${p1}\\)`) // Inline math
  .replace(/\\\[(.*?)\\\]/g, (match, p1) => `\\[${p1}\\]`) // Display math

  // Handle code blocks with proper formatting
  .replace(/```(\w*)\s*([\s\S]*?)```/g, (match, language, code) => {
    // If it looks like math content in a code block, convert to math display
    if (code.includes('\\frac') || code.includes('\\sin') || 
        code.includes('\\cos') || code.includes('\\sum') ||
        code.includes('\\int')) {
      return `$$${code}$$`;
    }

    // Otherwise format as code block
    return `<pre class="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
              <code class="font-mono text-sm">${code}</code>
            </pre>`;
  })
  
  // Handle Gemini's weird comment-based code blocks
  .replace(/(\/\/\s*.*?)<br>(.*?Math\..*?)<br>/g, (match) => {
    return `<pre class="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
              <code class="font-mono text-sm">${match}</code>
            </pre>`;
  })

  // Clean up HTML artifacts (potentially from Gemini)
  .replace(/\{\s*"(html_content|content)"\s*:\s*"/g, '') // Remove content artifact
  .replace(/"\s*\}/g, '') // Remove closing brace artifact
  .replace(/<\/?p>/g, '') // Remove paragraph tags (if any)
  .replace(/\\\\/g, '\\');  // Fixes double backslashes

return formatted;

  }
}

export default ViewNotes;