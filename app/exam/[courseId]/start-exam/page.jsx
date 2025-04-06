"use client"
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ExamPage from '../_components/ExamPage'
import { ArrowRight, CheckCircle, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

function ExamStart() {
  const [loading, setLoading] = useState(false)
  const [questionCount, setQuestionCount] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [userAnswer, setUserAnswer] = useState("")
  const [course, setCourse] = useState({})
  const [startTime, setStartTime] = useState(null)
  const [timeLeft, setTimeLeft] = useState(null)
  const [elapsedTime, setElapstedTime] = useState(0)
  const router = useRouter()

  const { courseId } = useParams()

  // Fetch the first question and initialize timer
  useEffect(() => {
    GetExamQuestion()
    const startTime = new Date().toISOString();
    setStartTime(startTime) // Start time initialized when fetching first question
  }, [courseId])

  useEffect(() => {
    if (!timeLeft) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0 // Exam ends
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer) // Cleanup on unmount
  }, [timeLeft])

  // Fetch exam question
  const GetExamQuestion = async () => {
    try {
      const response = await axios.post('/api/study-type', {
        courseId: courseId,
        studyType: 'exam'
      })

      // Clone the object to remove circular references
      const cleanedData = JSON.parse(JSON.stringify(response.data))

      { cleanedData.questionCount == 0 ? setCurrentQuestion(cleanedData?.currQuestionAiResp?.question) : setCurrentQuestion(cleanedData.question) }

      setCourse(cleanedData)
      setTimeLeft(cleanedData?.exam_time * 60) // Initialize timer
      setQuestionCount(cleanedData.questionCount)
      setUserAnswer(cleanedData.userAns)
      setElapstedTime(cleanedData.remainingTime)
      console.log("Exam Course Data:", cleanedData)
    } catch (error) {
      console.error("Error fetching exam question:", error)
    }
  }

  // useEffect(()=>{
  //     const interval = setInterval(()=>{
  //         setElapstedTime((prev) => prev + 1)
  //     }, 1000)

  //     const saveTime = async ()=>{
  //         await axios.post('/api/save-question',{
  //             courseId: course.courseId,
  //             question: currentQuestion,
  //             userAns: userAnswer || "",
  //             remainingTime: elapsedTime
  //         })
  //     }
  //     const saveInterval = setInterval(saveTime, 10000);
  //     return () => {
  //         clearInterval(interval);
  //         clearInterval(saveInterval);
  //     };
  // },[elapsedTime, userAnswer, courseId])



  const handleSave = async () => {
    toast('Saving answer...')
    const resUpdate = await axios.post('/api/save-question', {
      courseId: course.courseId,

      question: currentQuestion,
      userAns: userAnswer || ""
    })
    toast('Answer Saved!')
  }

  useEffect(() => {
    const storedStartTime = localStorage.getItem(`exam_start_time_${courseId}`);
    if (storedStartTime) {
      setStartTime(new Date(storedStartTime));
    } else {
      const newStartTime = new Date().toISOString();
      localStorage.setItem(`exam_start_time_${courseId}`, newStartTime);
      setStartTime(new Date(newStartTime));
    }
  }, [courseId]);

  useEffect(() => {
    if (!startTime || !course.exam_time) return;

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now - new Date(startTime)) / 1000); // Convert ms to seconds
      const remaining = Math.max(course.exam_time * 60 - elapsed, 0);

      setTimeLeft(remaining);

      if (remaining === 0) {
        updateExamTime()
        toast('Time is up!')
        clearInterval(interval);
        router.push(`/exam/${courseId}/feedback`)
       } // Stop timer when time is up
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, course.exam_time]);

  const updateExamTime=async()=>{
    const res = await axios.post('/api/update-exam-time',{
      createdBy: course?.createdBy,
      courseId: course?.courseId
    })
    console.log(res)
  }
  // Handle answer submission
  const handleSubmit = async () => {
    if (questionCount >= 5) return;
    if(questionCount <= 4){
      toast('Deciding your next quesiton...')
    }
    setLoading(true);

    // Debugging: Log the values before sending request

    try {
      const res = await axios.post('/api/generate-next-exam', {
        userAns: userAnswer,
        difficultyLevel: course?.difficultyLevel,
        correctAns: course?.currQuestionAiResp?.answer,
        question: currentQuestion,
        courseId: course?.courseId,
        createdBy: course?.createdBy,
        exam_time: course?.exam_time,
        start_time: startTime
      });
      // Find the derivative of $g(x) = (x+1)^2$.

      // Access the AI response from the response data
      const responseData = res.data;
      console.log(responseData.dbResponse.resp.aiResponse.feedback.question);

      const resUpdate = await axios.post('/api/save-question', {
        courseId: course.courseId,
        // exam_time
        question: responseData.dbResponse.resp.aiResponse.feedback.question,
        userAns: userAnswer
      })

      const questionUpdate = await axios.post('/api/update-next', {
        courseId: course.courseId
      })

      console.log(resUpdate)
      console.log(questionUpdate.data.res.questionCount)
      setCourse(questionUpdate.data.res)

      const newQuestion = resUpdate.data.res.question || "";
      console.log(newQuestion)
      setQuestionCount(questionUpdate.data.res.questionCount + 1);
      setCurrentQuestion(newQuestion);
      setUserAnswer(""); // Clear input field

      // Optionally, you might want to save the feedback for display
      // setFeedback(responseData.aiResponse.feedback);

    } catch (error) {
      console.error("Error submitting exam:", error);
      // Handle specific error cases
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Server error data:", error.response.data);
        console.error("Server error status:", error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // Format timer display (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Format question for MathJax
  const formatQuestion = (question) => {
    return question.includes('$') ? `${question}` : question
  }

  return (
    <MathJaxContext config={{ tex: { inlineMath: [['$', '$']] } }}>
      <div className="mt-20 mx-10 relative p-8 bg-gradient-to-br from-gray-50 to-blue-100 rounded-2xl shadow-xl overflow-hidden">
        {/* Floating study elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Book */}
          <div className="absolute top-8 right-12 w-12 h-16 bg-white shadow-md rounded opacity-30 animate-float-slow transform rotate-12"></div>

          {/* Pencil */}
          <div className="absolute top-32 left-16 w-2 h-20 bg-yellow-500 opacity-20 animate-float transform -rotate-45">
            <div className="absolute top-0 w-2 h-2 bg-pink-300"></div>
            <div className="absolute bottom-0 w-2 h-4 bg-gray-400"></div>
          </div>

          {/* Notebook */}
          <div className="absolute bottom-16 right-24 w-16 h-20 bg-white shadow-md rounded opacity-30 animate-float-medium">
            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-blue-200"></div>
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-blue-200"></div>
          </div>

          {/* Calculator */}
          <div className="absolute bottom-40 left-24 w-14 h-18 bg-gray-300 rounded opacity-20 animate-float-slow">
            <div className="absolute inset-1 bg-gray-100 rounded"></div>
          </div>

          {/* Formula */}
          <div className="absolute top-24 right-40 text-4xl opacity-10 animate-float-medium">E=mc²</div>

          {/* Light particles */}
          <div className="absolute inset-0">
            <div className="absolute h-2 w-2 rounded-full bg-blue-300 opacity-40 top-1/4 left-1/3 animate-pulse"></div>
            <div className="absolute h-3 w-3 rounded-full bg-indigo-300 opacity-30 top-2/3 left-1/4 animate-pulse-slow"></div>
            <div className="absolute h-2 w-2 rounded-full bg-purple-300 opacity-30 top-1/2 right-1/4 animate-pulse-medium"></div>
          </div>
        </div>

        {/* Exam content container */}
        <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/80 shadow-lg">
          <ExamPage course={course} />

          {/* Time left indicator */}
          <div className="flex items-center mt-6 mb-4">
            <Clock className="w-5 h-5 mr-2 text-indigo-500" />
            <p className="text-gray-700 font-medium">Time Left: <span className="text-indigo-600 font-bold">{formatTime(timeLeft)}</span></p>
          </div>

          {/* Question display */}
          <div className="bg-white rounded-lg p-5 mb-6 border border-gray-100 shadow-sm">
            <MathJax>
              <div className="text-gray-800 text-lg">{(currentQuestion)}</div>
            </MathJax>
          </div>

          {/* Answer input */}
          <div className="mb-6">
            <input
              onChange={(e) => setUserAnswer(e.target.value)}
              value={userAnswer}
              placeholder="Type Answer Here"
              className="w-full p-4 bg-white rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-between">
            {questionCount <= 5 && <Button onClick={() => handleSave()} className={`cursor-pointer bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>Save Answer</Button>}
            {questionCount >= 4 ? (
              <Button 
              disabled={loading}
              onClick={() => {
                
                handleSubmit();  // First, execute handleSubmit()
                toast('Redirecting to feedback...')
                router.push(`/exam/${courseId}/feedback`);  // Then, navigate
              }} className="cursor-pointer z-20 bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Finish
              </Button>
            ) : (
              <Button
                disabled={loading}
                onClick={handleSubmit}
                className={`cursor-pointer bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            )}

          </div>
        </div>
      </div>
    </MathJaxContext>
  );
}

export default ExamStart
