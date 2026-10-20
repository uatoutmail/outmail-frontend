import { Mail, TrendingUp, Building, Briefcase } from "lucide-react";
import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";

const OutreachStatPills = ({ selectedPeriod = "7" }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/analytics/outreach?period=${selectedPeriod}`);
        setData(response.data);
      } catch (err) {
        // Deliberately falls through to the "0"/"None" defaults below, which
        // is the behaviour the test pins. Showing a number we do not have is
        // arguably wrong, but changing it is a product decision — raised, not
        // taken here.
        logger.error("Failed to load outreach stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedPeriod]);

  const stats = [
    {
      // 2026-10-20 dashboard audit: "sent" used to count every row CREATED
      // in the window regardless of status, so a row that expired unsent
      // still read as sent. Now shows "X of Y" — X = actually sent, Y =
      // everything we prepared for this window. The gap is never assigned a
      // cause: Outmail's own responsibility ends at preparing correct
      // content, and what happens after (approval, whether the desktop
      // agent was online, local SMTP delivery) runs on the student's own
      // machine, outside anything we execute or can guarantee.
      label: `Emails Sent (${selectedPeriod}d)`,
      value: loading ? null : (data?.emailsSentPeriod ?? 0),
      secondary: loading ? null : (data?.emailsPreparedPeriod ?? 0),
      icon: Mail,
      color: "text-purple-400",
      bg: "bg-purple-500/15",
      border: "border-purple-500/25",
    },
    {
      label: "Total Emails Sent",
      value: loading ? null : (data?.totalEmailsSent ?? 0),
      secondary: loading ? null : (data?.totalEmailsPrepared ?? 0),
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/15",
      border: "border-green-500/25",
    },
    {
      // Distinct real companies (via CompanyEmail), not distinct recipient
      // email addresses — two recruiter contacts at the same company used
      // to count as two companies targeted.
      label: "Companies Targeted",
      value: loading ? null : (data?.companiesTargeted ?? 0),
      icon: Building,
      color: "text-cyan-400",
      bg: "bg-cyan-500/15",
      border: "border-cyan-500/25",
    },
    {
      // 2026-10-20 dashboard audit: replaces "Active Outreach", which showed
      // the hardcoded literal 'AI-generated' — never real data. Job openings
      // delivered (all-time, via JobImpression) is the Rs 999 "500
      // openings/year" promise's own accounting, already wired into the real
      // job feed (jobsController.js) — not a new pipeline.
      label: "Job Openings Shown",
      value: loading ? null : (data?.jobOpeningsShown ?? 0),
      icon: Briefcase,
      color: "text-amber-400",
      bg: "bg-amber-500/15",
      border: "border-amber-500/25",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bg} ${stat.border} border backdrop-blur-md rounded-xl p-3 flex items-center gap-3 relative overflow-hidden`}
        >
          <div className="p-2 rounded-lg bg-white/10 flex-shrink-0 relative z-10">
            <stat.icon size={15} className={stat.color} />
          </div>
          <div className="min-w-0 relative z-10 flex-1">
            <p className="text-[10px] text-white/50 uppercase tracking-wide leading-tight">
              {stat.label}
            </p>
            {stat.value === null ? (
              <div className="h-4 w-12 bg-white/10 animate-pulse rounded mt-1"></div>
            ) : (
              <p className={`text-sm font-bold mt-0.5 ${stat.color}`}>
                <span>{stat.value}</span>
                {stat.secondary != null && (
                  <span className="text-white/40 font-normal text-xs"> of {stat.secondary}</span>
                )}
              </p>
            )}
          </div>
          {loading && <div className="absolute inset-0 bg-white/5 animate-pulse"></div>}
        </div>
      ))}
    </div>
  );
};

export default OutreachStatPills;
