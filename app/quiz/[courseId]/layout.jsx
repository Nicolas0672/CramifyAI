import DashboardHeader from '@/app/dashboard/_components/DashboardHeader'
import React from 'react'

function PracticeViewLayout({children}) {
  return (
    <div>
        <DashboardHeader/>
        <div className='mx-10 md:mx-20 lg:px-60 mt-10'>
        {children}
        </div>
    </div>
  )
}

export default PracticeViewLayout