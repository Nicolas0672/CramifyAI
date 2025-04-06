"use client";
import React, { useContext } from "react";
import DashboardHeader from "./_components/DashboardHeader";
import { SidebarContext } from "../SidebarContext";

function DashboardLayout({ children }) {
  const { isSidebarExpanded } = useContext(SidebarContext);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full  text-white transition-all duration-300 ${
          isSidebarExpanded ? "w-64" : "w-16"
        }`}
      >
        <DashboardHeader />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 p-10 ${
          isSidebarExpanded ? "ml-32" : "ml-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
