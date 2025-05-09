"use client"
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import FeedbackDetails from '../_components/FeedbackDetails'
import LearningProgressStepper from '@/app/LearningProgressStepper'
import { useLearningMode } from '@/app/LearningModeContext'
import { useCourse } from '@/app/CourseIdProvider'
import confetti from 'canvas-confetti'
import { MathJaxContext } from 'better-react-mathjax';


function ViewExamFeedback() {
  const {courseId} = useParams()
  const [feedbackDetails, setFeedbackDetails] = useState([])
  const router = useRouter()
  const {currentModes, setMode} = useLearningMode()
    const{setCourse} = useCourse()

    
  
  useEffect(()=>{
    GetFeedbackData()
    setMode('exam')
  }, [courseId])

  const GetFeedbackData = async () => {
    try {
      const res = await axios.get(`/api/get-feedback?courseId=${courseId}`);
      const result = res.data.result;
      console.log("Fetched data:", result);
      
      if (result && result.length > 0) {
        setFeedbackDetails(result);
        setCourse(result[0]); // Set course with the first item once we have data
        triggerConfetti(); // Move confetti trigger here as well
      } else {
        console.log("No feedback data returned or empty array");
      }
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };

  function triggerConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

 

  

  
 
  
 
  const averageRating = feedbackDetails.length > 0
  ? (feedbackDetails.reduce((sum, item) => {
      // Extract just the numerical value from ratings
      const ratingValue = parseFloat(item.aiResponse.feedback.rating.toString().split('/')[0]);
      return sum + (isNaN(ratingValue) ? 0 : ratingValue);
    }, 0) / feedbackDetails.length).toFixed(1)
  : 0;

return (
  <div className="max-w-4xl mx-auto px-6 py-8 bg-gradient-to-b from-indigo-50 to-white min-h-screen rounded-2xl">
          <LearningProgressStepper currentMode={currentModes} />
    <div className="mb-8 text-center">
      <div className="inline-block p-2 bg-indigo-100 rounded-full mb-4">
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        Congratulations on finishing your exam!
      </h2>
      <div className="h-1 w-16 bg-indigo-500 mx-auto rounded-full mt-2 mb-4"></div>
      <p className="text-gray-600 mb-6">Your personalized AI feedback is ready below</p>
      
      <div className="inline-block bg-white p-2 rounded-xl shadow-md border border-indigo-100">
        <div className="text-lg font-semibold text-gray-700">Average Score</div>
        <div className="text-xl font-bold text-indigo-600">{averageRating}/10</div>
      </div>
    </div>
    
    <div className="space-y-6">
      {feedbackDetails.map((feedback, index) => (
         <MathJaxContext config={{
          tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true
          },
          options: {
            enableMenu: false
          }
        }}>
        <FeedbackDetails 
          key={index} 
          feedback={feedback} 
          index={index} 
        />
        </MathJaxContext>
      ))}
    </div>
    
    <div className="mt-10 text-center">
      <button onClick={()=>router.push('/dashboard')}className="cursor-pointer px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
        Back to Dashboard
      </button>
    </div>
  </div>
);
  }

export default ViewExamFeedback