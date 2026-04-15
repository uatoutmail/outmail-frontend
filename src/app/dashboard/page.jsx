"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// Import Components
import DashboardSidebar from "./components/shared/DashboardSidebar";
import DashboardHeader from "./components/shared/DashboardHeader";
import DashboardOverview from "./components/overview/DashboardOverview";
import ColdOutreachTab from "./components/cold-outreach/ColdOutreachTab";
import MentorshipTab from "./components/mentorship/MentorshipTab";
import JobOpeningsTab from "./components/jobs/JobOpeningsTab";
import SettingsTab from "./components/settings/SettingsTab";

export default function Page() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  // Check if user has stored token
  const hasStoredToken = () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated && !hasStoredToken()) {
      window.location.href = '/';
    }
  }, [isAuthenticated, loading]);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-l from-black via-[#6c00ff] to-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className="relative flex h-screen bg-gradient-to-l from-black via-[#6c00ff] to-black text-white font-syne overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #6c00ff 0%, #0f0f2d 60%, #000 100%)",
      }}
    >
      <DashboardSidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
        logout={logout}
      />

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out lg:ml-64 overflow-y-auto overflow-x-hidden ${
          isSidebarOpen ? "overflow-x-hidden" : "overflow-x-hidden"
        }`}
      >
        {/* Topbar */}
        <DashboardHeader setIsSidebarOpen={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
        
        {/* Conditional rendering based on activeSection */}
        {activeSection === "dashboard" && <DashboardOverview />}
        {activeSection === "coldOutreach" && <ColdOutreachTab />}
        {activeSection === "mentorship" && <MentorshipTab />}
        {activeSection === "jobOpenings" && <JobOpeningsTab />}
        {activeSection === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}