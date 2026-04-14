"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import TPOSidebar from "@/component/tpo/TPOSidebar";
import TPOTopBar from "@/component/tpo/TPOTopBar";
import TPOOverviewCards from "@/component/tpo/TPOOverviewCards";
import TPOCharts from "@/component/tpo/TPOCharts";
import TPOStudentTable from "@/component/tpo/TPOStudentTable";
import TPOMentorshipPanel from "@/component/tpo/TPOMentorshipPanel";
import { api } from "@/lib/api";

export default function TPODashboard() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/admin/stats");
        setStats(res.data.stats);
      } catch (err) {
        console.error("Failed to fetch TPO stats", err);
      }
    };
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Mock TPO user — replace with real auth later
  const tpoUser = {
    name: "Prof. Anita Sharma",
    college: "BITS Pilani — Pilani Campus",
    role: "Placement Officer",
    avatar: null,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <TPOSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Top Bar */}
        <TPOTopBar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          user={tpoUser}
        />

        {/* Content */}
        <main className="flex-1 p-6 space-y-8">

          {/* Welcome */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {tpoUser.name.split(" ")[1]} 
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {tpoUser.college} &nbsp;·&nbsp; Batch 2025–26 &nbsp;·&nbsp; Last updated: Today, 9:42 AM
              </p>
            </div>
            <div className="flex gap-3">
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>All Batches</option>
                <option>2025–26</option>
                <option>2024–25</option>
              </select>
              <button className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium">
                Export Report
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <TPOOverviewCards stats={stats} />

          {/* Charts Row */}
          <TPOCharts stats={stats} />

          {/* Bottom Row — Student Table + Mentorship Panel */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <TPOStudentTable />
            </div>
            <div>
              <TPOMentorshipPanel />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
