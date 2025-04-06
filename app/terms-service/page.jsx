"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

function ViewTermsAndConditions() {
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
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">Terms and Conditions</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-400 to-blue-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600">Last Updated: April 5, 2025</p>
          </div>
          
          {/* Introduction */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to CramSmart. These Terms and Conditions govern your use of the CramSmart platform and services, including our website, mobile applications, and all related tools and features (collectively, the "Service").
            </p>
            <p className="text-gray-700">
              By accessing or using CramSmart, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you do not have permission to access the Service.
            </p>
          </div>
          
          {/* Account Registration */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Account Registration</h2>
            <p className="text-gray-700 mb-4">
              To use certain features of the Service, you must register for an account. When you register, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify CramSmart immediately of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>
            <p className="text-gray-700">
              You must be at least 13 years old to create an account. If you are under 18, you represent that you have your parent or guardian's permission to use the Service and that they have read and agree to these Terms and Conditions.
            </p>
          </div>
          
          {/* License and Service Usage */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">License and Service Usage</h2>
            <p className="text-gray-700 mb-4">
              CramSmart grants you a limited, non-exclusive, non-transferable, and revocable license to access and use the Service for personal, non-commercial educational purposes. This license is subject to these Terms and Conditions.
            </p>
            <p className="text-gray-700 mb-4">
              When using our Service, you agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Use the Service for any illegal purpose or in violation of any laws</li>
              <li>Infringe upon or violate our intellectual property rights or those of any third party</li>
              <li>Transmit any viruses, malware, or other harmful code</li>
              <li>Attempt to gain unauthorized access to any part of the Service</li>
              <li>Interfere with or disrupt the Service or servers connected to the Service</li>
              <li>Harvest or collect user information without permission</li>
              <li>Use the Service to generate unauthorized academic work or bypass academic integrity requirements</li>
              <li>Share your account credentials with others or allow multiple people to use your account</li>
            </ul>
          </div>
          
          {/* User Content */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">User Content</h2>
            <p className="text-gray-700 mb-4">
              Our Service allows you to upload, submit, store, or share content, including text, study materials, questions, and responses ("User Content"). You retain all rights to your User Content, but you grant CramSmart a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your User Content for the purpose of operating and improving our Service.
            </p>
            <p className="text-gray-700 mb-4">
              You represent and warrant that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You own or have the necessary rights to your User Content</li>
              <li>Your User Content does not violate the privacy rights, publicity rights, copyright, contractual rights, or any other rights of any person or entity</li>
              <li>Your User Content does not contain material that is false, intentionally misleading, or defamatory</li>
              <li>Your User Content does not contain any material that is unlawful, abusive, malicious, harassing, or otherwise objectionable</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We reserve the right to remove any User Content that violates these terms or that we otherwise find objectionable, without prior notice.
            </p>
          </div>
          
          {/* Intellectual Property */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of CramSmart and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
            </p>
            <p className="text-gray-700 mb-4">
              Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of CramSmart.
            </p>
            <p className="text-gray-700">
              The AI algorithms, learning methodologies, and proprietary technologies that power our study modes are proprietary to CramSmart and are protected as trade secrets and by copyright law.
            </p>
          </div>
          
          {/* Payment Terms */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
  <h2 className="text-2xl font-bold mb-4 text-gray-800">Payment Terms</h2>
  <p className="text-gray-700 mb-4">
    CramSmart offers both free features and premium features that require credits. Credits can be purchased as one-time payments through our platform. By purchasing credits, you agree to pay all fees in accordance with the pricing terms presented to you at the time of purchase.
  </p>
  <p className="text-gray-700 mb-4">
    Credits are non-refundable once they have been used to access premium features or modes. Unused credits remain valid in your account until used, subject to the limitations described below.
  </p>
  <p className="text-gray-700 mb-4">
    When using our credit system:
  </p>
  <ul className="list-disc pl-6 text-gray-700 space-y-2">
    <li>Credits are purchased as one-time payments and do not automatically renew</li>
    <li>Credits may expire after 12 months of account inactivity</li>
    <li>Different app modes and features may require different amounts of credits</li>
    <li>We reserve the right to change our credit pricing structure upon reasonable notice</li>
    <li>Special promotions, discounts, and bonus credits may be offered at our discretion</li>
  </ul>
  <p className="text-gray-700 mt-4">
    Payment processing is handled by secure third-party payment processors. CramSmart does not store complete credit card information on our servers. By making a purchase, you agree to the terms and conditions of our payment processor as well.
  </p>
</div>
          {/* Limitation of Liability */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the maximum extent permitted by law, CramSmart and its directors, employees, partners, agents, suppliers, or affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses resulting from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Your access to or use of or inability to access or use the Service</li>
              <li>Any conduct or content of any third party on the Service</li>
              <li>Any content obtained from the Service</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              <li>Reliance on information or content provided through the Service</li>
              <li>Academic performance or outcomes resulting from use of the Service</li>
            </ul>
          </div>
          
          {/* Disclaimer */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Disclaimer</h2>
            <p className="text-gray-700 mb-4">
              CramSmart is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, expressed or implied, regarding the operation or availability of the Service.
            </p>
            <p className="text-gray-700 mb-4">
              We do not guarantee that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>The Service will meet your specific requirements</li>
              <li>The Service will be uninterrupted, timely, secure, or error-free</li>
              <li>The results from using the Service will be accurate or reliable</li>
              <li>Any errors in the Service will be corrected</li>
              <li>The Service will be available at any particular time or location</li>
              <li>Using the Service will lead to specific academic outcomes or improved grades</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Educational content and AI-generated explanations are provided for learning assistance purposes only and should not be considered a substitute for formal instruction or professional advice.
            </p>
          </div>
          
          {/* Termination */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms and Conditions.
            </p>
            <p className="text-gray-700 mb-4">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or delete your account through your account settings.
            </p>
            <p className="text-gray-700">
              All provisions of these Terms and Conditions which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </div>
          
          {/* Changes to Terms */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify or replace these Terms and Conditions at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="text-gray-700">
              By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
            </p>
          </div>
          
          {/* Governing Law */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Governing Law</h2>
            <p className="text-gray-700">
  These Terms and Conditions shall be governed and construed in accordance with the laws of the State of Washington, without regard to its conflict of law provisions. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of Washington.
</p>

          </div>
          
          {/* Contact Us */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-lg mb-6">
              If you have any questions about these Terms and Conditions, please contact us at:
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

export default ViewTermsAndConditions;