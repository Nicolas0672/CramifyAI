import React from 'react'

import DashboardHeader from './_components/DashboardHeader'
import { SidebarProvider } from '../SidebarContext'

function DashboardLayout({children}) {
  return (
    
   <div>
      <div className='md:w-64 hidden md:block fixed'>
        
      </div>
      <div className='md:ml-60'>
        
        <div className='p-10'>
        {children}
      </div>
      </div>
      
   </div>
  
  )
  
}

export default DashboardLayout