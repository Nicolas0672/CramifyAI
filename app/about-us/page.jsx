"use client"
import Link from 'next/link';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
function ViewAboutUs() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="bg-gradient-to-b from-white to-blue-50 min-h-screen">
         <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                  {/* Logo with gradient effect */}
                  <Link href="/home">
                    <div className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 transition-opacity">
                      CramSmart
                    </div>
                  </Link>
        
                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex items-center space-x-8">
                    
                    <Link href="/sign-up">
                      <button 
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
                    
                          <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                            <button 
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
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">About CramSmart</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">Transforming how students learn, one concept at a time.</p>
        </div>
        
        {/* Mission Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Our Mission</h2>
          <p className="text-lg mb-4 text-gray-700 leading-relaxed">
            CramSmart is your AI-powered study companion built for modern students who want to study smarter, not harder. We believe learning should be adaptive, personalized, and actually effective — focusing precisely on <span className="font-semibold text-blue-600">your unique weaknesses</span>.
          </p>
          <p className="text-lg mb-4 text-gray-700 leading-relaxed">
            In a world of endless content and limited time, we help you cut through the noise and focus on what truly matters for your academic success.
          </p>
        </div>
        
        {/* Smart Learning Approach */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">The CramSmart Approach</h2>
          <p className="text-lg mb-6 text-gray-700">
            We've built CramSmart around four intelligent study modes that work together to create a comprehensive learning experience:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Study Mode",
                description: "Auto-generates flashcards, summaries, and explanations using your course content.",
                icon: "📚"
              },
              {
                title: "Practice Mode",
                description: "Adaptive quizzes that identify and target your knowledge gaps.",
                icon: "🎯"
              },
              {
                title: "Exam Mode",
                description: "Realistic mock exams to test your knowledge under pressure.",
                icon: "📝"
              },
              {
                title: "Talk Mode",
                description: "Chat with an AI that learns your weak spots and helps you improve through dialogue.",
                icon: "💬"
              }
            ].map((mode, index) => (
              <div key={index} className="bg-blue-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{mode.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{mode.title}</h3>
                <p className="text-gray-600">{mode.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Technology Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Built with Precision</h2>
          <p className="text-lg mb-6 text-gray-700 leading-relaxed">
            Everything from database integration, AI model prompts, user tracking, and UI design has been crafted with intention — by a student who knows the pressure of real deadlines and late-night cram sessions.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["React", "Express.js", "Drizzle ORM", "Tailwind CSS", "AI Models", "UUID Tracking"].map((tech, index) => (
              <span key={index} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full font-medium">{tech}</span>
            ))}
          </div>
        </div>
        
        {/* Closing Statement */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Join the Learning Revolution</h2>
          <p className="text-lg mb-6">
            CramSmart isn't just another study tool — it's a movement to make learning more human, more focused, and more effective.
          </p>
          <Link href={'/sign-up'}>
          <button className="cursor-pointer bg-white text-blue-600 hover:bg-blue-50 transition-colors font-bold py-3 px-8 rounded-full">
            Get Started
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ViewAboutUs;