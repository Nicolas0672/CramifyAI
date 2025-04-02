"use client"
import axios from 'axios'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function ViewExam() {
  const { courseId } = useParams()
  const router = useRouter()
  const [examIntro, setExamIntro] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [buttonLoading, setButtonLoading] = useState(false)

  useEffect(() => {
    GetExamIntro()
  }, [])

  useEffect(()=>{
    examIntro&&CheckStartedExam()
  },[examIntro])

  const CheckStartedExam=()=>{
    if(examIntro?.questionCount > 0){
      toast('Redirecting to exam page...')
      router.push(`/exam/${courseId}/start-exam`)
    }
  }

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

  const handleStartExam = () => {
    setButtonLoading(true)
    // Wait a moment to show the loading state before navigating
    setTimeout(() => {
      router.push(`/exam/${courseId}/start-exam`)
    }, 800)
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl text-gray-700 flex items-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] mr-2"></div>
        Loading exam information...
      </div>
    </div>
  )
  
  if (error) return <div className="p-6 text-red-500 text-xl">{error}</div>
  if (!examIntro) return <div className="p-6 text-xl">No exam information available</div>

  return (
    <div className="mt-20 max-w-5xl mx-auto p-8 relative">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-16 h-16 border-4 border-blue-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-20 left-10 w-24 h-24 border-4 border-purple-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-40 w-32 h-3 bg-blue-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-20 h-2 bg-purple-400/20 rounded-full animate-pulse"></div>
      </div>
      
      {/* Main content with hover effects */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl border border-blue-400/30 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 relative z-10">
        <h1 className="text-4xl font-bold mb-3">{examIntro.currQuestionAiResp.courseTitle}</h1>
        
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="bg-slate-800/80 backdrop-blur-sm px-5 py-3 rounded-xl text-base border-l-4 border-blue-400 hover:border-blue-300 transition-colors duration-300">
            <span className="opacity-70">Duration:</span> {examIntro.exam_time} minutes
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm px-5 py-3 rounded-xl text-base border-l-4 border-purple-400 hover:border-purple-300 transition-colors duration-300">
            <span className="opacity-70">Difficulty:</span> {examIntro.difficultyLevel}
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-xl rounded-2xl p-8 mt-4 border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative z-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center group">
            <span className="w-2 h-8 bg-blue-500 rounded-full mr-3 group-hover:h-10 transition-all duration-300"></span>
            Course Summary
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">{examIntro.currQuestionAiResp.courseSummary}</p>
        </div>
        
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center group">
            <span className="w-2 h-8 bg-purple-500 rounded-full mr-3 group-hover:h-10 transition-all duration-300"></span>
            Exam Instructions
          </h2>
          <ul className="text-gray-700 space-y-3 text-lg">
            <li className="flex items-start group">
              <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-3 mr-3 group-hover:bg-blue-400 transition-colors duration-300"></span>
              Read each question carefully before answering.
            </li>
            <li className="flex items-start group">
              <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-3 mr-3 group-hover:bg-purple-400 transition-colors duration-300"></span>
              You have {examIntro.exam_time} minutes to complete this exam.
            </li>
            <li className="flex items-start group">
              <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-3 mr-3 group-hover:bg-blue-400 transition-colors duration-300"></span>
              This exam will test your knowledge of {examIntro.currQuestionAiResp.courseTitle}.
            </li>
            <li className="flex items-start group">
              <span className="inline-block w-2 h-2 bg-slate-400 rounded-full mt-3 mr-3 group-hover:bg-purple-400 transition-colors duration-300"></span>
              Once you begin, you cannot pause the timer.
            </li>
          </ul>
        </div>
        
        <div className="mt-12 flex justify-center">
          <button 
            className={`cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-medium text-lg py-4 px-10 rounded-xl transition-all duration-300 transform hover:translate-y-[-4px] hover:shadow-lg shadow-blue-500/30 active:translate-y-0 relative overflow-hidden ${buttonLoading ? 'pointer-events-none' : ''}`}
            onClick={handleStartExam}
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <div className="flex items-center justify-center">
                <div className="inline-block h-5 w-5 animate-spin rounded-full border-3 border-solid border-white border-r-transparent align-[-0.125em] mr-2"></div>
                <span>Starting...</span>
              </div>
            ) : (
              "Begin Exam"
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewExam