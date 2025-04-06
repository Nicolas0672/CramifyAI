"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

function ViewPrivacyPolicy() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <>
      {/* Header */}
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

      {/* Main Content */}
      <div className="pt-24 pb-16 bg-gradient-to-b from-white to-blue-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">Privacy Policy</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-400 to-blue-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">Last Updated: April 5, 2025</p>
          </div>
          
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Introduction</h2>
            <p className="text-gray-700 mb-4">
              At CramSmart, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. Please read this policy carefully to understand our practices regarding your personal data.
            </p>
            <p className="text-gray-700">
              By using CramSmart, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our service.
            </p>
          </div>
          
          {/* Information We Collect */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Personal Information</h3>
            <p className="text-gray-700 mb-4">
              We may collect personal information that you provide directly to us, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Name and contact information</li>
              <li>Account credentials</li>
              <li>Educational information (courses, subjects, study materials)</li>
              <li>Communication preferences</li>
              <li>Payment information (processed securely through third-party payment processors)</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-3 text-gray-700">Usage Data</h3>
            <p className="text-gray-700 mb-4">
              We automatically collect certain information when you use CramSmart, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Study patterns and learning analytics</li>
              <li>Time spent on different features</li>
              <li>Content interaction statistics</li>
            </ul>
          </div>
          
          {/* How We Use Your Information */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Providing and personalizing our services</li>
              <li>Creating adaptive learning experiences tailored to your needs</li>
              <li>Improving our platform and developing new features</li>
              <li>Communicating with you about your account and updates</li>
              <li>Analyzing usage patterns to enhance user experience</li>
              <li>Protecting against fraudulent or unauthorized activity</li>
              <li>Complying with legal obligations</li>
            </ul>
          </div>
          
          {/* Data Sharing and Disclosure */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Data Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Service Providers:</strong> With third-party vendors who need access to your information to help us operate our business</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>With Your Consent:</strong> In other cases with your explicit permission</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We do not sell your personal information to third parties for advertising purposes.
            </p>
          </div>
          
          {/* Data Security */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication procedures</li>
              <li>Secure database architecture</li>
              <li>Staff training on data protection</li>
            </ul>
            <p className="text-gray-700 mt-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </div>
          
          {/* Your Rights and Choices */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Rights and Choices</h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Access and review your personal information</li>
              <li>Update or correct inaccuracies in your data</li>
              <li>Request deletion of your personal information</li>
              <li>Restrict or object to certain processing activities</li>
              <li>Request portability of your information</li>
              <li>Opt-out of certain communications</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </p>
          </div>
          
          {/* Children's Privacy */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Children's Privacy</h2>
            <p className="text-gray-700">
              CramSmart is designed for users who are at least 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe we have collected information from a child under 13, please contact us so we can take appropriate action.
            </p>
          </div>
          
          {/* Changes to This Policy */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </div>
          
          {/* Contact Us */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-lg mb-6">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 inline-block">
              <p className="text-white mb-2">Email: cramsmart.help@gmail.com</p>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewPrivacyPolicy;