"use client"
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import QuizCardItem from '../_components/QuizCardItem'
import { Check, X, ChevronLeft, ChevronRight, BookOpen, RotateCw } from 'lucide-react'
import toast from 'react-hot-toast'

function QuizContent() {
  const { courseId } = useParams()
  const [quizData, setQuizData] = useState([])
  const [stepCount, setStepCount] = useState(0)
  const router = useRouter()
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null)
  const [correctAns, setCorrectAns] = useState()
  const [explaination, setExplaination] = useState()
  const [showAnswer, setShowerAnswer] = useState(false)
  const [showExplaination, SetShowExplaination] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showComplete, setShowComplete] = useState(true)

  useEffect(() => {
    GetQuiz()
  }, [])

  const GetQuiz = async () => {
    setLoading(true)
    try {
      const res = await axios.post('/api/study-type', {
        courseId: courseId,
        studyType: 'quiz'
      })
      setQuizData(res.data)
      console.log(res.data)
    } catch (error) {
      console.error("Error fetching quiz data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete=async()=>{
    setLoading(true)
    const res = await axios.post('/api/handle-complete',{
      courseId: courseId,
      studyType: 'quiz',
      type: 'practice'
    })
    setShowComplete(false)
    toast('You have successfully finished this section!')
    setLoading(false)
    router.back()
    
  }

  useEffect(()=>{
    {quizData.isDone? setShowComplete(false) : setShowComplete(true)}
    console.log(quizData.isDone?'1':'2')
   },[quizData])

  const handleNext = () => {
    if (stepCount < quizData?.aiResponse?.questions.length - 1) {
      setStepCount(stepCount + 1)
      setIsCorrectAnswer(null)
      setCorrectAns(null)
      setExplaination(null)
      setShowerAnswer(false)
      SetShowExplaination(false)
    }
  }

  const handlePrevious = () => {
    if (stepCount > 0) {
      setStepCount(stepCount - 1)
      setIsCorrectAnswer(null)
      setCorrectAns(null)
      setExplaination(null)
      setShowerAnswer(false)
      SetShowExplaination(false)
    }
  }

  const CheckAnswer = (userAnswer, currentQuestion) => {
    if (userAnswer == currentQuestion?.correctAnswer) {
      setIsCorrectAnswer(true)
      return
    }
    setCorrectAns(currentQuestion?.correctAnswer)
    setExplaination(currentQuestion?.explanation)
    setIsCorrectAnswer(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <RotateCw className="w-12 h-12 animate-spin text-blue-500" />
        <p className="mt-4 text-lg font-medium">Loading quiz...</p>
      </div>
    )
  }

  return (
    <div className="mt-24 max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 backdrop-blur-sm bg-opacity-90">
      <div className="mb-8 flex items-center justify-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          <h2 className="font-bold text-3xl text-center">Interactive Quiz</h2>
        </div>
      </div>

      {quizData?.aiResponse?.questions && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">
              Question {stepCount + 1} of {quizData.aiResponse.questions.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((stepCount + 1) / quizData.aiResponse.questions.length) * 100}%` 
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      <motion.div
        key={stepCount}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <QuizCardItem 
          setShowerAnswer={setShowerAnswer} 
          quiz={quizData?.aiResponse?.questions[stepCount]} 
          userSelectedOption={(v) => CheckAnswer(v, quizData?.aiResponse?.questions[stepCount])}
        />
      </motion.div>

      {isCorrectAnswer === false && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg flex items-start">
            <X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 text-lg">Incorrect</h3>
              <p className="text-red-700 mt-1">Your answer was not correct.</p>
              {!showAnswer ? (
                <Button 
                  onClick={() => setShowerAnswer(true)}
                  variant='outline'
                  className="mt-3 text-red-700 border-red-300 hover:bg-red-100"
                >
                  Show correct answer
                </Button>
              ) : (
                <div className="mt-3 p-3 bg-white rounded-lg border border-red-200">
                  <p className="font-medium">Correct answer: <span className="text-red-700">{correctAns}</span></p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {isCorrectAnswer === true && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-800 text-lg">Correct!</h3>
              <p className="text-green-700 mt-1">Great job! Your answer is correct.</p>
            </div>
          </div>
        </motion.div>
      )}

      {correctAns != null && (
        <div className="mt-8">
          <Button 
            onClick={() => SetShowExplaination(!showExplaination)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            <BookOpen className="w-4 h-4 mr-2" /> 
            {showExplaination ? "Hide" : "Show"} Explanation
          </Button>
          
          {showExplaination && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4 p-5 bg-gray-50 rounded-lg border border-gray-200"
            >
              <h3 className="font-medium text-gray-800 mb-2">Explanation:</h3>
              <p className="text-gray-700">{explaination}</p>
            </motion.div>
          )}
        </div>
      )}

      <div className="flex justify-between mt-10">
        <Button
          onClick={handlePrevious}
          variant="outline"
          className="flex items-center gap-2 border-gray-300 hover:bg-gray-100 disabled:opacity-50"
          disabled={stepCount === 0}
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>
        
        {stepCount < (quizData?.aiResponse?.questions?.length - 1) ? (
          <Button
            onClick={handleNext}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (showComplete?
          <Button
            disabled={loading} 
            onClick={() => handleComplete()} 
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          >
            Complete Quiz
          </Button>:(
            <Button 
            onClick={() => router.back()} 
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          >
            Quiz Completed
          </Button>
          )
        )}
      </div>
    </div>
  )
}

export default QuizContent