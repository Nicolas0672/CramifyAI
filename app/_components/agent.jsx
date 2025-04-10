"use client"
import { Button } from '@/components/ui/button';
import { teachMeAssistant, vapi2 } from '@/lib/teachMeAssistant';
import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';



function AgentLayout({ userDetails,userName, userId, type, courseId, topic, questions, isNewMember }) {
  const CallStatus = {
    INACTIVE: "INACTIVE",
    CONNECTING: "CONNECTING",
    ACTIVE: "ACTIVE",
    FINISHED: "FINISHED",
  };
  const [courseTitle, setCourseTitle] = useState([])
  const { user } = useUser()
  const [avatar, setAvatar] = useState('')
 


  const SavedMessage = {
    role: ['user', 'system', 'assistant'], // Possible roles
    content: "", // String content
  };
  const router = useRouter()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [userIsSpeaking, setUserIsSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);

  const [messages, setMessages] = useState([]);
  
  // Timer state for vapi2 - starting from 5 minutes (300 seconds)
  const TIMER_START = 300; // 5 minutes in seconds
  const [timer, setTimer] = useState(TIMER_START);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const GetCourseTitle = async () => {
    const res = await axios.post('/api/courses', {
      createdBy: user?.primaryEmailAddress.emailAddress
    })

    const courses = (res.data.result.slice(0, 3))
    const courseTitle = courses.map((course) => ({
      courseTitle: course.aiResponse.courseTitle
    }))
    setCourseTitle(courseTitle)
   
  }
  useEffect(() => {
    user&&GetCourseTitle()
 
    if(type == 'generate'){
      setAvatar('boy')
    } else { setAvatar('girl')}
  }, [user])



  // Timer effect for vapi2 - countdown from 5 minutes
  useEffect(() => {
    let interval = null;
    
    if (isTimerActive && type !== 'generate') {
      interval = setInterval(() => {
        setTimer(seconds => {
          if (seconds <= 1) {
            // Timer finished
            clearInterval(interval);
            setIsTimerActive(false);
            handleDisconnect(); // Auto disconnect when timer reaches 0
            return 0;
          }
          return seconds - 1;
        });
      }, 1000);
    } else if (!isTimerActive) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive, type]);

  // Format time for display
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const currentVapi = type === 'generate' ? vapi : vapi2;

    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      // Start timer only for vapi2
      if (type !== 'generate') {
        setIsTimerActive(true);
      }
    }
    
    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      // Stop timer
      setIsTimerActive(false);
    }

    const onMessage = (message) => {
      // Check if the message is a final transcript for both VAPI instances
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        // Set who is speaking based on the role
        if (message.role === 'user') {
          setUserIsSpeaking(true);
          setIsSpeaking(false);
        } else {
          setUserIsSpeaking(false);
          setIsSpeaking(true);
        }

        const newMessage = {
          role: message.role,
          content: message.transcript // Assuming 'transcript' is the content
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true)
    const onSpeechEnd = () => setIsSpeaking(false)

    const onError = (err) => console.log('error', err)
    
    // Use the appropriate VAPI instance for event listeners
    currentVapi.on('call=start', onCallStart)
    currentVapi.on('call-end', onCallEnd)
    currentVapi.on('message', onMessage)
    currentVapi.on('speech-start', onSpeechStart)
    currentVapi.on('speech-end', onSpeechEnd)
    currentVapi.on('error', onError)

    return () => {
      // Remove listeners for the specific VAPI instance
      currentVapi.off('call=start', onCallStart)
      currentVapi.off('call-end', onCallEnd)
      currentVapi.off('message', onMessage)
      currentVapi.off('speech-start', onSpeechStart)
      currentVapi.off('speech-end', onSpeechEnd)
      currentVapi.off('error', onError)
    }
  }, [type])  

  const handleGenerateFeedback = async (messages) => {
    console.log('Full Messages Array:', messages);
    try {
      const res = await axios.post('/api/generate-teach-feedback', {
        courseId: courseId,
        createdBy: userId,
        transcript: messages,
        title: topic
      });
      toast('Redirecting...')
  
      console.log(res.data)
        router.push(`/teach-me/${res.data.courseId}/feedback`);
    
    } catch (error) {
      console.error("Error generating feedback:", error);
      router.push('/');
    }
  };


  

  useEffect(() => {
    
    if (callStatus === CallStatus.FINISHED){
      if(type == 'generate'){
        router.push('/')
      }
      else{
        toast('Your feedback is being generated...')
        handleGenerateFeedback(messages)
      }
    } 
  }, [messages, callStatus, type, userId])

  const handleCall = async () => {
    if(userDetails?.remainingCredits - 2 < 0){
      toast('You do not have enough credits!')
    }
    else{
      const createdBy = user?.primaryEmailAddress?.emailAddress;
      const username = user?.fullName
    
      toast('Call has started')
      setCallStatus(CallStatus.CONNECTING)
      
      // Reset timer when starting vapi2 call
      if (type !== 'generate') {
        setTimer(TIMER_START);
        setIsTimerActive(true);
      }
      
      if(type == 'generate'){
        if(isNewMember){
        const response = await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, {
          
          variableValues: {
            username: user?.fullName,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            topic1: courseTitle[0]?.courseTitle || 'Math',
            topic2: courseTitle[1]?.courseTitle || 'Science',
            topic3: courseTitle[2]?.courseTitle || 'History'
          },
        })} else {
          const response = await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID2, {
          
            variableValues: {
              username: user?.fullName,
              createdBy: user?.primaryEmailAddress?.emailAddress,
              topic1: courseTitle[0]?.courseTitle,
              topic2: courseTitle[1]?.courseTitle,
              topic3: courseTitle[2]?.courseTitle
            },
          })
        };
        
      } else {
     
        await vapi2.start(teachMeAssistant,{
          variableValues:{
            username: user?.fullName,
            firstQuestion: questions,
            topic: topic
          }
        })
        
      };
    }
   
    }


    const handleDisconnect = async () => {
      
      setCallStatus(CallStatus.FINISHED)
      setIsTimerActive(false);
      
      // Stop the appropriate VAPI instance based on the type
      type === 'generate' ? vapi.stop() : vapi2.stop()
    }

  const latestMessage = messages[messages.length - 1]?.content
  const isCallInactiveOrFinished = callStatus == CallStatus.INACTIVE || callStatus == CallStatus.FINISHED




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

        <div className='  call-view bg-purple-50 backdrop-blur-sm p-8 rounded-xl shadow-md w-full max-w-6xl mx-auto border border-gray-100'>
          <div className='video-grid grid grid-cols-1 md:grid-cols-2 gap-8 my-6'>
            {/* Teacher video */}
            <div className='video-card bg-gradient-to-b from-blue-50 to-indigo-50 rounded-2xl overflow-hidden relative h-96 flex items-center justify-center border border-blue-100 shadow-lg'>
              <div className='absolute inset-0 bg-white/10'></div>
              <div className='avatar z-10 transform transition-all duration-300 hover:scale-105'>
                <div className='p-3 bg-white bg-opacity-70 rounded-full border border-blue-200 shadow-md'>
                  {avatar=='boy'?<Image
                    src='/image-generate.jpg'
                    alt="vapi"
                    width={150}
                    height={130}
                    className='object-cover rounded-full'
                  />: <Image
                  src='/thumbnail.png'
                  alt="vapi"
                  width={150}
                  height={130}
                  className='object-cover rounded-full'/>}
                </div>
              </div>

              {/* Conditional AI-like pulse effect - only shown when teacher is speaking */}
              {isSpeaking && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='w-64 h-64 rounded-full bg-blue-400 opacity-10 animate-ping'></div>
                </div>
              )}

              {/* Teacher label */}
              <div className='absolute top-4 left-4 bg-white/60 px-3 py-1 rounded text-sm text-blue-600 font-medium'>
                {type === 'generate' ? 'Elliot' : 'Hannah'}
              </div>

              {/* Connection status indicator */}
              <div className='absolute bottom-6 w-full text-center'>
                <div className='inline-block px-4 py-2 bg-white/70 rounded-full text-blue-500 text-sm shadow-sm'>
                  <span className='inline-block w-2 h-2 bg-green-400 rounded-full mr-2'></span>
                  {isSpeaking ? 'Speaking' : 'Connected'}
                </div>
              </div>
              
              {/* Timer for vapi2 */}
              {type !== 'generate' && (callStatus === CallStatus.CONNECTING || callStatus === CallStatus.ACTIVE) && (
                <div className={`absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm font-medium ${timer <= 60 ? 'text-red-600' : 'text-blue-600'}`}>
                  <span className='flex items-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    {formatTime(timer)}
                  </span>
                </div>
              )}
            </div>

            {/* Student video */}
            <div className='video-card bg-gradient-to-b from-indigo-50 to-purple-50 rounded-2xl overflow-hidden relative h-96 flex items-center justify-center border border-purple-100 shadow-md'>
              <div className='absolute inset-0 bg-white/10'></div>

              {/* Student avatar */}
              <div className="avatar z-10">
  <div className="p-3 bg-white bg-opacity-70 rounded-full border border-purple-200 shadow-md">
    {user?.imageUrl ? (
      <img
        src={user.imageUrl}
        alt="User Avatar"
        className="w-28 h-28 rounded-full object-cover"
      />
    ) : (
      <div className="w-28 h-28 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 text-4xl font-semibold">
        {user?.emailAddress?.emailAddress?.charAt(0).toUpperCase() ?? "?"}
      </div>
    )}
  </div>
