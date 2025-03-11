"use client";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LayoutDashboard, Shield, UserCircle, Menu } from 'lucide-react'; // Import Menu icon
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
import { STUDY_MATERIAL_TABLE } from '@/configs/schema';
import { desc, eq } from 'drizzle-orm';
import { SidebarContext } from '../../SidebarContext';




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
    const { isSidebarExpanded, setIsSidebarExpanded } = useContext(SidebarContext) // State for sidebar expansion

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

    const router = useRouter();

    const Options = [
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
        if (selectOption === 'Practice' || selectOption === 'Exam') {
            setConfirmSelection(true);
        } else {
            router.push('/create');
            setOpenDialogue(false);
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
            const res = await db
                .select()
                .from(STUDY_MATERIAL_TABLE)
                .where(eq(STUDY_MATERIAL_TABLE.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(STUDY_MATERIAL_TABLE.id));

            const topicsList = res.map(item => item.topic);
            setTopics(topicsList);
        } catch (error) {
            console.error("Error fetching topics:", error);
        }
    };

    const handleSelectTopic = (topic) => {
        setSelectedTopic(topic);
    };

    useEffect(() => {
        if (isLoaded && user) {
            fetchTopics(user);
        }
    }, [isLoaded, user]);

    return (
        <>
            
            {!isSidebarExpanded&& <div
                className={`fixed top-4 mr-5 z-50 p-2 bg-white rounded-r-md shadow-sm cursor-pointer transition-all ${isSidebarExpanded ? 'ml-64' : 'ml-4'}`}
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            >
                <Menu className="w-6 h-6 text-gray-700" />
            </div>}

            {/* Sidebar */}
            <div
                className={`fixed h-screen shadow-md p-5 bg-white ${isSidebarExpanded ? 'w-64' : 'w-0 overflow-hidden'}`}
            >
             
                {/* Logo */}
                <div className='flex gap-2 items-center'>
    {/* Logo */}
    <Image src={'/logo.svg'} color='black' alt='logo' width={40} height={40} />

    {/* Title */}
    {isSidebarExpanded&&<h2 className='font-bold text-2xl text-gray-800'>CramifyAI</h2>}

    {/* Hamburger Menu */}
    <div
        className='p-2 bg-white rounded-r-md shadow-sm cursor-pointer transition-all'
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
    >
        <Menu className="w-6 h-6 text-gray-700" />
    </div>
</div>

                {/* Create New Button */}
                {isSidebarExpanded&&<div className='mt-10'>
                    <Button
                        className='w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all'
                        onClick={() => setOpenDialogue(true)}
                    >
                        + Create New
                    </Button>
                </div>}

                {/* Menu List */}
                {isSidebarExpanded&&<div className='mt-5'>
                    {MenuList.map((menu, index) => (
                        <Link href={menu.path} key={index}>
                            <div
                                className={`mt-3 flex gap-5 items-center p-3 hover:bg-blue-50 rounded-lg cursor-pointer transition-all
                                    ${path === menu.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                            >
                                <menu.icon className={`w-5 h-5 ${path === menu.path ? 'text-blue-600' : 'text-gray-500'}`} />
                                <h2 className='text-md font-medium'>{menu.name}</h2>
                            </div>
                        </Link>
                    ))}
                </div>
}
                {/* Credits Section */}
                {isSidebarExpanded&&<div className="relative mt-64 bottom-4">
                    <div className="absolute mt-52 w-[100%] left-1/2 transform -translate-x-1/2 border p-4 bg-blue-50 rounded-lg shadow-sm">
                        <h2 className="text-md mb-2 text-gray-800">Available Credits:</h2>
                        <Progress value={30} className="h-2 bg-blue-100" />
                        <h2 className="text-sm text-gray-600 mt-1">Out of 5 Credits Used</h2>
                        <Link href={'/dashboard/upgrade'} className="text-blue-600 text-xs mt-2 hover:underline">
                            Upgrade to create more
                        </Link>
                    </div>
                </div>}

                {/* Dialog for Study Material Selection */}
                <Dialog open={openDialogue} onOpenChange={setOpenDialogue}>
                    <DialogContent className='bg-white rounded-lg shadow-lg max-w-md'>
                        <DialogHeader>
                            <DialogTitle className='text-center text-2xl font-bold text-gray-800'>
                                Select Study Material Type
                            </DialogTitle>
                            <DialogDescription className='text-center text-gray-600'>
                                {selectOption === 'Study'
                                    ? "Create your own personalized study guide and flashcards"
                                    : selectOption === 'Exam'
                                        ? "Challenge yourself with a realistic, timed exam"
                                        : selectOption === 'Practice'
                                            ? "Sharpen your memory with AI-generated quizzes"
                                            : ''}
                            </DialogDescription>

                            {/* Study Material Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                {Options.map((option, index) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer p-4 flex flex-col items-center justify-center border-2 rounded-xl transition-all duration-300 ease-in-out 
                                            ${option.color} ${option.hoverColor} 
                                            ${option.name === selectOption ? 'border-blue-500 shadow-lg scale-105' : 'border-transparent'}`}
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
                                    className='mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all cursor-pointer'
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
                                            className='cursor-pointer bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all'
                                            onClick={() => handleConfirmation(false)}
                                        >
                                            No
                                        </Button>
                                        <Button
                                            className='cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all'
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
                                    <div className='mt-4 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 rounded-lg'>
                                        {topics.length > 0 ? (
                                            topics.map((topic, index) => (
                                                <div
                                                    key={index}
                                                    className={`cursor-pointer p-3 rounded-lg transition-all
                                                        ${selectedTopic === topic ? 'bg-blue-500 text-white' : 'hover:bg-blue-50 text-gray-700'}`}
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
                                        className='cursor-pointer mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition-all'
                                        onClick={() => setShowTopicSelection(false)}
                                    >
                                        Back
                                    </Button>
                                </>
                            )}
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

export default SideBar;