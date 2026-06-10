"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/component/DashboardLayout";
import {
  LayoutDashboard,
  Mail,
  Users,
  Briefcase,
  SlidersHorizontal
} from "lucide-react";

// Import Components
import DashboardOverview from "./components/overview/DashboardOverview";
import ColdOutreachTab from "./components/cold-outreach/ColdOutreachTab";
import MentorshipTab from "./components/mentorship/MentorshipTab";
import JobOpeningsTab from "./components/jobs/JobOpeningsTab";
import SettingsTab from "./components/settings/SettingsTab";

const studentNavItems = [
  { label: "Dashboard", action: "dashboard", icon: LayoutDashboard },
  { label: "Cold Outreach", action: "coldOutreach", icon: Mail },
  { label: "Mentorship", action: "mentorship", icon: Users },
  { label: "Job Openings", action: "jobOpenings", icon: Briefcase },
  { label: "Settings", action: "settings", icon: SlidersHorizontal },
];

export default function Page() {
  const { user, isAuthenticated, loading, logout } = useAuth();
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
    <DashboardLayout
      theme="dark"
      user={user}
      portalName="Student Portal"
      navItems={studentNavItems}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      logout={logout}
      title=""
      subtitle=""
    >
      {/* Conditional rendering based on activeSection */}
      {activeSection === "dashboard" && <DashboardOverview />}
      {activeSection === "coldOutreach" && <ColdOutreachTab />}
      {activeSection === "mentorship" && <MentorshipTab />}
      {activeSection === "jobOpenings" && <JobOpeningsTab />}
      {activeSection === "settings" && <SettingsTab />}
    </DashboardLayout>
  );
}