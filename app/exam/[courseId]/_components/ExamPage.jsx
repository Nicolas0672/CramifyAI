"use client"
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, Brain, Zap } from 'lucide-react'

function ExamPage({course}) {
    const[progress, setProgress] = useState(0)
   const containerVariants = {
     hidden: { opacity: 0 },
     visible: { 
       opacity: 1,
       transition: { 
         staggerChildren: 0.2
       }
     }
   };
 
   const itemVariants = {
     hidden: { y: 20, opacity: 0 },
     visible: { y: 0, opacity: 1 }
   };

   useEffect(()=>{
    if (course && course.questionCount) {
        console.log(course.questionCount)
        setProgress((course.questionCount + 1) * 20); // Update the progress when questionCount changes
      }
   },[course])
 
   return (
     <motion.div
       className='relative overflow-hidden p-3 border-0 shadow-lg rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 hover:shadow-xl transition-all duration-300'
       initial="hidden"
       animate="visible"
       variants={containerVariants}
       whileHover={{ scale: 1.01 }}
     >
       {/* Decorative elements */}
       <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -mr-20 -mt-20 blur-xl"></div>
       <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full -ml-16 -mb-16 blur-xl"></div>
       
       <div className='flex flex-col md:flex-row gap-6 items-center z-10 relative'>
         {/* Course Image */}
         <motion.div 
           className='relative w-28 h-28 flex-shrink-0'
           variants={itemVariants}
         >
           <div className="absolute inset-0 bg-gradient-to-br from-blue-300/50 to-purple-300/50 rounded-full blur-md"></div>
           <div className="absolute inset-2 bg-white rounded-full"></div>
           <Image
             src={'/exam_1.png'}
             alt='exam'
             fill
             className='object-contain p-4 z-10 relative'
           />
           <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-md">
             <Star className="w-3 h-3 text-white" />
           </div>
         </motion.div>
 
         {/* Course Details */}
         <div className='flex-1'>
           {/* Course Title */}
           <motion.div variants={itemVariants} className="mb-3">
             <h2 className='font-bold text-2xl bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent'>
               {course?.currQuestionAiResp?.courseTitle || "Interactive Quiz Session"}
             </h2>
           </motion.div>
 
           {/* Course Summary */}
           <motion.div variants={itemVariants} className="mb-5">
             <p className='text-gray-600 leading-relaxed'>
               {"This interactive exam dynamically adjusts questions based on your responses, ensuring a tailored experience that pinpoints your strengths and areas for improvement. At the end, you'll receive a detailed performance breakdown with key insights, study tips, and tricks to help you master the topic."}
             </p>
           </motion.div>
 
           {/* Progress Bar */}
           <motion.div variants={itemVariants} className='mb-6'>
             <div className="flex items-center justify-between mb-2">
               <span className="text-sm font-medium text-gray-600">Progress</span>
               <span className="text-sm font-medium text-indigo-600">{progress == 0 ? 20 : progress}%</span>
             </div>
             <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
               <div 
                 className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                 style={{ width: `${progress == 0 ? 20 : progress }%` }}
               ></div>
               <div className="absolute top-0 left-0 h-full w-full opacity-20">
                 <div className="w-full h-full bg-[radial-gradient(circle_at_2rem_0rem,rgba(255,255,255,0.8),transparent_40%)]"></div>
               </div>
             </div>
           </motion.div>
 
           {/* Stats Row */}
           <motion.div 
             variants={itemVariants} 
             className='grid grid-cols-1 md:grid-cols-2 gap-4'
           >
             <div className='flex items-center p-3 bg-white/70 rounded-xl shadow-sm'>
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mr-3 shadow-sm">
                 <BookOpen className='w-4 h-4 text-white' />
               </div>
               <div>
                 <p className="text-xs text-gray-500">Total Questions</p>
                 <p className="font-medium text-gray-900">{"5"}</p>
               </div>
             </div>
             
             <div className='flex items-center p-3 bg-white/70 rounded-xl shadow-sm'>
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-3 shadow-sm">
                 <Brain className='w-4 h-4 text-white' />
               </div>
               <div>
                 <p className="text-xs text-gray-500">Knowledge Level</p>
                 <p className="font-medium text-gray-900">Intermediate</p>
               </div>
             </div>
           </motion.div>
         </div>
       </div>
     </motion.div>
   );
 }


export default ExamPage