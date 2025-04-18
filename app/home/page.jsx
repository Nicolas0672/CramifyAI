"use client"
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBookOpen,
  FaChartLine,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
  FaRocket,
  FaBrain,
  FaLightbulb,
  FaEnvelope,
  FaTwitter,
  FaLinkedin,
  FaTiktok
} from 'react-icons/fa';
import { BsChatDots } from 'react-icons/bs';
import Typed from 'typed.js';
import Link from 'next/link';
import { useSidebar } from '../SidebarContext';
import { useRouter } from 'next/navigation';


// Animated background component with neural network visualization
const NeuralNetworkBackground = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 400"
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 z-0"
    >
      <defs>
        <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8A4FFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#4FACFF" stopOpacity="0.7" />
        </linearGradient>
        <filter id="glowEffect">
          <feGaussianBlur className="blur" stdDeviation="8" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" />
          <feBlend mode="screen" in="SourceGraphic" />
        </filter>
      </defs>

      {/* Dynamic network lines */}
      {[...Array(12)].map((_, i) => (
        <motion.line
          key={i}
          x1={Math.random() * 600}
          y1={Math.random() * 400}
          x2={Math.random() * 600}
          y2={Math.random() * 400}
          stroke="url(#aiGradient)"
          strokeWidth={Math.random() * 2}
          opacity={0.3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1
          }}
          filter="url(#glowEffect)"
        />
      ))}

      {/* Central AI core */}
      <motion.circle
        cx="300"
        cy="200"
        r="40"
        fill="url(#aiGradient)"
        filter="url(#glowEffect)"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      {/* Neural network nodes */}
      {[...Array(8)].map((_, i) => (
        <motion.circle
          key={i}
          cx={200 + Math.random() * 200}
          cy={100 + Math.random() * 200}
          r={Math.random() * 4 + 2}
          fill="url(#aiGradient)"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            repeatType: "reverse"
          }}
        />
      ))}
    </svg>
  );
};

// Floating study elements animation
const FloatingStudyElements = () => {
  const elements = [
    { icon: "📚", delay: 0, position: "top-20 left-20", size: "text-3xl" },
    { icon: "🧠", delay: 0.5, position: "top-24 right-24", size: "text-4xl" },
    { icon: "📝", delay: 1, position: "bottom-16 left-32", size: "text-2xl" },
    { icon: "💡", delay: 1.5, position: "bottom-32 right-16", size: "text-3xl" },
    { icon: "🔍", delay: 2, position: "top-40 left-1/3", size: "text-2xl" },
    { icon: "📊", delay: 2.5, position: "bottom-24 right-1/3", size: "text-3xl" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((item, index) => (
        <motion.div
          key={index}
          className={`absolute ${item.position} ${item.size} opacity-20`}
          initial={{ y: 0 }}
          animate={{
            y: [0, -10, 0, 10, 0],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{
            duration: 8,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {item.icon}
        </motion.div>
      ))}
    </div>
  );
};

// Animated text typing effect
const AnimatedText = () => {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        'Turn Cramming Into Learning',
        'Study Smarter, Not Harder',
        'Master Your Weak Spots'
      ],
      typeSpeed: 70,
      backSpeed: 50,
      loop: true,
      backDelay: 1500,
      startDelay: 500
    });

    return () => typed.destroy();
  }, []);

  return <span ref={el} />;
};

