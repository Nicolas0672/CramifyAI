import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image'
import React from 'react'


function AgentLayout({userName}) {
  const isSpeaking = true;
  const CallStatus = {
    INACTIVE: "INACTIVE",
    CONNECTING: "CONNECTING",
    ACTIVE: "ACTIVE",
    FINISHED: "FINISHED",
  };

  const callStatus = CallStatus.INACTIVE
  const messages = [
    'Whats your name',
    "My name is Doe"
  ]

  const lastMessages = messages[messages.length - 1]
  
  return (
    <>
    <div className=''>
      {/* Subtle ambient background elements for the whole screen */}
      <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50'></div>
        <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl opacity-10'></div>
        <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-300 rounded-full filter blur-3xl opacity-10'></div>
      </div>

      <div className='call-view bg-purple-50 backdrop-blur-sm p-10 rounded-xl shadow-md w-full max-w-6xl mx-auto border border-gray-100'>
        <div className='video-grid grid grid-cols-1 md:grid-cols-2 gap-8 my-6'>
          {/* Teacher video */}
          <div className='video-card bg-gradient-to-b from-blue-50 to-indigo-50 rounded-2xl overflow-hidden relative h-96 flex items-center justify-center border border-blue-100 shadow-lg'>
            <div className='absolute inset-0 bg-white/10'></div>
            <div className='avatar z-10 transform transition-all duration-300 hover:scale-105'>
              <div className='p-3 bg-white bg-opacity-70 rounded-full border border-blue-200 shadow-md'>
                <Image 
                  src='/thumbnail.png' 
                  alt="vapi" 
                  width={150} 
                  height={130} 
                  className='object-cover rounded-full'
                />
              </div>
            </div>
            
            {/* Subtle AI-like pulse effect */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='w-64 h-64 rounded-full bg-blue-400 opacity-10 animate-ping'></div>
            </div>
            
            {/* Teacher label */}
            <div className='absolute top-4 left-4 bg-white/60 px-3 py-1 rounded text-sm text-blue-600 font-medium'>
              Teacher
            </div>
            
            {/* Connection status indicator */}
            <div className='absolute bottom-6 w-full text-center'>
              <div className='inline-block px-4 py-2 bg-white/70 rounded-full text-blue-500 text-sm shadow-sm'>
                <span className='inline-block w-2 h-2 bg-green-400 rounded-full mr-2'></span>
                {isSpeaking ? 'Speaking' : 'Connected'}
              </div>
            </div>
          </div>
          
          {/* Student video */}
          <div className='video-card bg-gradient-to-b from-indigo-50 to-purple-50 rounded-2xl overflow-hidden relative h-96 flex items-center justify-center border border-purple-100 shadow-md'>
            <div className='absolute inset-0 bg-white/10'></div>
            
            {/* Student avatar */}
            <div className='avatar z-10'>
              <div className='p-3 bg-white bg-opacity-70 rounded-full border border-purple-200 shadow-md'>
                <div className='w-28 h-28 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 text-3xl font-medium'>
                  {userName}
                </div>
              </div>
            </div>
            
            {/* Student label */}
            <div className='absolute top-4 left-4 bg-white/60 px-3 py-1 rounded text-sm text-purple-600 font-medium'>
              Student
            </div>
            
            {/* Muted indicator */}
            <div className='absolute bottom-6 w-full text-center'>
              <div className='inline-block px-4 py-2 bg-white/70 rounded-full text-gray-500 text-sm shadow-sm'>
                <span className='inline-block w-2 h-2 bg-red-400 rounded-full mr-1'></span>
                Listening
              </div>
            </div>
          </div>
        </div>
        
        {messages.length > 0 && (
            <div className='mt-8 mb-6 mx-auto max-w-3xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-indigo-100 overflow-hidden'>
                <div className='p-5 bg-gradient-to-r from-blue-50 to-purple-50'>
                    <h3 className='text-center text-indigo-600 font-medium mb-3'>Conversation</h3>
                    <div className='transcript-content bg-white/70 p-4 rounded-xl'>
                        <p key={lastMessages} className={cn('transition-opacity duration-500 opacity-0 text-gray-700 font-normal', 'animate-in opacity-100')}>
                            {lastMessages}
                        </p>
                    </div>
                </div>
            </div>
        )}

        {/* Call control buttons */}
        <div className='w-full flex justify-center mt-2'>
            {callStatus != 'ACTIVE' ? (
                <Button className='px-6 py-2 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-white font-medium'>
                    <span className='flex items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Start Call' : 'Connecting...'}
                    </span>
                </Button>
            ) : (
                <Button className='px-6 py-2 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-white font-medium'>
                    <span className='flex items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        End Call
                    </span>
                </Button>
            )}
        </div>
      </div>
    </div>
    </>
  );
}

export default AgentLayout