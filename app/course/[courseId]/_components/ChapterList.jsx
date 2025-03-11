import React from 'react';
import { motion } from 'framer-motion'; // For animations

function ChapterList({ course }) {
  const CHAPTERS = course?.aiResponse?.chapters;

  return (
    <div className='mt-6'>
      <h2 className='font-medium text-xl mt-4'>Chapters</h2>
      <div className='mt-3'>
        {CHAPTERS?.map((chapter, index) => (
          <motion.div
            key={index} // Add a key for React rendering
            className='flex gap-5 items-center p-4 border border-gray-200 shadow-md mb-2 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-300 '
            whileHover={{ scale: 1.02, boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }} // Hover animation
            whileTap={{ scale: 0.98 }} // Click animation
          >
            {/* Emoji */}
            <h2 className='text-2xl'>{chapter?.emoji}</h2>

            {/* Chapter Details */}
            <div>
              <h2 className='font-medium'>{chapter?.title}</h2>
              <p className='text-gray-500 text-sm'>{chapter?.summary}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ChapterList;