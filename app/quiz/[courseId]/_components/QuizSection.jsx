import React, { useEffect, useState } from 'react'

function QuizSection({courseId, practiceCourse}) {

    const [quizTypeContent, setQuizTypeContent] = useState()

    const MaterialList = [
        {
            name: 'Quiz',
            desc: 'Quiz Yourself',
            icon: '/quiz.png',
            path: '/quiz',
            type: 'quiz'
        },
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
            studyType:'quiz'
        })
        setQuizTypeContent(res)
    }

    return (
        <div className='mt-5'>
            
            <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
                {/* {MaterialList.map((item, index) => (
                    
                    <MaterialCardItem item={item}
                    studyTypeContent={studyTypeContent}
                    course={course}
                    refreshData={GetStudyMaterial}
                    />
                    
                    
                ))} */}
            </div>
            
        </div>
      )
}

export default QuizSection