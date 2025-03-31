import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLearningMode } from './LearningModeContext';
import axios from 'axios';
import { useCourse } from './CourseIdProvider';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast'; // Make sure this import is added

const LearningProgressStepper = ({ currentMode }) => {
  const { setMode, currentModes } = useLearningMode();
  const { course } = useCourse();
  const [generatedModes, setGeneratedModes] = useState({
    teach: false,
    study: false,
    practice: false,
    exam: false
  });
  const [loading, setLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState(null); // Track which mode is loading
  const [prevMode, setPrevMode] = useState();
  const modes = [
    { id: 'teach', label: 'Teach' },
    { id: 'study', label: 'Study' },
    { id: 'practice', label: 'Practice' },
    { id: 'exam', label: 'Exam' }
  ];
  const router = useRouter();

  useEffect(() => {
    CheckExist();
  }, [course?.courseId]);

  const CheckExist = async () => {
    console.log(course?.courseId);
    const res = await axios.post('/api/check-exist', {
      courseId: course?.courseId
    });
    setGeneratedModes(res.data);
    console.log(res.data);
  };

  useEffect(() => {
    console.log(course);
  }, [course]);

  const GenerateStudyContent = async (mode, lastMode) => {
    setLoading(true);
    setLoadingMode(mode); // Set which mode is currently loading
    toast('Content is generating...');
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

    if (mode === 'teach') {
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

      router.push('/teach-me/' + course?.courseId);

    } else if (mode === 'study') {
      payload = {
        courseId: course?.courseId,
        topic: topic,
        courseType: 'Study',
        courseLayout: summary,
        difficultyLevel: 'Easy',
        createdBy: course?.createdBy
      };
      console.log("Study Payload: ", payload);

      const res = await axios.post('/api/generate-course-outline', payload);
      console.log(res.data);
      router.push('/course/' + course?.courseId);

    } else if (mode === 'practice') {
      payload = {
        courseId: course?.courseId,
        topic: topic,
        courseType: 'practice',
        courseLayout: summary,
        difficultyLevel: 'Easy',
        createdBy: course?.createdBy
      };
      console.log("Practice Payload: ", payload);

      const res = await axios.post('/api/generate-practice-questions', payload);
      console.log(res.data);
      router.push('/quiz/' + course?.courseId);

    } else if (mode === 'exam') {
      payload = {
        courseId: course?.courseId,
        topic: topic,
        courseType: 'exam',
        courseLayout: summary,
        difficultyLevel: 'Easy',
        createdBy: course?.createdBy,
        exam_time: 30
      };
      console.log("Exam Payload: ", payload);

      const res = await axios.post('/api/generate-exam', payload);
      console.log(res.data);
      router.push('/exam/' + course?.courseId);
    }
   
    toast('Redirecting...')
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
      combinedSummary = course?.aiResponse;
    } else if (prevMode == 'exam') {
      console.log('exam');
      combinedSummary = course?.aiResponse;
    }
    return combinedSummary;
  };

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
      topic = course?.aiResponse;
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

    if (generatedModes[mode.id]) {
      if (mode.id === 'teach') {
        router.push('/teach-me/' + course?.courseId + '/feedback');
      } else if (mode.id === 'practice') {
        router.push('/quiz/' + course?.courseId);
      } else if (mode.id === 'study') {
        router.push('/course/' + course?.courseId);
      } else if (mode.id === 'exam') {
        router.push('/exam/' + course?.courseId + '/feedback');
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

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      {/* Top label showing current mode */}
      <div className="text-center mb-4">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-medium text-indigo-500 bg-indigo-50 px-4 py-1 rounded-full"
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
            const isCompleted = index <= currentIndex && generatedModes[mode.id];
            const isActive = index === currentIndex;
            const isGenerated = generatedModes[mode.id];
            const isLoading = loadingMode === mode.id && loading;

            return (
              <div key={mode.id} className="flex flex-col items-center">
                {/* Circle */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    boxShadow: isActive ? '0 0 0 4px rgba(99, 102, 241, 0.2)' : 'none',
                    rotate: isLoading ? 360 : 0,
                  }}
                  transition={{
                    rotate: isLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : { duration: 0 }
                  }}
                  whileHover={{ scale: 1.1, cursor: 'pointer' }}
                  onClick={() => !loading && handleStepClick(mode)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                    isLoading
                      ? 'bg-indigo-300 text-white'
                      : isActive
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                        : isGenerated
                          ? 'bg-indigo-400 text-white'
                          : isCompleted
                            ? 'bg-gradient-to-r from-indigo-300 to-purple-400 text-white'
                            : 'bg-white border-2 border-gray-200 text-gray-400'
                  }`}
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
                    index + 1
                  )}
                </motion.div>

                {/* Label */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + (index * 0.1) }}
                  className={`mt-2 text-sm font-medium ${
                    isActive
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