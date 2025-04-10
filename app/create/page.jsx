"use client"
import React, { useEffect, useState } from 'react'
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
import { useRouter } from 'next/navigation'


function Create() {

    const [step, setStep] = useState(0)
    const [formData, setFormData] = useState([])
    const [pdfFile, setPdfFile] = useState(null)
    const [hasPdf, setHasPdf] = useState(false)
    const { selectedStudyType } = useStudy()
    const router = useRouter()
    const [data, setData] = useState({})
    const AddFileEntry = useMutation(api.fileStorage.AddFileEntryToDb)
    const GetFileUrl=useMutation(api.fileStorage.getFileUrl)
    const [fileName, setFileName] = useState()
    const[userDetails, setUserDetails] = useState()


    const { user } = useUser()

    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        user&&GetUserDetails()
    },[user])

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

    const GetUserDetails=async()=>{
        const res = await axios.post('/api/check-new-member',{
            createdBy: user?.primaryEmailAddress?.emailAddress
        })
        setUserDetails(res.data.res)
        console.log(res.data.res)
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
        setLoading(true);

        // if (hasPdf) {

        //     const postUrl = await generateUploadUrl();

        //     const fileData = new FormData()
        //     fileData.append("file", pdfFile)
           
        //     console.log("Upload URL:", postUrl);

        //     const result = await fetch(postUrl, {
        //         method: "POST",
        //         headers:{"Content-Type": pdfFile?.type},
        //         body: pdfFile,
        //     });
        //     const { storageId } = await result.json();
        //     const fileUrl = await GetFileUrl({storageId: storageId})

        //     // Maybe considering using this fileId as courseId
        //     const fileId= uuidv4()
        //     const res = await AddFileEntry({
        //         fileId: fileId,
        //         storageId: storageId,
        //         fileName: fileName??'Untitled File',
        //         fileUrl: fileUrl,
        //         createdBy:  user?.primaryEmailAddress?.emailAddress
        //     })

        //     console.log(res)

        //     const resp = await db.insert(STUDY_MATERIAL_TABLE).values({
        //         courseId: uuidv4(),
        //         courseType: formData.studyType,
        //         topic: formData.topic,
        //         difficultyLevel: formData.difficultyLevel,
        //         courseLayout: '',
        //         createdBy: user?.primaryEmailAddress?.emailAddress,
        //         storageId: storageId  // Save only if provided
        //     }).returning()

        //     console.log('storageId',storageId)

            // if (resp) {
            //     GenerateCourseOutline()
            //     console.log('Insert successful w storageID', resp);
            //     // Optionally show a success message to the user
            // } else {
            //     console.log('Insert failed from storageID');
            //     // Handle the failure case (e.g., show an error message)
            // }

        // }
        // else {
            // MAKE AN API TO INSERT DATA
            if(userDetails?.remainingCredits - 1 < 0){
                toast('You do not have enough credits!')
            } else {
                const resp = await axios.post('/api/insert-new-study',{
                    courseType: formData.studyType,
                    topic: formData.topic,
                    difficultyLevel: formData.difficultyLevel,
                    courseLayout: formData.comment,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                })
                const res = resp.data
                setData(res)      
            }
            
    }
    useEffect(()=>{
        console.log(data)
        console.log(data?.courseType)
        GenerateCourseOutline()
    },[data])

    const GenerateCourseOutline = async () => {
        setLoading(true);
        try {

            if(data?.courseType == 'Study'){
               
                    console.log("res is going thru");
        
                    // Prepare the payload
                    const payload = {
                        courseId: data?.courseId,
                        courseType: data?.courseType,
                        topic: data?.topic,
                        difficultyLevel: data?.difficultyLevel,
                        courseLayout: data?.courseLayout,
                        createdBy: data?.createdBy,
                    };
                    console.log("Request Payload:", payload);
        
                    // Send the POST request
                    const res = await axios.post('/api/generate-course-outline', payload);
                    console.log("Response from API:", res.data);
                    toast("Your course content is generating...")
                    router.replace('/dashboard')
                
            }
            else if(data?.courseType == 'Practice'){
                const practicePayload = {
                    courseId: data?.courseId,
                    courseType: data?.courseType,
                    topic: data?.topic,
                    difficultyLevel: data?.difficultyLevel,
                    createdBy: data?.createdBy,
                    courseLayout: data?.courseLayout
                };
        
                const res = await axios.post('/api/generate-practice-questions', practicePayload);
                console.log("Response from API:", res.data);
                toast("Your practice questions are generating...");
                router.replace('/dashboard')
            }
            else if(data?.courseType == 'Exam'){
                const examPayload = {
                    courseId: data?.courseId,
                    courseLayout: data?.courseLayout,
                    topic: data?.topic,
                    difficultyLevel: data?.difficultyLevel,
                    createdBy: data?.createdBy,
                    exam_time: 30
                }
                const res = await axios.post('/api/generate-exam',examPayload)
                console.log("Response from API:", res.data);
                toast("Your exam is generating...");
                router.replace('/dashboard')
            }
    
           
        } catch (error) {
            console.error("Error in GenerateCourseOutline:", error);
        }
        setLoading(false)
       
    };




    return (
        <>
        <div className="min-h-screen flex flex-col items-center justify-center  md:px-24 lg:px-36 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
            {/* Form Container */}
            <div className="w-full max-w-3xl p-8 bg-white rounded-xl shadow-2xl border border-gray-100 transform transition-all hover:scale-105">
                {/* Header */}
                <h2 className="font-bold text-4xl  text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Let's get started on your journey
                </h2>
                <p className="mt-4 text-gray-600 text-lg text-center">
                    Fill in the details to create your plan
                </p>

                {/* Topic Input - Takes Full Width */}
                <div className="w-full mt-8 space-y-6">
                    <TopicInput
                        setFileName={setFileName}
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
                        disabled={loading}
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
         <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
         {/* Books */}
         <div className="absolute top-[8%] right-[15%] w-16 h-20 bg-blue-900 shadow-md rounded opacity-10 animate-float-slow transform rotate-12">
           <div className="absolute inset-y-0 right-0 w-1 bg-blue-800"></div>
           <div className="absolute inset-1 bg-blue-100 border-t border-gray-300"></div>
         </div>
         <div className="absolute top-[60%] left-[8%] w-14 h-18 bg-red-800 shadow-md rounded opacity-8 animate-float transform -rotate-6">
           <div className="absolute inset-y-0 right-0 w-1 bg-red-900"></div>
           <div className="absolute inset-1 bg-red-50 border-t border-gray-300"></div>
         </div>
         <div className="absolute bottom-[30%] left-[22%] w-16 h-20 bg-green-800 shadow-md rounded opacity-10 animate-float-medium transform rotate-3">
           <div className="absolute inset-y-0 right-0 w-1 bg-green-900"></div>
           <div className="absolute inset-1 bg-green-50 border-t border-gray-300"></div>
         </div>
         
         {/* Pencils */}
         <div className="absolute top-[35%] left-[20%] w-2 h-24 bg-amber-700 opacity-12 animate-float-medium transform -rotate-45">
           <div className="absolute top-0 w-2 h-3 bg-pink-300"></div>
           <div className="absolute bottom-0 w-2 h-5 bg-zinc-300"></div>
         </div>
         <div className="absolute bottom-[15%] right-[25%] w-1 h-20 bg-amber-800 opacity-10 animate-float-slow transform rotate-30">
           <div className="absolute top-0 w-1 h-2 bg-red-300"></div>
           <div className="absolute bottom-0 w-1 h-3 bg-zinc-400"></div>
         </div>
         
         {/* Notebooks */}
         <div className="absolute bottom-[25%] right-[10%] w-20 h-24 bg-slate-100 shadow-md rounded opacity-12 animate-float">
           <div className="absolute left-0 top-0 bottom-0 w-2 bg-sky-600"></div>
           <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-300"></div>
           <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-300"></div>
           <div className="absolute left-9 top-2 bottom-2 w-0.5 bg-slate-300"></div>
         </div>
         
         {/* Calculator */}
         <div className="absolute top-[70%] right-[30%] w-16 h-20 bg-gray-700 rounded opacity-10 animate-float-medium">
           <div className="absolute inset-1 bg-gray-200 rounded grid grid-cols-4 gap-0.5 p-1">
             {[...Array(12)].map((_, i) => (
               <div key={i} className="bg-gray-400 rounded-sm"></div>
             ))}
           </div>
         </div>
         
         {/* Coffee cup */}
         <div className="absolute top-[40%] right-[15%] opacity-10 animate-float-slow">
           <div className="w-10 h-12 bg-stone-400 rounded-b-lg"></div>
           <div className="absolute top-1 left-1 right-1 h-2 bg-stone-300 rounded-t-sm"></div>
           <div className="absolute -right-3 top-2 w-3 h-6 border-2 border-stone-400 rounded-r-lg"></div>
         </div>
         
         {/* Formulas */}
         <div className="absolute top-[20%] right-[40%] text-4xl opacity-8 animate-float-medium font-serif">E=mc²</div>
         <div className="absolute bottom-[40%] left-[35%] text-3xl opacity-6 animate-float-slow font-serif">a²+b²=c²</div>
         <div className="absolute top-[50%] left-[55%] text-2xl opacity-7 animate-float font-serif">F=ma</div>
         
         {/* Graduation cap */}
         <div className="absolute top-[15%] left-[40%] w-20 h-10 bg-black opacity-10 animate-float-medium">
           <div className="absolute -top-5 left-2 right-2 h-5 bg-black rounded-t-lg"></div>
           <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-black rounded-full"></div>
           <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 w-10 h-1 bg-yellow-600"></div>
         </div>
         
         {/* Highlighter */}
         <div className="absolute top-[65%] right-[45%] w-4 h-14 bg-yellow-400 opacity-10 animate-float transform rotate-12">
           <div className="absolute top-0 left-0 right-0 h-3 bg-yellow-500 rounded-t-sm"></div>
         </div>
         
         {/* Light particles */}
         <div className="absolute h-3 w-3 rounded-full bg-blue-300 opacity-15 top-1/4 left-1/3 animate-pulse"></div>
         <div className="absolute h-4 w-4 rounded-full bg-indigo-300 opacity-10 top-2/3 left-1/4 animate-pulse-slow"></div>
         <div className="absolute h-2 w-2 rounded-full bg-purple-300 opacity-12 top-1/2 right-1/4 animate-pulse-medium"></div>
         <div className="absolute h-3 w-3 rounded-full bg-green-300 opacity-10 bottom-1/4 right-1/3 animate-pulse"></div>
         <div className="absolute h-2 w-2 rounded-full bg-yellow-300 opacity-8 bottom-1/3 left-2/3 animate-pulse-slow"></div>
       </div>
       </>
    );

}

export default Create