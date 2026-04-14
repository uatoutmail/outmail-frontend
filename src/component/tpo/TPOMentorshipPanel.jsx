"use client";
import { useState, useEffect } from "react";
import { Star, GraduationCap, CalendarCheck, Users } from "lucide-react";
import { api } from "@/lib/api";

function StarRow({ count }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={i <= Math.round(count) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

export default function TPOMentorshipPanel() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/api/mentorship/sessions");
        setSessions(res.data || []);
      } catch (err) {
        console.error("Failed to fetch mentorship sessions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const totalSessions = sessions.length;
  const totalAttended = sessions.reduce((acc, s) => acc + (s.attendees || 0), 0);
  const avgRating = totalSessions > 0 
    ? (sessions.reduce((acc, s) => acc + (s.rating || 0), 0) / totalSessions).toFixed(1)
    : "0.0";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full max-h-[800px]">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-0.5">
          <GraduationCap size={16} className="text-purple-600" />
          <h3 className="text-sm font-semibold text-gray-900">Mentorship Sessions</h3>
        </div>
        <p className="text-xs text-gray-400">Recent sessions & student feedback</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        {[
          { icon: CalendarCheck, label: "Sessions", value: totalSessions },
          { icon: Users,         label: "Attended",  value: totalAttended },
          { icon: Star,          label: "Avg Rating", value: avgRating },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col items-center py-4 gap-1">
            <Icon size={14} className="text-purple-500" />
            <p className="text-base font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-50 px-6 py-2">
        {loading ? (
          <div className="py-4 text-center text-sm text-gray-500">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-500">No sessions available.</div>
        ) : (
          sessions.map((s) => (
            <div key={s.id} className="py-4">
              {/* Mentor */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {s.mentorName ? s.mentorName.split(" ").map((n) => n[0]).join("").substring(0, 2) : "M"}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{s.mentorName}</p>
                    <p className="text-xs text-gray-400">{s.mentorRole}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <StarRow count={s.rating} />
                    <span className="text-xs font-semibold text-gray-700">{s.rating || "0"}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{s.attendees} attended</p>
                </div>
              </div>

              {/* Topic + Date */}
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded-md font-medium">{s.topic}</span>
                <span className="text-xs text-gray-400">{new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>

              {/* Reviews */}
              {s.reviews && s.reviews.length > 0 && (
                <div className="space-y-2">
                  {s.reviews.map((r) => (
                    <div key={r.id} className="bg-gray-50 rounded-lg px-3 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-medium text-gray-700">{r.reviewerName}</p>
                        <StarRow count={r.stars} />
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">&ldquo;{r.reviewText}&rdquo;</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-100">
        <button className="text-xs text-purple-600 font-medium hover:underline">View all sessions →</button>
      </div>
    </div>
  );
}
