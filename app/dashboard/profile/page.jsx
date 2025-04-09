"use client"
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { User, Clock, CreditCard, Mail, Sparkles, Zap, Award, Flame } from 'lucide-react';
import {  useClerk, useUser } from '@clerk/nextjs';
import axios from 'axios';
import { motion } from 'framer-motion';
import FloatingStudyElements from '@/app/FloatingStudyElemens';
import { Button } from '@/components/ui/button';

const ProfileProgressGraph = () => {
  const [timeframe, setTimeframe] = useState('weekly');
  const { user, isLoaded } = useUser();
  const [userDetails, setUserDetails] = useState();
  const [teachMode, setTeachMode] = useState([]);
  const [studyMode, setStudyMode] = useState([]);
  const [practiceMode, setPracticeMode] = useState([]);
  const [examMode, setExamMode] = useState([]);
  const { signOut } = useClerk()
  const [validCompletedCourses, setValidCompletedCourses] = useState({
    study: [],
    practice: [],
    exam: [],
    teach: []
  });
  const [topics, setTopics] = useState({
    study: [],
    practice: [],
    exam: [],
    teach: []
  });
  const [processedData, setProcessedData] = useState({
    daily: [],
    weekly: [],
    monthly: []
  });
  
  const GetUserDetails = async () => {
    const res = await axios.post('/api/check-new-member', {
      createdBy: user?.primaryEmailAddress?.emailAddress
    });
    setUserDetails(res.data.res);
  }

  useEffect(() => {
    if (!isLoaded || !user) return;
  
    GetUserDetails();
  }, [isLoaded, user]);
  

  // User data
  const userData = {
    username: userDetails?.name || "User",
    email: user?.primaryEmailAddress?.emailAddress || "",
    createdAt: userDetails?.createdAt || "N/A",
    totalCredits: userDetails?.newPurchasedCredit || 0
  };

  const GetAllModes = async () => {
    const teachMode = await axios.post('/api/fetch-all-modes', {
      createdBy: user?.primaryEmailAddress?.emailAddress,
      mode: 'teach'
    });
    setTeachMode(teachMode.data);

    const studyMode = await axios.post('/api/fetch-all-modes', {
      createdBy: user?.primaryEmailAddress?.emailAddress,
      mode: 'study'
    });
    setStudyMode(studyMode.data);

    const practiceMode = await axios.post('/api/fetch-all-modes', {
      createdBy: user?.primaryEmailAddress?.emailAddress,
      mode: 'practice'
    });
    setPracticeMode(practiceMode.data);

    const examMode = await axios.post('/api/fetch-all-modes', {
      createdBy: user?.primaryEmailAddress?.emailAddress,
      mode: 'exam'
    });
    setExamMode(examMode.data);
  }

  useEffect(() => {
    if (studyMode && teachMode && practiceMode && examMode) CheckCompletedCourses();
  }, [studyMode, teachMode, practiceMode, examMode]);

  const CheckCompletedCourses = () => {
    let completedCourses = {
      study: [],
      practice: [],
      exam: [],
      teach: []
    };
    
    let topic = {
      study: [],
      practice: [],
      exam: [],
      teach: []
    };
    
    studyMode.forEach(course => {
      if (course?.progress >= 100) {
        topic.study.push(course?.aiReponse?.courseTitle);
        completedCourses.study.push(course);
      }
    });
    
    teachMode.forEach(course => {
      if (course?.progress >= 100) {
        topic.teach.push(course?.topics?.courseTitle);
        completedCourses.teach.push(course);
      }
    });
    
    practiceMode.forEach(course => {
      if (course?.progress >= 100) {
        topic.practice.push(course?.aiReponse?.quizTitle);
        completedCourses.practice.push(course);
      }
    });
    
    examMode.forEach(course => {
      if (course?.questionCount >= 5) {
        topic.exam.push(course?.currQuestionAiResp?.courseTitle);
        completedCourses.exam.push(course);
      }
    });
    
    setTopics(topic);
    setValidCompletedCourses(completedCourses);
    console.log(completedCourses)
    
    processData(completedCourses);
  }

  useEffect(() => {
    user && GetAllModes();
  }, [user]);

  // Process the real data for the chart
  const processData = (completedCourses) => {
    // Helper function to parse dates in DD-MM-YYYY format
    const parseDate = (dateString) => {
      if (!dateString) return null;
      
      // Check if it's in DD-MM-YYYY format
      if (typeof dateString === 'string' && dateString.includes('-')) {
        const [day, month, year] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day); // month is 0-based in JS
      }
      
      // Fallback to regular date parsing
      return new Date(dateString);
    };
   
    // Flatten all completed courses into a single array with created dates
    const allCourses = [
      
      ...completedCourses.study.map(course => ({
        mode: 'Study',
        title: course?.aiResponse?.courseTitle,
        date: parseDate(course?.createdAt)
      })),
      ...completedCourses.teach.map(course => ({
        mode: 'Teach',
        title: course?.topics?.courseTitle,
        date: parseDate(course?.createdAt)
      })),
      ...completedCourses.practice.map(course => ({
        mode: 'Practice',
        title: course?.aiResponse?.quizTitle,
        date: parseDate(course?.createdAt)
      })),
      ...completedCourses.exam.map(course => ({
        mode: 'Exam',
        title: course?.currQuestionAiResp?.courseTitle,
        date: parseDate(course?.createdAt)
      }))
    ].filter(course => course?.date && !isNaN(course.date));
    
    console.log("All courses after date parsing:", allCourses);
    
    // Sort by creation date
    allCourses.sort((a, b) => a.date - b.date);
    
    // Process for daily data
    const dailyData = processTimeframe(allCourses, 'day');
    
    // Process for weekly data
    const weeklyData = processTimeframe(allCourses, 'week');
    
    // Process for monthly data
    const monthlyData = processTimeframe(allCourses, 'month');
    
    setProcessedData({
      daily: dailyData,
      weekly: weeklyData,
      monthly: monthlyData
    });
  };
  
  const processTimeframe = (courses, timeframe) => {
    const timeframeMap = new Map();
    
    courses.forEach(course => {
      const date = course.date;
      if (!date || isNaN(date.getTime())) return; // Make sure it's a valid date
      
      let key;
      
      if (timeframe === 'day') {
        key = `${date.getMonth() + 1}/${date.getDate()}`;
      } else if (timeframe === 'week') {
        // Get the week number
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        key = `Week ${weekNumber}`;
      } else if (timeframe === 'month') {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        key = monthNames[date.getMonth()];
      }
      
      if (!timeframeMap.has(key)) {
        timeframeMap.set(key, {
          date: key,
          completedCourses: 0,
          courses: [],
          courseDetails: []
        });
      }
      
      const entry = timeframeMap.get(key);
      
      if (course.title && !entry.courses.includes(course.title)) {
        entry.completedCourses++;
        entry.courses.push(course.title);
        entry.courseDetails.push({
          title: course.title,
          mode: course.mode,
          createdAt: date.toLocaleDateString() // Format date consistently
        });
      }
    });
    
    // Convert map to array and sort by date
    return Array.from(timeframeMap.values());
  };

  // Custom tooltip component with emoji indicators based on mode
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <p className="font-semibold text-gray-800 dark:text-white">{label}</p>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium">
            {data.completedCourses} courses completed
          </p>
          {data.courseDetails && data.courseDetails.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Courses:</p>
              <ul className="text-sm text-gray-600 dark:text-gray-300">
                {data.courseDetails.map((course, index) => (
                  <li key={index} className="mt-1 flex items-center">
                    {course.mode === 'Study' && <span className="mr-1">📚</span>}
                    {course.mode === 'Teach' && <span className="mr-1">👨‍🏫</span>}
                    {course.mode === 'Practice' && <span className="mr-1">🎯</span>}
                    {course.mode === 'Exam' && <span className="mr-1">🏆</span>}
                    <span>{course.title}</span>
                    <span className="ml-1 text-xs text-gray-400">({course.mode})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      );
    }
    return null;
  };
  
  const getGradientId = () => {
    return 'progressGradient';
  };
  
  // Calculate current streak and total courses
  const calculateStreakAndTotal = () => {
    let streak = 0;
    let total = 0;
    
    // Calculate total unique courses
    const uniqueCourses = new Set();
    Object.values(topics).forEach(modeTopics => {
      modeTopics.forEach(topic => {
        uniqueCourses.add(topic);
      });
    });
    
    total = uniqueCourses.size;
    
    // Calculate streak (simplified)
    if (processedData.daily.length > 0) {
      const lastDayData = processedData.daily[processedData.daily.length - 1];
      if (lastDayData.completedCourses > 0) {
        streak = 1;
        let i = processedData.daily.length - 2;
        while (i >= 0 && processedData.daily[i].completedCourses > 0) {
          streak++;
          i--;
        }
      }
    }
    
    return { streak, total };
  };
  
  const { streak, total } = calculateStreakAndTotal();
  
  // Custom dot component with emojis based on mode
  const CustomizedDot = (props) => {
    const { cx, cy, index, payload } = props;
    
    // If there are no courses completed on this day, just show a regular dot
    if (!payload.completedCourses) {
      return (
        <circle cx={cx} cy={cy} r={5} fill="#6366F1" />
      );
    }
    
    // Otherwise, show a mode-specific emoji
    const course = payload.courseDetails && payload.courseDetails[0];
    const mode = course?.mode || 'Study';
    
    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill="#6366F1" />
        <motion.g 
          whileHover={{ scale: 1.2 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {mode === 'Study' && <text x={cx - 7} y={cy + 4} fontSize="12">📚</text>}
          {mode === 'Teach' && <text x={cx - 7} y={cy + 4} fontSize="12">👨‍🏫</text>}
          {mode === 'Practice' && <text x={cx - 7} y={cy + 4} fontSize="12">🎯</text>}
          {mode === 'Exam' && <text x={cx - 7} y={cy + 4} fontSize="12">🏆</text>}
        </motion.g>
      </g>
    );
  };
  
  return (
    <motion.div 
      className="w-full mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 md:p-6 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FloatingStudyElements/>
      {/* User Profile Info Section */}
      <motion.div 
        className="mb-6 md:mb-8 border-b border-gray-200 dark:border-gray-700 pb-6"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex items-center">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-md"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {userData.username?.slice(0, 2).toUpperCase() || "ME"}
            </motion.div>
            <div className="ml-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{userData.username}</h2>
              <div className="flex items-center text-sm md:text-base text-gray-500 dark:text-gray-400 mt-1">
                <Mail size={14} className="mr-1" />
                <span className="truncate max-w-full md:max-w-none">{userData.email}</span>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="bg-indigo-100 dark:bg-indigo-900/30 rounded-xl p-3 shadow-md mt-4 md:mt-0"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-indigo-600 dark:text-indigo-300 font-medium text-sm">
              Total Credits Purchased
            </div>
            <div className="flex items-center mt-1">
              <CreditCard size={16} className="text-indigo-600 dark:text-indigo-400 mr-1" />
              <span className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{userData.totalCredits}</span>
            </div>
            <div className="text-xs text-indigo-500 dark:text-indigo-400 mt-1 italic">
              Thank you for your support! ✨
            </div>
          </motion.div>
        </div>
        
        <div className="mt-4 text-sm flex items-center text-gray-600 dark:text-gray-400">
          <Clock size={14} className="mr-1" />
          <span>Member since {userData.createdAt}</span>
        </div>
        <Button 
          variant="outline" 
          className="cursor-pointer mt-3 text-gray-600 dark:text-gray-400 hover:bg-red-50 transition"
          onClick={() => signOut({ redirectUrl: '/home' })}
        >
          Sign out
        </Button>
      </motion.div>
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <motion.h2 
          className="text-lg md:text-xl font-bold text-gray-800 dark:text-white flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Learning Progress 
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="ml-2"
          >
            📚
          </motion.span>
        </motion.h2>
        <motion.div 
          className="flex flex-wrap gap-2 md:gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTimeframe('daily')}
            className={`px-3 py-1 md:px-4 md:py-2 text-sm rounded-full transition-all shadow-md ${
              timeframe === 'daily'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Daily
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1 md:px-4 md:py-2 text-sm rounded-full transition-all shadow-md ${
              timeframe === 'weekly'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Weekly
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1 md:px-4 md:py-2 text-sm rounded-full transition-all shadow-md ${
              timeframe === 'monthly'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Monthly
          </motion.button>
        </motion.div>
      </div>
  
      <motion.div 
        className="w-full h-48 md:h-64"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={processedData[timeframe]} 
            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
          >
            <defs>
              <linearGradient id={getGradientId()} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6B7280', fontSize: '11px' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => {
                // For mobile, we can shorten the date format
                const isMobile = window.innerWidth < 768;
                if (isMobile) {
                  return value.split(' ')[0]; // Just show the first part of the date
                }
                return value;
              }}
            />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: '11px' }}
              axisLine={{ stroke: '#E5E7EB' }}
              allowDecimals={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ marginTop: '10px' }} />
            <Line
              type="monotone"
              dataKey="completedCourses"
              name="Completed Courses"
              stroke="url(#progressGradient)"
              strokeWidth={3}
              dot={<CustomizedDot />}
              activeDot={{ r: 8, fill: '#4F46E5' }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
      
      <motion.div 
        className="mt-4 flex flex-col md:flex-row md:justify-between md:items-center text-sm space-y-2 md:space-y-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-indigo-500 mr-2"></div>
          <span className="text-gray-600 dark:text-gray-300">Current Streak: {streak} days</span>
          <motion.span 
            className="ml-1" 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
          >
            🔥
          </motion.span>
        </div>
        <div className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center">
          <span>Total Courses: {total}</span>
          <motion.span 
            className="ml-1"
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.9, type: "spring" }}
          >
            ⭐
          </motion.span>
        </div>
      </motion.div>
  
      {/* Legend explaining emojis */}
      <motion.div 
        className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2 justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <motion.div 
          whileHover={{ scale: 1.1, y: -2 }}
          className="flex items-center bg-blue-100 dark:bg-blue-900/20 rounded-full px-3 py-1 shadow-sm"
        >
          <span className="text-base md:text-lg mr-1">📚</span>
          <span className="text-xs text-gray-700 dark:text-gray-300">Study</span>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.1, y: -2 }}
          className="flex items-center bg-green-100 dark:bg-green-900/20 rounded-full px-3 py-1 shadow-sm"
        >
          <span className="text-base md:text-lg mr-1">👨‍🏫</span>
          <span className="text-xs text-gray-700 dark:text-gray-300">Teach</span>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.1, y: -2 }}
          className="flex items-center bg-orange-100 dark:bg-orange-900/20 rounded-full px-3 py-1 shadow-sm"
        >
          <span className="text-base md:text-lg mr-1">🎯</span>
          <span className="text-xs text-gray-700 dark:text-gray-300">Practice</span>
        </motion.div>
        <motion.div 
          whileHover={{ scale: 1.1, y: -2 }}
          className="flex items-center bg-yellow-100 dark:bg-yellow-900/20 rounded-full px-3 py-1 shadow-sm"
        >
          <span className="text-base md:text-lg mr-1">🏆</span>
          <span className="text-xs text-gray-700 dark:text-gray-300">Exam</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileProgressGraph;