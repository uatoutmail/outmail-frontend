import { TrendingUp, MoreHorizontal } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";

// Palette reused across industries so the chart stays on-brand regardless of
// which industries actually appear in the data.
// Data-visualisation palette, NOT brand colours. Chart series must be
// distinguishable from each other, so these deliberately stay a spread rather
// than folding into the two brand purples — a chart where every line is the
// same purple is unreadable. Only the first series is brand-anchored.
const INDUSTRY_COLORS = [
  "#6C00FF",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#AD46FF",
  "#3B82F6",
];

// Real funding data (OUT-173, reworked 2026-10-20): MarketSignal rows of kind
// 'funding' produced by the funding ingestion adapter, aggregated by
// industry. The bar height is a RELATIVE activity score (0-100, the busiest
// industry this window = 100), not a summed dollar amount — a headline's
// amount only ever counted when it parsed exactly ("$12M Series B" parses,
// "raises a dozen million" doesn't), so the dollar total silently
// undercounted real activity. Signal count is complete regardless of
// phrasing; the dollar figure is still real (never invented) but now a
// secondary stat, not the primary metric.
const formatAmount = (amountM) => {
  if (!amountM) return "$0";
  if (amountM >= 1000) return `$${(amountM / 1000).toFixed(1)}B`;
  return `$${Math.round(amountM)}M`;
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
        <p className="text-purple-600 font-bold">Relative activity: {row.relativeScore}/100</p>
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
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState("bar");

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
      } catch (err) {
        logger.error("[FundingTrends] Failed to load:", err);
        if (active) {
          setFundingData([]);
          setTotals({ events: 0, amountM: 0 });
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
          <p className="text-[9px] text-white/30 italic mt-0.5">
            Relative signal strength — not exact funding amounts
          </p>
        </div>
        <button
          onClick={() => setViewType(viewType === "bar" ? "pie" : "bar")}
          className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          title={`Switch to ${viewType === "bar" ? "pie" : "bar"} chart`}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-white"></div>
        </div>
      ) : fundingData.length === 0 || fundingData.every((i) => i.relativeScore === 0) ? (
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
            <ResponsiveContainer width="100%" height="100%">
              {viewType === "bar" ? (
                <BarChart
                  data={fundingData}
                  margin={{ top: 4, right: 4, bottom: 30, left: -10 }}
                  barCategoryGap="15%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="industry"
                    tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 9 }}
                    angle={-35}
                    textAnchor="end"
                    height={45}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 9 }}
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Bar dataKey="relativeScore" radius={[4, 4, 0, 0]} maxBarSize={52}>
                    {fundingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={fundingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={58}
                    paddingAngle={2}
                    dataKey="relativeScore"
                  >
                    {fundingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              )}
            </ResponsiveContainer>
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
