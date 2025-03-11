"use client";
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

function ViewNotes() {
  const { courseId } = useParams();
  const [notes, setNotes] = useState([]);
  const [stepCount, setStepCount] = useState(0);
  const router = useRouter()

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

  return (
    <MathJaxContext >
      <MathJax>
        <div>
          {/* Navigation Buttons and Progress Bar */}
          <div className='flex gap-5 items-center'>
            {stepCount !== 0 && (
              <Button className='cursor-pointer' onClick={handlePrevious} variant='outline' size='sm'>
                Previous
              </Button>
            )}
            {notes?.map((item, index) => (
              <div
                key={index}
                className={`w-full h-2 rounded-full ${
                  index <= stepCount ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              ></div>
            ))}
            {stepCount < notes.length - 1 ? (
              <Button className='cursor-pointer'onClick={handleNext} variant='outline' size='sm'>
                Next
              </Button>
              
            ):
            
            <Button onClick={()=> router.back()} className='cursor-pointer' variant='outline' size='sm'>Go to Course Page</Button>
            }
          </div>

          {/* Notes Content */}
          <div className='mt-4'>
            <div className='notes-content prose max-w-none space-y-4 text-lg'
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(notes[stepCount]?.notes || '')
                  .replace(/```html/g, ' ')                
                  .replace(/\\n/g, ' ')                    
                  .replace(/\{\s*"(html_content|content)"\s*:\s*"/g, '') 
                  .replace(/"\s*\}/g, '')                  
                  .replace(/<\/?p>/g, '')                  
                  .replace(/\\\\/g, '\\')  // Fixes double backslashes (critical fix)
              }}
            />
           
          </div>
        </div>
      </MathJax>
    </MathJaxContext>
  );
}

export default ViewNotes;