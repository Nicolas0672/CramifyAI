// SidebarContext.js
"use client"
import React, { createContext, useState, useContext } from 'react';

// Create the context
export const SidebarContext = createContext();

// Create the provider component
export const SidebarProvider = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // To manage expansion
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // To manage visibility

  const hideSidebar = () => setIsSidebarVisible(false);
  const showSidebar = () => setIsSidebarVisible(true);

  return (
    <SidebarContext.Provider value={{ isSidebarExpanded, setIsSidebarExpanded, isSidebarVisible, hideSidebar, showSidebar, setIsSidebarVisible }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook to use the sidebar context
export const useSidebar = () => useContext(SidebarContext);
