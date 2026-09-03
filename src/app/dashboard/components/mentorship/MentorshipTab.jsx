"use client";
import { Calendar, FileText, Play, ExternalLink, Eye, Plus, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";

// Open a session link if the backend provided one; otherwise give honest
// feedback instead of a silent no-op or a fake success.
const openOrNotice = (url, message) => {
  if (url) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    toast(message);
  }
};

const MentorshipTab = () => {
  const [showArchivedSessions, setShowArchivedSessions] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get("/api/mentorship/sessions");
        setSessions(response.data);
      } catch (error) {
        logger.error("Error fetching mentorship sessions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const getStatus = (date) => {
    const sessionDate = new Date(date);
    const now = new Date();

    // Simple logic for status:
    // active: same day
    // upcoming: future day
    // past: past day

    const isToday = sessionDate.toDateString() === now.toDateString();
    if (isToday) return "active";
    if (sessionDate > now) return "upcoming";
    return "past";
  };

  const activeSessions = sessions.filter((s) => getStatus(s.date) === "active");
  const upcomingSessions = sessions.filter((s) => getStatus(s.date) === "upcoming");
  const archivedSessions = sessions.filter((s) => getStatus(s.date) === "past");

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "upcoming":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "past":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getSessionTypeBadge = (type) => {
    switch (type) {
      case "Group Session":
        return "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30";
      case "Workshop":
        return "bg-orange-500/20 text-orange-300 border border-orange-500/30";
      case "Q&A":
        return "bg-teal-500/20 text-teal-300 border border-teal-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-500/30";
    }
  };

  const getSessionTypeLabel = (type) => {
    switch (type) {
      case "Q&A":
        return "💬 Ask Me Anything";
      case "Group Session":
        return "👥 Group Session";
      case "Workshop":
        return "🛠 Workshop";
      default:
        return type;
    }
  };

  const renderSessionCard = (session) => {
    const status = getStatus(session.date);
    const formattedDate = new Date(session.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return (
      <div
        key={session.id}
        className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/15 hover:border-white/30 transition-all duration-300 shadow-md"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-white">{session.mentorName}</h3>
              <p className="text-xs text-white/60">{session.mentorRole}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
            <span
              className={`px-2.5 py-1 rounded-full border text-xs font-semibold capitalize ${getStatusStyle(status)}`}
            >
              {status}
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getSessionTypeBadge(session.sessionType)}`}
            >
              {getSessionTypeLabel(session.sessionType)}
            </span>
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-2 mb-4">
          <p className="text-xs text-purple-200 leading-relaxed">
            <span className="font-semibold text-purple-300">Why attend: </span>
            {session.whyThisMentor}
          </p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-white/70">
            <Calendar size={14} />
            <span className="text-sm">
              {formattedDate} · {session.sessionTime}
            </span>
          </div>
          <div className="flex items-start gap-2 text-white/70">
            <FileText size={14} className="mt-0.5 shrink-0" />
            <p className="text-sm font-medium text-white/90">{session.topic}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {status === "past" ? (
            <button
              onClick={() =>
                openOrNotice(
                  session.recordingUrl || session.recordingLink,
                  "Recording will be available here soon."
                )
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Play size={14} /> Watch Recording
            </button>
          ) : status === "active" ? (
            <button
              onClick={() =>
                openOrNotice(
                  session.meetingLink || session.joinUrl || session.link,
                  "The join link opens when the session goes live."
                )
              }
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <ExternalLink size={14} /> Join Now
            </button>
          ) : (
            <>
              <button
                onClick={() =>
                  openOrNotice(session.detailsUrl, "Full session details are coming soon.")
                }
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Eye size={14} /> View Details
              </button>
              <button
                onClick={() =>
                  openOrNotice(session.bookingLink, "Slot booking opens soon — we'll notify you.")
                }
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={14} /> Book Slot
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
        <p className="text-white/60 font-syne animate-pulse">Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 font-syne">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 mt-10 text-white">Mentorship</h1>
          <p className="text-white/60 text-sm sm:text-base">
            Learn from leaders at companies actively hiring — sharpen your edge before you reach out
          </p>
        </div>
      </div>

      {activeSessions.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-green-400">Live Now</h2>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSessions.map(renderSessionCard)}
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400">Upcoming</h2>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>
        {upcomingSessions.length === 0 ? (
          <p className="text-white/40 italic text-sm">No upcoming sessions scheduled.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingSessions.map(renderSessionCard)}
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => setShowArchivedSessions((prev) => !prev)}
          className="flex items-center gap-3 w-full text-left mb-4 group"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-300 transition-colors">
            Past Sessions
          </h2>
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-gray-400 group-hover:text-gray-300 transition-colors text-xs font-medium">
            {showArchivedSessions ? "▲ Hide" : "▼ Show"}
          </span>
        </button>
        {showArchivedSessions && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {archivedSessions.length === 0 ? (
              <p className="text-white/40 italic text-sm">No past sessions found.</p>
            ) : (
              archivedSessions.map(renderSessionCard)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipTab;
