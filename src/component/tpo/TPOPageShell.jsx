"use client";
import { Loader2 } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  GraduationCap,
  BarChart3,
  BookOpen,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import DashboardLayout from "@/component/DashboardLayout";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Overview", href: "/tpo/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/tpo/students", icon: Users },
  { label: "Job Intelligence", href: "/tpo/jobs", icon: BriefcaseBusiness },
  { label: "Mentorship", href: "/tpo/mentorship", icon: GraduationCap },
  { label: "Analytics", href: "/tpo/analytics", icon: BarChart3 },
  { label: "Resources", href: "/tpo/resources", icon: BookOpen },
  { label: "Settings", href: "/tpo/settings", icon: Settings },
];

// OUT-201: every /tpo/* page goes through this shell, so the role gate lives
// here rather than duplicated per-page. This is NOT the real security
// boundary — every TPO-scoped API route already rejects a non-TPO_ADMIN
// caller server-side regardless of what the frontend does — but before this
// there was no client-side check at all, so a signed-in STUDENT could
// navigate straight to /tpo/dashboard and see a broken/empty TPO shell
// instead of being sent to their own dashboard.
export default function TPOPageShell({ children, title, subtitle }) {
  const { user, userRole, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      router.replace("/tpo/login");
      return;
    }
    if (userRole !== "TPO_ADMIN") {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, userRole, router]);

  if (loading || !isAuthenticated || userRole !== "TPO_ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-purple-500" size={28} />
      </div>
    );
  }

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
