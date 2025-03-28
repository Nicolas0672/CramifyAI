"use client"
import React, { useEffect, useState } from 'react'
import AgentLayout from '../_components/agent'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'

function CreateTeach() {
  const{user} = useUser()
  const [isNewMember, setIsNewMember] = useState(null)

  useEffect(()=>{
      IsNewMember()
    }, [user])
  
    const IsNewMember=async()=>{
      const res = await axios.post('/api/check-new-member', {
        createdBy: user?.primaryEmailAddress?.emailAddress
      })
      setIsNewMember(res.data.res.isNewMember)
      console.log(res.data.res)
    }

  return (
    <div className='mt-10'>
        
       
        <AgentLayout isNewMember={isNewMember} userName={user?.name} userId={user?.primaryEmailAddress?.emailAddress} type="generate" question='' courseId='' topic=''/>
    </div>
  )
}

export default CreateTeach