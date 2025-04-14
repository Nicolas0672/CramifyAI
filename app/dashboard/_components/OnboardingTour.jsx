"use client"
import { useState, useEffect } from 'react';
import { ChevronRight, X } from 'lucide-react';

const OnboardingTour = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps = [
    {
      selector: '#teach-mode-tab',
      title: 'Teach Mode 🎙️',
      description: "Let's start with Teach Mode — tell the AI what you know. Your answers help us generate personalized notes, quizzes, and exams later. If you can teach it, you'll remember it."
    },
    {
      selector: '#study-mode-tab',
      title: 'Study Mode 📖',
      description: "Next up: Study Mode. We turn what you taught us into clean AI-generated notes and flashcards — and we fill in the gaps based on what you missed or didn’t mention. Smart studying, tailored to you."
    },
    {
      selector: '#practice-mode-tab',
      title: 'Practice Mode 🧠',
      description: "Practice Mode. Answer adaptive quiz questions based on your content. Learn through repetition — powered by AI."
    },
    {
      selector: '#exam-mode-tab',
      title: 'Exam Mode ⏱️',
      description: "Exam Mode. Simulate a real test with a timer and full exam structure. The questions dynamically change based on your progress, keeping you sharp every time."
    },
    {
      selector: '#create-new-button',
      title: 'Create Your First Course 🚀',
      description: "You're ready. Click here to create your first course and lock in your study flow 💪"
    }
  ];
  

  // Scroll to and highlight the current element
  useEffect(() => {
    if (currentStep < tourSteps.length) {
      const targetElement = document.querySelector(tourSteps[currentStep].selector);
      
      if (targetElement) {
        // Scroll the element into view
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add a pulsing highlight class to the element
        targetElement.classList.add('tour-highlight');
        
        return () => {
          // Clean up highlight when step changes
          targetElement.classList.remove('tour-highlight');
        };
      }
    }
  }, [currentStep, tourSteps]);

  const handleNextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const completeTour = () => {
    
    // Mark tour as completed in localStorage
    localStorage.setItem('cramsmartTourCompleted', 'true');
    
    // Show final success message
  
    
    // Notify parent component
    if (onComplete) {
      onComplete();
    }
  };

  const skipTour = () => {
    // Mark tour as completed in localStorage
    localStorage.setItem('cramsmartTourCompleted', 'true');
    
    // Notify parent component
    if (onComplete) {
      onComplete();
    }
  };

  const showFinalMessage = () => {
    // Create a modal to show the final message
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white rounded-xl p-8 max-w-md mx-4 text-center shadow-xl';
    modalContent.innerHTML = `
      <h2 class="text-2xl font-bold text-indigo-700 mb-4">You're all set! 🎉</h2>
      <p class="text-gray-700 text-lg mb-6">You teach. We adapt. Together, you win.</p>
      <button class="px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-1">Let's go!</button>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    
    // Add event listener to remove modal when button is clicked
    modalOverlay.querySelector('button').addEventListener('click', () => {
      document.body.removeChild(modalOverlay);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed overlay to block interactions */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Tour content */}
      <div className="relative h-full w-full pointer-events-none">
        {currentStep < tourSteps.length && (
          <div className="absolute z-20 max-w-md bg-white rounded-xl shadow-2xl p-6 pointer-events-auto transition-all duration-500"
               style={{
                 // We'll position this with JavaScript when the step changes
                 left: '50%',
                 top: '50%',
                 transform: 'translate(-50%, -50%)'
               }}>
            
            {/* Close button */}
            <button 
              onClick={skipTour}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
            
            {/* Step indicator */}
            <div className="flex items-center mb-2">
              <span className="text-xs font-medium text-indigo-600">
                Step {currentStep + 1} of {tourSteps.length}
              </span>
            </div>
            
            {/* Step content */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {tourSteps[currentStep].title}
            </h3>
            <p className="text-gray-600 mb-6">
              {tourSteps[currentStep].description}
            </p>
            
            {/* Navigation buttons */}
            <div className="flex justify-between">
              <button 
                onClick={skipTour}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Skip
              </button>
              <button 
                onClick={handleNextStep}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg flex items-center group transition transform hover:-translate-y-0.5"
              >
                {currentStep < tourSteps.length - 1 ? 'Next' : 'Finish'}
                <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingTour;