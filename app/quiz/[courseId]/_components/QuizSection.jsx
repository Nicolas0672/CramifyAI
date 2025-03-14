import React, { useEffect, useState } from 'react'
import PracticeIntroCard from './PracticeIntroCard'
import axios from 'axios'
import PracticeContentCard from './PracticeContentCard'


function QuizSection({courseId, course}) {

    const [quizTypeContent, setQuizTypeContent] = useState()

    const MaterialList = [
        {
            name: 'Quiz',
            desc: 'Quiz Yourself',
            icon: '/qa.png',
            path: '/practice-quiz',
            type: 'quiz'
        },
        {
            name: 'Fill in the blank',
            desc: 'A great way to recall your memories',
            icon: '/quiz.png',
            path: '/fill-in-blank',
            type: 'Fill'
        }
        // {
        //     name: 'Flashcard',
        //     desc: 'Flashcard to help remember concepts',
        //     icon: '/flashcard.png',
        //     path: '/flashcards',
        //     type: 'flashcard'
        // }
    ]

    useEffect(()=>{
        GetQuizMaterial()
        
    },[])

    const GetQuizMaterial=async()=>{
        const res = await axios.post('/api/study-type',{
            courseId:courseId,
            studyType:'quizAll'
        })
        setQuizTypeContent(res.data)
        console.log(res.data)
       
        
    }

    return (
        <div className='mt-5'>
            
            <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
                {MaterialList.map((item, index) => (
                    
                <PracticeContentCard key = {index}item={item}
                quizTypeContent={quizTypeContent}
                practiceCourse={course}
                refreshData={GetQuizMaterial}
                />
                    
                    
                ))}
            </div>
            
        </div>
      )
}

export default QuizSection