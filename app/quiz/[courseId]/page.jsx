"use client"
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import QuizSection from './_components/QuizSection'
import PracticeIntroCard from './_components/PracticeIntroCard'

function ViewQuiz() {

    const {courseId} = useParams()
    const [practiceCourse, setPracticeCourse] = useState([])

    useEffect(()=>{
        GetPracticeDetails()
    },[])

    const GetPracticeDetails=async()=>{
      let attempt = 0;
      const maxAttempt = 20;
      while(attempt < maxAttempt){
        const res = await axios.get(`/api/quizzes?courseId=${courseId}`);
        setPracticeCourse(res.data.result)
        if(res?.data?.result?.status === 'Ready'){
          console.log('Ready')
            break;
        } else {
            await new Promise((res)=> setTimeout(res,5000))
            attempt++
        } 
      }    
    }

  return (
    <div>
        
        <PracticeIntroCard course={practiceCourse}/>
        <QuizSection course={practiceCourse} courseId={courseId}/>
    </div>
  )
}

export default ViewQuiz