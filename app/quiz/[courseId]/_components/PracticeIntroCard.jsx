import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, Brain, Zap } from 'lucide-react';
import {  useLearningMode } from '@/app/LearningModeContext';
import LearningProgressStepper from '@/app/LearningProgressStepper';
import { useCourse } from '@/app/CourseIdProvider';

function PracticeIntroCard({course}) {
  const {currentModes, setMode} = useLearningMode()
  const{setCourse} = useCourse()
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };

  useEffect(()=>{
    setMode('practice')
    setCourse(course)
  },[course])

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className='relative overflow-hidden p-4 sm:p-8 border-0 shadow-lg rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 hover:shadow-xl transition-all duration-300 w-full'
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      whileHover={{ scale: 1.01 }}
    >
      <LearningProgressStepper currentMode={currentModes} />
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -mr-20 -mt-20 blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full -ml-16 -mb-16 blur-xl"></div>
      
      <div className='flex flex-col md:flex-row gap-4 sm:gap-6 items-center z-10 relative'>
        {/* Course Image */}
        <motion.div 
          className='relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0'
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300/50 to-purple-300/50 rounded-full blur-md"></div>
          <div className="absolute inset-2 bg-white rounded-full"></div>
          <Image
            src={'/practice.png'}
            alt='course'
            fill
            className='object-contain p-4 z-10 relative'
          />
          <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-md">
            <Star className="w-3 h-3 text-white" />
          </div>
        </motion.div>
      
        {/* Course Details */}
        <div className='flex-1 w-full'>
        
          {/* Course Title */}
          <motion.div variants={itemVariants} className="mb-2 sm:mb-3">
            <h2 className='font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent'>
              {course?.aiResponse?.quizTitle || "Interactive Course Session"}
            </h2>
          </motion.div>
         
          {/* Course Summary */}
          <motion.div variants={itemVariants} className="mb-3 sm:mb-5">
            <p className='text-gray-600 leading-relaxed'>
              {course?.aiResponse?.learningObjectives || "Enhance your knowledge with these comprehensive course materials designed to build your understanding."}
            </p>
          </motion.div>
  
          {/* Progress Bar */}
          <motion.div variants={itemVariants} className='mb-4 sm:mb-6'>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm font-medium text-indigo-600">{course?.progress || 0}%</span>
            </div>
            <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                style={{ width: `${course?.progress}%` }}
              ></div>
              <div className="absolute top-0 left-0 h-full w-full opacity-20">
                <div className="w-full h-full bg-[radial-gradient(circle_at_2rem_0rem,rgba(255,255,255,0.8),transparent_40%)]"></div>
              </div>
            </div>
          </motion.div>
  
          {/* Stats Row */}
          <motion.div 
            variants={itemVariants} 
            className='grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 w-full'
          >
            <div className='flex items-center p-2 sm:p-3 bg-white/70 rounded-xl shadow-sm'>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mr-3 shadow-sm">
                <BookOpen className='w-4 h-4 text-white' />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Questions</p>
                <p className="font-medium text-gray-900">{course?.aiResponse?.questions?.length || "12"}</p>
              </div>
            </div>
            
            <div className='flex items-center p-2 sm:p-3 bg-white/70 rounded-xl shadow-sm'>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-3 shadow-sm">
                <Brain className='w-4 h-4 text-white' />
              </div>
              <div>
                <p className="text-xs text-gray-500">Knowledge Level</p>
                <p className="font-medium text-gray-900">{course?.progress <= 50 ?'Intermediate':'Expert'}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default PracticeIntroCard;