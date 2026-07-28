"use client";
import React, { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import { api } from "@/lib/api";

// Real hiring data (OUT-172): companies ranked by ACTIVE scraped postings in
// the last 30 days. Counts come from real Job rows — never fabricated.
const HiringSpotlight = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get("/api/news/hiring-spotlight");
        if (active) setCompanies(res.data?.companies || []);
      } catch (err) {
        console.error("[HiringSpotlight] Failed to load:", err);
        if (active) setCompanies([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const badgeStyles = {
    hot: "bg-red-500/20 text-red-400",
    new: "bg-green-500/20 text-green-400",
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
            <Briefcase size={13} className="text-amber-400" />
            Companies Hiring Now
          </h3>
          <p className="text-[11px] text-white/40">Most active openings in the last 30 days</p>
        </div>
        <span className="text-[10px] text-white/30">
          {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full py-6">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white/60" />
          </div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 py-6">
            <Briefcase size={26} className="text-white/20" />
            <p className="text-xs text-white/30 text-center">
              No hiring activity yet.
              <br />
              Companies appear here as job sources are scraped.
            </p>
          </div>
        ) : (
          companies.map((company, i) => (
            <div
              key={company.name}
              className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/50 font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-white">{company.name}</span>
                  {company.latestRole && (
                    <span className="text-[10px] text-white/40 ml-1.5 truncate">
                      {company.latestRole}
                    </span>
                  )}
                </div>
                {company.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wide flex-shrink-0 ${
                      badgeStyles[company.badge] || "bg-white/10 text-white/50"
                    }`}
                  >
                    {company.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-white/50 flex-shrink-0">
                {company.roles} {company.roles === 1 ? "role" : "roles"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HiringSpotlight;
