"use client";
import { Monitor, KeyRound, Download, RefreshCw } from "lucide-react";
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

  // Ambient Tone Wash: no dot, no orb, no ring — the card's own background
  // temperature IS the signal (a soft radial wash in the state's colour),
  // the icon tint and the heading colour carry the rest. Soft and
  // professional at rest; offline still reads clearly because the wash,
  // the icon and the heading all shift colour together, not just one dot.
  const wash = online
    ? "bg-[radial-gradient(ellipse_at_18%_15%,rgba(52,211,153,0.16),transparent_65%)] bg-white/[0.045] border-emerald-400/20"
    : "bg-[radial-gradient(ellipse_at_18%_15%,rgba(251,113,133,0.15),transparent_65%)] bg-white/[0.045] border-rose-400/20";
  const iconTint = online ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300";
  const headingColor = online ? "text-emerald-300" : "text-rose-300";

  return (
    <div
      className={`rounded-xl p-4 border h-full flex flex-col backdrop-blur-md transition-colors ${loading ? "bg-white/10 border-white/10" : wash}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`p-2 rounded-lg transition-colors ${loading ? "bg-purple-500/20 text-purple-400" : iconTint}`}
        >
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
        <div className="flex-1 flex flex-col gap-2 py-1">
          <p className={`text-xl font-bold ${headingColor}`}>{online ? "Online" : "Offline"}</p>
          <p className="text-[11px] text-white/45">
            {status?.lastSeen ? `Last check-in ${timeAgo(status.lastSeen)}` : "Never connected"}
          </p>

          {/* OUT-173: the agent is installed (it has checked in before) but
              Gmail itself got disconnected — a different situation from
              never having linked the device at all, so it gets its own CTA
              rather than falling into the "Link Desktop Agent" flow below.
              This is a deep link (outmail://reconnect-gmail), not a password
              field — the app password is never typed on a web page (OUT-169
              rule, enforced in the desktop app itself). Clicking it opens the
              already-installed app straight to its native Gmail settings
              panel; if the stored credential is still valid, it reconnects
              with nothing to type at all. */}
          {status?.lastSeen && status?.credentialConnected === false && (
            <a
              href="outmail://reconnect-gmail"
              className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-white bg-purple-500 hover:bg-purple-400 rounded-md py-1.5 transition-colors mt-auto"
            >
              <RefreshCw size={12} />
              Reconnect Gmail
            </a>
          )}

          {!online && (
            <div className="w-full pt-2 mt-auto space-y-2">
              {linkCode ? (
                // Specific, not just "in the desktop app" — names the exact
                // field the app's own login screen shows ("Enter a one-time
                // code"), and leads with the simpler option it's a fallback
                // for, since this is the exact point someone stares at a
                // code with no idea where it goes.
                <div className="text-center">
                  <p className="text-[10px] text-white/50">
                    On the app&rsquo;s sign-in screen, under &ldquo;Enter a one-time code&rdquo;,
                    paste:
                  </p>
                  <p className="text-base font-bold tracking-widest text-purple-300">{linkCode}</p>
                  <p className="text-[9px] text-white/30">
                    Expires in {Math.max(0, Math.round((linkCodeExpiry - now) / 60000))} min
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-[10px] text-white/40 text-center">
                    Already have the app open? Click &ldquo;Sign in with Google&rdquo; there instead
                    — simplest, no code needed.
                  </p>
                  <button
                    onClick={generateLinkCode}
                    disabled={generatingCode}
                    className="w-full flex items-center justify-center gap-1.5 text-[11px] font-medium text-purple-300 hover:text-purple-200 disabled:opacity-50"
                  >
                    <KeyRound size={12} />
                    {generatingCode ? "Generating..." : "Link Desktop Agent"}
                  </button>
                </>
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