</div>


              {/* Conditional pulse effect for student - only shown when user is speaking */}
              {userIsSpeaking && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='w-64 h-64 rounded-full bg-purple-400 opacity-10 animate-ping'></div>
                </div>
              )}

              {/* Student label */}
              <div className='absolute top-4 left-4 bg-white/60 px-3 py-1 rounded text-sm text-purple-600 font-medium'>
                {user?.fullName}
              </div>

              {/* Muted/Speaking indicator */}
              <div className='absolute bottom-6 w-full text-center'>
                <div className='inline-block px-4 py-2 bg-white/70 rounded-full text-gray-500 text-sm shadow-sm'>
                  <span className={'inline-block w-2 h-2 rounded-full mr-1 ' + (userIsSpeaking ? 'bg-green-400' : 'bg-green-400')}></span>
                  {userIsSpeaking ? 'Speaking' : 'Connected'}
                </div>
              </div>
            </div>
          </div>


          
    <div className='mt-8 mb-6 mx-auto max-w-3xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-indigo-100 overflow-hidden'>
      <div className='p-5 bg-gradient-to-r from-blue-50 to-purple-50'>
        <h3 className='text-center text-indigo-600 font-medium mb-3'>Conversation</h3>
        <div className='transcript-content bg-white/70 p-4 rounded-xl'>
          <p 
            key={latestMessage}
            className="
              text-gray-700 
              transition-all 
              duration-300 
              ease-in-out
              opacity-100
              transform 
              translate-y-0
            "
          >
            {latestMessage}
          </p>
        </div>
      </div>
    </div>
 


          {/* Call control buttons */}
          <div className='w-full flex justify-center mt-2'>
            {callStatus != 'CONNECTING' ? (
              <Button onClick={handleCall} className='cursor-pointer px-6 py-2 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-white font-medium'>
                <span className='flex items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Start Call' : '...'}
                </span>
              </Button>
            ) : (
              <Button onClick={handleDisconnect} className='cursor-pointer px-6 py-2 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-white font-medium'>
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