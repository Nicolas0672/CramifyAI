import React from 'react';
import { motion } from 'framer-motion'; // For animations

function ChapterList({ course }) {
  const CHAPTERS = course?.aiResponse?.chapters;

  return (
    <div className='mt-6 w-full'>
      <h2 className='font-medium text-xl mt-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent'>Chapters</h2>
      <div className='mt-3'>
        {CHAPTERS?.map((chapter, index) => (
          <motion.div
            key={index}
            className='relative overflow-hidden flex gap-3 sm:gap-5 items-center p-3 sm:p-5 border-0 shadow-sm mb-3 rounded-xl bg-gradient-to-br from-white/90 to-blue-50/50 hover:shadow-md transition-all duration-300 w-full'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.01, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)' }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-100/20 to-transparent rounded-full -mr-10 -mt-10 blur-lg"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-100/20 to-transparent rounded-full -ml-8 -mb-8 blur-lg"></div>
            
            {/* Chapter Details with enhanced styling */}
            <div className="flex-1 z-10 w-full">
              <h2 className='font-medium text-base sm:text-lg bg-gradient-to-r bg-clip-text text-black'>{chapter?.title}</h2>
              <p className='text-gray-500 text-xs sm:text-sm'>{chapter?.summary}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;