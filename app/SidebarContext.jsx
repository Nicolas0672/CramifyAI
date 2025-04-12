"use client"

import React, { createContext, useState, useContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Create the context
export const SidebarContext = createContext();

// Create the provider component
export const SidebarProvider = ({ children }) => {
  const pathname = usePathname();
  
  // List of authentication routes where sidebar should be hidden
  const authRoutes = ["/sign-in", "/sign-up", "/home", "/privacy-policy", "/terms-service", "/about-us"];
  
  // Check if the current path is an auth page
  const isAuthPage = authRoutes.some(route => pathname?.startsWith(route));
  
  // Force sidebar to be visible if we're on dashboard, regardless of pathname
  const forceSidebarVisible = pathname?.includes('/dashboard');
  
  // Initialize with appropriate visibility
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(forceSidebarVisible || !isAuthPage);
  
  // Effect to synchronize sidebar visibility with route changes
  useEffect(() => {
    if (pathname?.includes('/dashboard')) {
      setIsSidebarVisible(true);
    } else if (isAuthPage) {
      setIsSidebarVisible(false);
    } else {
      setIsSidebarVisible(true);
    }
  }, [pathname]);

  const hideSidebar = () => setIsSidebarVisible(false);
  const showSidebar = () => setIsSidebarVisible(true);

  return (
    <SidebarContext.Provider value={{ 
      isSidebarExpanded, 
      setIsSidebarExpanded, 
      isSidebarVisible, 
      hideSidebar, 
      showSidebar, 
      setIsSidebarVisible 
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook to use the sidebar context
export const useSidebar = () => useContext(SidebarContext);