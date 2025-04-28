import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLearningMode } from './LearningModeContext';
import axios from 'axios';
import { useCourse } from './CourseIdProvider';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast'; // Make sure this import is added
import { useUser } from '@clerk/nextjs';
import { ArrowRight, CheckCircle, CreditCard, XCircle } from 'lucide-react';

const LearningProgressStepper = ({ currentMode }) => {
  const { setMode, currentModes } = useLearningMode();
  const { course } = useCourse();
  // Update the state structure to include both exists flag and data
  const [generatedModes, setGeneratedModes] = useState({
    teach: { exists: false, data: null },
    study: { exists: false, data: null },
    practice: { exists: false, data: null },
    exam: { exists: false, data: null }
  });
  const [loading, setLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState(null); // Track which mode is loading
  const [prevMode, setPrevMode] = useState();
  const [userDetails, setUserDetails] = useState()
  const modes = [
    { id: 'teach', label: 'Teach' },
    { id: 'study', label: 'Study' },
    { id: 'practice', label: 'Practice' },
    { id: 'exam', label: 'Exam' }
  ];
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [showIntroOverlay, setShowIntroOverlay] = useState(false);
  const [teachFeedback, setTeachFeedback] = useState()
  useEffect(() => {
    if (!isLoaded || !user || !course?.courseId) return;

    GetUserDetails();
    CheckExist();
    GetTeachFeedback()
  }, [isLoaded, user, course?.courseId]);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('cramsmartCourseIntroSeen') === 'true';
    if (!hasSeenIntro) {
      setShowIntroOverlay(true);
    }
  }, []);





  const dismissOverlay = () => {
    setShowIntroOverlay(false);
    localStorage.setItem('cramsmartCourseIntroSeen', 'true');
  };

  const GetUserDetails = async () => {
    const res = await axios.post('/api/check-new-member', {
      createdBy: user?.primaryEmailAddress?.emailAddress
    })
    setUserDetails(res.data.res)
  }


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

  const GetTeachFeedback = async () => {
    const dbRes = await axios.get('/api/get-teach-feedback?courseId=' + course?.courseId)
    setTeachFeedback(dbRes.data.result.aiFeedback || null)
  }





  const CheckExist = async () => {
    console.log(course?.courseId);
    const res = await axios.post('/api/check-exist', {
      courseId: course?.courseId
    });
    console.log(res.data)
    setGeneratedModes(res.data);

  };

  useEffect(() => {
    console.log(course);
  }, [course]);

  const GenerateStudyContent = async (mode, lastMode) => {


    if (mode === 'teach') {
      if (userDetails?.remainingCredits - 2 >= 0) {
        setLoading(true);
        setLoadingMode(mode); // Set which mode is currently loading
        showSuccessToast('Content is generating...');
        const summary = await GetModeDetails(lastMode);
        const topic = await GetModeTopics(lastMode)
        console.log(summary);
        console.log(mode);

        if (!summary) {
          alert("No content available to generate.");
          setLoading(false);
          setLoadingMode(null); // Reset loading mode
          return;
        }

        let payload;
        payload = {
          courseId: course?.courseId,
          difficultyLevel: 'Easy',
          amount: 1,
          courseLayout: summary,
          topic: topic,
          createdBy: course?.createdBy
        };
        console.log("Teach Payload: ", payload);

        const res = await axios.post('/api/vapi/generate', payload);
        console.log(res.data);
        showCreditSpentToast('2 Credits Spent')

        router.push('/teach-me/' + course?.courseId);
      } else {
        showErrorToast('Insufficient Credit')
      }


    } else if (mode === 'study') {
      if (userDetails?.remainingCredits - 1 >= 0) {
        setLoading(true);
        setLoadingMode(mode); // Set which mode is currently loading
        showSuccessToast('Content is generating...');
        const summary = await GetModeDetails(lastMode);
        const topic = await GetModeTopics(lastMode)
        console.log(summary);
        console.log(mode);

        if (!summary) {
          alert("No content available to generate.");
          setLoading(false);
          setLoadingMode(null); // Reset loading mode
          return;
        }

        let payload;
        payload = {
          courseId: course?.courseId,
          topic: topic,
          courseType: 'Study',
          courseLayout: teachFeedback == null ? summary : teachFeedback,
          difficultyLevel: 'Medium',
          createdBy: course?.createdBy
        };
        console.log("Study Payload: ", payload);

        const res = await axios.post('/api/generate-course-outline', payload);
        console.log(res.data);
        showCreditSpentToast('1 Credits Spent')

        router.push('/course/' + course?.courseId);
      } else {
        showErrorToast('Insufficient Credit')
      }


    } else if (mode === 'practice') {
      if (userDetails?.remainingCredits - 1 >= 0) {
        setLoading(true);
        setLoadingMode(mode); // Set which mode is currently loading
        showSuccessToast('Content is generating...');
        const summary = await GetModeDetails(lastMode);
        const topic = await GetModeTopics(lastMode)
        console.log(summary);
        console.log(mode);

        if (!summary) {
          alert("No content available to generate.");
          setLoading(false);
          setLoadingMode(null); // Reset loading mode
          return;
        }

        let payload;
        payload = {
          courseId: course?.courseId,
          topic: topic,
          courseType: 'practice',
          courseLayout: teachFeedback == null ? summary : teachFeedback,
          difficultyLevel: 'Medium',
          createdBy: course?.createdBy
        };
        console.log("Practice Payload: ", payload);

        const res = await axios.post('/api/generate-practice-questions', payload);
        console.log(res.data);
        showCreditSpentToast('1 Credits Spent')

        router.push('/quiz/' + course?.courseId);
      } else {
        showErrorToast('Insufficient Credit')
      }


    } else if (mode === 'exam') {
      if (userDetails?.remainingCredits - 1 >= 0) {
        setLoading(true);
        setLoadingMode(mode); // Set which mode is currently loading
        showSuccessToast('Content is generating...');
        const summary = await GetModeDetails(lastMode);
        const topic = await GetModeTopics(lastMode)
        console.log(summary);
        console.log(mode);

        if (!summary) {
          alert("No content available to generate.");
          setLoading(false);
          setLoadingMode(null); // Reset loading mode
          return;
        }

        let payload;
        payload = {
          courseId: course?.courseId,
          topic: topic,
          courseType: 'exam',
          courseLayout: teachFeedback == null ? summary : teachFeedback,
          difficultyLevel: 'Medium',
          createdBy: course?.createdBy,
          exam_time: 30
        };
        console.log("Exam Payload: ", payload);

        const res = await axios.post('/api/generate-exam', payload);
        console.log(res.data);
        showCreditSpentToast('1 Credits Spent')

        router.push('/exam/' + course?.courseId);
      } else {
        showErrorToast('Insufficient Credit')
      }

    }


    setLoading(false);
    setLoadingMode(null); // Reset loading mode
  };

  const GetModeDetails = async (prevMode) => {
    let combinedSummary = "";
    console.log(prevMode);
    if (prevMode == 'study') {
      console.log('study');
      combinedSummary = course?.aiResponse?.chapters?.map(chapter => chapter.summary).join(" ");

      console.log(combinedSummary);
    } else if (prevMode == 'teach') {
      console.log('teach');

      combinedSummary = course?.aiFeedback;
    } else if (prevMode == 'practice') {
      console.log('practice');
      combinedSummary = course?.courseLayout;
    } else if (prevMode == 'exam') {
      console.log('exam');
      try {
        const res = await axios.get('/api/get-feedback?courseId=' + course?.courseId)
        const resData = res?.data?.result;
        console.log(resData);
        if (resData && Array.isArray(resData)) {
          combinedSummary = resData
            ?.filter(item => item?.aiResponse?.feedback?.rating < 6)
            ?.map(item => item?.aiResponse?.feedback?.explanation)
            ?.join(" || ");
        }
        console.log(combinedSummary);
        if (!combinedSummary) {
          console.log('No feedback data found, using course AI response.');
          combinedSummary = course?.aiResponse
        }
      } catch (err) {
        combinedSummary = course?.aiResponse;
      }
      
    }
    return combinedSummary;
  }

  const GetModeTopics = async (prevMode) => {
    let topic = "";
    console.log(prevMode);
    if (prevMode == 'study') {
      console.log('study');
      topic = course?.aiResponse?.courseTitle

    } else if (prevMode == 'teach') {
      console.log('teach');
      topic = course?.topic;
    } else if (prevMode == 'practice') {
      console.log('practice');
      topic = course?.topic;
    } else if (prevMode == 'exam') {
      console.log('exam');
      const response = await axios.post('/api/study-type', {
        courseId: course?.courseId,
        studyType: 'exam'
      })

      // Clone the object to remove circular references
      const cleanedData = JSON.parse(JSON.stringify(response.data))
      console.log(cleanedData);
      topic = cleanedData?.topic;
    }
    return topic;
  };

  useEffect(() => {
    console.log(prevMode);
    console.log(currentModes);
  }, [prevMode]);

  // Find current mode index
  const currentIndex = modes.findIndex(mode => mode.id === currentMode);

  const handleStepClick = (mode) => {
    console.log("Clicked mode:", mode.id);

    // Store the previous mode immediately by passing the current mode
    const lastMode = currentMode || currentModes;

    setPrevMode(lastMode); // Still update state for reference
    setMode(mode.id);
    console.log(generatedModes)

    if (generatedModes[mode.id].exists) {
      if (mode.id === 'teach') {
        console.log(generatedModes[mode.id]?.data?.progress)
        if (generatedModes[mode.id]?.data?.progress >= 100) {
          router.push('/teach-me/' + course?.courseId + '/feedback');
        } else {
          router.push('/teach-me/' + course?.courseId);
        }

      } else if (mode.id === 'practice') {
        router.push('/quiz/' + course?.courseId);
      } else if (mode.id === 'study') {
        router.push('/course/' + course?.courseId);
      } else if (mode.id === 'exam') {
        console.log(generatedModes[mode.id]?.data?.questionCount)
        console.log(generatedModes[mode.id]?.data?.exam_time)
        console.log(course)
        if (generatedModes[mode.id]?.data?.questionCount >= 5 || generatedModes[mode.id]?.data?.exam_time == 0) {
          router.push('/exam/' + course?.courseId + '/feedback');
        } else {
          router.push('/exam/' + course?.courseId)
        }

      }
    } else {
      // Pass lastMode directly instead of relying on prevMode from state
      GenerateStudyContent(mode.id, lastMode);
    }
  };

  useEffect(() => {
    console.log("Current Mode:", currentMode);
  }, [currentMode]);

  // Fix for progress bar calculation
  const modeIndices = {
    teach: 0,
    study: 1,
    practice: 2,
    exam: 3
  };

  // Calculate progress width based on current mode index
  const currentModeIndex = modeIndices[currentMode] || 0;
  // Calculate progress percentage (0% for teach, 33% for study, 66% for practice, 100% for exam)
  const progressWidth = currentModeIndex > 0 ? ((currentModeIndex) / (modes.length - 1)) * 100 : 0;


  // Add this to your existing styles section
  const goldenShimmerStyles = `
.golden-locked {
  background: linear-gradient(
    45deg, 
    #FFD700,
    #FDB931,
    #F0C419,
    #FFD700
  );
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  animation: golden-pulse 2s infinite, golden-shimmer 3s infinite;
}

@keyframes golden-pulse {
  0% {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.8);
  }
  100% {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  }
}

@keyframes golden-shimmer {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.golden-locked:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
}
`;


  const shimmerStyles = `
  @keyframes subtle-diamond-shine {
    0% {
      background-position: -100% 0;
    }
    25% {
      background-position: 0% 0;
    }
    50% {
      background-position: 100% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .diamond-shimmer {
    position: relative;
    overflow: hidden;
  }

  .diamond-shimmer::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(
      90deg, 
      rgba(255,255,255,0) 0%, 
      rgba(255,255,255,0.15) 25%, 
      rgba(255,255,255,0.3) 30%, 
      rgba(255,255,255,0.15) 35%, 
      rgba(255,255,255,0) 60%
    );
    background-size: 200% 100%;
    animation: subtle-diamond-shine 4s linear infinite;
    pointer-events: none;
    border-radius: 50%; /* Ensure the shine respects the circle shape */
  }
`;

  const calloutStyles = `
  /* Enhanced pulse effect for ALL circles */
  .diamond-shimmer {
    animation: circle-pulse 4s infinite;
  }
  
  @keyframes circle-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.3);
  }
  40% {
    box-shadow: 0 0 0 12px rgba(124, 58, 237, 0.2);
  }
  70% {
    box-shadow: 0 0 0 16px rgba(124, 58, 237, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(124, 58, 237, 0);
  }
}
  
  /* Different pulse timing for each circle to create a wave effect */
.diamond-shimmer:nth-child(1) {
  animation-delay: 0s;
}

.diamond-shimmer:nth-child(2) {
  animation-delay: 0.6s;
}

.diamond-shimmer:nth-child(3) {
  animation-delay: 1.2s;
}

.diamond-shimmer:nth-child(4) {
  animation-delay: 1.4s;
}
  /* Fallback enhancement for when mode isn't generated */
  .mode-not-generated .diamond-shimmer {
    animation-duration: 6s;
    animation: circle-pulse-enhanced 6s infinite;
  }
  
  @keyframes circle-pulse-enhanced {
    0% {
      box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.6);
    }
    30% {
      box-shadow: 0 0 0 14px rgba(124, 58, 237, 0.4);
    }
    60% {
      box-shadow: 0 0 0 20px rgba(124, 58, 237, 0.2);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(124, 58, 237, 0);
    }
  }
`;



  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <style>{shimmerStyles}</style>
      <style>{calloutStyles}</style>
      <style>{goldenShimmerStyles}</style>
      {/* Top label showing current mode */}
      <div className="text-center mb-4">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-m font-medium text-indigo-500 bg-indigo-50 px-4 py-1 rounded-full"
        >
          Learning Mode: {modes[currentIndex]?.label || 'Not Started'}
        </motion.span>
      </div>

      {/* Progress Stepper */}
      <div className="relative">
        {/* Track */}
        <div className="h-1 bg-gray-200 absolute w-full top-5 rounded-full"></div>

        {/* Completed progress */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressWidth}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="h-1 bg-gradient-to-r from-indigo-500 to-purple-600 absolute top-5 rounded-full"
        />

        {/* Step circles */}
        <div className="relative flex justify-between">
          {modes.map((mode, index) => {
            const isCompleted = index <= currentIndex && generatedModes[mode.id].exists;
            const isActive = index === currentIndex;
            const isGenerated = generatedModes[mode.id].exists;
            const isLoading = loadingMode === mode.id && loading;

            return (
              <div key={mode.id} className="flex flex-col items-center">
                {/* Circle - diamond-shimmer class applied to ALL circles */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    boxShadow: isActive
                      ? '0 0 0 4px rgba(99, 102, 241, 0.2)'
                      : 'none',
                    rotate: isLoading ? 360 : 0,
                  }}
                  transition={{
                    rotate: isLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : { duration: 0 },
                    scale: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileHover={{
                    scale: 1.1,
                    y: !isGenerated ? -5 : 0,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => !loading && handleStepClick(mode)}
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300
                  ${isLoading
                      ? 'bg-indigo-300 text-white'
                      : isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        : isGenerated
                          ? 'bg-indigo-400 text-white'
                          : isCompleted
                            ? 'bg-gradient-to-r from-indigo-300 to-purple-400 text-white'
                            : 'golden-locked text-yellow-900 font-bold cursor-pointer'
                    }
                `}
                >
                  {isLoading ? (
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : isActive || isGenerated || isCompleted ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <span className="text-yellow-900 font-bold">★</span>
                  )}
                </motion.div>

                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                  className={`mt-2 text-sm font-medium ${isActive
                      ? 'text-indigo-600 font-semibold'
                      : isGenerated
                        ? 'text-indigo-500'
                        : isCompleted
                          ? 'text-gray-600'
                          : 'text-gray-400'
                    }`}
                >
                  {mode.label}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearningProgressStepper;