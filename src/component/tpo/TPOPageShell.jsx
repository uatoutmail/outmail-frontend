"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/component/DashboardLayout";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  GraduationCap,
  BarChart3,
  BookOpen,
  Settings
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/tpo/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/tpo/students", icon: Users },
  { label: "Job Intelligence", href: "/tpo/jobs", icon: BriefcaseBusiness },
  { label: "Mentorship", href: "/tpo/mentorship", icon: GraduationCap },
  { label: "Analytics", href: "/tpo/analytics", icon: BarChart3 },
  { label: "Resources", href: "/tpo/resources", icon: BookOpen },
  { label: "Settings", href: "/tpo/settings", icon: Settings },
];

export default function TPOPageShell({ children, title, subtitle }) {
  const { user, logout } = useAuth();

  const tpoUser = {
    name: user?.name || user?.display_name || "TPO Admin",
    college: user?.institute_name || user?.institute || "Outmail Partner",
    role: "TPO",
  };

  return (
    <DashboardLayout
      theme="light"
      user={tpoUser}
      portalName="TPO Portal"
      navItems={navItems}
      logout={logout}
      title={title || "Placement Officer Dashboard"}
      subtitle={subtitle || tpoUser.college}
    >
      {children}
    </DashboardLayout>
  );
}
