"use client";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LayoutDashboard, Shield, UserCircle, Menu, BookOpen, Brain, Sparkles, Loader2Icon } from 'lucide-react'; // Added education/AI themed icons
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
    const { isSidebarExpanded, setIsSidebarExpanded, isSidebarVisible,  setIsSidebarVisible } = useContext(SidebarContext) // State for sidebar expansion
    const [loading, setLoading] = useState()
    const [tip, setTip] = useState()
    const [credit, setCredit] = useState({})
    const [totalCredit, setTotalCredit] = useState()
    const router = useRouter();


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
    };



    const handleProceed = () => {
        if (selectOption === 'Practice' || selectOption === 'Exam' || selectOption == 'Study') {
            setConfirmSelection(true);
        } else {
            if(credit?.remainingCredits - 2 >= 0){
                toast('Redirecting...')
            router.push('/create-teach-me')
            setOpenDialogue(false);
            } else {
                toast('Insufficient Credit')
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

    const GetCredits=async()=>{
      

        const res = await axios.post('/api/check-new-member',{
            createdBy: user?.primaryEmailAddress?.emailAddress
        })
        setCredit(res.data.res)
    
        if(res != null){
            let newFreeCredit = res.data.res?.newFreeCredits || 0
            let newPurchases = res.data.res?.newPurchasedCredit || 0
            const newTotal = res.data.res?.remainingCredits
          
            setTotalCredit(newTotal)
           
        }
    }

    useEffect(()=>{
        user&&updateUserDate()
    },[user])

    const updateUserDate =async()=>{
        const res= axios.post('/api/update-user',{
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
    
    useEffect(()=>{
        credit?.nextCreditReset&&CheckFreeReset()
    },[user, credit])


    const GenerateSelectedTopic = async () => {
        if (!selectedTopic) {
            toast.error("Please select a topic before continuing");
            return; // Stop execution
          }
        setLoading(true)
        toast('Your content is generating')
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
        user&&GetCredits()
        setLoading(false)
        toast("Your content is generated")

        router.replace('/dashboard')
    }
    // const { courseId, topic, courseType, courseLayout, difficultyLevel, createdBy } = await req.json();

    useEffect(()=>{
        GetStudyTip()
        
    }, [user])

    useEffect(() => {
        if (!user || !isLoaded) return;
        
        const interval = setInterval(() => {
            GetCredits(); // Fetch the latest credits from the DB
        }, 5000); // Runs every 5 seconds
    
        return () => clearInterval(interval); // Cleanup interval when component unmounts
    }, [user, isLoaded]);
    

  


    // courseId, topic, courseType, courseLayout, difficultyLevel, createdBy, exam_time

    const GetStudyTip=async()=>{
        const res = await axios.post('/api/generate-ai-tips',{
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

    return (
       
                <>
                    {/* Sidebar with hamburger menu that stays fixed */}
                    <div
                    style={{ display: isSidebarVisible ? 'block' : 'none' }}
                        className={`fixed h-screen transition-all duration-300 ease-in-out ${
                            isSidebarExpanded ? 'w-64' : 'w-8'
                        }`}
                    >
                        {/* Header with logo and hamburger that's always visible */}
                        <div className={`flex gap-2 items-center p-4 ${
                        isSidebarExpanded ? 'bg-gradient-to-br from-white via-blue-50 to-indigo-50' : 'bg-transparent'
                    }`}>
                        {/* Logo with subtle animation */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-indigo-400 rounded-full blur-md opacity-50 animate-pulse"></div>
                            <Image src={'/lg.png'} style={{ backgroundColor: 'transparent' }} color='black' alt='logo' width={40} height={40} className="relative drop-shadow-lg" />
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
                                    {totalCredit > 0 ? <Button
                                        className='w-full cursor-pointer bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                                        onClick={() => setOpenDialogue(true)}
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" /> Create New
                                    </Button> : 
                                    <Button
                                        className='w-full cursor-pointer bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                                        onClick={() => toast('You have run out of credits')}
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" /> Credits Required
                                    </Button>
                                    }
                                </div>
    
                                {/* Menu List */}
                                <div className='mt-8 space-y-2'>
                                    {MenuList.map((menu, index) => (
                                        <Link href={menu.path} key={index}>
                                            <div
                                                className={`flex gap-4 items-center p-3.5 rounded-xl cursor-pointer transition-all duration-300
                                                    ${path === menu.path
                                                    ? 'bg-gradient-to-r from-indigo-100/80 to-blue-50 text-indigo-600 shadow-md border-l-4 border-indigo-500'
                                                    : 'text-gray-700 hover:bg-white/70 hover:shadow-sm border-l-4 border-transparent'}`}
                                            >
                                                <div className={`p-2 rounded-lg ${path === menu.path ? 'bg-white/90 shadow-sm' : 'bg-gray-100/70'}`}>
                                                    <menu.icon className={`w-5 h-5 ${path === menu.path ? 'text-indigo-600' : 'text-gray-600'}`} />
                                                </div>
                                                <h2 className={`text-md font-medium transition-all ${path === menu.path ? 'font-semibold' : ''}`}>
                                                    {menu.name}
                                                </h2>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                
                                {/* AI Tips/Suggestion */}
                                <div className="mt-6 bg-indigo-50/80 backdrop-blur-sm p-4 rounded-xl border border-indigo-100/50 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center mb-2">
                                        <Brain className="w-5 h-5 text-indigo-500 mr-2" />
                                        <span className="text-sm font-medium text-indigo-700">Motivation Tip</span>
                                    </div>
                                    <p className="text-xs text-indigo-600 italic">{tip}</p>
                                </div>
    
                                {/* Credits Section */}
                                <div className="relative mt-6 mb-4">
                                    <div className="w-full border p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all">
                                        <div className="flex items-center justify-between mb-2">
                                            <h2 className="text-md text-gray-800 font-medium"> Remaining Credits: </h2>
                                            <span className="text-indigo-600 font-bold">
                                            {totalCredit}
                                            </span>
                                        </div>
    
                                        {/* Progress Bar */}
                                        <div className="relative h-3 w-full bg-blue-100/60 rounded-full overflow-hidden">
                                            <div
                                                className="absolute h-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 transition-all"
                                                style={{ width: `${Math.min((credit?.totalCredits / credit?.totalCreditSize) * 100, 100)}%` }}
                                            />
                                            {/* Divider to show free credit limit */}
                                            <div className="absolute left-[50%] h-full w-0.5 bg-gray-400/50"></div>
                                        </div>
    
                                        <h2 className="text-xs mt-1 text-gray-500">Includes 10 Free Per Month</h2>
    
                                        {/* Next Reset Date */}
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
                                        key={index}
                                        className={`cursor-pointer p-4 flex flex-col items-center justify-center border-2 rounded-xl transition-all duration-300 ease-in-out 
                                            ${option.color} ${option.hoverColor} 
                                            ${option.name === selectOption ? 'border-indigo-500 shadow-lg scale-105' : 'border-transparent'}`}
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
           
            </>
            )}
       


export default SideBar;