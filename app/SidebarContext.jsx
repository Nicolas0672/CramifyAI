"use client"
import React, { createContext, useState } from 'react';

// Create the context
export const SidebarContext = createContext();

// Create the provider component
export const SidebarProvider = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  return (
    <SidebarContext.Provider value={{ isSidebarExpanded, setIsSidebarExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
};