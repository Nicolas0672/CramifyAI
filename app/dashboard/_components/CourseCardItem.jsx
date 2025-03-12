"use client";

import { SidebarContext } from '@/app/SidebarContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';

function CourseCardItem({ course, index, mode, loading }) {
  const { isSidebarExpanded } = useContext(SidebarContext);

  return (
    <div
      className={`border rounded-lg shadow-md p-5 w-full min-h-[200px] flex flex-col justify-between 
        ${isSidebarExpanded ? 'ml-0' : 'ml-0'}`}
    >
      {/* Header Section */}
      <div>
        <div className='flex justify-between items-center'>
          {mode === 'study' && <Image src={'/knowledge.png'} alt='other' width={50} height={50} />}
          {mode === 'practice' && <Image src={'/practice.png'} alt='other' width={50} height={50} />}
          {mode === 'exam' && <Image src={'/exam.png'} alt='other' width={50} height={50} />}
          <h2 className='text-[10px] p-1 px-2 rounded-full bg-blue-500 text-white whitespace-nowrap'>
            {course?.createdAt}
          </h2>
        </div>
      </div>

      {/* Title Section */}
      <h2 className='text-lg mt-3 font-medium break-words'>
        {course?.aiResponse?.courseTitle || course?.aiResponse?.quizTitle}
      </h2>

      {/* Dynamic Content Section */}
      <div className='mt-3 flex-shrink-0'>
        {mode === 'study' ? (
          <Progress value={0} />
        ) : (
          <div className='text-sm text-gray-500'>
            {course?.aiResponse?.questions?.length || 0} Questions
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className='mt-3 flex justify-end'>
        {course?.status === 'Generating' ? (
          <div className='flex items-center gap-2 bg-gray-500 text-white text-sm p-1 px-2 rounded-full whitespace-nowrap'>
            <RefreshCcw className='h-4 w-4 animate-spin' />
            <span>Generating...</span>
          </div>
        ) : (
          <Link
            href={
              mode === 'study'
                ? '/course/' + course?.studyMaterialId
                : '/quiz/' + course?.courseId
            }
          >
            <Button
              className='bg-blue-500 w-24 cursor-pointer hover:bg-blue-400'
              disabled={loading || course?.status === 'Generating'} // Prevent clicks while loading
            >
              {mode === 'study' ? 'View' : 'Practice'}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default CourseCardItem;
