import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import FundingTrends from "./FundingTrends";
import MailingAgentStatus from "./MailingAgentStatus";
import OutreachStatPills from "./OutreachStatPills";
import WeeklyIntelligenceCard from "./WeeklyIntelligenceCard";
import { useAuth } from "@/context/AuthContext";

const DashboardOverview = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("7");

  return (
    // No padding of its own — DashboardLayout's <main> already wraps every
    // page in p-6. Stacking a second p-5/pb-8 on top of that was pure
    // double-padding (~95px of it) and the actual reason this page needed
    // the page-level scrollbar DashboardLayout's <main overflow-y-auto>
    // otherwise exists to avoid.
    <div className="flex flex-col gap-3">
      {/* Row 1: Welcome + Period Selector + Stat Pills */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            Welcome back,{" "}
            <span className="text-purple-400">{user?.display_name || user?.name || "User"}</span>
          </h2>
          <div className="relative inline-block">
            <select
              className="bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg appearance-none pr-7 text-xs border border-white/10"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="15">Last 15 days</option>
              <option value="30">Last 30 days</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>
        </div>
        <OutreachStatPills selectedPeriod={selectedPeriod} />
      </div>

      {/* Row 2: Industry Funding Trends (left, wider 3/5) + Mailing Agent
          status (right 2/5) — a loud online/offline light is meant to be the
          first thing a student notices, so it sits above the fold next to
          the other at-a-glance chart rather than buried further down. */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3" style={{ minHeight: "340px" }}>
          <FundingTrends selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
        </div>
        <div className="lg:col-span-2" style={{ minHeight: "340px" }}>
          <MailingAgentStatus />
        </div>
      </div>

      {/* Row 3: This Week's Market Read — the weekly intelligence that drives
          each student's outreach batches (OUT-177) */}
      <div style={{ minHeight: "260px" }}>
        <WeeklyIntelligenceCard />
      </div>
    </div>
  );
};

export default DashboardOverview;
