"use client"
import DashboardHeader from '@/app/dashboard/_components/DashboardHeader'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import CourseIntroCard from './_components/CourseIntroCard'
import StudyMaterialSection from './_components/StudyMaterialSection'
import ChapterList from './_components/ChapterList'

function Course() {
    const {courseId} = useParams()
    const [course, setCourse] = useState()


    useEffect(() =>{
        GetCourse()
    }, [])
    const GetCourse = async () => {
      let attempt = 0;
      const maxAttempt = 20;
      while(attempt < maxAttempt){
        const result = await axios.get('/api/courses?courseId='+courseId )
        console.log(result)
        setCourse(result.data.result)
        if(result?.data?.result?.status === 'Ready'){
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
        
        <div className=''>
        <CourseIntroCard course = {course}/>

        <StudyMaterialSection course= {course}courseId = {courseId}/>
        <ChapterList course= {course}/>
        </div>

    </div>
  )
}

export default Course