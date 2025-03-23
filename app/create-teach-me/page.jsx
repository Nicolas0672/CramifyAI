"use client"
import React from 'react'
import AgentLayout from '../_components/agent'
import { useUser } from '@clerk/nextjs'

function CreateTeach() {
  const{user} = useUser()

  return (
    <div className='mt-10'>
        
        <h3>Teach Me Material Generation</h3>
        <AgentLayout userName={user?.name} userId={user?.primaryEmailAddress?.emailAddress} type="generate" question='' courseId='' topic=''/>
    </div>
  )
}

export default CreateTeach