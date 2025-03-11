import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react';
import { motion } from 'framer-motion'; // For animations
import { ArrowRight, RefreshCcw } from 'lucide-react'; // Modern icon
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';


function MaterialCardItem({ item, studyTypeContent, course, refreshData }) {
  const [loading, setLoading] = useState(false);

  const GenerateContent = async () => {
    toast('Generating content');
    setLoading(true);
    let CHAPTERS = '';
    course?.aiResponse.chapters.forEach((chapter) => {
      CHAPTERS = (chapter.title || chapter?.courseTitle) + ',' + CHAPTERS;
    });
    const result = await axios.post('/api/generate-content', {
      courseId: course?.studyMaterialId,
      type: item.name,
      chapters: CHAPTERS
    });
    console.log('generating flashcards', result);
    setLoading(false);
    refreshData(true);
    toast('Your content is ready to view');
  };

  return (
    <Link href={'/course/' + course?.studyMaterialId + item.path}>
      <motion.div
        className={`mt-3 border border-gray-200 shadow-lg p-5 rounded-lg flex flex-col items-center backdrop-blur-sm bg-white/30 hover:bg-white/50 transition-all duration-300 h-full
        ${studyTypeContent?.[item.type]?.length > 0 ? '' : 'grayscale'}`}
        whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }} // Hover animation
        whileTap={{ scale: 0.95 }} // Click animation
      >
        {/* Status Badge */}
        {studyTypeContent?.[item.type]?.length > 0 ? (
          <h2 className='p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2'>
            Ready
          </h2>
        ) : (
          <h2 className='p-1 px-2 bg-green-500 text-white rounded-full text-[10px] mb-2'>
            Generate
          </h2>
        )}

        {/* Icon */}
        <div className='relative w-12 h-12 mb-3'>
          <Image src={item.icon} alt={item.name} fill className='object-contain' />
        </div>

        {/* Name and Description */}
        <h2 className='font-medium text-lg text-gray-800 mb-1'>{item.name}</h2>
        <p className='text-gray-500 text-sm text-center mb-4 flex-1'>{item.desc}</p> {/* flex-1 makes this section grow */}

        {/* Button (stays at the bottom) */}
        <motion.div className='w-full' whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {studyTypeContent?.[item.type]?.length > 0 ? (
            <Button className='cursor-pointer w-full flex items-center gap-2' variant='outline'>
              <span>View</span>
              <ArrowRight className='w-4 h-4' /> {/* Modern icon */}
            </Button>
          ) : (
            <Button
              className='cursor-pointer w-full flex items-center gap-2'
              variant='outline'
              onClick={() => GenerateContent()}
            >
              {loading && <RefreshCcw className='animate-spin' />}
              <span>Generate</span>
              <ArrowRight className='w-4 h-4' /> {/* Modern icon */}
            </Button>
          )}
        </motion.div>
      </motion.div>
    </Link>
  );
}

export default MaterialCardItem;
