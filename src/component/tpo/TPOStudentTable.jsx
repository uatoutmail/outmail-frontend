"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { api } from "@/lib/api";

export default function TPOStudentTable() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/api/admin/students");
        setStudents(res.data.students || []);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter((s) => {
    const nameStr = s.display_name || "";
    const emailStr = s.email || "";
    return nameStr.toLowerCase().includes(search.toLowerCase()) || 
           emailStr.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-sm text-gray-500">Loading students...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Student Directory</h3>
          <p className="text-xs text-gray-400 mt-0.5">All registered students</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
            <Search size={12} className="text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="text-xs bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none w-28"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Student", "Email", "Joined On", "Last Login"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 px-5 py-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {(s.display_name ? s.display_name.split(" ").map((n) => n[0]).join("") : "?")}
                    </div>
                    <span className="font-medium text-gray-800 whitespace-nowrap">{s.display_name || "Unknown"}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs">{s.email}</td>
                <td className="px-5 py-3 text-gray-500 text-xs">
                  {new Date(s.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs">
                  {s.last_login ? new Date(s.last_login).toLocaleDateString() : "Never"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-4 text-center text-sm text-gray-400">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-400">Showing {filtered.length} of {students.length} students</p>
      </div>
    </div>
  );
}
