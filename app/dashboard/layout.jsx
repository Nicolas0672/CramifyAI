"use client";
import React, { useContext, useEffect } from "react";
import DashboardHeader from "./_components/DashboardHeader";
import { SidebarContext } from "../SidebarContext";
import { usePathname } from "next/navigation";

function DashboardLayout({ children }) {
  const { isSidebarExpanded, setIsSidebarVisible, isSidebarVisible } = useContext(SidebarContext);
// In your Layout component
        const pathname = usePathname();
    
          
        useEffect(() => {
            // If we're on the dashboard page, force the sidebar to be visible
            if (pathname.includes('/dashboard')) {
              setIsSidebarVisible(true);
            }
          }, [pathname, setIsSidebarVisible]);

  useEffect(()=>{
    console.log(isSidebarVisible)
  },[isSidebarVisible])
  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full  text-white transition-all duration-300 ${
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
