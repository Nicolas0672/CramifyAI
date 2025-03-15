"use client"
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import { Button } from '@/components/ui/button'


function ViewFillBlank() {
  const { courseId } = useParams()
  const [fillData, setFillData] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState({})
  const [correctAnswers, setCorrectAnswers] = useState({})
  const inputRefs = useRef({})
  const router = useRouter()

  useEffect(() => {
    GetFillDetails()
  }, [])

  const GetFillDetails = async () => {
    try {
      const res = await axios.post('/api/study-type', {
        courseId: courseId,
        studyType: 'fill'
      })
      
      // Extract data and store correct answers separately
      const data = res.data.aiResponse.data
      setFillData(data)
      
      // Create a mapping of correct answers
      const answerMap = {}
      data.forEach((item, index) => {
        answerMap[index] = item.answer
      })
      setCorrectAnswers(answerMap)
      
      console.log(data)
    } catch (error) {
      console.error("Error fetching fill-in-the-blank data:", error)
    }
  }

  // Debounce function to improve input performance
  const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  // Memoized debounced update function
  const debouncedUpdate = React.useCallback(
    debounce((index, value) => {
      setAnswers(prev => ({
        ...prev,
        [index]: value
      }));
    }, 100),
    []
  );

  const handleInputChange = (index, value) => {
    // Update immediately for a responsive feel
    const newAnswers = { ...answers, [index]: value };
    setAnswers(newAnswers);
    
    // Debounce the state update for better performance
    debouncedUpdate(index, value);
  }

  const checkAnswer = (index) => {
    setSubmitted(prev => ({
      ...prev,
      [index]: true
    }))
  }

  // Compare answers with backslash handling
  const isCorrectAnswer = (index) => {
    if (!submitted[index]) return false;
    
    const userAnswer = answers[index]?.trim() || '';
    const correctAnswer = correctAnswers[index]?.trim() || '';
    
    // Basic text comparison with case insensitivity
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) return true;
    
    // Try sanitizing and comparing again for LaTeX expressions
    const sanitizedUser = userAnswer.replace(/\\/g, '');
    const sanitizedCorrect = correctAnswer.replace(/\\/g, '');
    
    return sanitizedUser.toLowerCase() === sanitizedCorrect.toLowerCase();
  }

  // Function to ensure LaTeX is properly formatted for MathJax rendering
  const formatForMathJax = (text) => {
    if (!text) return '';
    // If the text doesn't already have LaTeX delimiters, add them
    if (!text.includes('\\(') && !text.includes('$')) {
      return `\\(${text}\\)`;
    }
    return text;
  }

  // Process the question string to properly handle math expressions
  const renderQuestion = (questionText, index) => {
    if (!questionText) return '';
    
    // Replace ____ with a placeholder we can identify
    const processedText = questionText.replace("____", "[[BLANK]]");
    
    // Split on our custom placeholder
    const parts = processedText.split("[[BLANK]]");
    
    if (parts.length === 1) return <MathJax hideUntilTypeset="first">{questionText}</MathJax>;
    
    return (
      <div className="flex flex-wrap items-center gap-2">
        <MathJax hideUntilTypeset="first">{parts[0]}</MathJax>
        
        <div className="inline-block relative mb-8">
          <input
            ref={el => inputRefs.current[index] = el}
            type="text"
            value={answers[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className={`mt-3 px-3 py-2 rounded-md border-2 focus:outline-none transition-colors duration-300 w-64 text-center font-medium ${
              submitted[index] ? 
                (isCorrectAnswer(index) 
                  ? 'border-green-400 bg-green-50 text-green-700' 
                  : 'border-red-400 bg-red-50 text-red-700') 
                : 'border-blue-300 bg-blue-50/30 text-blue-800 focus:border-blue-500'
            }`}
            placeholder="Type your answer here"
          />
          {submitted[index] && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap">
              {isCorrectAnswer(index) 
                ? <span className="text-green-600">Correct!</span>
                : (
                  <div className="flex items-center space-x-1">
                    <span className="text-red-600">Correct answer:</span>
                    <div className="ml-1">
                      <MathJax>{formatForMathJax(correctAnswers[index])}</MathJax>
                    </div>
                  </div>
                )
              }
            </div>
            
          )}
        </div>
        
        
        <MathJax hideUntilTypeset="first">{parts[1]}</MathJax>
      </div>
    );
  }

  return (
    <MathJaxContext
      config={{
        tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']],
          processEscapes: true
        },
        options: {
          enableMenu: false
        }
      }}
    >
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8 text-center">
          Fill in the Blanks
        </h1>
        
        <div className="space-y-8">
          {fillData.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-slate-100 p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex justify-center items-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-medium">
                    {index + 1}
                  </div>
                  <h3 className="font-medium text-gray-700">Question {index + 1}</h3>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => checkAnswer(index)}
                    className="px-4 py-1.5 text-sm rounded-md bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-300 shadow-sm hover:shadow"
                  >
                    Check
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-lg text-gray-800 leading-relaxed">
                  {renderQuestion(item.question, index)}
                </div>
              </div>
              
              {item.explanation && submitted[index] && (
                <div className="p-4 bg-blue-50 border-t border-blue-100">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">Explanation:</h4>
                  <MathJax hideUntilTypeset="first">
                    <p className="text-sm text-gray-700">{item.explanation}</p>
                  </MathJax>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className='flex justify-between'>
        <Button onClick={()=>router.back()}variant='outline'className='mt-6 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300'>Go back to Quiz Page</Button>
        <Button variant='outline' className='mt-6 cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300'>Mark as completed</Button>
        </div>
      </div>
    </MathJaxContext>
  )
}

export default ViewFillBlank