"use client";
import { useState, useEffect } from "react";
import TPOPageShell from "@/component/tpo/TPOPageShell";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BriefcaseBusiness, TrendingUp, Building2, Zap, Search } from "lucide-react";
import { api } from "@/lib/api";

const urgencyBadge = {
  "Hot":    "bg-red-100 text-red-600",
  "High":   "bg-orange-100 text-orange-600",
  "Medium": "bg-yellow-100 text-yellow-700",
  "Normal": "bg-gray-100 text-gray-500",
};

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("all");
  const [data, setData] = useState({
    sectorBreakdown: [],
    ALL_JOBS: [],
    stats: {
      totalOpenings: 0,
      avgPerStudent: 0,
      uniqueCompanies: 0,
      hotOpportunities: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/api/admin/jobs");
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch jobs data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const { sectorBreakdown, ALL_JOBS, stats } = data;

  const sectors = ["all", ...Array.from(new Set(ALL_JOBS.map((j) => j.sector)))];
  const filtered = ALL_JOBS.filter((j) =>
    (sector === "all" || j.sector === sector) &&
    (j.company.toLowerCase().includes(search.toLowerCase()) || j.role.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <TPOPageShell title="Job Intelligence" subtitle="Live job openings tracked by your students, ranked by Outmail Priority Score">
        <div className="flex justify-center items-center h-64 text-gray-500">Loading jobs data...</div>
      </TPOPageShell>
    );
  }

  return (
    <TPOPageShell title="Job Intelligence" subtitle="Live job openings tracked by your students, ranked by Outmail Priority Score">

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: BriefcaseBusiness, label: "Total Openings Tracked", value: stats?.totalOpenings?.toLocaleString() || "0", sub: "Across all students",     color: "purple" },
          { icon: TrendingUp,        label: "Avg per Student",          value: stats?.avgPerStudent || "0",             sub: "Openings tracked",       color: "blue"   },
          { icon: Building2,         label: "Unique Companies",         value: stats?.uniqueCompanies?.toLocaleString() || "0", sub: "With active hiring",     color: "green"  },
          { icon: Zap,               label: "Hot Opportunities",        value: stats?.hotOpportunities?.toLocaleString() || "0", sub: "Score ≥ 90 this week",   color: "orange" },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className={`bg-white rounded-xl border border-gray-200 p-5 shadow-sm`}>
            <div className={`inline-flex p-2.5 rounded-lg bg-${color}-50 mb-3`}>
              <Icon size={16} className={`text-${color}-600`}/>
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs font-medium text-gray-600 mt-0.5">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sector bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Job Openings by Sector</h3>
          <p className="text-xs text-gray-400 mb-4">Where your students are focusing</p>
          <div className="h-52">
            {sectorBreakdown && sectorBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorBreakdown}
                  layout="vertical"
                  margin={{ top: 5, right: 20, bottom: 20, left: 70 }}
                >
                  <CartesianGrid stroke="#F3F4F6" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#6B7280", fontSize: 11 }} />
                  <YAxis dataKey="sector" type="category" tick={{ fill: "#6B7280", fontSize: 11 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="openings" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">No data available</div>
            )}
          </div>
        </div>

        {/* Priority score legend */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Outmail Priority Score — How It Works</h3>
            <p className="text-xs text-gray-400">Scores rank each job by how urgently students should reach out</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Hiring Signal",   desc: "Recent funding, headcount surge, or new job posted",    color: "purple", weight: "40%" },
              { label: "Company Momentum", desc: "Growth stage, market buzz, press mentions this quarter", color: "blue",  weight: "35%" },
              { label: "Fit Score",        desc: "Match between student profile & role requirements",    color: "green",  weight: "25%" },
            ].map(({ label, desc, color, weight }) => (
              <div key={label} className={`border border-${color}-100 bg-${color}-50 rounded-xl p-4`}>
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-xs font-semibold text-${color}-700`}>{label}</p>
                  <span className={`text-xs font-bold text-${color}-600`}>{weight}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={13} className="text-gray-400"/>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search company or role…" className="text-sm bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none w-full"/>
          </div>
          <select value={sector} onChange={(e) => setSector(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none">
            {sectors.map((s) => <option key={s} value={s}>{s === "all" ? "All Sectors" : s}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Company", "Role", "Sector", "Priority Score", "Students Tracking", "Urgency", "Posted"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((j) => (
                <tr key={j.company + j.role} className="border-t border-gray-50 hover:bg-gray-50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold flex items-center justify-center">{j.company[0]}</div>
                      <span className="font-medium text-gray-800">{j.company}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{j.role}</td>
                  <td className="px-5 py-3"><span className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-md font-medium">{j.sector}</span></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-purple-500" style={{ width: `${j.score}%` }}/>
                      </div>
                      <span className="text-sm font-bold text-gray-800">{j.score}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{j.students} students</td>
                  <td className="px-5 py-3"><span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${urgencyBadge[j.urgency] || urgencyBadge["Normal"]}`}>{j.urgency}</span></td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{j.posted}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-4 text-center text-sm text-gray-400">No jobs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">Showing {filtered.length} of {ALL_JOBS.length} tracked openings</p>
        </div>
      </div>
    </TPOPageShell>
  );
}
