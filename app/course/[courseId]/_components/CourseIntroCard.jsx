import { Progress } from '@/components/ui/progress';
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion'; // For animations
import { PlayCircle, BookOpen } from 'lucide-react'; // Fun icons

function CourseIntroCard({ course }) {
  return (
    <motion.div
      className='flex gap-5 items-center p-10 border shadow-md rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-lg transition-shadow duration-300 '
      whileHover={{ scale: 1.02 }} // Subtle hover animation
      whileTap={{ scale: 0.98 }} // Click animation
    >
      {/* Course Image */}
      <div className='relative w-24 h-24'>
        <Image
          src={'/knowledge.png'}
          alt='course'
          fill
          className='object-contain'
        />
      </div>

      {/* Course Details */}
      <div className='flex-1'>
        {/* Course Title */}
        <h2 className='font-bold text-2xl text-gray-800 mb-2'>
          {course?.aiResponse?.courseTitle}
        </h2>

        {/* Course Summary */}
        <p className='text-gray-600 mb-4'>
          {course?.aiResponse?.courseSummary}
        </p>

        {/* Progress Bar */}
        <div className='mb-4'>
          <Progress
            className='h-2 bg-gray-200'
            value={50} // Replace with actual progress value
            indicatorColor='bg-gradient-to-r from-blue-500 to-purple-500' // Gradient progress bar
          />
          <p className='text-sm text-gray-500 mt-1'>50% Completed</p> {/* Replace with actual progress */}
        </div>

        {/* Chapters and Play Button */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <BookOpen className='w-5 h-5 text-blue-500' />
            <h2 className='text-lg text-blue-500'>
              Total Chapters: {course?.aiResponse?.chapters?.length}
            </h2>
          </div>

          
          
        </div>
      </div>
    </motion.div>
  );
}

export default CourseIntroCard;