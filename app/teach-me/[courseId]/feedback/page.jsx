"use client"
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLearningMode } from '@/app/LearningModeContext'
import LearningProgressStepper from '@/app/LearningProgressStepper'
import { useCourse } from '@/app/CourseIdProvider'
import confetti from 'canvas-confetti'

function ViewTeachFeedback() {
  const router = useRouter()
  const { courseId } = useParams()
  const [teachFeedback, setTeachFeedback] = useState()
  const [newTopic, setNewTopic] = useState("")
  const [loading, setLoading] = useState(true)
  const {currentModes, setMode} = useLearningMode()
  const {setCourse} = useCourse()
  
  useEffect(() => {
    if (courseId) {
      GetTeachFeedback()
     
    }
  }, [courseId])

  function triggerConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
  
  const GetTeachFeedback = async () => {
    setLoading(true)
    try {
      const dbRes = await axios.get('/api/get-teach-feedback?courseId=' + courseId)
      setTeachFeedback(dbRes.data.result)
    } catch (error) {
      console.error("Failed to fetch learning feedback:", error)
    } finally {
      setLoading(false)
      triggerConfetti()
    }
  }
  
  const processTopic = () => {
    if (teachFeedback && teachFeedback.topic) {
      let processedTopic = teachFeedback.topic.replace(/[{}"]/g, '')
      processedTopic = processedTopic.replace('courseTitle:', '')
      setNewTopic(processedTopic)
    }
  }
  
  useEffect(() => {
    processTopic()
    setCourse(teachFeedback)
    setMode('teach')
  }, [teachFeedback])

  // Helper function to determine score color
  const getScoreColor = (score) => {
    if (!score) return "text-gray-600";
    
    const numericScore = parseFloat(score.toString().replace(/[^0-9.]/g, ''));
    if (numericScore >= 8) return "text-green-500";
    if (numericScore >= 6) return "text-blue-500";
    if (numericScore >= 4) return "text-amber-500";
    return "text-red-500";
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-bounce rounded-full h-16 w-16 bg-indigo-400 shadow-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <p className="mt-4 text-indigo-600 font-medium animate-pulse">Generating your learning magic...</p>
        </div>
      </div>
    )
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-6 py-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 min-h-screen rounded-3xl shadow-md"
    >
      <LearningProgressStepper currentMode={currentModes}/>
      <div className="mb-8 text-center">
        <motion.div 
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
          className="inline-flex p-4 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl mb-6 shadow-lg"
        >
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
          </svg>
        </motion.div>
        
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mb-3">
          Learning Journey Insights
        </h1>
        
        <div className="h-2 w-32 bg-gradient-to-r from-indigo-400 to-purple-500 mx-auto rounded-full my-4"></div>
        
        {teachFeedback?.aiFeedback?.overallScore && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center justify-center my-4"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-indigo-300 to-purple-300 animate-pulse opacity-50"></div>
              <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center z-10">
                <span className={`text-3xl font-bold ${getScoreColor(teachFeedback.aiFeedback.overallScore)}`}>
                  {teachFeedback.aiFeedback.overallScore}
                </span>
              </div>
            </div>
          </motion.div>
        )}
        
        <p className="text-gray-600 text-lg mb-8">Your personalized AI learning feedback</p>
        
        {newTopic && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-2 px-4 py-2 bg-white rounded-full shadow-sm inline-block">
              {newTopic}
            </h2>
          </div>
        )}
      </div>
      
      {teachFeedback?.aiFeedback && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-8"
        >
          {/* Summary Section */}
          {teachFeedback.aiFeedback.summary && (
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl shadow-md border-2 border-indigo-100"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl mr-4 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-indigo-600">Learning Summary</h3>
              </div>
              <p className="text-gray-600 leading-relaxed pl-4 border-l-2 border-indigo-100">{teachFeedback.aiFeedback.summary}</p>
            </motion.div>
          )}
          
          {/* Strengths Section */}
          {teachFeedback?.aiFeedback?.strengths && (
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl shadow-md border-2 border-green-100"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-r from-green-400 to-teal-400 rounded-2xl mr-4 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-600">Your Strengths</h3>
              </div>
              <p className="text-gray-600 leading-relaxed pl-4 border-l-2 border-green-100">{teachFeedback.aiFeedback.strengths}</p>
            </motion.div>
          )}
          
          {/* Weakness Section */}
          {teachFeedback.aiFeedback.weakness && (
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl shadow-md border-2 border-red-100"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl mr-4 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-red-600">Areas to Improve</h3>
              </div>
              <p className="text-gray-600 leading-relaxed pl-4 border-l-2 border-red-100">{teachFeedback.aiFeedback.weakness}</p>
            </motion.div>
          )}
          
          {/* Improvements Section */}
          {teachFeedback.aiFeedback.improvements && (
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-3xl shadow-md border-2 border-amber-100"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl mr-4 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-amber-600">Growth Opportunities</h3>
              </div>
              <p className="text-gray-600 leading-relaxed pl-4 border-l-2 border-amber-100">{teachFeedback.aiFeedback.improvements}</p>
            </motion.div>
          )}
        </motion.div>
      )}
      
      <div className="mt-12 text-center">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/dashboard')} 
          className="cursor-pointer px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Continue Learning Journey
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ViewTeachFeedback