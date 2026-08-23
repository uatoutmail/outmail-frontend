"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Monitor, CheckCircle2, XCircle, Inbox, KeyRound } from "lucide-react";
import { api } from "@/lib/api";
import { useNow } from "@/hooks/useNow";
import { usePolling } from "@/hooks/usePolling";

/** Convert an ISO timestamp to a relative "X ago" label. */
function timeAgo(isoString) {
  if (!isoString) return "";
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const MailingAgentPanel = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkCode, setLinkCode] = useState(null);
  const [linkCodeExpiry, setLinkCodeExpiry] = useState(null);
  const [generatingCode, setGeneratingCode] = useState(false);
  const now = useNow();

  const fetchStatus = useCallback(async () => {
    try {
      const res = await api.get("/api/agent/status");
      setStatus(res.data);
    } catch (err) {
      console.error("[MailingAgentPanel] Failed to fetch status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 30s rather than the previous 10s, and only while the tab is visible.
  // usePolling calls this immediately on mount, so it replaces the fetch-on-
  // mount effect as well as the interval. Agent status changes on the order of
  // minutes, so a 10-second poll bought nothing while keeping the database
  // awake continuously (OUT-206).
  usePolling(fetchStatus, 30000);

  const today = status?.today || { sent: 0, waiting: 0, queued: 0, failed: 0 };
  const total = today.sent + today.waiting + today.queued + today.failed;
  const progress = total > 0 ? Math.round((today.sent / total) * 100) : 0;
  const online = !!status?.online;
  const usage = status?.usage || { dailyUsed: 0, dailyLimit: null };
  const logs = status?.logs || [];

  const generateLinkCode = async () => {
    setGeneratingCode(true);
    try {
      const res = await api.post("/api/agent/link/code");
      setLinkCode(res.data.code);
      setLinkCodeExpiry(Date.now() + res.data.expiresInSeconds * 1000);
    } catch (err) {
      console.error("[MailingAgentPanel] Failed to generate link code:", err);
    } finally {
      setGeneratingCode(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 h-full flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
            <Monitor size={13} className="text-purple-400" />
            Mailing Agent
          </h3>
          <p className="text-[11px] text-white/40">
            Sends from your desktop
            {status?.lastSeen && (
              <span className="text-white/30"> · last check-in {timeAgo(status.lastSeen)}</span>
            )}
          </p>
        </div>
        <span
          className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full border ${
            online
              ? "bg-green-500/15 text-green-400 border-green-500/30"
              : "bg-white/5 text-white/40 border-white/10"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              online ? "bg-green-400 animate-pulse" : "bg-white/30"
            }`}
          />
          {online ? "Online" : "Offline"}
        </span>
      </div>

      {/* Today's progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-white/50">Today&apos;s mailing</span>
          <span className="text-[11px] font-medium text-white">
            {today.sent} / {total} sent
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-purple-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-3 mt-1.5 text-[10px] text-white/40">
          <span>{today.queued + today.waiting} pending</span>
          {today.failed > 0 && (
            <span className="text-red-400">{today.failed} failed</span>
          )}
          <span className="ml-auto">
            Daily limit: {usage.dailyLimit ? `${usage.dailyUsed}/${usage.dailyLimit}` : "—"}
          </span>
        </div>
      </div>

      {/* Link desktop agent */}
      {!online && (
        <div className="mb-3 bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
          {linkCode ? (
            <div className="text-center">
              <p className="text-[11px] text-white/50 mb-1">
                Enter this code in the Outmail desktop app:
              </p>
              <p className="text-lg font-bold tracking-widest text-purple-300">{linkCode}</p>
              <p className="text-[10px] text-white/30 mt-1">
                Expires in {Math.max(0, Math.round((linkCodeExpiry - now) / 60000))} min
              </p>
            </div>
          ) : (
            <button
              onClick={generateLinkCode}
              disabled={generatingCode}
              className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-purple-300 hover:text-purple-200 disabled:opacity-50"
            >
              <KeyRound size={12} />
              {generatingCode ? "Generating..." : "Link Desktop Agent"}
            </button>
          )}
        </div>
      )}

      {/* Log feed */}
      <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full py-6">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white/60" />
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 py-6">
            <Inbox size={28} className="text-white/20" />
            <p className="text-xs text-white/30 text-center">
              No sends yet.
              <br />
              {online
                ? "Your agent is connected and waiting for today's batch."
                : "Open the Outmail desktop app to start sending."}
            </p>
          </div>
        ) : (
          /* Sends and failures only — heartbeats are liveness, not activity
             (OUT-174); the header shows the single last-check-in line. */
          logs.map((log) => {
            const ok = log.status === "success";
            return (
              <div
                key={log.id}
                className="flex items-center gap-2.5 py-1.5 border-b border-white/5 last:border-0"
              >
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  {ok ? (
                    <CheckCircle2 size={11} className="text-green-400" />
                  ) : (
                    <XCircle size={11} className="text-red-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white truncate">
                    {ok
                      ? `Sent to ${log.recipient || "recipient"}`
                      : `Failed: ${log.recipient || "recipient"}`}
                  </p>
                  {log.error && (
                    <p className="text-[10px] text-red-400/70 truncate">{log.error}</p>
                  )}
                </div>
                <span className="text-[10px] text-white/35 flex-shrink-0">
                  {timeAgo(log.createdAt)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MailingAgentPanel;
