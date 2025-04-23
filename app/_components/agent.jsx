"use client"
import { Button } from '@/components/ui/button';
import { teachMeAssistant, vapi2 } from '@/lib/teachMeAssistant';
import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { ArrowRight, CheckCircle, CreditCard, XCircle } from 'lucide-react';
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';



function AgentLayout({ progress, userDetails, userName, userId, type, courseId, topic, questions, isNewMember }) {
  const CallStatus = {
    INACTIVE: "INACTIVE",
    CONNECTING: "CONNECTING",
    ACTIVE: "ACTIVE",
    FINISHED: "FINISHED",
  };
  const [courseTitle, setCourseTitle] = useState([])
  const { user } = useUser()
  const [avatar, setAvatar] = useState('')
  // New state for noise warning popup
  const [showNoiseWarning, setShowNoiseWarning] = useState(false);
  const MIN_DURATION_MS = 60000
  const userClickRef = useRef(false);
  const router = useRouter()
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [userIsSpeaking, setUserIsSpeaking] = useState(false)
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);

  const [messages, setMessages] = useState([]);


  // Timer state for vapi2 - starting from 5 minutes (300 seconds)
  const TIMER_START = 300; // 5 minutes in seconds
  const [timer, setTimer] = useState(TIMER_START);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [startCall, setStartCall] = useState(false)
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPathname = useRef(pathname);
  const latestMessagesRef = useRef(messages);
  const [userClick, setUserClick] = useState(false)

  const SavedMessage = {
    role: ['user', 'system', 'assistant'], // Possible roles
    content: "", // String content
  };


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
    user && GetCourseTitle()

    if (type == 'generate') {
      setAvatar('boy')
    } else { setAvatar('girl') }
  }, [user])

  useEffect(() => {
    latestMessagesRef.current = messages;
  }, [messages]);



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
      setStartCall(true)
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

  const showRedirectToast = (message) => {
    toast(
      <div className="flex items-center gap-2">
        <div className="bg-green-100 p-2 rounded-full">
          <ArrowRight className="w-5 h-5 text-green-500" />
        </div>
        <span>{message}</span>
      </div>,
      {
        style: {
          background: 'linear-gradient(to right, #ecfdf5, #d1fae5)',
          border: '1px solid #6ee7b7',
          color: '#065f46',
          borderRadius: '0.5rem',
        },
        duration: 3000,
      }
    );
  };

  const showCreditSpentToast = (amount) => {
    toast(
      <div className="flex items-center gap-2">
        <div className="bg-blue-100 p-2 rounded-full">
          <CreditCard className="w-5 h-5 text-blue-500" />
        </div>
        <span>Credits spent: ${amount}</span>
      </div>,
      {
        style: {
          background: 'linear-gradient(to right, #eff6ff, #dbeafe)',
          border: '1px solid #93c5fd',
          color: '#1e40af',
          borderRadius: '0.5rem',
        },
        duration: 3000,
      }
    );
  };

  const handleGenerateFeedback = async (messages) => {
    console.log('Full Messages Array:', messages);
    try {
      const res = await axios.post('/api/generate-teach-feedback', {
        courseId: courseId,
        createdBy: userId,
        transcript: messages,
        title: topic
      });
      showRedirectToast('Redirecting...')

      console.log(res.data)

      router.push(`/teach-me/${res.data.courseId}/feedback`);

    } catch (error) {
      console.error("Error generating feedback:", error);
      router.push('/dashboard');
    }
  };

  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      if (type == 'generate') {
        showCreditSpentToast('2 Credits Spent')
        router.push('/dashboard')
      }
      else {
        showSuccessToast('Your feedback is being generated...')
        setUserClick(true)
        handleGenerateFeedback(messages)
      }
    }
  }, [messages, callStatus, type, userId])

  // Modified to show popup first, then connect call
  const handleCall = () => {
    if (userDetails?.remainingCredits - 2 < 0) {
      showErrorToast('You do not have enough credits!')
    } else {
      // Show the noise warning popup instead of immediately starting the call
      setShowNoiseWarning(true);
    }
  }

  // New function to handle the actual call connection after user confirmation
  const initiateCall = async () => {
    const createdBy = user?.primaryEmailAddress?.emailAddress;
    const username = user?.fullName;
    setStartCall(true)

    showSuccessToast('Call has started');
    setCallStatus(CallStatus.CONNECTING);
    setShowNoiseWarning(false); // Hide the popup

    // Reset timer when starting vapi2 call
    if (type !== 'generate') {
      setTimer(TIMER_START);
      setIsTimerActive(true);
    }

    if (type == 'generate') {
      if (isNewMember) {
        const response = await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, {
          variableValues: {
            username: user?.fullName,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            topic1: courseTitle[0]?.courseTitle || 'Math',
            topic2: courseTitle[1]?.courseTitle || 'Science',
            topic3: courseTitle[2]?.courseTitle || 'History'
          },
        });
      } else {
        const response = await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID2, {
          variableValues: {
            username: user?.fullName,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            topic1: courseTitle[0]?.courseTitle,
            topic2: courseTitle[1]?.courseTitle,
            topic3: courseTitle[2]?.courseTitle
          },
        });
      }
    } else {
      await vapi2.start(teachMeAssistant, {
        variableValues: {
          username: user?.fullName,
          firstQuestion: questions,
          topic: topic
        }
      });
    }
  }



  // Update the ref when state changes
  useEffect(() => {
    userClickRef.current = userClick;
  }, [userClick]);

  // Session timing setup (this stays the same)
  useEffect(() => {
    if (startCall && !sessionStorage.getItem('sessionStart')) {
      const timestamp = Date.now().toString();
      sessionStorage.setItem('sessionStart', timestamp);
      console.log('Session started at:', timestamp);
    }
  }, [startCall]);

  // Modified shouldGenerateFeedback to use ref instead of state
  const shouldGenerateFeedback = () => {
    // Check userClickRef instead of the state
    if (userClickRef.current === true) {
      return false;
    }

    const startTimeString = sessionStorage.getItem('sessionStart');
    const startTime = startTimeString ? parseInt(startTimeString, 10) : null;

    if (!startTime) {
      console.log('No valid start time found');
      return false;
    }

    const currentTime = Date.now();
    const duration = currentTime - startTime;

    console.log('Start time:', startTime);
    console.log('Current time:', currentTime);
    console.log('Current duration (ms):', duration);

    console.log('Session requirements check:', {
      notGenerate: type !== 'generate',
      hasStartCall: startCall,
      messagesLength: latestMessagesRef.current.length,
      durationMet: duration >= MIN_DURATION_MS,
      userClick: userClickRef.current
    });

    return (
      type !== 'generate' &&
      startCall &&
      latestMessagesRef.current.length > 5 &&
      duration >= MIN_DURATION_MS &&
      userClickRef.current === false
    );
  };

  // beforeUnload handler 
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (shouldGenerateFeedback()) {
        setCallStatus(CallStatus.FINISHED);
        setIsTimerActive(false);
        const blob = new Blob([JSON.stringify({
          courseId: courseId,
          createdBy: userId,
          transcript: latestMessagesRef.current,
          title: topic
        })], { type: 'application/json' });

        navigator.sendBeacon('/api/generate-teach-feedback', blob);

        type === 'generate' ? vapi.stop() : vapi2.stop();
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [callStatus]);

  // Cleanup effect without userClick as dependency
  useEffect(() => {
    return () => {
      if (startCall) {
        console.log('last useEffect call');
        const shouldGenerate = shouldGenerateFeedback();
        console.log('🤖 Should generate feedback on route change?', shouldGenerate);

        if (shouldGenerate) {
          console.log('✅ All good! Generating feedback...');
          handleGenerateFeedback(latestMessagesRef.current);
        } else {
          console.log('⛔️ Not generating feedback');
        }
        stopAIProcess();
        sessionStorage.removeItem('sessionStart');
        sessionStorage.removeItem('feedbackGenerated');
      }
    };
  }, [startCall]); // Remove userClick dependency

  const stopAIProcess = () => {
    // Implement your logic to stop the AI here
    type === 'generate' ? vapi.stop() : vapi2.stop(); // Adjust for your VAPI instances
  };



  const handleDisconnect = () => {
    // Update the ref immediately
    userClickRef.current = true;
    // Then update the state
    setUserClick(true);

    setCallStatus(CallStatus.FINISHED);
    setIsTimerActive(false);

    type === 'generate' ? vapi.stop() : vapi2.stop();
    sessionStorage.removeItem('sessionStart');
    sessionStorage.removeItem('feedbackGenerated');
  }



  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished = callStatus == CallStatus.INACTIVE || callStatus == CallStatus.FINISHED;
  const lastMessages = messages[messages.length - 1];

  return (
    <>
      <div className=''>
        {/* Subtle ambient background elements for the whole screen */}
        <div className='fixed inset-0 -z-10 overflow-hidden pointer-events-none'>
          <div className='absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-50 via-white to-indigo-50'></div>
          <div className='absolute top-1/4 right-1/4 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl opacity-10'></div>
          <div className='absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-300 rounded-full filter blur-3xl opacity-10'></div>
        </div>

        {/* Noise Warning Popup */}
        {showNoiseWarning && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-b from-indigo-50 to-purple-50 rounded-2xl p-6 m-4 max-w-md shadow-xl border border-purple-100 transform transition-all animate-fadeIn">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 017.072 0m-9.9-2.828a9 9 0 0112.728 0" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-indigo-700">Prepare Your Environment</h3>
              </div>

              <p className="text-gray-600 mb-6">
                Please ensure your surroundings are free from noise for the best call experience. Find a quiet space and check that your microphone is working properly.
              </p>

              <div className="flex justify-between space-x-3">
                <button
                  onClick={() => setShowNoiseWarning(false)}
                  className="flex-1 px-4 py-2 bg-white hover:bg-gray-50 text-indigo-500 rounded-lg border border-indigo-200 transition duration-200 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={initiateCall}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg transition duration-200 shadow-md"
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        )}

        <div className='call-view bg-purple-50 backdrop-blur-sm p-8 rounded-xl shadow-md w-full max-w-6xl mx-auto border border-gray-100'>
          <div className='video-grid grid grid-cols-1 md:grid-cols-2 gap-8 my-6'>
            {/* Teacher video */}
            <div className='video-card bg-gradient-to-b from-blue-50 to-indigo-50 rounded-2xl overflow-hidden relative h-96 flex items-center justify-center border border-blue-100 shadow-lg'>
              <div className='absolute inset-0 bg-white/10'></div>
              <div className='avatar z-10 transform transition-all duration-300 hover:scale-105'>
                <div className='p-3 bg-white bg-opacity-70 rounded-full border border-blue-200 shadow-md'>
                  {avatar == 'boy' ? <Image
                    src='/image-generate.jpg'
                    alt="vapi"
                    width={150}
                    height={130}
                    className='object-cover rounded-full'
                  /> : <Image
                    src='/thumbnail.png'
                    alt="vapi"
                    width={150}
                    height={130}
                    className='object-cover rounded-full' />}
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
                      {user?.primaryEmailAddress?.emailAddress?.charAt(0).toUpperCase() ?? "?"}
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
          {progress ? (
            progress === 100 && type !== 'generate' ? null : (
              <div className='w-full flex justify-center mt-2'>
                {callStatus !== 'CONNECTING' ? (
                  <Button
                    onClick={handleCall}
                    className='cursor-pointer px-6 py-2 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-white font-medium'
                  >
                    <span className='flex items-center'>
                      {/* SVG icon */}
                      {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Start Call' : '...'}
                    </span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleDisconnect}
                    className='cursor-pointer px-6 py-2 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300 text-white font-medium'
                  >
                    <span className='flex items-center'>
                      {/* SVG icon */}
                      End Call
                    </span>
                  </Button>
                )}
              </div>
            )
          ) : (
            // Optionally, render a loading indicator or placeholder here
            <div className="w-full flex justify-center mt-2">
              <div className="flex items-center space-x-1 text-sm text-gray-600 font-medium">
                <span>Loading</span>
                <span className="animate-bounce [animation-delay:-0.3s]">.</span>
                <span className="animate-bounce [animation-delay:-0.15s]">.</span>
                <span className="animate-bounce">.</span>
              </div>
            </div>

          )}

        </div>
      </div>
    </>
  );
}

export default AgentLayout