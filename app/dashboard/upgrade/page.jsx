"use client"
import FloatingStudyElements from '@/app/FloatingStudyElemens';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ViewUpgrade = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user, isLoaded } = useUser();
  const [userDetails, setUserDetails] = useState()
  const [totalCredit, setTotalCredit]= useState()
  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(()=>{
    if (!isLoaded || !user) return
    user&&GetUserDetails()
  },[user, isLoaded])

  const GetUserDetails=async()=>{
    const result = await axios.post('/api/check-new-member',{
      createdBy: user?.primaryEmailAddress?.emailAddress
    })

    setUserDetails(result.data)
    if(result != null){
      let newFreeCredit = result.data.res?.newFreeCredits || 0
      let newPurchases = result.data.res?.newPurchasedCredit || 0
      const newTotal = newFreeCredit + newPurchases
    
      setTotalCredit(newTotal)
      console.log(newTotal)
  }
  }

  const OnCheckOutClick=async()=>{

    const res = await axios.post('/api/payment/checkout',{
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_20
    })
    console.log(res.data)
    window.open(res.data?.url)
  }

  return (
    <div className="bg-white min-h-screen overflow-hidden">
        <FloatingStudyElements/>
      {/* Header with subtle animation */}
      <div className="py-12 relative">
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Upgrade Your Learning Experience
            </h1>
            <p className="text-center text-gray-600 mt-3 text-xl">
              Unlock the full potential of your learning journey
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full filter blur-3xl"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-6 px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className={`transform transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
              <div className="absolute top-6 right-6 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                MY PLAN
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="p-8 relative z-10 h-full flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Free Version</h2>
                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  
                </div>
                
                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-gray-600 ml-3">10 free credits per month</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-gray-600 ml-3">Basic learning modes 
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-gray-600 ml-3">Limited teaching mode </p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-gray-600 ml-3">Generate up to 3 chapters per request</p>
                  </div>
                  
                </div>
                
                <button className="w-full py-3 bg-gray-200 text-gray-700 font-medium rounded-lg group-hover:bg-gray-300 transition-all duration-300 relative overflow-hidden mt-auto">
                  <span className="relative z-10">Owned</span>
                </button>
              </div>
            </div>
          </div>

          {/* Premium Plan - removed pulsing effect */}
          <div className={`transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl overflow-hidden shadow-xl border-2 border-blue-400 relative group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full">
              <div className="absolute -top-px -right-px -left-px h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-t-lg"></div>
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg">
                RECOMMENDED
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="p-8 relative z-10 h-full flex flex-col">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Premium Credits</h2>
                <p className="text-gray-600 mb-6">Unlock the full AI-powered learning experience</p>
                
                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-gray-600 ml-3">More credits, more powerful learning tools</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-gray-600 ml-3">Generate up to 5 chapters per request</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="rsound" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-gray-600 ml-3"> Custom quizzes (Create & edit your own quizzes)</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <p className="text-gray-600 ml-3"> Faster AI Response Times</p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-auto">
                  <button onClick={OnCheckOutClick}className="cursor-pointer w-full py-3.5 font-medium rounded-lg relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:scale-105"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center justify-center relative z-10 text-white">
                      <span>Purchase 20 Credits</span>
                      <span className="ml-2 font-bold">$6.99</span>
                    </div>
                  </button>
                  
                  {/* <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Coming Soon</span>
                    </div>
                  </div>
                  
                  <button className="w-full py-3.5 bg-gradient-to-r from-gray-100 to-gray-100 text-gray-400 font-medium rounded-lg cursor-not-allowed flex items-center justify-center relative overflow-hidden">
                    <div className="flex items-center justify-center">
                      <span>Purchase 50 Credits</span>
                      <span className="ml-2 font-bold">Coming Soon</span>
                    </div>
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Feature highlights with staggered animation */}
        <div className="mt-16">
          <h3 className={`text-2xl font-bold text-center text-gray-800 mb-10 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            Unlock Premium Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title:"More Learning Modes",
                description: "Explore advanced and AI-driven learning styles",
                delay: "700"
              },
              {
                title: "Custom Flashcards",
                description: "Create and edit your own flashcards anytime",
                delay: "800"
              },
              {
                title: "No Ads",
                description: "Enjoy an uninterrupted learning experience",
                delay: "900"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={`bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group transition-all duration-700 delay-${feature.delay} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 rounded-xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
     
    </div>
  );
};

export default ViewUpgrade;