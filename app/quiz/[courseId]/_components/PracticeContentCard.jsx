"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCcw, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';


function PracticeContentCard({quizTypeContent, item, refreshData, practiceCourse}) {
  const [loading, setLoading] = useState();
  const router = useRouter()
  const [userDetails, setUserDetails] = useState()
  const { user, isLoaded } = useUser();

  useEffect(()=>{
    if (!isLoaded || !user) return;
    GetUserDetails()
  },[user, isLoaded])

  const GetUserDetails=async()=>{
    const res = await axios.post('/api/check-new-member',{
      createdBy: user?.primaryEmailAddress?.emailAddress
    })
    setUserDetails(res.data.res)
  }

  

  const GenerateContent = async () => {
    setLoading(true);
    showSuccessToast('Generating Content');
    const result = await axios.post('/api/generate-fill-blank',{
      courseId: practiceCourse?.courseId,
      courseLayout: practiceCourse?.courseLayout,
      difficultyLevel: practiceCourse?.difficultyLevel,
      topic: practiceCourse?.topic
    })
    if(result){
      checkStatus(result.data.id)
    }
  }
  

  const checkStatus = async(recordId)=>{
    console.log('Check status')
    let attemps = 0;
    const maxAttempts = 20

    while(attemps < maxAttempts){
      const res = await axios.get(`/api/get-fill-status?id=${recordId}`)
     
      if(res.data && res.data?.status == 'Ready'){
        setLoading(false)
        await refreshData();
        showSuccessToast('Your content is ready to view');
        break;
      }
      await new Promise((res)=> setTimeout(res, 2000))
      attemps++
    }
    
    setLoading(false)
  }

   const showSuccessToast = (message) => {
      toast(
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-2 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <span>{message}</span>
        </div>,
        {
          style: {
            background: 'linear-gradient(to right, #f0fdf4, #dcfce7)',
            border: '1px solid #86efac',
            color: '#166534',
            borderRadius: '0.5rem',
          },
          duration: 3000,
        }
      );
    };
    
    const showErrorToast = (message) => {
      toast(
        <div className="flex items-center gap-2">
          <div className="bg-red-100 p-2 rounded-full">
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <span>{message}</span>
        </div>,
        {
          style: {
            background: 'linear-gradient(to right, #fef2f2, #fee2e2)',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            borderRadius: '0.5rem',
          },
          duration: 3000,
        }
      );
    };

  const isReady = quizTypeContent?.[item.type]?.status == 'Ready';

  return isReady ? (
    <Link href={'/quiz/' + practiceCourse?.courseId + item.path}>
      {CardContent()}
    </Link>
  ) : (
    CardContent()
  );
  
  function CardContent() {
    return (
      <motion.div
        className={`relative mt-3 border border-gray-200 shadow-lg p-4 sm:p-6 rounded-xl
          flex flex-col items-center backdrop-blur-sm w-full
          ${isReady ? 'bg-gradient-to-br from-white/80 to-blue-50/50' : 'bg-gradient-to-br from-white/80 to-purple-50/50'}
          hover:shadow-xl transition-all duration-300 h-full overflow-hidden`}
        whileHover={{ scale: 1.03, boxShadow: '0px 10px 25px rgba(0, 0, 0, 0.1)' }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background decoration */}
        <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br from-blue-100/40 to-purple-100/40 blur-md z-0"></div>
        <div className="absolute -left-6 -bottom-6 w-16 h-16 rounded-full bg-gradient-to-tl from-blue-100/40 to-purple-100/40 blur-md z-0"></div>
  
        {/* Content */}
        <div className="flex flex-col items-center z-10 w-full h-full">
          {/* Status Badge */}
          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            {isReady ? (
              <div className='flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-xs mb-4 shadow-sm'>
                <Sparkles className="w-3 h-3" />
                <span>Ready</span>
              </div>
            ) : (
              <div className='flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs mb-4 shadow-sm'>
                <Sparkles className="w-3 h-3" />
                <span>Generate</span>
              </div>
            )}
          </motion.div>
  
          {/* Icon */}
          <motion.div className='relative w-12 h-12 sm:w-16 sm:h-16 mb-4' initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 100 }}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-md"></div>
            <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center p-2">
              <Image src={item.icon} alt={item.name} fill className='object-contain p-3' />
            </div>
          </motion.div>
  
          {/* Name & Description */}
          <h2 className='font-semibold text-lg sm:text-xl bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2 text-center'>
            {item.name}
          </h2>
          <p className='text-gray-600 text-sm text-center mb-5 flex-1 max-w-full px-1 sm:px-0 sm:max-w-[90%]'>
            {item.desc}
          </p>
  
          {/* Button */}
          <motion.div className="w-full mt-auto" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            {isReady ? (
              <Button className="cursor-pointer w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 py-4 sm:py-5">
                <span>View</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                className="cursor-pointer w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 py-4 sm:py-5"
                onClick={(e) => {
                  e.preventDefault();
                  GenerateContent();
                }}
                disabled={loading}
              >
                {loading && <RefreshCcw className="w-4 h-4 animate-spin" />}
                <span>Generate</span>
                <ArrowRight className="w-4 h-4" />
                
              </Button>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  }
}

export default PracticeContentCard;