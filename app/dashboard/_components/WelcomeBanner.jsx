"use client"

import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function WelcomeBanner() {
    const { user, isLoaded } = useUser()
    
    return (
        <div className='relative flex justify-start gap-6 p-6 bg-gradient-to-r from-slate-800 to-slate-700 w-full text-white rounded-lg overflow-hidden shadow-lg border border-slate-600'>
            {/* Abstract circuit pattern overlay */}
            <div className='absolute inset-0 opacity-10'>
                <div className='absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl'></div>
                <div className='absolute bottom-0 left-0 w-32 h-32 bg-purple-400 rounded-full blur-3xl'></div>
            </div>
            
            {/* AI-themed image */}
            <div className='relative z-10 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 p-3 rounded-lg'>
                <Image 
                    src={'/laptop.png'} 
                    alt='laptop' 
                    width={100} 
                    height={100}
                    className='drop-shadow-lg'
                />
            </div>
            
            {/* Welcome text */}
            <div className='relative z-10 flex flex-col justify-center'>
                <h2 className='font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200'>
                    Hello, {user?.fullName || 'Student'}
                </h2>
                <p className='text-slate-200 mt-1'>Welcome back, it's time to enhance your learning</p>
                
                {/* Subtle indicator of AI activity */}
                <div className='flex items-center mt-2'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse'></div>
                    <span className='text-xs text-slate-300'>AI assistant ready</span>
                </div>
            </div>
        </div>
    )
}

export default WelcomeBanner