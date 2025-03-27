"use client"
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaBookOpen, 
    FaChartLine, 
    FaTrophy, 
    FaClipboardList,
    FaQuoteLeft,
    FaBars,
    FaTimes,
    FaChevronDown,
    FaChevronUp
} from 'react-icons/fa';
import FloatingStudyElements from '../FloatingStudyElemens';
import { useRouter } from 'next/navigation';
import Typed from 'typed.js';
import { Book, Home, Shield, Users } from 'lucide-react';
const AIVisual = () => {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 600 400" 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 z-0"
      >
        {/* Glowing Brain Network */}
        <defs>
          <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A4FFF" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#4FACFF" stopOpacity="0.7"/>
          </linearGradient>
          <filter id="glowEffect">
            <feGaussianBlur className="blur" stdDeviation="10" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" />
            <feBlend mode="screen" in="SourceGraphic" />
          </filter>
        </defs>
  
        {/* Network Lines */}
        {[...Array(15)].map((_, i) => (
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
  
        {/* Pulsing AI Core */}
        <motion.circle 
          cx="300" 
          cy="200" 
          r="50"
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
  
        {/* Connecting Nodes */}
        {[...Array(10)].map((_, i) => (
          <motion.circle 
            key={i}
            cx={200 + Math.random() * 200} 
            cy={100 + Math.random() * 200}
            r={Math.random() * 5 + 2}
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

  const AnimatedText = () => {
    const el = useRef(null);
  
    useEffect(() => {
      const typed = new Typed(el.current, {
        strings: ['Study Better', 'Cram Faster'],
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
  
  
const CramifyHomePage = () => {
    const [activeMode, setActiveMode] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const router = useRouter();
  const el = useRef(null);

  

  const faqItems = [
    {
      question: "What makes CramSmart different from other study apps?",
      answer: "CramSmart's unique 'Teach First' approach revolutionizes learning by having you explain concepts to AI, which provides instant, nuanced feedback. This active learning method, combined with our adaptive AI technology, creates a more engaging and effective study experience than traditional passive learning methods."
    },
    {
      question: "How does the AI adapt to my learning style?",
      answer: "Our AI system analyzes your learning patterns, explanation styles, and performance data to create a personalized learning experience. It adjusts question difficulty, identifies knowledge gaps, and customizes study materials to match your unique learning pace and preferences."
    },
    {
      question: "Are the practice exams really like actual tests?",
      answer: "Yes! Our exam simulation engine uses advanced AI to generate questions that mirror real exam patterns. The questions dynamically adjust in difficulty and style based on your performance, ensuring you're well-prepared for any testing scenario."
    },
    {
      question: "Can I track my progress over time?",
      answer: "Absolutely! CramSmart provides detailed analytics and progress tracking, showing your improvement across different subjects and concepts. You'll get insights into your strengths, areas for improvement, and personalized study recommendations."
    },
    {
      question: "Is CramSmart suitable for all subjects?",
      answer: "Yes, CramSmart is designed to work across all academic subjects and professional certifications. Our AI adapts its teaching and testing methods to suit the specific requirements of each subject area."
    }
  ];

  const modes = {
    teach: {
      title: 'Teach Mode',
      description: 'Transform learning by explaining concepts to AI',
      benefits: [
        'Deepen your understanding through active explanation',
        'Receive instant, nuanced feedback',
        'Uncover and bridge knowledge gaps'
      ],
      icon: FaBookOpen,
      color: 'from-purple-500 to-blue-500',
      mockup: '/api/placeholder/800/600',
      videoUrl: 'https://example.com/teach-mode-demo'
    },
    study: {
      title: 'Study Mode',
      description: 'Generate personalized study materials',
      benefits: [
        'AI-powered comprehensive summaries',
        'Custom, adaptive flashcards',
        'Intelligent learning paths'
      ],
      icon: FaChartLine,
      color: 'from-blue-500 to-indigo-500',
      mockup: '/api/placeholder/800/600',
      videoUrl: 'https://example.com/study-mode-demo'
    },
    practice: {
      title: 'Practice Mode',
      description: 'Interactive quizzes that adapt to your learning',
      benefits: [
        'Dynamic, intelligent question generation',
        'Real-time performance insights',
        'Precision-targeted improvement'
      ],
      icon: FaTrophy,
      color: 'from-indigo-500 to-purple-500',
      mockup: '/api/placeholder/800/600',
      videoUrl: 'https://example.com/practice-mode-demo'
    },
    exam: {
      title: 'Exam Mode',
      description: 'AI-generated mock exams to challenge you',
      benefits: [
        'Simulate authentic exam environments',
        'Comprehensive performance diagnostics',
        'Adaptive difficulty scaling'
      ],
      icon: FaClipboardList,
      color: 'from-red-500 to-pink-500',
      mockup: '/api/placeholder/800/600',
      videoUrl: 'https://example.com/exam-mode-demo'
    }
  };

  const navLinks = [
    { label: 'Features', href: '#features' },
   
    { label: 'Testimonials', href: '#testimonials' }
  ];

  const userTestimonials = [
    {
      name: 'Emily Rodriguez',
      role: 'Medical Student',
      quote: 'CramifyAI transformed my study routine. The teach mode helped me truly understand complex medical concepts.',
      rating: 5
    },
    {
      name: 'Alex Chen',
      role: 'Computer Science Major',
      quote: 'The practice mode is like having a personal tutor that knows exactly where I need to improve.',
      rating: 4.5
    },
    {
      name: 'Sarah Thompson',
      role: 'Law Student',
      quote: 'Incredible AI-powered study materials that actually adapt to my learning style!',
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span 
        key={index} 
        className={`text-xl ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
              CramSmart
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
        {navLinks.map((link) => (
          <a 
            key={link.href}
            href={link.href} 
            className="text-gray-700 font-semibold hover:text-purple-600 transition-colors relative group"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full"></span>
          </a>
        ))}
        <button 
          onClick={() => router.push('/sign-up')} 
          className="cursor-pointer bg-gradient-to-br from-purple-600 to-blue-600 text-white px-7 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:scale-105 transition-all transform"
        >
          Start Learning
        </button>
      </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-600 hover:text-purple-600"
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
    </div>

    {/* Mobile Menu */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href} 
                  className="text-gray-700 font-semibold hover:text-purple-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button 
                onClick={() => router.push('/sign-up')} 
                className="cursor-pointer bg-gradient-to-br from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:shadow-lg hover:scale-105 transition-all transform"
              >
                Start Learning
              </button>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
      </header>

      {/* Main Content Container */}
      <main className="flex-grow">
        {/* Hero Section */}
          {/* Hero Section - Slightly modified */}
          <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden"
        >
              <AIVisual />

          {/* Background Particles */}
          <div className="absolute inset-0 opacity-10">
        <div className="absolute w-72 h-72 bg-purple-200 rounded-full -top-20 -left-20 animate-blob"></div>
        <div className="absolute w-96 h-96 bg-blue-200 rounded-full -bottom-20 -right-20 animate-blob animation-delay-2000"></div>
        <div className="absolute w-64 h-64 bg-indigo-200 rounded-full top-1/3 right-1/4 animate-blob animation-delay-4000"></div>
      </div>
      <FloatingStudyElements/>
      <motion.h1 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="text-6xl md:text-8xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 relative z-10"
      >
        <AnimatedText/>
      </motion.h1>
      <motion.h2
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-4xl md:text-6xl font-bold mb-8 text-gray-800 relative z-10"
      >
        with CramSmart
      </motion.h2>
      <motion.p
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="text-xl max-w-2xl mx-auto text-gray-600 mb-10 relative z-10"
      >
        Explain concepts, let AI refine your understanding, and ace your exams effortlessly
      </motion.p>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="relative z-10"
      >
        <button 
          onClick={() => router.push('/sign-up')} 
          className="cursor-pointer bg-gradient-to-br from-purple-600 to-blue-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:shadow-lg hover:scale-105 transition-all transform"
        >
          Start Your Learning Journey
        </button>
      </motion.div>
    </motion.section>

    {/* Learning Modes Section */}
    <section id="features" className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
          Intelligent Learning Modes
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Customized AI-driven learning experiences that adapt to your unique study needs.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {Object.entries(modes).map(([key, mode]) => {
          const Icon = mode.icon;
          return (
            <motion.div 
              key={key}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveMode(activeMode === key ? null : key)}
              className={`
                bg-white rounded-xl shadow-lg p-8 text-center cursor-pointer 
                ${activeMode === key ? 'ring-4 ring-purple-500' : ''}
              `}
            >
              <div className={`mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br ${mode.color} flex items-center justify-center`}>
                <Icon className="text-white w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{mode.title}</h3>
              <p className="text-gray-600 mb-6">{mode.description}</p>
              <ul className="text-left space-y-3 text-gray-500">
                {mode.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 mr-3 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

          {/* Mode Details Modal */}
          <AnimatePresence>
            {activeMode && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                onClick={() => setActiveMode(null)}
              >
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl max-w-5xl w-full p-10 relative shadow-2xl border border-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => setActiveMode(null)}
                    className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                  >
                    ✕
                  </button>
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                      <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                        {modes[activeMode].title}
                      </h2>
                      <p className="text-lg text-gray-600 mb-8">
                        {modes[activeMode].description}
                      </p>
                      <ul className="space-y-4 text-gray-600">
                        {modes[activeMode].benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-6 h-6 mr-4 mt-1 flex-shrink-0 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-center">
                      <motion.img 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        src={modes[activeMode].mockup} 
                        alt={`${modes[activeMode].title} Mockup`} 
                        className="max-w-full rounded-xl shadow-2xl border border-gray-200"
                      />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section id="faq" className="py-24 bg-white">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
        Frequently Asked Questions
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Everything you need to know about CramSmart's innovative learning approach
      </p>
    </div>

    <div className="max-w-3xl mx-auto">
      {faqItems.map((item, index) => (
        <motion.div
          key={index}
          className="mb-4"
          initial={false}
        >
          <button
            onClick={() => setActiveFaq(activeFaq === index ? null : index)}
            className="w-full flex items-center justify-between p-6 
              bg-gradient-to-br from-white to-purple-50 
              rounded-xl 
              shadow-lg hover:shadow-xl 
              transition-all duration-300 
              transform hover:scale-[1.01]
              border border-purple-100/50
              font-heading"
          >
            <span className="text-lg font-semibold 
              bg-clip-text text-transparent 
              bg-gradient-to-r from-purple-600 to-blue-600">
              {item.question}
            </span>
            <div className="p-2 bg-white/70 rounded-full shadow-md">
              {activeFaq === index ? (
                <FaChevronUp className="text-purple-500 transition-transform" />
              ) : (
                <FaChevronDown className="text-purple-500 transition-transform" />
              )}
            </div>
          </button>
          <AnimatePresence>
            {activeFaq === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 bg-purple-50 rounded-b-lg font-body">
                  <p className="text-gray-700 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* User Testimonials */}
<section id="testimonials" className="bg-gray-50 py-24">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
        What Our Users Say
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Real stories from students who transformed their learning with CramifyAI
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {userTestimonials.map((testimonial, index) => (
        <motion.div 
          key={index}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-white to-purple-50 
            rounded-xl 
            shadow-lg 
            hover:shadow-xl 
            p-8 
            transition-all 
            duration-300 
            border 
            border-purple-100/50"
        >
          <FaQuoteLeft className="text-purple-500 mb-4 w-12 h-12" />
          <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                {testimonial.name}
              </h4>
              <p className="text-gray-500">{testimonial.role}</p>
            </div>
            <div className="flex items-center">
              {renderStars(testimonial.rating)}
              <span className="ml-2 text-sm text-gray-600">
                {testimonial.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* Final CTA */}
<section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-24 flex-grow">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-5xl font-bold mb-6 drop-shadow-lg">
            Ready to Revolutionize Your Learning?
          </h2>
          <p className="text-xl max-w-2xl mx-auto mb-10 text-white/80">
            Join thousands of students who have transformed their study approach with CramSmart's intelligent learning companion.
          </p>
          <button
            className="group relative inline-flex items-center justify-center 
            px-12 py-4 
            text-lg font-bold text-purple-600 
            bg-white 
            rounded-full 
            overflow-hidden 
            transition-all duration-300 
            hover:bg-white/90 
            hover:scale-105 
            active:scale-95 
            shadow-2xl 
            hover:shadow-purple-500/50 cursor-pointer"
            onClick={router.push('/sign-up')}
          >
            <span className="absolute inset-0 bg-purple-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <span className="relative z-10">Get Started for Free</span>
          </button>
        </div>
      </section>
      
      <footer className="bg-white py-12 border-t border-gray-100">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            CramSmart
          </h3>
          <p className="text-gray-600 text-lg">Intelligent learning, simplified.</p>
        </div>
        
        <div className="flex justify-end items-center">
          <div>
            <h4 className="font-semibold text-gray-800 mb-4 text-right">Connect</h4>
            <div className="flex space-x-4 justify-end">
              <a href="#" className="text-gray-400 hover:text-purple-600 transition hover:scale-110">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition hover:scale-110">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition hover:scale-110">Email</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-8 text-center text-gray-500 text-sm">
        © 2024 CramSmart. All rights reserved.
      </div>
    </footer>
      </main>
    </div>
  );
};

export default CramifyHomePage;