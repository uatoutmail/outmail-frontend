"use client";
import React, { useEffect, useState } from "react";
import { Sparkles, Building2 } from "lucide-react";
import { api } from "@/lib/api";

// This week's market read (OUT-177): a user-facing surface of the Saturday
// weekly-intelligence run — the same analysis that decides which companies
// enter each student's outreach batches.
const WeeklyIntelligenceCard = () => {
  const [intel, setIntel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get("/api/outreach/weekly-intelligence");
        if (active) setIntel(res.data?.intelligence || null);
      } catch (err) {
        console.error("[WeeklyIntelligence] Failed to load:", err);
        if (active) setIntel(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const weekLabel = intel?.weekOf
    ? new Date(intel.weekOf).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 h-full flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
            <Sparkles size={13} className="text-purple-400" />
            This Week&apos;s Market Read
          </h3>
          <p className="text-[11px] text-white/40">
            Where we expect hiring — drives your outreach batches
          </p>
        </div>
        {weekLabel && (
          <span className="text-[10px] text-white/30 flex-shrink-0">Week of {weekLabel}</span>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white/60" />
        </div>
      ) : !intel ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6">
          <Sparkles size={26} className="text-white/20" />
          <p className="text-xs text-white/30 text-center">
            No market read yet.
            <br />
            Intelligence is generated every Saturday for the week ahead.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0 space-y-3">
          {intel.summary && (
            <p className="text-[11px] text-white/60 leading-relaxed">{intel.summary}</p>
          )}

          {intel.industries?.length > 0 && (
            <div>
              <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">
                Industries expected to hire
              </p>
              <div className="space-y-1.5">
                {intel.industries.slice(0, 4).map((row) => (
                  <div key={row.industry} className="flex items-start gap-2">
                    <span className="text-[11px] font-semibold text-white flex-shrink-0">
                      {row.industry}
                    </span>
                    {typeof row.confidence === "number" && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-semibold flex-shrink-0">
                        {Math.round(row.confidence * 100)}%
                      </span>
                    )}
                    {row.reason && (
                      <span className="text-[10px] text-white/40 truncate">{row.reason}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {intel.companies?.length > 0 && (
            <div>
              <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">
                Companies on the radar
              </p>
              <div className="flex flex-wrap gap-1.5">
                {intel.companies.slice(0, 8).map((c) => (
                  <span
                    key={c.name}
                    title={(c.reasons || []).join(" · ")}
                    className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-0.5 border border-white/10"
                  >
                    <Building2 size={9} className="text-white/40" />
                    <span className="text-[10px] text-white/70">{c.name}</span>
                    {typeof c.hiringProbability === "number" && (
                      <span className="text-[10px] font-bold text-green-400">
                        {Math.round(c.hiringProbability * 100)}%
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyIntelligenceCard;
