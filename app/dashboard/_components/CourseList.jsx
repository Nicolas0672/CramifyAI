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
    const [quizList, setQuizList] = useState([])
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState('study')  // NEW - Switch between Study & Practice

    useEffect(() => {
        user && getCourseList();
        user && getQuizList();  // NEW - Fetch quizzes too
        console.log(mode)
    }, [user])

    const getCourseList = async () => {
        setLoading(true);
        const result = await axios.post('/api/courses', { createdBy: user?.primaryEmailAddress.emailAddress });
        setCourseList(result.data.result);
        setLoading(false);
    }

    const getQuizList = async () => {
        setLoading(true);
        const result = await axios.post('/api/quizzes', { createdBy: user?.primaryEmailAddress.emailAddress });
        setQuizList(result.data.result);
        setLoading(false);
    }

    return (
        <div className='mt-5'>
            <h2 className='font-bold text-2xl flex justify-between items-center'>
                {mode === 'study' ? 'Your Study Material' : 'Your Practice Quizzes'}

                <div className="flex gap-2">
                    <Button className='cursor-pointer'onClick={() => setMode('study')} 
                            variant={mode === 'study' ? 'default' : 'outline'}>
                        Study
                    </Button>
                    <Button className='cursor-pointer' onClick={() => setMode('practice')} 
                            variant={mode === 'practice' ? 'default' : 'outline'}>
                        Practice
                    </Button>
                    <Button className='cursor-pointer'onClick={() => setMode('exam')} 
                            variant={mode === 'exam' ? 'default' : 'outline'} >Exam</Button>
                    <Button 
                        onClick={mode === 'study' ? getCourseList : getQuizList}
                        variant='outline'
                        className='cursor-pointer border-black-500'
                    >
                        <RefreshCcw className=''/> Refresh
                    </Button>
                    
                </div>
            </h2>

            <div className='mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {!loading ? 
                    (mode === 'study' ? 
                        courseList.map((course, index) => (
                            <CourseCardItem course={course} key={index} mode={mode} loading={loading} />
                        ))
                        :
                        quizList.map((quiz, index) => (
                            <CourseCardItem course={quiz} key={index} mode={mode} loading={loading}/>
                        ))
                    ) :
                    [1, 2, 3, 4, 5, 6].map((item, index) => (
                        <div key={index} className='h-56 w-full bg-slate-200 rounded-lg animate-pulse'></div>
                    ))
                }
            </div>
        </div>
    )
}

export default CourseList;
