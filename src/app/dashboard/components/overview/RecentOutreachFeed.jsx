"use client";
import { Clock, Mail, Inbox } from "lucide-react";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";

function companyFromEmail(email = "") {
  try {
    const domain = email.split("@")[1] || email;
    return domain;
  } catch {
    return email;
  }
}

/** Convert an ISO timestamp to a relative "X ago" label. */
function timeAgo(isoString) {
  if (!isoString) return "";
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const SkeletonRow = () => (
  <div className="flex items-center gap-2.5 py-1.5 border-b border-white/5 last:border-0 animate-pulse">
    <div className="w-7 h-7 rounded-full bg-white/10 flex-shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="h-2.5 bg-white/10 rounded w-2/3" />
      <div className="h-2 bg-white/5 rounded w-1/3" />
    </div>
    <div className="h-2 bg-white/10 rounded w-10 flex-shrink-0" />
  </div>
);

const RecentOutreachFeed = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/api/student/analytics");
        const recent = (res.data?.analytics?.recentActivity || []).slice(0, 5);
        setLogs(recent);
      } catch (err) {
        logger.error("[RecentOutreachFeed] Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 h-full flex flex-col">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
          <Clock size={13} className="text-cyan-400" />
          Recent Outreach
        </h3>
        <p className="text-[11px] text-white/40">Last 5 emails sent</p>
      </div>

      <div className="flex-1 overflow-hidden space-y-1">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 py-6">
            <Inbox size={28} className="text-white/20" />
            <p className="text-xs text-white/30">No emails sent yet</p>
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-2.5 py-1.5 border-b border-white/5 last:border-0"
            >
              <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Mail size={12} className="text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {log.organization_name || companyFromEmail(log.recipient_email)}
                </p>
                <p className="text-[10px] text-white/40 truncate">
                  {log.subject || "Cold Outreach"}
                </p>
              </div>
              <span className="text-[10px] text-white/35 flex-shrink-0">
                {timeAgo(log.sent_at || log.created_at)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentOutreachFeed;
