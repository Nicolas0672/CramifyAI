"use client"
import React, { useState } from 'react'
import SelectOption from './_components/SelectOption'
import { Button } from '@/components/ui/button'
import TopicInput from './_components/TopicInput'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Loader2Icon } from 'lucide-react'
import { drizzle } from 'drizzle-orm/neon-http'
import { STUDY_MATERIAL_TABLE } from '@/configs/schema'
import { db } from '@/configs/db'
import { useUser } from '@clerk/nextjs'
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-hot-toast";
import { useStudy } from '../StudyContext'
import axios from 'axios'
import { desc, eq } from 'drizzle-orm'

function Create() {

    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState([])
    const [pdfFile, setPdfFile] = useState(null)
    const [hasPdf, setHasPdf] = useState(false)
    const { selectedStudyType } = useStudy()

    const { user } = useUser()

    const [loading, setLoading] = useState(false)

    const handleUserInput = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue,
            studyType: selectedStudyType || prev.studyType
        }))
        console.log(formData)
    }
    const onFileChange = (file) => {
        setPdfFile(file)
        setHasPdf(file ? true : false)
    }

    const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl)

    const OnUpload = async () => {
        if (!formData.topic || !formData.difficultyLevel) {
            console.log('err')
            toast.error("Please fill in all required fields.");
            return; // Stop execution
        }
        if (!pdfFile && !formData.comment) {
            toast.error("Please provide either a PDF file or text.");
            return;
        }
        // const formDataToSend = new FormData()
        // formDataToSend.append("studyType", formData.studyType)
        // formDataToSend.append("topic", formData.topic)
        // formDataToSend.append("difficultyLevel", formData.difficult)
        // formDataToSend.append("comment", formData.comment)
        // formDataToSend.append('file', pdfFile)

        setLoading(true);


        if (hasPdf) {

            const postUrl = await generateUploadUrl();

            const fileData = new FormData()
            fileData.append("file", pdfFile)
            console.log(fileData)


            const result = await fetch(postUrl, {
                method: "POST",
                body: fileData,
            });
            const { storageId } = await result.json();

            const resp = await db.insert(STUDY_MATERIAL_TABLE).values({
                courseId: uuidv4(),
                courseType: formData.studyType,
                topic: formData.topic,
                difficultyLevel: formData.difficultyLevel,
                courseLayout: '',
                createdBy: user?.primaryEmailAddress?.emailAddress,
                storageId: storageId  // Save only if provided
            }).returning()

            if (resp) {
                GenerateCourseOutline()
                console.log('Insert successful w storageID', resp);
                // Optionally show a success message to the user
            } else {
                console.log('Insert failed from storageID');
                // Handle the failure case (e.g., show an error message)
            }

        }
        else {
            const resp = await db.insert(STUDY_MATERIAL_TABLE).values({
                courseId: uuidv4(),
                courseType: formData.studyType,
                topic: formData.topic,
                difficultyLevel: formData.difficultyLevel,
                courseLayout: formData.comment,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                storageId: null,  // Save only if provided
            })

            if (resp) {
                GenerateCourseOutline()
                console.log('Insert successful', resp);
                // Optionally show a success message to the user
            } else {
                console.log('Insert failed');
                // Handle the failure case (e.g., show an error message)
            }
        }
        setLoading(false)
    }

    const GenerateCourseOutline = async () => {
        try {
            // Fetch data from the database
            const resData = await db
                .select()
                .from(STUDY_MATERIAL_TABLE)
                .where(eq(STUDY_MATERIAL_TABLE.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(STUDY_MATERIAL_TABLE.id))
                .limit(1);
    
            const firstItem = resData[0];
    
            if (!hasPdf) {
                console.log("res is going thru");
    
                // Prepare the payload
                const payload = {
                    courseId: firstItem.courseId,
                    courseType: firstItem.courseType,
                    topic: firstItem.topic,
                    difficultyLevel: firstItem.difficultyLevel,
                    courseLayout: firstItem.courseLayout,
                    createdBy: firstItem.createdBy,
                };
                console.log("Request Payload:", payload);
    
                // Send the POST request
                const res = await axios.post('/api/generate-course-outline', payload);
                console.log("Response from API:", res.data);
            }
        } catch (error) {
            console.error("Error in GenerateCourseOutline:", error);
        }
    };




    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-5 md:px-24 lg:px-36 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
            {/* Form Container */}
            <div className="w-full max-w-3xl p-8 bg-white rounded-xl shadow-2xl border border-gray-100 transform transition-all hover:scale-105">
                {/* Header */}
                <h2 className="font-bold text-4xl  text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Let's get started on your journey
                </h2>
                <p className="mt-4 text-gray-600 text-lg text-center">
                    Fill in the details to create your study plan
                </p>

                {/* Topic Input - Takes Full Width */}
                <div className="w-full mt-8 space-y-6">
                    <TopicInput
                        handleUserInput={handleUserInput}
                        formData={formData}
                        setTopic={(value) => handleUserInput('topic', value)}
                        setDifficultyLevel={(value) => handleUserInput('difficultyLevel', value)}
                        setComment={(value) => handleUserInput('comment', value)}
                        onFileChange={onFileChange}
                    />
                </div>

                {/* Button Section */}
                <div className="flex justify-center mt-10">
                    <Button
                        onClick={OnUpload}
                        className="cursor-pointer w-full max-w-xs py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        {loading ? (
                            <Loader2Icon className="animate-spin h-6 w-6" />
                        ) : (
                            "Generate Study Plan"
                        )}
                    </Button>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                {/* Floating Circles */}
                <div className="absolute w-24 h-24 bg-blue-200 rounded-full opacity-20 -top-12 -left-12 animate-float"></div>
                <div className="absolute w-32 h-32 bg-purple-200 rounded-full opacity-20 -bottom-16 -right-16 animate-float animation-delay-2000"></div>
                <div className="absolute w-20 h-20 bg-pink-200 rounded-full opacity-20 top-1/4 left-1/4 animate-float animation-delay-4000"></div>
            </div>
        </div>
    );

}

export default Create