"use client";

import { SidebarContext } from '@/app/SidebarContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RefreshCcw, BookOpen, ClipboardList, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';

function CourseCardItem({ course, index, mode, loading }) {
  const { isSidebarExpanded } = useContext(SidebarContext);
 

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col h-full border border-gray-100">
      {/* Header Section with icon and date */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
        {mode === 'study' && <Image src={'/knowledge.png'} alt='other' width={50} height={50} />}
          {mode === 'practice' && <Image src={'/practice.png'} alt='other' width={50} height={50} />}
          {mode === 'exam' && <Image src={'/exam.png'} alt='other' width={50} height={50} />}

          <span className="text-xl font-medium text-gray-700">
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {course?.createdAt}
        </span>
      </div>
      
      {/* Title Section */}
      <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
        {course?.aiResponse?.courseTitle || course?.aiResponse?.quizTitle}
      </h3>
      
      {/* Dynamic Content Section */}
      
      
      {/* Footer Section with progress and button */}
      <div className="mt-auto">
      <div className="mb-2 mt-3 flex-grow">
        {mode === 'study' ? (
          <p className="text-sm text-gray-600 line-clamp-2">
            {course?.aiResponse?.courseSummary || "Learn and master new concepts"}
          </p>
        ) : (
          <div className="text-sm text-gray-600">
            {course?.aiResponse?.questions?.length || 0} Questions
          </div>
        )}
      </div>

        {course?.status === 'Generating' ? (
          <div className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-sm text-gray-600">Generating...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Progress value={course?.progress || 0} className="h-2 flex-grow" />
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {course?.progress || 0}%
              </span>
            </div>
            <Link
            href={
              mode === 'study'
                ? '/course/' + course?.studyMaterialId
                : '/quiz/' + course?.courseId
            }
          >

              <Button variant="outline" className="cursor-pointer w-full text-sm bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800">
                {mode === 'study' ? 'View' : 'Practice'}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseCardItem;