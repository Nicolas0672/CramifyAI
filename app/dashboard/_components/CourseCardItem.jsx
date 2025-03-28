"use client";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Loader2Icon, Trash } from "lucide-react";
import { SidebarContext } from '@/app/SidebarContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RefreshCcw, BookOpen, ClipboardList, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useState } from 'react';
import axios from "axios";
import toast from "react-hot-toast";

function CourseCardItem({ course, index, mode, status, setCourses }) {
  const { isSidebarExpanded } = useContext(SidebarContext);
  const [loading, setLoading] = useState(false)
  const DeleteCourseContent = async () => {
    setCourses((prevCourse) => prevCourse.filter((c) => c.courseId !== course?.courseId))
    console.log(course?.courseId + mode)
    toast('Course has been deleted')
    const res = await axios.delete('/api/delete-content', {
      data: { // Pass data in the 'data' property
        courseId: course?.courseId,
        type: mode
      }

    })
    console.log(res)



  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col h-full border border-gray-100">
      {/* Header Section with icon and date */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          {mode === 'study' && <Image src={'/knowledge.png'} alt='study icon' width={40} height={40} className="w-10 h-10 sm:w-12 sm:h-12" />}
          {mode === 'practice' && <Image src={'/practice.png'} alt='practice icon' width={40} height={40} className="w-10 h-10 sm:w-12 sm:h-12" />}
          {mode === 'exam' && <Image src={'/exam_1.png'} alt='exam icon' width={40} height={40} className="w-10 h-10 sm:w-12 sm:h-12" />}
          {mode === 'teach Me' && <Image src={'/interview.png'} alt='teach me' width={40} height={40} className="w-10 h-10 sm:w-12 sm:h-12" />}
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-semibold text-gray-800">
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </span>
            <span className="text-xs text-gray-500">
              {course?.createdAt}
            </span>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-md hover:bg-red-50">
              <Trash className="w-5 h-5 stroke-current" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>Are you sure?</AlertDialogHeader>
            <p>This action cannot be undone.</p>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={DeleteCourseContent}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Yes, Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Rest of the existing component remains the same */}
      <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800 line-clamp-2 min-h-[2.5rem]">
        {course?.aiResponse?.courseTitle || course?.aiResponse?.quizTitle || course?.currQuestionAiResp?.courseTitle || course?.topics?.courseTitle}
      </h3>

      <div className="mt-auto">
        <div className="mb-2 mt-3 flex-grow min-h-[2.5rem]">
          {mode === "study" ? (
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
              {course?.aiResponse?.courseSummary || "Learn and master new concepts"}
            </p>
          ) : mode === "practice" ? (
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
              {course?.aiResponse?.learningObjectives || "Learn and master new concepts"}
            </p>
          ) : mode === 'exam' ? (
            <div>
              <div className="text-xs sm:text-sm text-gray-600 flex justify-between">
                <span>{course?.aiResponse?.questions?.length || 5} Questions</span>
                {mode === "exam" && (
                  <div className="flex items-end text-xs sm:text-sm text-gray-600">
                    {course?.exam_time + " Minutes"}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
              {course?.question?.courseSummary || "In this mode, you will be tasked to teach a topic towards an AI agent and your goal is to break down ideas into easy understanding points"}
            </p>
          )}
        </div>

        {course?.status === 'Generating' ? (
          <div className="flex items-center gap-2">
            <RefreshCcw className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-blue-500" />
            <span className="text-xs sm:text-sm text-gray-600">Generating...</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              {mode == 'exam' && <Progress value={course?.questionCount * 20 || 0} className="h-1.5 sm:h-2 flex-grow" />}
              {mode == 'study' && <Progress value={course?.progress || 0} className="h-1.5 sm:h-2 flex-grow" />}
              {mode == 'practice' && <Progress value={course?.progress || 0} className="h-1.5 sm:h-2 flex-grow" />}
              {mode == 'teach Me' && <Progress value={course?.progress || 0} className="h-1.5 sm:h-2 flex-grow" />}
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {mode == 'exam' ? course?.questionCount * 20 : mode == 'study' ? course.progress : course.progress}%
              </span>
            </div>
            <Link
              href={
                mode === 'study'
                  ? '/course/' + course?.courseId
                  : mode === 'practice'
                    ? '/quiz/' + course?.courseId
                    : mode === 'teach Me' && course?.progress < 100
                      ? '/teach-me/' + course?.courseId
                      : mode === 'teach Me' && course?.progress == 100
                        ? '/teach-me/' + course?.courseId + '/feedback'
                        : mode == 'exam' && course?.questionCount < 5
                          ? '/exam/' + course?.courseId
                          : '/exam/' + course?.courseId + '/feedback'
              }
              className="block w-full"
            >
              <Button
                onClick={() => setLoading(true)}
                disabled={loading}
                variant="outline"
                className="cursor-pointer w-full text-xs sm:text-sm bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800 py-1.5 sm:py-2 px-2 sm:px-3 h-auto min-h-[2rem]"
              >
                {loading ? (
                  <Loader2Icon className="animate-spin h-6 w-6" />
                ) : (
                  mode === 'study' ? 'View' :
                    mode === 'practice' ? 'Practice' :
                      mode === 'teach Me' && course?.progress < 100 ? 'Teach Me' :
                        mode === 'teach Me' && course?.progress === 100 ? 'View Feedback' :
                          mode === 'exam' && course?.questionCount >= 5 ? 'View Exam' :
                            'Take Exam'
                )}


              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseCardItem;