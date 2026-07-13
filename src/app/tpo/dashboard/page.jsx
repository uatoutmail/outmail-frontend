"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import TPOPageShell from "@/component/tpo/TPOPageShell";
import TPOOverviewCards from "@/component/tpo/TPOOverviewCards";
import TPOCharts from "@/component/tpo/TPOCharts";
import TPOStudentTable from "@/component/tpo/TPOStudentTable";
import TPOMentorshipPanel from "@/component/tpo/TPOMentorshipPanel";
import { api } from "@/lib/api";

export default function TPODashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
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

  const tpoUser = {
    name: user?.name || user?.display_name || "TPO Admin",
    college: user?.institute_name || user?.institute || "Outmail Partner",
  };

  const firstName = tpoUser.name.split(" ")[0] || "Admin";

  return (
    <TPOPageShell>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {firstName} 
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {tpoUser.college} &nbsp;·&nbsp; Batch 2025–26 &nbsp;·&nbsp; Last updated: Today
            </p>
          </div>
          <div className="flex gap-3">
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>All Batches</option>
              {Array.from({ length: 4 }, (_, i) => {
                const year = new Date().getFullYear() + 1 - i;
                return (
                  <option key={year}>
                    {year}–{year + 1}
                  </option>
                );
              })}
            </select>
            <button
              onClick={() => toast("Report export is coming soon.")}
              className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition font-medium"
            >
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
      </div>
    </TPOPageShell>
  );
}

