"use client";
import { useState, useEffect } from "react";
import TPOPageShell from "@/component/tpo/TPOPageShell";
import { GraduationCap, Users, Star, CalendarDays, Clock, ChevronDown, ChevronUp, Loader2, Inbox } from "lucide-react";
import { tpoColor } from "@/component/tpo/tpoColors";
import { api } from "@/lib/api";

function StarRow({ count }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={11}
          className={
            i <= Math.round(count)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-200 fill-gray-200"
          }
        />
      ))}
    </div>
  );
}

export default function MentorshipPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get("/api/mentorship/sessions");
        setSessions(response.data);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // Calculate KPIs
  const totalSessions = sessions.length;
  const totalAttendees = sessions.reduce((acc, s) => acc + (s.attendees || 0), 0);
  const avgRating = sessions.length > 0 
    ? (sessions.reduce((acc, s) => acc + (s.rating || 0), 0) / sessions.length).toFixed(1)
    : "0.0";
  
  // Rating distribution
  const ratings = [0, 0, 0, 0, 0];
  sessions.forEach(s => {
    const r = Math.round(s.rating || 0);
    if (r >= 1 && r <= 5) ratings[5 - r]++;
  });
  const totalReviews = sessions.length; // Simplified for now

  return (
    <TPOPageShell title="Mentorship" subtitle="Expert sessions, attendance records, and student reviews">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-purple-600" size={32} />
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
          <Inbox size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No mentorship sessions scheduled yet</p>
        </div>
      ) : (
        <>
          {/* KPI */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { icon: CalendarDays, label: "Sessions Held", value: totalSessions, sub: "All time", color: "purple" },
              { icon: Users, label: "Total Attendances", value: totalAttendees, sub: `${sessions.length} sessions`, color: "blue" },
              { icon: Star, label: "Avg Session Rating", value: avgRating, sub: "From student feedback", color: "yellow" },
              { icon: Clock, label: "Avg Session Length", value: "60 min", sub: "Standard duration", color: "green" },
            ].map(({ icon: Icon, label, value, sub, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className={`inline-flex p-2.5 rounded-lg ${tpoColor(color).bg50} mb-3`}>
                  <Icon size={16} className={tpoColor(color).text600} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs font-medium text-gray-600 mt-0.5">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Rating distribution */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Rating Distribution ({totalReviews} reviews)</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars, idx) => {
                const count = ratings[idx];
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 w-20 flex-shrink-0">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={10} className={i <= stars ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                      ))}
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-16 text-right">{count} ({pct.toFixed(0)}%)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Session Cards */}
          <div className="space-y-4">
            {sessions.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-left">
                {/* Header */}
                <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 font-bold text-base flex items-center justify-center flex-shrink-0">
                    {s.mentorName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <p className="font-semibold text-gray-900">{s.mentorName}</p>
                      <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">{s.sessionType || 'Session'}</span>
                    </div>
                    <p className="text-sm text-gray-500">{s.mentorRole}</p>
                    <p className="text-xs text-gray-400 mt-1">{s.topic}</p>
                  </div>
                  <div className="flex gap-6 text-center flex-shrink-0">
                    <div>
                      <p className="text-xl font-bold text-gray-900">{s.attendees || 0}</p>
                      <p className="text-xs text-gray-400">Attendees</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">{s.rating || 0}</p>
                      <p className="text-xs text-gray-400">Rating</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    className="flex items-center gap-1 text-xs text-purple-600 font-medium border border-purple-200 rounded-lg px-3 py-1.5 hover:bg-purple-50 transition"
                  >
                    {expanded === s.id ? <><ChevronUp size={12} />Hide</> : <><ChevronDown size={12} />Details</>}
                  </button>
                </div>

                {/* Date Wrapper */}
                <div className="px-6 py-3 bg-purple-50 border-t border-purple-100 flex items-center gap-2">
                  <CalendarDays size={13} className="text-purple-500" />
                  <span className="text-xs text-purple-700 font-medium">Session Date: {new Date(s.date).toLocaleDateString()} {s.sessionTime ? `· ${s.sessionTime}` : ''}</span>
                </div>

                {/* Expanded details */}
                {expanded === s.id && (
                  <div className="px-6 py-4 border-t border-gray-100 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Focus Area</h4>
                      <p className="text-sm text-gray-600 italic">&quot;{s.whyThisMentor}&quot;</p>
                    </div>
                    
                    {s.reviews && s.reviews.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Student Feedback</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {s.reviews.map((r, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                              <div className="flex items-center justify-between mb-1.5">
                                <p className="text-xs font-bold text-gray-900 uppercase tracking-tight">{r.reviewerName || 'Student'}</p>
                                <StarRow count={r.stars} />
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed italic">&quot;{r.reviewText}&quot;</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </TPOPageShell>
  );
}

