"use client"
import React, { useState } from 'react'
import SelectOption from './_components/SelectOption'
import { Button } from '@/components/ui/button'
import TopicInput from './_components/TopicInput'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader2Icon } from 'lucide-react'

function Create() {

    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState([])
    const [pdfFile, setPdfFile] = useState(null)

    const [loading, setLoading] = useState(false)

    const handleUserInput=(fieldName, fieldValue) =>{
        setFormData(prev=>({
            ...prev,
            [fieldName] : fieldValue
        }))

        console.log(formData)
    }

    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl)

    const handleFileUpload = (file) => {
        setPdfFile(file)
    }

    const OnUpload=async () =>{
        setLoading(true);
        const postUrl = await generateUploadUrl();

        // const formDataToSend = new FormData()
        // formDataToSend.append("studyType", formData.studyType)
        // formDataToSend.append("topic", formData.topic)
        // formDataToSend.append("difficultyLevel", formData.difficult)
        // formDataToSend.append("comment", formData.comment)
        // formDataToSend.append('file', pdfFile)

        const fileData = new FormData()
        fileData.append("file", pdfFile)

        const result = await fetch(postUrl, {
            method: "POST",
            body: fileData,
          });
          const { storageId } = await result.json();
          console.log("storageId", storageId)
          setLoading(false)
    }


    

  return (
    <div className=' mt-20 flex flex-col items-center p-5 md:px-24 lg:px-36'>

        <h2 className='font-bold text-4xl text-primary'>Let's get started on your journey</h2>
        <p className='mt-5 text-gray-500 text-lg'>Fill all details</p>

        <div className='mt-10'>
            {step==0?<SelectOption selectedStudyType={(value) => handleUserInput('studyType', value)}/>:
                <TopicInput 
                handleUserInput={handleUserInput}
                formData={formData}
                setTopic={(value) => handleUserInput('topic', value)}
                setDifficultyLevel={(value) => handleUserInput('difficultyLevel', value)}
                setComment={(value) => handleUserInput('comment', value)}
                setPdfFile={handleFileUpload}
                />}
        </div>
        <div className='flex justify-between w-full mt-32'>
        {step != 0 ? <Button variant='outline' onClick={() => setStep(step - 1)}>Previous</Button> : '`'}
        {step==0?<Button onClick={() => setStep(step + 1)}>Next</Button>:<Button onClick={OnUpload}> 
            {loading?
            <Loader2Icon className='animate-spin'/> : "Generate"
        }</Button>}
    </div>
        
    </div>
  )
}

export default Create