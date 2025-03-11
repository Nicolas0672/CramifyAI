"use client"
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CourseCardItem from './CourseCardItem'
import { Button } from '@/components/ui/button'
import { RefreshCcw } from 'lucide-react';

function CourseList() {
    const {user} = useUser()
    const [courseList, setCourseList] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        user&&getCourseList()
    }, [user])
    
    const getCourseList= async ()=>{
        setLoading(true)
        const result = await axios.post('/api/courses', {createdBy:user?.primaryEmailAddress.emailAddress})
        console.log(result)
        setCourseList(result.data.result)
        setLoading(false)
    }
  return (
    <div className='mt-5 '>
        <h2 className='font-bold text-2xl flex justify-between items-center'>Your Study Material
            <Button onClick={getCourseList}variant='outline' className='cursor-pointer border-blue-500'><RefreshCcw className=''/>Refresh</Button>
        </h2>

        <div className='mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {loading==false? courseList?.map((course, index) => (
                <CourseCardItem course={course} key={index}/>
            )):
            [1,2,3,4,5,6].map((item, index) => (
                <div key={index}className='h-56 w-full bg-slate-200 rounded-lg animate-pulse'>


                </div>
            ))
            }
        </div>

    </div>
  )
}

export default CourseList