const CramSmartLandingPage = () => {
  const [activeMode, setActiveMode] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const { setIsSidebarVisible } = useSidebar || { setIsSidebarVisible: () => { } };
  const router = useRouter()

  // Define study modes with enhanced descriptions
  const studyModes = {
    talk: {
      title: 'Teach Mode',
      description: 'Chat with your AI buddy and sharpen your weak points through explanation.',
      benefits: [
        'Actively explain concepts to identify and strengthen weak spots',
        'Get supportive, real-time feedback that challenges your reasoning',
        'Build confidence by practicing verbal articulation — a true test of understanding'
      ],
      icon: BsChatDots,
      color: 'from-pink-500 to-rose-600',
      accentColor: 'pink-500'
    },
    study: {
      title: 'Study Mode',
      description: 'Your AI compiles personalized notes and smart materials made just for you.',
      benefits: [
        'Summaries that adapt to your learning style and progress',
        'Flashcards generated from your own explanations and weak points',
        'Learning content evolves as your understanding grows'
      ],
      icon: FaBookOpen,
      color: 'from-blue-500 to-indigo-600',
      accentColor: 'blue-500'
    },
    practice: {
      title: 'Practice Mode',
      description: 'Sharpen your memory with fill-in-the-blank and question-answer drills tailored to your weak spots.',
      benefits: [
        'Quickfire questions that reinforce key concepts',
        'Fill-in-the-blank style to boost recall under light pressure',
        'Focused on your previous mistakes and knowledge gaps'
      ],
      icon: FaChartLine,
      color: 'from-purple-500 to-purple-700',
      accentColor: 'purple-500'
    },


    eexam: {
      title: 'Exam Mode',
      description: 'Go head-to-head with time-pressured, AI-generated exams that adapt to your weaknesses.',
      benefits: [
        'Questions evolve based on your past performance and knowledge gaps',
        'Experience time pressure just like a real exam',
        'Detailed analytics after each session to help you level up fast'
      ],
      icon: FaTrophy,
      color: 'from-indigo-500 to-indigo-700',
      accentColor: 'indigo-500'
    }

  };


  // Navigation links
  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Why CramSmart', href: '#why-cramsmart' },
    { label: 'FAQ', href: '#faq' }
  ];

  // Problems we solve
  const problems = [
    {
      icon: FaRocket,
      title: "Inefficient Study Sessions",
      description: "Traditional methods waste time on material you already know, while CramSmart targets exactly what you need to learn."
    },
    {
      icon: FaBrain,
      title: "Passive Learning Traps",
      description: "Simply reading notes doesn't cement knowledge. Our Talk Mode forces active engagement that strengthens neural pathways."
    },
    {
      icon: FaLightbulb,
      title: "Knowledge Blind Spots",
      description: "CramSmart's AI identifies what you don't know that you don't know – the most dangerous gaps in your understanding."
    }
  ];

  // FAQs with enhanced answers
  const faqItems = [
    {
      question: "How does CramSmart identify my weak areas?",
      answer: "CramSmart uses advanced AI to analyze your responses, hesitations, explanation quality, and performance patterns across different topics. It builds a comprehensive knowledge map that highlights areas where you need focused attention, continuously refining this model as you study more."
    },
    {
      question: "Do I need to upload my study materials?",
      answer: "No. CramSmart's AI is pre-trained on comprehensive educational content across various subjects. Simply tell it what you're studying, and it generates relevant materials. For specialized courses, you can optionally upload syllabi or notes to make the experience even more tailored."
    },
    {
      question: "Is CramSmart free to use?",
      answer: "CramSmart gives you free access to the essentials. Need more AI sessions, detailed feedback, or mock exams? Just grab some credits — no subscription needed. Early users get bonus credits and exclusive perks!"
    },
    {
      question: "Does it work with college-level or AP courses?",
      answer: "Absolutely! CramSmart is designed to handle everything from high school to graduate-level education. It excels with standardized tests like AP exams, SAT/ACT, MCAT, LSAT, and specialized college courses across disciplines."
    },
    {
      question: "How is this different from traditional flashcard apps?",
      answer: "Unlike passive flashcard systems, CramSmart creates a dynamic learning conversation. It adapts to your explanations, asks follow-up questions, and challenges you to articulate concepts in your own words – a proven technique for deeper comprehension and retention."
    }
  ];

  // Testimonials with enhanced quotes
  const testimonials = [
    {
      name: "Alex Chen",
      role: "Computer Science Major",
      quote:
        "CramSmart completely transformed my approach to studying algorithms. Instead of just memorizing pseudocode, I can explain concepts to the AI and get immediate feedback on my understanding. My midterm scores jumped from B's to A's in just one semester.",

      rating: 5,
    },
    {
      name: "Mia Rodriguez",
      role: "Pre-Med Student",
      quote:
        "As someone with test anxiety, the Exam Mode has been invaluable. It simulates the pressure while providing supportive feedback. After using CramSmart for my biochemistry course, I not only improved my grades but actually enjoyed studying complex metabolic pathways.",

      rating: 5,
    },
    {
      name: "Jamal Washington",
      role: "Law Student",
      quote:
        "The Talk Mode is revolutionary. Being able to articulate legal principles in conversation and receive instant corrections on my reasoning has improved my case analysis skills dramatically. It's like having a patient tutor available 24/7.",

      rating: 4.9,
    },
  ];

  const handleGetStarted = () => {
    setIsMenuOpen(false)
    // Set a flag in localStorage that we're navigating from home
    localStorage.setItem('fromHome', 'true');
  }


  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans overflow-hidden">
      {/* Header with floating effect */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo with gradient effect */}
          <Link href="/">
            <div className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-opacity">
              CramSmart
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 font-medium hover:text-purple-600 transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <Link href="/dashboard" >
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all transform"
              >
                Get Started
              </button>
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100"
            >
              <div className="container mx-auto px-4 py-4">
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-gray-700 font-medium py-2 hover:text-purple-600 transition-colors"
                      onClick={handleGetStarted}
                    >
                      {link.label}
                    </a>
                  ))}
                  <Link href="/dashboard" >
                    <button
                     onClick={handleGetStarted}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-md text-sm font-medium hover:opacity-90 transition-opacity mt-2"
                    >
                      Get Started
                    </button>
                  </Link>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          {/* Background Effects */}
          <NeuralNetworkBackground />
          <FloatingStudyElements />

          <div className="container mx-auto px-4 z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
              {/* Hero Content */}
              <motion.div
                className="w-full md:w-1/2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
