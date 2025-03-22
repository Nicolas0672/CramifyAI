import React from 'react'
import AgentLayout from '../_components/agent'

function CreateTeach() {
  return (
    <div className='mt-10'>
        
        <h3>Teach Me Material Generation</h3>
        <AgentLayout userName="You" userId='user1' type="generate"/>
    </div>
  )
}

export default CreateTeach