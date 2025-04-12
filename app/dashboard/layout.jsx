"use client";

import React, { useContext, useEffect } from "react";
import DashboardHeader from "./_components/DashboardHeader";
import { SidebarContext } from "../SidebarContext";
import { usePathname } from "next/navigation";

function DashboardLayout({ children }) {
  const { isSidebarExpanded, setIsSidebarVisible, isSidebarVisible } = useContext(SidebarContext);
  const pathname = usePathname();

  useEffect(() => {
    const fromHome = localStorage.getItem('fromHome') === 'true';
    
    if (fromHome) {
      // Clear the flag
      localStorage.removeItem('fromHome');
      
      // Reload the page to force proper rendering
      window.location.reload();
    }
  }, []);
  
  // Call this immediately when the component loads
  if (!isSidebarVisible) {
    // This runs before useEffect and forces the sidebar to be visible
    setIsSidebarVisible(true);
  }
  
  // Also use useEffect to ensure it stays visible
  useEffect(() => {
    setIsSidebarVisible(true);
  }, [pathname, setIsSidebarVisible]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full text-white transition-all duration-300 ${
          isSidebarExpanded ? "w-64" : "w-12"
        }`}
      >
        <DashboardHeader />
      </div>
      
      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 p-8 ${
          isSidebarExpanded ? "ml-32" : "ml-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;