<h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 block h-32 md:h-40">
    <AnimatedText />
  </span>
</h1>

                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                  Your AI Study Partner
                </h2>

                <p className="text-lg text-gray-600 mb-8 max-w-lg">
                  CramSmart doesn't waste your time with what you already know. It detects your weak points, challenges you to explain them, and helps you improve through focused feedback and interaction.
                </p>

                <div className="flex flex-row  gap-4">
                  <Link href="/dashboard">
                    <button 
                    onClick={handleGetStarted}
                    className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all transform">
                      Start Learning Now
                    </button>
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-colors"
                  >
                    See How It Works
                  </a>
                </div>
              </motion.div>

              {/* Hero Visual */}
              <motion.div
                className="w-full md:w-1/2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  {/* Decorative gradient border */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl blur-md opacity-70"></div>

                  {/* Placeholder for mockup/demo */}
                  <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
  <video
    className="absolute inset-0 w-full h-full object-cover"
    autoPlay
    muted
    loop
    playsInline
  >
    <source src="/realDemo.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  
</div>


                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Intelligent Study Modes
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Four powerful ways to engage with your AI study partner
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(studyModes).map(([key, mode], index) => {
                const Icon = mode.icon;
                return (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.03, y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${mode.color} flex items-center justify-center mb-6`}>
                      <Icon className="text-white w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{mode.title}</h3>
                    <p className="text-gray-600 mb-4">{mode.description}</p>
                    <ul className="space-y-2">
                      {mode.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className={`w-5 h-5 mr-2 mt-0.5 text-${mode.accentColor} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Weakness-Based Learning
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Focus your study time where it matters most
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-purple-600 font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Identify Knowledge Gaps</h3>
                <p className="text-gray-600">
                  CramSmart analyzes your responses and explanations to pinpoint exactly where your understanding falters, creating a personalized weakness map.
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-blue-600 font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Teach to Learn</h3>
                <p className="text-gray-600">
                  Explain concepts back to the AI in your own words. This active recall process strengthens neural pathways and reveals misconceptions.
                </p>
              </motion.div>

              <motion.div
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-indigo-600 font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Adaptive Reinforcement</h3>
                <p className="text-gray-600">
                  The AI adjusts questions and challenges based on your progress, continuously targeting weak areas until they become strengths.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem We Solve Section */}
        <section id="why-cramsmart" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Why CramSmart?
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Tired of endless cramming with no results?
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {problems.map((problem, index) => {
                const Icon = problem.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-6">
                      <Icon className="text-white w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{problem.title}</h3>
                    <p className="text-gray-600">{problem.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
          {/* Background dots pattern */}
          <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-10">
            {[...Array(80)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-purple-500"
                style={{
                  gridColumn: `${Math.floor(Math.random() * 20) + 1}`,
                  gridRow: `${Math.floor(Math.random() * 20) + 1}`
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                What Students Are Saying
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Join thousands of students revolutionizing their study habits
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                >
                  <div className="flex items-center mb-6">

                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(testimonial.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-500 ml-2">{testimonial.rating.toFixed(1)}</span>
                  </div>

                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Questions You Might Have
              </motion.h2>
              <motion.p
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Everything you need to know about CramSmart
              </motion.p>
            </div>

            <div className="max-w-3xl mx-auto">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="mb-6"
                >
                  <button
                    className="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100 rounded-xl text-left font-medium transition-colors duration-200"
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  >
                    <span>{item.question}</span>
                    {activeFaq === index ?
                      <FaChevronUp className="text-purple-600" /> :
                      <FaChevronDown className="text-gray-400" />
                    }
                  </button>
                  <AnimatePresence>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 bg-white border border-gray-100 rounded-b-xl shadow-sm">
                          <p className="text-gray-600">{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-purple-600 to-blue-600 text-white relative overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white opacity-10"
                style={{
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.15, 0.1]
                }}
                transition={{
                  duration: Math.random() * 5 + 10,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Ready to Transform Your Study Habits?
              </motion.h2>
              <motion.p
                className="text-xl opacity-90 mb-10 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Join CramSmart today and focus your study time on what truly matters. Your AI study partner is waiting.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link href="/dashboard">
                  <button 
                  onClick={handleGetStarted}
                  className="bg-white text-purple-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all">
                    Get Started Free
                  </button>
                </Link>
                <p className="mt-4 text-sm opacity-80">No credit card required. Start studying smarter today.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Connect With Me */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  Let's Connect
                </motion.h2>
                <motion.p
                  className="text-lg text-gray-600 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Building this with students in mind — reach out, give feedback, and start cramming
                </motion.p>
              </div>

              <div className="flex justify-center">
                <motion.div
                  className="bg-gray-50 p-8 rounded-2xl "
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-bold mb-6 ">Connect With Us</h3>
                  <div className="space-y-4">
                    <a href="mailto:cramsmart.help@gmail.com" className="flex items-center hover:text-purple-600 transition-colors">
                      <FaEnvelope className="w-5 h-5 mr-3" />
                      <span>cramsmart.help@gmail.com</span>
                    </a>
                    <a href="https://www.tiktok.com/@buildwithnico" className="flex items-center hover:text-purple-600 transition-colors">
                      <FaTiktok className="w-5 h-5 mr-3" />
                      <span>@cramsmart</span>
                    </a>
                    <a href="https://linkedin.com/company/cramsmart" className="flex items-center hover:text-purple-600 transition-colors">
                      <FaLinkedin className="w-5 h-5 mr-3" />
                      <span>CramSmart</span>
                    </a>
                  </div>
                </motion.div>

                {/* <motion.div 
                    className="bg-gray-50 p-8 rounded-2xl"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-xl font-bold mb-6">Join Early Access</h3>
                    <form>
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                          type="email" 
                          id="email"
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div className="mb-6">
                        <label htmlFor="studyField" className="block text-sm font-medium text-gray-700 mb-1">What are you studying?</label>
                        <input 
                          type="text" 
                          id="studyField"
                          placeholder="e.g. Computer Science, Biology, Law"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
                      >
                        Join Waitlist
                      </button>
                    </form>
                  </motion.div> */}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">CramSmart</h3>
              <p className="text-gray-400 mb-6">Your AI-powered study partner for efficient, focused learning.</p>
              {/* <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <FaTwitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <FaEnvelope className="w-5 h-5" />
                  </a>
                </div> */}
            </div>

            <div>
              <h4 className="font-bold mb-6">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                {/* <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li> */}
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-3">
                <li><a href="/about-us" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                {/* <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li> */}
                <li><a href="mailto:cramsmart.help@gmail.com" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Legal</h4>
              <ul className="space-y-3">
                <li><a href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms-service" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>

              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} CramSmart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CramSmartLandingPage;
