"use client"
import axios from 'axios'
import { ArrowRight } from 'lucide-react'
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

  const showRedirectToast = (message) => {
    toast(
      <div className="flex items-center gap-2">
        <div className="bg-green-100 p-2 rounded-full">
          <ArrowRight className="w-5 h-5 text-green-500" />
        </div>
        <span>{message}</span>
      </div>,
      {
        style: {
          background: 'linear-gradient(to right, #ecfdf5, #d1fae5)',
          border: '1px solid #6ee7b7',
          color: '#065f46',
          borderRadius: '0.5rem',
        },
        duration: 3000,
      }
    );
  };

  useEffect(()=>{
    examIntro&&CheckStartedExam()
  },[examIntro])

  const CheckStartedExam=()=>{
    if(examIntro?.questionCount > 0){
      showRedirectToast('Redirecting to exam page...')
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
    <div className="mt-14 sm:mt-15 w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8 relative">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-8 sm:w-16 h-8 sm:h-16 border-2 sm:border-4 border-blue-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-20 left-10 w-12 sm:w-24 h-12 sm:h-24 border-2 sm:border-4 border-purple-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-10 sm:left-40 w-16 sm:w-32 h-2 sm:h-3 bg-blue-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-10 sm:right-20 w-10 sm:w-20 h-1 sm:h-2 bg-purple-400/20 rounded-full animate-pulse"></div>
      </div>
      
      {/* Main content with hover effects */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-blue-400/30 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 relative z-10 w-full">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3">{examIntro.currQuestionAiResp.courseTitle}</h1>
        
        <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 sm:mt-6">
          <div className="bg-slate-800/80 backdrop-blur-sm px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base border-l-4 border-blue-400 hover:border-blue-300 transition-colors duration-300">
            <span className="opacity-70">Duration:</span> {examIntro.exam_time} minutes
          </div>
          <div className="bg-slate-800/80 backdrop-blur-sm px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base border-l-4 border-purple-400 hover:border-purple-300 transition-colors duration-300">
            <span className="opacity-70">Difficulty:</span> {examIntro.difficultyLevel}
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-8 mt-4 border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative z-10 w-full">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center group">
            <span className="w-1 sm:w-2 h-6 sm:h-8 bg-blue-500 rounded-full mr-2 sm:mr-3 group-hover:h-8 sm:group-hover:h-10 transition-all duration-300"></span>
            Course Summary
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">{examIntro.currQuestionAiResp.courseSummary}</p>
        </div>
        
        <div className="mt-6 sm:mt-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 flex items-center group">
            <span className="w-1 sm:w-2 h-6 sm:h-8 bg-purple-500 rounded-full mr-2 sm:mr-3 group-hover:h-8 sm:group-hover:h-10 transition-all duration-300"></span>
            Exam Instructions
          </h2>
          <ul className="text-gray-700 space-y-2 sm:space-y-3 text-base sm:text-lg">
            <li className="flex items-start group">
              <span className="inline-block w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-400 rounded-full mt-2 sm:mt-3 mr-2 sm:mr-3 group-hover:bg-blue-400 transition-colors duration-300"></span>
              Read each question carefully before answering.
            </li>
            <li className="flex items-start group">
              <span className="inline-block w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-400 rounded-full mt-2 sm:mt-3 mr-2 sm:mr-3 group-hover:bg-purple-400 transition-colors duration-300"></span>
              You have {examIntro.exam_time} minutes to complete this exam.
            </li>
            <li className="flex items-start group">
              <span className="inline-block w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-400 rounded-full mt-2 sm:mt-3 mr-2 sm:mr-3 group-hover:bg-blue-400 transition-colors duration-300"></span>
              This exam will test your knowledge of {examIntro.currQuestionAiResp.courseTitle}.
            </li>
            <li className="flex items-start group">
              <span className="inline-block w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-400 rounded-full mt-2 sm:mt-3 mr-2 sm:mr-3 group-hover:bg-purple-400 transition-colors duration-300"></span>
              Once you begin, you cannot pause the timer.
            </li>
          </ul>
        </div>
        
        <div className="mt-8 sm:mt-12 flex justify-center">
          <button 
            className={`cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-medium text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-10 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:translate-y-[-4px] hover:shadow-lg shadow-blue-500/30 active:translate-y-0 relative overflow-hidden w-full sm:w-auto ${buttonLoading ? 'pointer-events-none' : ''}`}
            onClick={handleStartExam}
            disabled={buttonLoading}
          >
            {buttonLoading ? (
              <div className="flex items-center justify-center">
                <div className="inline-block h-4 sm:h-5 w-4 sm:w-5 animate-spin rounded-full border-2 sm:border-3 border-solid border-white border-r-transparent align-[-0.125em] mr-2"></div>
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