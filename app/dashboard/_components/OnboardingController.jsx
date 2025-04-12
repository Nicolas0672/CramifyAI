"use client"
import { useState, useEffect } from 'react';
import OnboardingTour from './OnboardingTour';

const OnboardingController = () => {
  // State to track if we should show the tour or the dialog
  const [showTour, setShowTour] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Check if user is new on component mount
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem('cramsmartTourCompleted');
    if (!hasCompletedTour) {
      setIsNewUser(true);
    }
    
    // Add pulsing effect to button
    addPulsingEffect();
  }, []);

  // Add pulsing effect to the Create New button


  // Handle tour completion
  const handleTourComplete = () => {
    localStorage.setItem('cramsmartTourCompleted', 'true');
    setShowTour(false);
    setIsNewUser(false);
    setShowDialog(true); // Show dialog after tour completes
  };

  return null; // This component only adds effects, doesn't render anything
};

// Modified button click handler in your main component
const handleCreateNewClick = () => {
  if (!localStorage.getItem('cramsmartTourCompleted')) {
    // New user - show tour first
    setShowTour(true);
  } else {
    // Returning user - show dialog directly
    setOpenDialogue(true);
  }
};

export default OnboardingController;