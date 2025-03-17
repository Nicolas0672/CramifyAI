"use client"
import axios from 'axios'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ExamStart from './start-exam/page'
import ExamPage from './_components/ExamPage'

function ViewExam() {
  const { courseId } = useParams()
  const [examIntro, setExamIntro] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    GetExamIntro()
  }, [])

  const GetExamIntro = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`/api/exam?courseId=${courseId}`)
      setExamIntro(res.data.result)
      console.log(res.data.result)
    } catch (err) {
      console.error("Error fetching exam:", err)
      setError("Failed to load exam information")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl text-gray-700">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] mr-2"></div>
        Loading exam information...
      </div>
    </div>
  )
  
  if (error) return <div className="p-6 text-red-500 text-xl">{error}</div>
  if (!examIntro) return <div className="p-6 text-xl">No exam information available</div>

  return (
    <div className="mt-20 max-w-5xl mx-auto p-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg border border-blue-400/30 shadow-lg shadow-blue-500/10">
        <h1 className="text-4xl font-bold mb-3">{examIntro.currQuestionAiResp.courseTitle}</h1>
        
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="bg-slate-800 px-5 py-3 rounded-md text-base border-l-4 border-blue-400">
            <span className="opacity-70">Duration:</span> {examIntro.exam_time} minutes
          </div>
          <div className="bg-slate-800 px-5 py-3 rounded-md text-base border-l-4 border-purple-400">
            <span className="opacity-70">Difficulty:</span> {examIntro.difficultyLevel}
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-xl rounded-lg p-8 mt-2 border border-slate-200">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="w-2 h-8 bg-blue-500 rounded mr-3"></span>
            Course Summary
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">{examIntro.currQuestionAiResp.courseSummary}</p>
        </div>
        
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <span className="w-2 h-8 bg-purple-500 rounded mr-3"></span>
            Exam Instructions
          </h2>
          <ul className="text-gray-700 space-y-3 text-lg">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-3 mr-3"></span>
              Read each question carefully before answering.
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-3 mr-3"></span>
              You have {examIntro.exam_time} minutes to complete this exam.
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-3 mr-3"></span>
              This exam will test your knowledge of {examIntro.currQuestionAiResp.courseTitle}.
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-3 mr-3"></span>
              Once you begin, you cannot pause the timer.
            </li>
          </ul>
        </div>
        
        <div className="mt-12 flex justify-center">
            <Link href={'/exam/'+examIntro.courseId + '/start-exam'}>
          <button 
            className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-medium text-lg py-4 px-10 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
            onClick={() => console.log("Start exam clicked")}
          >
            Begin Exam
          </button>
          </Link>
          
        </div>
      </div>
      
      {/* AI decorative elements */}
      <div className="fixed top-10 right-10 w-12 h-12 border-4 border-blue-400/20 rounded-full z-0 opacity-30"></div>
      <div className="fixed bottom-20 left-10 w-20 h-2 bg-purple-400/20 rounded z-0 opacity-30"></div>
      
    </div>
  )
}

export default ViewExam