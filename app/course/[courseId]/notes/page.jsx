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
        <div className="relative overflow-hidden p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 shadow-lg border-0">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -mr-20 -mt-20 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full -ml-16 -mb-16 blur-xl"></div>
            
          <div className="relative z-10">
            {/* Navigation Buttons and Progress Bar */}
            <div className='flex gap-2 sm:gap-5 items-center mb-6 flex-wrap sm:flex-nowrap'>
              {stepCount !== 0 && (
                <Button
                  className='cursor-pointer shadow-sm bg-white hover:bg-gray-50 border-0 text-gray-700 hover:text-gray-900 transition-all duration-300'
                  onClick={handlePrevious}
                  variant='outline'
                  size='sm'
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
              )}
                
              <div className='flex-1 flex gap-1 sm:gap-2 min-w-0'>
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
                
              <div className="mt-2 sm:mt-0">
                {stepCount < notes.length - 1 ? (
                  <Button
                    className='cursor-pointer shadow-sm bg-white hover:bg-gray-50 border-0 text-gray-700 hover:text-gray-900 transition-all duration-300'
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
                    className='cursor-pointer shadow-sm bg-white hover:bg-gray-50 border-0 text-gray-700 hover:text-gray-900 transition-all duration-300'
                    variant='outline'
                    size='sm'
                  >
                    Go to Course Page
                  </Button>
                )}
              </div>
            </div>
              
            {/* Notes Content */}
            <div className='mt-6'>
              <div
                className='notes-content prose max-w-none space-y-4 text-base sm:text-lg bg-white/70 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-sm mx-auto'
                style={{ overflowWrap: 'break-word', wordWrap: 'break-word', hyphens: 'auto' }}
                dangerouslySetInnerHTML={{
                  __html: formatNotes(notes[stepCount]?.notes || '')
                }}
              />
              {showComplete && stepCount == notes.length - 1 &&
                <div className='flex justify-end'>
                  <Button 
                    disabled={loading}
                    onClick={() => handleComplete()}
                    variant='outline' 
                    className='mt-5 cursor-pointer shadow-sm bg-white hover:bg-gray-50 border-0 text-gray-700 hover:text-gray-900 transition-all duration-300'
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
      // Fix Gemini's escaped code blocks with newlines
      .replace(/\\n\s*\\n\s*/g, '<br>')
      .replace(/\\n/g, '<br>')
      
      // Math expressions
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
        
        // Otherwise format as code
        return `<pre class="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto"><code class="font-mono text-sm">${code}</code></pre>`;
      })
      
      // Handle Gemini's weird comment-based code blocks
      .replace(/(\/\/\s*.*?)<br>(.*?Math\..*?)<br>/g, (match) => {
        return `<pre class="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto"><code class="font-mono text-sm">${match}</code></pre>`;
      })
      
      // Clean up HTML artifacts
      .replace(/\{\s*"(html_content|content)"\s*:\s*"/g, '')
      .replace(/"\s*\}/g, '')
      .replace(/<\/?p>/g, '')
      .replace(/\\\\/g, '\\');  // Fixes double backslashes
      
    return formatted;
  }
}

export default ViewNotes;