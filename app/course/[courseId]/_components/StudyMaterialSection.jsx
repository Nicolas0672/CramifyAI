import React, { useEffect, useState } from 'react'
import MaterialCardItem from './MaterialCardItem'
import axios from 'axios'
import Link from 'next/link'

function StudyMaterialSection({courseId, course}) {

    const [studyTypeContent, setStudyTypeConent] = useState()

    const MaterialList= [
        {
            name:'Notes',
            desc:'Read Notes to Prepare',
            icon:'/notes.png',
            path:'/notes',
            type:'notes'
        },
        {
            name:'Flashcard',
            desc:'Flashcard to help remember concepts',
            icon:'/flashcard.png',
            path:'/flashcards',
            type:'flashcard'
        }
    ]

    useEffect(() =>{
        GetStudyMaterial()
    },[])
    const GetStudyMaterial=async()=> {
        const result = await axios.post('/api/study-type',{
            courseId:courseId,
            studyType:'ALL'
        })
        setStudyTypeConent(result.data)
    }

  return (
    <div className='mt-5'>
        <h2 className='font-medium text-2xl'>Study Material</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
            {MaterialList.map((item, index) => (
                
                <MaterialCardItem item={item}
                studyTypeContent={studyTypeContent}
                course={course}
                refreshData={GetStudyMaterial}
                />
                
                
            ))}
        </div>
    </div>
  )
}

export default StudyMaterialSection