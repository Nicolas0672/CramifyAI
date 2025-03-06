"use client"
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

function WelcomeBanner() {
    const {user, isLoaded} = useUser()
    
  return (
    <div className='flex items-center gap-6 p-5 bg-gray-600 w-full text-white rounded-lg'>
        <Image src={'/laptop.png'} alt='laptop' width={100} height={100}/>
        <div>
            <h2 className='font-bold text-3xl'>Hello, {user?.fullName}</h2>
            <p>Welcome Back, it is time to lock in</p>
        </div>
    </div>
    
  )
  
}

export default WelcomeBanner