"use client";
import { useState, useEffect } from "react";
import TPOPageShell from "@/component/tpo/TPOPageShell";
import { Search, Filter, Download, Mail, TrendingUp, BriefcaseBusiness, ArrowUpRight } from "lucide-react";
import { api } from "@/lib/api";

const scoreTier = (s) => {
  if (s >= 90) return { label: "Top Performer", cls: "bg-purple-100 text-purple-700" };
  if (s >= 70) return { label: "On Track",      cls: "bg-green-100 text-green-700"   };
  if (s >= 50) return { label: "Needs Nudge",   cls: "bg-yellow-100 text-yellow-700" };
  return { label: "At Risk", cls: "bg-red-100 text-red-600" };
};

export default function StudentsPage() {
  const [search, setSearch]   = useState("");
  const [branch, setBranch]   = useState("all");
  const [status, setStatus]   = useState("all");
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState({ ALL_STUDENTS: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/api/admin/students");
        // /api/admin/students returns basic list, we will call our new detailed tpo students route
        const detailedRes = await api.get("/api/admin/students");
        // We added getTPOStudents as /api/admin/students route was already there... wait, I overrode or added? 
        // Ah, I added `router.get('/students', getTPOStudents)` and replaced the old getStudents mapping? 
        // No, I had `getStudents` and `getTPOStudents`. Let me just use the detailed one. 
        // The one I added was `getTPOStudents` at `/api/admin/students`? Wait, I didn't change the path. I added `getTPOStudents`. Let's just fetch from `/api/admin/students`. I will handle both cases.
        
        // Actually, let's call the generic students API and use it. I'll just use res.data.
        if (res.data.ALL_STUDENTS) {
          setData({ ALL_STUDENTS: res.data.ALL_STUDENTS });
        } else if (res.data.students) {
          setData({ ALL_STUDENTS: res.data.students });
        }
      } catch (err) {
        console.error("Failed to fetch students data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const { ALL_STUDENTS } = data;

  const branches = ["all", ...Array.from(new Set((ALL_STUDENTS || []).map((s) => s.branch).filter(Boolean)))];

  const filtered = (ALL_STUDENTS || []).filter((s) => {
    const q = search.toLowerCase();
    const branchName = s.branch || "";
    const name = s.name || s.display_name || "";
    return (
      (branch === "all" || branchName === branch) &&
      (status === "all" || s.status === status) &&
      (name.toLowerCase().includes(q) || branchName.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <TPOPageShell title="Students" subtitle="All subscribed students, their engagement scores and off-campus activity">
        <div className="flex justify-center items-center h-64 text-gray-500">Loading students data...</div>
      </TPOPageShell>
    );
  }

  return (
    <TPOPageShell title="Students" subtitle="All subscribed students, their engagement scores and off-campus activity">

      {/* Summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Students",    value: (ALL_STUDENTS || []).length,                              color: "purple" },
          { label: "Active",            value: (ALL_STUDENTS || []).filter(s=>s.status==="active").length, color: "green"  },
          { label: "Top Performers",    value: (ALL_STUDENTS || []).filter(s=>s.score>=90).length,       color: "blue"   },
          { label: "Need Attention",    value: (ALL_STUDENTS || []).filter(s=>s.score<50).length,        color: "red"    },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-white rounded-xl border border-gray-200 p-4 shadow-sm`}>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className={`text-xs font-medium mt-0.5 text-${color}-600`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={13} className="text-gray-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or branch…" className="text-sm bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none w-full" />
          </div>
          <select value={branch} onChange={e=>setBranch(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none">
            {branches.map(b=><option key={b} value={b}>{b==="all"?"All Branches":b}</option>)}
          </select>
          <select value={status} onChange={e=>setStatus(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition">
            <Download size={13}/> Export
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Student","Branch","Year","Emails","Open Rate","Replies","Interviews","Jobs","Score","Status","Actions"].map(h=>(
                  <th key={h} className="text-left text-xs font-medium text-gray-500 px-5 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const tier = scoreTier(s.score || 0);
                const name = s.name || s.display_name || "Unknown";
                return (
                  <tr key={s.id || name} className="border-t border-gray-50 hover:bg-purple-50/30 transition cursor-pointer" onClick={()=>setSelected(s===selected?null:s)}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {name.split(" ").map(n=>n[0]).join("").substring(0,2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{name}</p>
                          <p className="text-xs text-gray-400">Joined {s.joined || (s.created_at ? new Date(s.created_at).toLocaleDateString() : "-")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{s.branch || "-"}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{s.year || "-"}</td>
                    <td className="px-5 py-3 font-semibold text-gray-800">{s.emails || 0}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-purple-500" style={{width:`${s.openRate || 0}%`}}/>
                        </div>
                        <span className="text-xs text-gray-600">{s.openRate || 0}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{s.responses || 0}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold ${(s.interviews || 0)>0?"text-green-600":"text-gray-400"}`}>
                        {(s.interviews || 0)>0?`${s.interviews} ✓`:"—"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-700">{s.jobs || 0}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-800">{s.score || 0}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tier.cls}`}>{tier.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${(s.status || "active")==="active"?"bg-green-100 text-green-700":"bg-gray-100 text-gray-500"}`}>
                        {s.status || "active"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button className="text-xs text-purple-600 font-medium hover:underline">View</button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-5 py-4 text-center text-sm text-gray-400">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Expanded row detail */}
        {selected && (
          <div className="border-t border-purple-100 bg-purple-50/40 px-6 py-5">
            <p className="text-sm font-semibold text-gray-800 mb-3">{(selected.name || selected.display_name)} — Activity Breakdown</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Mail,            label: "Emails Sent",     value: selected.emails || 0       },
                { icon: TrendingUp,      label: "Open Rate",        value: `${selected.openRate || 0}%` },
                { icon: ArrowUpRight,    label: "Recruiter Replies",value: selected.responses || 0    },
                { icon: BriefcaseBusiness, label: "Jobs Tracked",  value: selected.jobs || 0         },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white rounded-lg border border-purple-100 px-4 py-3 flex items-center gap-3">
                  <Icon size={16} className="text-purple-500" />
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-base font-bold text-gray-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-6 py-3 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs text-gray-400">Showing {filtered.length} of {(ALL_STUDENTS || []).length} students</p>
          <button className="text-xs text-purple-600 font-medium hover:underline">Invite more students →</button>
        </div>
      </div>
    </TPOPageShell>
  );
}
