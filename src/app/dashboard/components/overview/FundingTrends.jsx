import { TrendingUp, MoreHorizontal } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";

// Used only by the "Most Active" badges below (categorical — each industry
// needs its own identity there). The heatmap uses a separate intensity ramp
// instead, since it communicates MAGNITUDE, not category identity.
const INDUSTRY_COLORS = [
  "#6C00FF",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#AD46FF",
  "#3B82F6",
];

// Real funding data (OUT-173, reworked 2026-10-20, broadened 2026-10-20):
// the score is now Outmail's own momentum ANALYSIS (see `methodology`,
// sourced live from the API, not hardcoded here — the backend is the single
// source of truth for this disclaimer's exact wording), not a raw
// measurement. The 8 real industries are floored at 30 and scaled to 100;
// a dollar figure is still real when parseable (never invented) and stays a
// secondary stat alongside it.
const formatAmount = (amountM) => {
  if (!amountM) return "$0";
  if (amountM >= 1000) return `$${(amountM / 1000).toFixed(1)}B`;
  return `$${Math.round(amountM)}M`;
};

// Heatmap intensity ramp: dim violet at the floor (30) to vivid magenta at
// the busiest real industry (100) — a single-hue ramp reads as "how hot",
// which a set of distinct categorical colors wouldn't.
const heatColor = (score) => {
  const t = Math.max(0, Math.min(1, (score - 30) / 70));
  const r = Math.round(124 + (236 - 124) * t);
  const g = Math.round(58 + (72 - 58) * t);
  const b = Math.round(237 + (153 - 237) * t);
  return `rgba(${r}, ${g}, ${b}, ${0.18 + 0.62 * t})`;
};

// Hoisted out of FundingTrends (react-hooks/static-components) - a
// component declared inside another component's body is recreated on
// every render.
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const row = payload[0].payload;
    return (
      <div className="bg-white/90 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white/20">
        <p className="text-gray-800 font-semibold">{row.industry}</p>
        <p className="text-purple-600 font-bold">Momentum: {row.relativeScore}/100</p>
        <p className="text-gray-600 text-xs">
          {row.events} signal{row.events === 1 ? "" : "s"}
          {row.amount > 0 && <> · {formatAmount(row.amount)} disclosed</>}
        </p>
      </div>
    );
  }
  return null;
};

const FundingTrends = ({ selectedPeriod }) => {
  const [fundingData, setFundingData] = useState([]);
  const [totals, setTotals] = useState({ events: 0, amountM: 0 });
  const [methodology, setMethodology] = useState("");
  const [loading, setLoading] = useState(true);
  // 2026-10-20: locked to Radial Spoke (main) + Heatmap Grid (flip side),
  // replacing the earlier bar/pie and radial/donut toggles.
  const [viewType, setViewType] = useState("radial");

  useEffect(() => {
    let active = true;
    const fetchFundingData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/news/funding-trends?days=${selectedPeriod || 7}`);
        if (!active) return;
        const industries = (res.data?.industries || []).map((row, i) => ({
          industry: row.industry,
          relativeScore: row.relativeScore ?? 0,
          amount: row.amountM,
          events: row.events,
          color: INDUSTRY_COLORS[i % INDUSTRY_COLORS.length],
        }));
        setFundingData(industries);
        setTotals({ events: res.data?.totalEvents || 0, amountM: res.data?.totalAmountM || 0 });
        setMethodology(res.data?.methodology || "");
      } catch (err) {
        logger.error("[FundingTrends] Failed to load:", err);
        if (active) {
          setFundingData([]);
          setTotals({ events: 0, amountM: 0 });
          setMethodology("");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchFundingData();
    return () => {
      active = false;
    };
  }, [selectedPeriod]);

  const topThreeIndustries = [...fundingData]
    .sort((a, b) => b.relativeScore - a.relativeScore)
    .slice(0, 3)
    .filter((i) => i.relativeScore > 0); // an all-zero window has no "most active" to show

  // "Other" is a catch-all, not a real industry — it stays in the text stats
  // above (legitimately useful there) but is excluded from both geometric
  // views below: plotting it as a spoke/cell would be noise, and it's often
  // the single largest one, which would be actively misleading. It also
  // never gets the 30-100 floor the real industries get (see the API).
  const chartData = fundingData.filter((i) => i.industry !== "Other");

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-white shadow-xl border border-white/20 h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-1.5">
            <TrendingUp size={14} className="text-green-400" />
            Industry Funding Trends
          </h3>
          <p className="text-[10px] text-white/50 mt-0.5">
            Last {selectedPeriod} days · {totals.events} round{totals.events === 1 ? "" : "s"}
            {totals.amountM > 0 && (
              <>
                {" "}
                · <span className="text-green-400 font-bold">
                  {formatAmount(totals.amountM)}
                </span>{" "}
                disclosed
              </>
            )}
          </p>
          {methodology && <p className="text-[9px] text-white/30 italic mt-0.5">{methodology}</p>}
        </div>
        <button
          onClick={() => setViewType(viewType === "radial" ? "heatmap" : "radial")}
          className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          title={`Switch to ${viewType === "radial" ? "heatmap" : "radial"} view`}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-white"></div>
        </div>
      ) : fundingData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-6">
          <TrendingUp size={26} className="text-white/20" />
          <p className="text-xs text-white/30 text-center">
            No funding rounds tracked in this window.
            <br />
            Signals appear as the daily ingestion runs.
          </p>
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-0 mb-2" style={{ minHeight: "180px" }}>
            {viewType === "radial" ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData} outerRadius="68%">
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis
                    dataKey="industry"
                    tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 8 }}
                  />
                  <PolarRadiusAxis
                    domain={[0, 100]}
                    tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 7 }}
                    axisLine={false}
                    tickCount={3}
                  />
                  <Radar
                    dataKey="relativeScore"
                    stroke="#A78BFA"
                    fill="#7C3AED"
                    fillOpacity={0.35}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div
                data-testid="momentum-heatmap"
                className="w-full h-full grid grid-cols-4 grid-rows-2 gap-1.5"
              >
                {chartData.map((i) => (
                  <div
                    key={i.industry}
                    title={`${i.industry}: ${i.relativeScore}/100`}
                    className="rounded-md border border-white/10 flex flex-col items-center justify-center gap-0.5 px-1 text-center"
                    style={{ backgroundColor: heatColor(i.relativeScore) }}
                  >
                    <span className="text-[8px] text-white/70 leading-tight line-clamp-2">
                      {i.industry}
                    </span>
                    <span className="text-sm font-bold text-white">{i.relativeScore}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {topThreeIndustries.length > 0 && (
            <div className="border-t border-white/10 pt-2">
              {/* Renamed from "Top Funded" (2026-10-20): the badge now shows
                  signal count, not a dollar figure — a $0 badge next to the
                  single most ACTIVE industry this week (high signal count,
                  no parseable amounts) would read as a contradiction. */}
              <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1.5">
                Most Active
              </p>
              <div className="flex flex-wrap gap-1.5">
                {topThreeIndustries.map((industry) => (
                  <div
                    key={industry.industry}
                    className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-0.5 border border-white/10"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: industry.color }}
                    />
                    <span className="text-[10px] text-white/70">{industry.industry}</span>
                    <span className="text-[10px] font-bold text-green-400">
                      {industry.events} signal{industry.events === 1 ? "" : "s"}
                      {industry.amount > 0 && <> · {formatAmount(industry.amount)}</>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FundingTrends;
