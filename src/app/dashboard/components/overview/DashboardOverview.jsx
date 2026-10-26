import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import FundingTrends from "./FundingTrends";
import HiringSpotlight from "./HiringSpotlight";
import HotHiringNews from "./HotHiringNews";
import MailingAgentPanel from "./MailingAgentPanel";
import OutreachStatPills from "./OutreachStatPills";
import RecentOutreachFeed from "./RecentOutreachFeed";
import WeeklyIntelligenceCard from "./WeeklyIntelligenceCard";
import { useAuth } from "@/context/AuthContext";

const DashboardOverview = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("7");

  return (
    <div className="flex flex-col p-5 gap-4 pb-8">
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

      {/* Row 2: Industry Funding Trends (left, wider 3/5) + Hot Hiring News (right 2/5) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3" style={{ minHeight: "340px" }}>
          <FundingTrends selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
        </div>
        <div className="lg:col-span-2" style={{ minHeight: "340px" }}>
          <HotHiringNews />
        </div>
      </div>

      {/* Row 3: This Week's Market Read — the weekly intelligence that drives
          each student's outreach batches (OUT-177) */}
      <div style={{ minHeight: "260px" }}>
        <WeeklyIntelligenceCard />
      </div>

      {/* Row 4: Mailing Agent (desktop sending progress) full width */}
      <div style={{ minHeight: "280px" }}>
        <MailingAgentPanel />
      </div>

      {/* Row 4: Companies Hiring Now (left) + Recent Outreach Feed (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div style={{ minHeight: "240px" }}>
          <HiringSpotlight />
        </div>
        <div style={{ minHeight: "240px" }}>
          <RecentOutreachFeed />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
