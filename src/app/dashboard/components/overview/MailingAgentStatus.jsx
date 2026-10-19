"use client";
import { Monitor, KeyRound, Download } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useNow } from "@/hooks/useNow";
import { usePolling } from "@/hooks/usePolling";
import { api } from "@/lib/api";
import { DOWNLOAD_URLS, PLATFORM_LABEL, detectPlatform } from "@/lib/desktopDownload";
import { logger } from "@/lib/logger";
import { POLL_MS } from "@/lib/polling";

/** Convert an ISO timestamp to a relative "X ago" label. */
function timeAgo(isoString) {
  if (!isoString) return "";
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// A deliberately loud status light (not the quiet corner badge
// MailingAgentPanel uses) — this card's whole job on the compact dashboard
// is to be the first thing a student notices: is my sending agent actually
// running right now. Full send-progress/activity detail still lives on the
// Cold Outreach tab; this is just the alarm.
const MailingAgentStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [linkCode, setLinkCode] = useState(null);
  const [linkCodeExpiry, setLinkCodeExpiry] = useState(null);
  const [generatingCode, setGeneratingCode] = useState(false);
  const now = useNow();
  const platform = detectPlatform();

  const fetchStatus = useCallback(async () => {
    try {
      const res = await api.get("/api/agent/status");
      setStatus(res.data);
    } catch (err) {
      logger.error("[MailingAgentStatus] Failed to fetch status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  usePolling(fetchStatus, POLL_MS);

  const online = !!status?.online;

  const generateLinkCode = async () => {
    setGeneratingCode(true);
    try {
      const res = await api.post("/api/agent/link/code");
      setLinkCode(res.data.code);
      setLinkCodeExpiry(Date.now() + res.data.expiresInSeconds * 1000);
    } catch (err) {
      logger.error("[MailingAgentStatus] Failed to generate link code:", err);
    } finally {
      setGeneratingCode(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
          <Monitor size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Mailing Agent</h3>
          <p className="text-[10px] text-white/40">Sends from your desktop</p>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-white" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-2">
          {/* A glass-marble orb (radial gradient + a soft highlight + a
              two-layer ambient glow) rather than a flat Tailwind-palette
              dot — the same signal, rendered like something a premium
              product would ship instead of a stock alert icon. Offline
              gets a slow breathing pulse (animate-pulse), not a frantic
              ping — attention-grabbing without reading as an alarm. */}
          <div className="relative flex items-center justify-center h-16 w-16">
            <span
              className={`absolute inline-flex h-16 w-16 rounded-full ${
                online ? "bg-emerald-400/25 animate-ping" : "bg-rose-500/25 animate-pulse"
              }`}
            />
            <span
              className={`relative inline-flex h-14 w-14 rounded-full ring-1 ring-white/20 ${
                online
                  ? "bg-[radial-gradient(circle_at_32%_28%,#a7f3d0_0%,#10b981_42%,#065f46_100%)] shadow-[0_0_18px_4px_rgba(16,185,129,0.45),0_0_42px_14px_rgba(16,185,129,0.18)]"
                  : "bg-[radial-gradient(circle_at_32%_28%,#fecdd3_0%,#e11d48_42%,#7f1d1d_100%)] shadow-[0_0_18px_4px_rgba(225,29,72,0.4),0_0_42px_14px_rgba(225,29,72,0.16)]"
              }`}
            >
              {/* Glass highlight */}
              <span className="absolute top-2 left-2.5 h-3 w-3 rounded-full bg-white/50 blur-[2px]" />
            </span>
          </div>
          <div className="text-center">
            <p
              className={`text-lg font-bold tracking-wide bg-clip-text text-transparent ${
                online
                  ? "bg-gradient-to-r from-emerald-300 to-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.45)]"
                  : "bg-gradient-to-r from-rose-300 to-rose-500 drop-shadow-[0_0_10px_rgba(225,29,72,0.4)]"
              }`}
            >
              {online ? "Online" : "Offline"}
            </p>
            <p className="text-[11px] text-white/40 mt-0.5">
              {status?.lastSeen ? `Last check-in ${timeAgo(status.lastSeen)}` : "Never connected"}
            </p>
          </div>

          {!online && (
            <div className="w-full pt-1 space-y-2">
              {linkCode ? (
                <div className="text-center">
                  <p className="text-[10px] text-white/50">Enter this code in the desktop app:</p>
                  <p className="text-base font-bold tracking-widest text-purple-300">{linkCode}</p>
                  <p className="text-[9px] text-white/30">
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
              <a
                href={DOWNLOAD_URLS[platform]}
                className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-white bg-purple-500 hover:bg-purple-400 rounded-md py-1.5 transition-colors"
              >
                <Download size={12} />
                Download for {PLATFORM_LABEL[platform]}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MailingAgentStatus;
