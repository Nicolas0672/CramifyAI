"use client";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LayoutDashboard, Shield, UserCircle, Menu, BookOpen, Brain, Sparkles, Loader2Icon, XCircle, CheckCircle, AlertTriangle, Info, ArrowRight } from 'lucide-react'; // Added education/AI themed icons
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStudy } from '@/app/StudyContext';
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs/db';
import { AI_TEXT_RESPONSE_TABLE, STUDY_MATERIAL_TABLE } from '@/configs/schema';
import { and, desc, eq, sql } from 'drizzle-orm';
import { SidebarContext } from '../../SidebarContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import OnboardingTour from './OnboardingTour';
import OnboardingController from './OnboardingController';




function SideBar() {
  const { user, isLoaded } = useUser();
  const [topics, setTopics] = useState([]);
  const [showTopicSelection, setShowTopicSelection] = useState(false);
  const [confirmSelection, setConfirmSelection] = useState(false);
  const { setSelectedStudyType } = useStudy();
  const [selectOption, setSelectOption] = useState(null);
  const path = usePathname();
  const [openDialogue, setOpenDialogue] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const { isSidebarExpanded, setIsSidebarExpanded, isSidebarVisible, setIsSidebarVisible } = useContext(SidebarContext) // State for sidebar expansion
  const [loading, setLoading] = useState()
  const [tip, setTip] = useState()
  const [credit, setCredit] = useState({})
  const [totalCredit, setTotalCredit] = useState()
  const router = useRouter();
  const [showTour, setShowTour] = useState(false);
  const [showInsufficientCreditsDialog, setShowInsufficientCreditsDialog] = useState(false);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
const [dataLoaded, setDataLoaded] = useState(false);

  const MenuList = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      name: "Upgrade",
      icon: Shield,
      path: '/dashboard/upgrade'
    },
    {
      name: "Profile",
      icon: UserCircle,
      path: '/dashboard/profile'
    }
  ];


  const Options = [
    {
      name: 'Teach',
      icon: '/interview.png',
      color: 'bg-purple-50',
      hoverColor: 'hover:bg-purple-100'
    },

    {
      name: 'Study',
      icon: '/knowledge.png',
      color: 'bg-blue-50',
      hoverColor: 'hover:bg-blue-100',
    },
    {
      name: 'Practice',
      icon: '/practice.png',
      color: 'bg-green-50',
      hoverColor: 'hover:bg-green-100',
    },
    {
      name: 'Exam',
      icon: '/exam_1.png',
      color: 'bg-red-50',
      hoverColor: 'hover:bg-red-100',
    },

  ];



  const handleSelectStudyType = (type) => {
    setSelectedStudyType(type);
    if (type == 'Exam' || 'Study') {
      setConfirmSelection(false)
      setShowTopicSelection(false)
      setSelectedTopic(null)
    }
    if (type === 'Teach' && totalCredit < 2) {
      setOpenDialogue(false);
      setTimeout(() => {
        setShowInsufficientCreditsDialog(true);
      }, 100);
    }
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


  const handleProceed = () => {
    if (selectOption === 'Practice' || selectOption === 'Exam' || selectOption == 'Study') {
      setConfirmSelection(true);
    } else {
      if (credit?.remainingCredits - 2 >= 0) {
        showRedirectToast('Redirecting...')
        router.push('/create-teach-me')
        setOpenDialogue(false);
      } else {
        showErrorToast('Insufficient Credit')
      }

    }
  };

  const handleConfirmation = (confirm) => {
    if (confirm) {
      setShowTopicSelection(true);
    } else {
      router.push('/create');
      setOpenDialogue(false);
    }
  };

  const fetchTopics = async (user) => {
    try {
      const res = await axios.post('/api/fetch-topics', {
        createdBy: user?.primaryEmailAddress.emailAddress,
        selectedOption: selectOption
      })
      console.log(res.data.topics)
      setTopics(res.data.topics)

    }
    catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);

  };

  const GetCredits = async () => {

    setSidebarLoading(true);
    const res = await axios.post('/api/check-new-member', {
      createdBy: user?.primaryEmailAddress?.emailAddress
    })
    setCredit(res.data.res)

    if (res != null) {
      let newFreeCredit = res.data.res?.newFreeCredits || 0
      let newPurchases = res.data.res?.newPurchasedCredit || 0
      const newTotal = res.data.res?.remainingCredits

      setTotalCredit(newTotal)
      
    
    }

    if (!dataLoaded && res != null) {
  
      setDataLoaded(true);
      setInitialLoading(false);
      // Store timestamp of when data was first loaded
      sessionStorage.setItem('sidebarDataLoaded', 'true');
    }
  }

  useEffect(() => {
    user && updateUserDate()
  }, [user])

  const updateUserDate = async () => {
    const res = axios.post('/api/update-user', {
      createdBy: user?.primaryEmailAddress?.emailAddress
    })
    console.log(res)
  }

  const CheckFreeReset = async () => {
    const currentDate = new Date();
    // Compare the timestamps

    if (currentDate.getTime() >= new Date(credit?.nextCreditReset).getTime()) {
      const res = await axios.post('/api/update-credit', {
        createdBy: user?.primaryEmailAddress?.emailAddress,
        lastCreditReset: credit?.nextCreditReset
      });
    }
  };

  useEffect(() => {
    credit?.nextCreditReset && CheckFreeReset()
  }, [user, credit])


  const GenerateSelectedTopic = async () => {
    if (!selectedTopic) {
      showErrorToast("Please select a topic before continuing");
      return; // Stop execution
    }
    setLoading(true)
    showSuccessToast('Your content is generating')
    const res = await axios.post('/api/fetch-courseTopicId', {
      createdBy: user?.primaryEmailAddress?.emailAddress,
      selectOption: selectOption,
      selectedTopic: selectedTopic
    })

    const firstItem = res.data.firstItem;
    const combinedCourseLayout = res.data.courseLayout
    console.log(combinedCourseLayout)


    if (selectOption == 'Practice') {
      const payLoad = {
        courseId: firstItem?.courseId,
        topic: firstItem?.aiResponse?.courseTitle,
        courseType: firstItem?.aiResponse?.courseType,
        courseLayout: combinedCourseLayout,
        difficultyLevel: firstItem?.aiResponse?.difficultyLevel,
        createdBy: user?.primaryEmailAddress?.emailAddress
      }
      console.log("paylod", payLoad)
      const res = await axios.post('/api/generate-practice-questions', payLoad)
      console.log("data is generated", res.data)
    } else if (selectOption == 'Exam') {
      const payLoad = {
        courseId: firstItem?.courseId,
        topic: firstItem?.aiResponse?.courseTitle,
        courseType: firstItem?.aiResponse?.courseType,
        courseLayout: combinedCourseLayout,
        difficultyLevel: firstItem?.aiResponse?.difficultyLevel,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        exam_time: 30
      }
      const res = await axios.post('/api/generate-exam', payLoad)
      console.log('exam is generating', res.data)
    } else {
      console.log(combinedCourseLayout?.strengths)
      const summary = combinedCourseLayout?.summary;
      const strengths = combinedCourseLayout?.strengths?.join(', ');
      const improvements = combinedCourseLayout?.improvements?.join(', ');

      // Combine all into one string
      const combinedText = `
                Summary: ${summary}

                Strengths: ${strengths}

                Improvements: ${improvements}
            `;
      console.log(combinedText)
      const payLoad = {
        courseId: firstItem?.courseId,
        topic: firstItem?.topic,
        courseType: 'Study',
        courseLayout: combinedText,
        difficultyLevel: 'Easy',
        createdBy: user?.primaryEmailAddress?.emailAddress
      }
      const res = await axios.post('/api/generate-course-outline', payLoad)
      console.log('study content generating', res.data)
    }
    user && GetCredits()
    setLoading(false)
    showSuccessToast('Your session has been created successfully!');

    router.replace('/dashboard')
  }
  // const { courseId, topic, courseType, courseLayout, difficultyLevel, createdBy } = await req.json();

  useEffect(() => {
    GetStudyTip()

  }, [user])

  useEffect(() => {
    if (!user || !isLoaded) return;



    const hasLoadedThisSession = sessionStorage.getItem('sidebarDataLoaded');

    
  
  if (hasLoadedThisSession === 'true') {
    // If data was loaded in this session, don't show loading state
    setInitialLoading(false);
  }

  user&&GetCredits()

    const interval = setInterval(() => {
      user&&GetCredits(); // Fetch the latest credits from the DB
    }, 5000); // Runs every 5 seconds

    return () => clearInterval(interval); // Cleanup interval when component unmounts
  }, [user, isLoaded]);





  // courseId, topic, courseType, courseLayout, difficultyLevel, createdBy, exam_time

  const GetStudyTip = async () => {
    const res = await axios.post('/api/generate-ai-tips', {
      createdBy: user?.primaryEmailAddress?.emailAddress
    })
    setTip(res.data.res.motivationTips)
    console.log(res.data.res.motivationTips)

  }

  useEffect(() => {
    if (isLoaded && user) {
      fetchTopics(user);
    }
  }, [isLoaded, user, selectOption]);



  // Add this effect to add pulsing animation to the button
  useEffect(() => {
    // Create a style element for our custom CSS
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      /* Subtle heartbeat pulse animation for the create button */
   /* Wavelength animation for the create button */
@keyframes outward-wave {
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.3);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(99, 102, 241, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
}

/* Sequential waves effect */
@keyframes sequential-waves {
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.3),
                0 0 0 0 rgba(99, 102, 241, 0);
  }
  30% {
    box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.1),
                0 0 0 0 rgba(99, 102, 241, 0.2);
  }
  60% {
    box-shadow: 0 0 0 15px rgba(99, 102, 241, 0),
                0 0 0 8px rgba(99, 102, 241, 0.1);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0),
                0 0 0 15px rgba(99, 102, 241, 0);
  }
}

