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
    const [examList, setExamList] = useState([])
    
    useEffect(() => {
        user && getCourseList();
        user && getQuizList();  // NEW - Fetch quizzes too
        user && GetExamList()
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

    const GetExamList = async () =>{
        setLoading(true);
        const result = await axios.post('/api/exam', { createdBy: user?.primaryEmailAddress.emailAddress })
        setExamList(result.data.result)
        console.log(result.data)
        setLoading(false)
    }

    useEffect(()=>{
        console.log(mode)
    },[mode])

    const handleClick = ()=>{
        if(mode == 'study') return getCourseList
        if(mode == 'quiz') return getQuizList
        if(mode == 'exam') return GetExamList
    }
    
    return (
        <div className='mt-5 px-2'>
            <div className='mb-8 pb-4 border-b border-gray-100'>
                <h2 className='font-bold text-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 pb-1'>
                        {mode === 'study' ? 'Your Study Material' : mode === 'practice' ? 'Your Practice Quizzes' : 'Your Exam Sets'}
                    </span>
                    
                    <div className="flex flex-wrap gap-2">
                        <div className='p-1 gap-3 bg-gray-50 rounded-lg shadow-sm flex gap-1'>
                            <Button 
                                className={`cursor-pointer px-4 py-2 transition-all duration-300 ${mode === 'study' ? 'shadow-md' : ''}`}
                                onClick={() => setMode('study')}
                                variant={mode === 'study' ? 'default' : 'outline'}>
                                Study
                            </Button>
                            <Button 
                                className={`cursor-pointer px-4 py-2 transition-all duration-300 ${mode === 'practice' ? 'shadow-md' : ''}`} 
                                onClick={() => setMode('practice')}
                                variant={mode === 'practice' ? 'default' : 'outline'}>
                                Practice
                            </Button>
                            <Button 
                                className={`cursor-pointer px-4 py-2 transition-all duration-300 ${mode === 'exam' ? 'shadow-md' : ''}`}
                                onClick={() => setMode('exam')}
                                variant={mode === 'exam' ? 'default' : 'outline'}>
                                Exam
                            </Button>
                            <Button
                            onClick={mode === 'study' ? getCourseList : mode === 'practice' ? getQuizList : GetExamList}
                            variant='outline'
                            className='cursor-pointer border-gray-300 hover:border-blue-500 hover:text-blue-500 transition-colors duration-300 shadow-sm'
                        >
                            <RefreshCcw className='mr-1 h-4 w-4'/> Refresh
                        </Button>
                        </div>
                       
                    </div>
                </h2>
            </div>
            
            <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {!loading ? 
                  (
                    mode === 'study' ? (
                        courseList.length > 0 ? (
                            courseList.map((course, index) => (
                                <CourseCardItem course={course} key={index} mode={mode} loading={loading} />
                            ))
                        ) : (
                            <div className="col-span-full py-8 text-center text-gray-500">
                                No study materials found. Create your first one!
                            </div>
                        )
                    ) : mode === 'practice' ? (
                        quizList.length > 0 ? (
                            quizList.map((quiz, index) => (
                                <CourseCardItem course={quiz} key={index} mode={mode} loading={loading} />
                            ))
                        ) : (
                            <div className="col-span-full py-8 text-center text-gray-500">
                                No practice quizzes found. Create your first one!
                            </div>
                        )
                    ) : (
                        examList.length > 0 ? (
                            examList.map((exam, index) => (
                                <CourseCardItem course={exam} key={index} mode={mode} loading={loading} />
                            ))
                        ) : (
                            <div className="col-span-full py-8 text-center text-gray-500">
                                No exam sets found. Create your first one!
                            </div>
                        )
                    )
                    ) : 
                    [1, 2, 3, 4].map((item, index) => (
                        <div key={index} className='h-56 w-full bg-gradient-to-r from-slate-200 to-slate-100 rounded-lg animate-pulse shadow-sm'>
                            <div className="h-28 bg-slate-300/50 rounded-t-lg"></div>
                            <div className="p-3">
                                <div className="h-4 bg-slate-300/70 rounded-full w-3/4 mb-2"></div>
                                <div className="h-3 bg-slate-300/50 rounded-full w-1/2"></div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default CourseList;