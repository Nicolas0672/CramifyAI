"use client"
import axios from 'axios'
import { useScroll } from 'framer-motion'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import TeachIntroCard from './_components/TeachIntroCard'
import AgentLayout from '@/app/_components/agent'
import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'; // For animations

function ViewTeachMe() {
    const {courseId} = useParams()
    const [teachDetails, setTeachDetails] = useState()
    const{user} = useUser()
    useEffect(()=>{
        GetTeachMeDetails()
    },[courseId])
    const GetTeachMeDetails = async()=>{
      console.log(courseId)
        const res = await axios.get('/api/teach-me?courseId='+courseId)
        console.log(res.data)
        setTeachDetails(res.data.result)
    }


    return (
        <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto">
          {/* Introduction/Summary Section */}
         
    
          {/* Course Intro Card */}
          <TeachIntroCard course={teachDetails} />
    
          {/* Agent Layout - Chat interface */}
          <div className="mt-4 w-full">
            <AgentLayout 
              isNewMember={false}
              userName={user?.name} 
              userId={user?.primaryEmailAddress?.emailAddress} 
              type="teach-me" 
              questions={teachDetails?.question || ''} 
              topic={teachDetails?.topics?.courseTitle || ''} 
              courseId={teachDetails?.courseId}
            />
          </div>
        </div>
      );
}

export default ViewTeachMe