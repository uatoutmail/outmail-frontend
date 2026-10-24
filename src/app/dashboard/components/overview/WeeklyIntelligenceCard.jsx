"use client";
import { Sparkles, Building2, ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";

// This week's market read (OUT-177): a user-facing surface of the Saturday
// weekly-intelligence run — the same analysis that decides which companies
// enter each student's outreach batches.
//
// The generation prompt already allows 3-6 industries (weeklyIntelligenceService.js) —
// this just stopped hard-capping the UI at 4. Some weeks the model returns
// fewer than 5; the ranked list and the "Show all N" button both read off
// the real count rather than assuming 5 exist.
const WeeklyIntelligenceCard = () => {
  const [intel, setIntel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await api.get("/api/outreach/weekly-intelligence");
        if (active) setIntel(res.data?.intelligence || null);
      } catch (err) {
        logger.error("[WeeklyIntelligence] Failed to load:", err);
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
          <p className="text-[11px] text-white/55">
            Where we expect hiring, drives your outreach batches
          </p>
        </div>
        {weekLabel && (
          <span className="text-[10px] text-white/45 flex-shrink-0">Week of {weekLabel}</span>
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
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {intel.summary && (
            <p className="text-[13px] text-white/75 leading-relaxed">{intel.summary}</p>
          )}

          {(() => {
            const ranked = (intel.industries || []).slice(0, 5);
            if (ranked.length === 0) return null;
            return (
              <div className="relative">
                {/* Collapsed: a bounded max-height clips mid-list rather than
                    mid-sentence — only full rows are ever visible, the next
                    one just fades under the gradient instead of being cut
                    off ragged. 5 rows is a known, bounded size, so a fixed
                    "open" ceiling is safe without measuring scrollHeight. */}
                <div
                  className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                  style={{ maxHeight: expanded ? "640px" : "150px" }}
                >
                  {ranked.map((row, i) => (
                    <div
                      key={row.industry}
                      className={`flex items-start gap-4 py-3 ${i > 0 ? "border-t border-white/[0.06]" : ""}`}
                    >
                      <span className="text-2xl font-extrabold text-white/15 w-9 flex-shrink-0 leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[15px] font-bold text-white">{row.industry}</span>
                          {typeof row.confidence === "number" && (
                            <span className="text-[11px] font-bold text-emerald-300 bg-emerald-400/10 rounded-full px-2 py-0.5">
                              {Math.round(row.confidence * 100)}% confidence
                            </span>
                          )}
                        </div>
                        {row.reason && (
                          <p className="text-[12.5px] text-white/55 leading-snug mt-1">
                            {row.reason}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {!expanded && ranked.length > 2 && (
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />
                )}
                {ranked.length > 2 && (
                  <button
                    onClick={() => setExpanded((v) => !v)}
                    className="relative w-full flex items-center justify-center gap-1 text-[11.5px] font-semibold text-purple-300 hover:text-purple-200 bg-purple-500/10 hover:bg-purple-500/15 border border-purple-400/20 rounded-full py-1.5 mt-2"
                  >
                    {expanded ? (
                      <>
                        Show less <ChevronUp size={13} />
                      </>
                    ) : (
                      <>
                        Show all {ranked.length} <ChevronDown size={13} />
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })()}

          {intel.companies?.length > 0 && (
            <div>
              <p className="text-[9px] text-white/55 uppercase tracking-widest mb-1.5">
                Companies on the radar
              </p>
              <div className="flex flex-wrap gap-1.5">
                {intel.companies.slice(0, 8).map((c) => (
                  <span
                    key={c.name}
                    title={(c.reasons || []).join(" · ")}
                    className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-0.5 border border-white/15"
                  >
                    <Building2 size={9} className="text-white/55" />
                    <span className="text-[10px] text-white/90">{c.name}</span>
                    {typeof c.hiringProbability === "number" && (
                      <span className="text-[10px] font-bold text-green-300">
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
