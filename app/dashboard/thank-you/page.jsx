"use client"

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

function ViewThankYou() {
  const router = useRouter();
  
  useEffect(() => {
    // Single confetti burst
    const shootConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5252', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#3F51B5'],
        disableForReducedMotion: true
      });
    };
    
    // Shoot confetti once when component mounts
    shootConfetti();
    
    // Prevent scrolling
    document.body.style.overflow = 'hidden';
    
    // Clean up function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  const handleContinue = () => {
    router.push('/dashboard');
  };
  
  const handleSupportEmail = () => {
    window.location.href = 'mailto:support@cramify.ai';
  };
  
  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            Woohoo!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 mb-6 text-lg"
          >
            Your purchase was successful! 🎉
          </motion.p>
          
          <div className="flex flex-col gap-4">
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="cursor-pointer w-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 text-white font-medium py-3 px-6 rounded-full transition duration-300"
            >
              Continue to Dashboard →
            </motion.button>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-sm text-gray-500 mt-4"
            >
              Your new credits are ready to use!
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600"
            >
              Don't see your credits? Please{' '}
              <button 
                onClick={handleSupportEmail}
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                contact support
              </button>{' '}
              at cramsmart.help@gmail.com
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ViewThankYou;