/* Target button directly by ID */
#create-new-button {
  animation: sequential-waves 3s infinite ease-out;
  position: relative;
  z-index: 1;
}

/* Optional: Add this if you want to ensure the button maintains its border-radius during animation */
#create-new-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  z-index: -1;
}
    
    
    // Add the style element to the document

      
      /* Diamond shine effect with reduced intensity */
      @keyframes diamond-shine {
        0% { background-position: -100% 0; }
        50% { background-position: 200% 0; }
        100% { background-position: -100% 0; }
      }
      
      .diamond-effect {
        position: relative;
        overflow: hidden;
      }
      
      .diamond-effect::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(
          45deg, 
          transparent 0%,
          rgba(255, 255, 255, 0) 30%,
          rgba(255, 255, 255, 0.3) 45%,
          rgba(255, 255, 255, 0) 60%,
          transparent 100%
        );
        transform: rotate(45deg);
        background-size: 200% 200%;
        animation: diamond-shine 8s linear infinite;
        pointer-events: none;
        z-index: 1;
      }
      
      .selected-mode::before {
        background: linear-gradient(
          45deg, 
          transparent 0%,
          rgba(255, 255, 255, 0) 30%,
          rgba(255, 255, 255, 0.5) 45%,
          rgba(255, 255, 255, 0) 60%,
          transparent 100%
        );
        animation: diamond-shine 7s linear infinite;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      if (styleEl && document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);

  // Styled toast notifications
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

  const showWarningToast = (message) => {
    toast(
      <div className="flex items-center gap-2">
        <div className="bg-amber-100 p-2 rounded-full">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>
        <span>{message}</span>
      </div>,
      {
        style: {
          background: 'linear-gradient(to right, #fffbeb, #fef3c7)',
          border: '1px solid #fcd34d',
          color: '#92400e',
          borderRadius: '0.5rem',
        },
        duration: 3000,
      }
    );
  };

  const showInfoToast = (message) => {
    toast(
      <div className="flex items-center gap-2">
        <div className="bg-blue-100 p-2 rounded-full">
          <Info className="w-5 h-5 text-blue-500" />
        </div>
        <span>{message}</span>
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


  // Handler for "Create New" button click
  const handleCreateNewClick = () => {
    const hasCompletedTour = localStorage.getItem('cramsmartTourCompleted');
    if (!hasCompletedTour) {
      // New user - show tour first
      setShowTour(true);
      showInfoToast("Welcome! Let's take a quick tour first.");
    } else {
      // Returning user - show dialog directly
      setOpenDialogue(true);
    }
  };

  // Handle tour completion
  const handleTourComplete = () => {
    localStorage.setItem('cramsmartTourCompleted', 'true');
    setShowTour(false);
    // Show dialog after tour completes
    setOpenDialogue(true);
  };

  // Add this new function to handle insufficient credits for Teach mode
  const warnAboutLowCredits = () => {
    if (totalCredit <= 3) {
      showWarningToast(`You only have ${totalCredit || 0} credits remaining. Consider upgrading your plan.`);
    }
  };

  return (

    <>
      {showTour && <OnboardingTour onComplete={handleTourComplete} />}

      {/* Sidebar with hamburger menu that stays fixed */}
      <div
        style={{ display: isSidebarVisible ? 'block' : 'none' }}
        className={`fixed h-screen transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-8'
          }`}
      >
        {/* Header with logo and hamburger that's always visible */}
        <div className={`flex gap-2 items-center p-4 ${isSidebarExpanded ? 'bg-gradient-to-br from-white via-blue-50 to-indigo-50' : 'bg-transparent'
          }`}>
          {/* Logo with subtle animation */}
          <div className="relative">
            <div className="absolute -inset-1  rounded-full blur-md opacity-50 animate-pulse"></div>
            <Image src={'/lg.png'} style={{ backgroundColor: 'transparent' }} color='black' alt='logo' width={40} height={40}  />
          </div>

          {/* Title - only visible when expanded */}
          {isSidebarExpanded && <h2 className='font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 tracking-tight'>CramSmart</h2>}

          {/* Hamburger Menu - always visible */}
          <div
            className='ml-auto p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg cursor-pointer transition-all hover:bg-indigo-50 hover:rotate-180'
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          >
            <Menu className="w-6 h-6 text-indigo-600" />
          </div>
        </div>



        {/* Sidebar content - conditionally rendered based on expanded state */}
        {isSidebarExpanded && (
          <div className="h-[calc(100vh-68px)] overflow-y-auto p-4 bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-r border-blue-100/50 shadow-xl">
            {/* Create New Button */}
            <div className='mt-4'>
              {initialLoading  ? (
                <div className="w-full h-10 bg-gray-200 animate-pulse rounded-lg"></div>
              ) : (
                totalCredit > 0 ? (
                  <Button id="create-new-button" className='w-full cursor-pointer bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1' onClick={handleCreateNewClick}>
                    <Sparkles className="w-4 h-4 mr-2" /> Create New
                  </Button>
                ) : (
                  <Button className='w-full cursor-pointer bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1' onClick={() => showErrorToast('You have run out of credits')}>
                    <Sparkles className="w-4 h-4 mr-2" /> Credits Required
                  </Button>
                )
              )}
            </div>

            {/* Menu List */}
            <div className='mt-8 space-y-2'>
              {initialLoading  ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-14 bg-gray-200 animate-pulse rounded-xl mb-2"></div>
                ))
              ) : (
                MenuList.map((menu, index) => (
                  <Link href={menu.path} key={index}>
                    <div
                      onClick={() => warnAboutLowCredits()}
                      className={`flex gap-4 items-center p-3.5 rounded-xl cursor-pointer transition-all duration-300
            ${path === menu.path
                          ? 'bg-gradient-to-r from-indigo-100/80 to-blue-50 text-indigo-600 shadow-md border-l-4 border-indigo-500'
                          : 'text-gray-700 hover:bg-white/70 hover:shadow-sm border-l-4 border-transparent'
                        }`}
                    >
                      <div className={`p-2 rounded-lg ${path === menu.path ? 'bg-white/90 shadow-sm' : 'bg-gray-100/70'}`}>
                        <menu.icon className={`w-5 h-5 ${path === menu.path ? 'text-indigo-600' : 'text-gray-600'}`} />
                      </div>
                      <h2 className={`text-md font-medium transition-all ${path === menu.path ? 'font-semibold' : ''}`}>
                        {menu.name}
                      </h2>
                    </div>
                  </Link>
                ))
              )}
            </div>


            {/* AI Tips/Suggestion */}
            {initialLoading  ? (
              <div className="mt-6 h-24 bg-gray-200 animate-pulse rounded-xl"></div>
            ) : (
              <div className="mt-6 bg-indigo-50/80 backdrop-blur-sm p-4 rounded-xl border border-indigo-100/50 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center mb-2">
                  <Brain className="w-5 h-5 text-indigo-500 mr-2" />
                  <span className="text-sm font-medium text-indigo-700">Motivation Tip</span>
                </div>
                <p className="text-xs text-indigo-600 italic">{tip}</p>
              </div>
            )}

            {/* Credits Section */}
            {initialLoading  ? (
              <div className="mt-6 mb-4 h-36 bg-gray-200 animate-pulse rounded-xl"></div>
            ) : (
              <div className="relative mt-6 mb-4">
                <div className="w-full border p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-md text-gray-800 font-medium"> Remaining Credits: </h2>
                    <span className="text-indigo-600 font-bold">
                      {totalCredit}
                    </span>
                  </div>


                  <div className="relative h-3 w-full bg-blue-100/60 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 transition-all"
                      style={{ width: `${Math.min((credit?.totalCredits / credit?.totalCreditSize) * 100, 100)}%` }}
                    />

                    <div className="absolute left-[50%] h-full w-0.5 bg-gray-400/50"></div>
                  </div>

                  <h2 className="text-xs mt-1 text-gray-500">Includes 10 Free Per Month</h2>


                  <div className="mt-3 text-sm text-gray-600">
                    <p>Next Reset: {credit?.nextCreditReset ? new Date(credit?.nextCreditReset).toLocaleDateString() : 'Not set'}</p>
                  </div>

                  <Link
                    href={'/dashboard/upgrade'}
                    className="flex items-center justify-center mt-3 text-white text-sm bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 p-2 rounded-md hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 transition-all shadow-sm hover:shadow-md"
                  >
                    <Sparkles className="w-4 h-4 mr-1" /> Upgrade for More
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Dialog for Study Material Selection */}
      <Dialog open={openDialogue} onOpenChange={setOpenDialogue}>

        <DialogContent className='bg-white rounded-xl shadow-xl max-w-lg border border-indigo-100/30 max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='text-center text-2xl font-bold text-gray-800'>
              Select Study Material Type
            </DialogTitle>
            <DialogDescription className='text-center text-gray-600'>
              {selectOption === 'Study'
                ? "Create your own personalized study guide and flashcards (1 credit)"
                : selectOption === 'Exam'
                  ? "Challenge yourself with a dynamic, timed exam (1 credit)"
                  : selectOption === 'Practice'
                    ? "Sharpen your memory with AI-generated quizzes (1 credit)"
                    : selectOption === 'Teach' ?
                      'Learn with AI (2 credits)' : ''}
            </DialogDescription>

            {/* Study Material Options */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {Options.map((option, index) => (
                <div
                  id={`${option.name.toLowerCase()}-mode-tab`}
                  key={index}
                  className={`cursor-pointer p-4 flex flex-col items-center justify-center border-2 rounded-xl transition-all duration-300 ease-in-out 
                                            ${option.color} ${option.hoverColor} diamond-effect
                                            ${option.name === selectOption ? 'border-indigo-500 shadow-lg scale-105 selected-mode' : 'border-transparent'}`}
                  onClick={() => {
                    setSelectOption(option.name);
                    handleSelectStudyType(option.name);
                  }}
                >
                  <div className="p-3 rounded-full bg-white shadow-md">
                    <Image src={option.icon} alt={option.name} width={40} height={40} />
                  </div>
                  <h2 className="mt-3 text-lg font-medium text-gray-700">{option.name}</h2>
                </div>
              ))}
            </div>

            {/* Next Button */}
            {selectOption && (
              <Button
                className='mt-4 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-semibold py-2 rounded-lg transition-all cursor-pointer shadow-md hover:shadow-lg'
                onClick={handleProceed}
              >
                Next
              </Button>
            )}

            {/* Confirmation Dialog */}
            {confirmSelection && (
              <>
                <DialogDescription className='text-center mt-4 text-gray-600'>
                  Do you want to continue with your existing topics?
                </DialogDescription>
                <div className='flex justify-center gap-4 mt-4'>
                  <Button
                    className='cursor-pointer bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all shadow-md'
                    onClick={() => handleConfirmation(false)}
                  >
                    No
                  </Button>
                  <Button
                    className='cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold py-2 rounded-lg transition-all shadow-md'
                    onClick={() => handleConfirmation(true)}
                  >
                    Yes
                  </Button>
                </div>
              </>
            )}

            {/* Topic Selection */}
            {showTopicSelection && (
              <>
                <DialogTitle className='mt-4 text-center text-2xl font-bold text-gray-800'>
                  Select a Topic
                </DialogTitle>
                <DialogDescription className='text-center text-gray-600'>
                  Choose a topic to continue practicing.
                </DialogDescription>

                {/* Scrollable Topics List */}
                <div className='mt-4 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-100 rounded-lg'>
                  {topics.length > 0 ? (
                    topics.map((topic, index) => (
                      <div
                        key={index}
                        className={`cursor-pointer p-3 rounded-lg transition-all
                                                        ${selectedTopic === topic ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' : 'hover:bg-indigo-50 text-gray-700'}`}
                        onClick={() => {
                          handleSelectTopic(topic);
                          setSelectedTopic(topic); // Update selected topic
                        }}
                      >
                        <p className='text-md'>{topic}</p>
                      </div>
                    ))
                  ) : (
                    <p className='text-center text-gray-600 p-3'>No topics available</p>
                  )}
                </div>
                <Button
                  className='cursor-pointer mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-2 rounded-lg transition-all shadow-md'
                  onClick={() => GenerateSelectedTopic()}
                >
                  {loading ? (
                    <Loader2Icon className="animate-spin h-6 w-6" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showInsufficientCreditsDialog} onOpenChange={setShowInsufficientCreditsDialog}>
        <DialogContent className="bg-white rounded-xl shadow-xl max-w-md border border-red-100">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl font-bold text-gray-800">
              Insufficient Credits
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mt-2">
              The Teach mode requires 2 credits, but you only have {totalCredit} {totalCredit === 1 ? 'credit' : 'credits'} available.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Link
              href="/dashboard/upgrade"
              className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-semibold py-2 rounded-lg transition-all cursor-pointer shadow-md hover:shadow-lg text-center"
            >
              <Sparkles className="w-4 h-4 inline mr-2" /> Upgrade Now
            </Link>
            <Button
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all"
              onClick={() => {
                setShowInsufficientCreditsDialog(false);
                setTimeout(() => {
                  setOpenDialogue(true);
                }, 100);
              }}
            >
              Go Back
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </>
  )
}



export default SideBar;