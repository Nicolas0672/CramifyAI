import DashboardHeader from '@/app/dashboard/_components/DashboardHeader'
import React from 'react'

function CourseViewLayout({children}) {
  return (
    <div>
        <DashboardHeader/>
        <div className='mx-3 md:mx-5 lg:px-40 mt-5'>
        {children}
        </div>
    </div>
  )
}

export default CourseViewLayout