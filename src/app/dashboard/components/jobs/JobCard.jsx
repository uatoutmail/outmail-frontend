import { Sparkles, CheckCircle, X, AlertTriangle, Wand2, Clock } from "lucide-react";
import { Fraunces } from "next/font/google";
import React, { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

// A reviewer sometimes reads a real deadline off the posting itself (e.g.
// "closes in 3 days") and logs it on approval — applicationDeadline is that
// ISO timestamp, never a pre-formatted string, so the label stays accurate
// however long this card sits open rather than going stale/negative.
export function getDeadlineLabel(applicationDeadline) {
  if (!applicationDeadline) return null;
  const diffMs = new Date(applicationDeadline).getTime() - Date.now();
  if (diffMs <= 0) return null;
  const hours = diffMs / 3_600_000;
  if (hours < 24) {
    const n = Math.max(1, Math.round(hours));
    return `Closes in ${n} hour${n === 1 ? "" : "s"}`;
  }
  const days = Math.round(diffMs / 86_400_000);
  return `Closes in ${days} day${days === 1 ? "" : "s"}`;
}

// Scoped here (not in the root layout) rather than next/font's own usage
// guidance of "import once, use everywhere" — this repo deliberately
// consolidated every other typeface onto Syne after three unused families
// were found loading on every page load (see layout.js). Importing it in
// this leaf component keeps the same discipline: Fraunces's woff2 only
// downloads on pages that actually render a job card.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-fraunces-var",
  display: "swap",
});

const JobCard = ({
  job,
  getPriorityTier,
  getPriorityScoreColor,
  getStatusColor,
  getStatusText,
  handleOpenJob,
  handleDiscard,
  handleResetStatus,
  handleApply,
  handleJobReported,
}) => {
  const tier = getPriorityTier(job.matchScore);
  const isNew = !job.userAction; // no per-user action yet
  // A history-list card (Applied/Discarded tabs) carries no live score —
  // tier's own fallback would otherwise paint it as a blue "Possible Match"
  // accent, which is misleading once there's no score behind it at all.
  const accentBorder = job.matchScore == null ? "border-white/15" : tier.border;

  // Accept either backend field shape (applyLink/url or applyUrl/sourceUrl) so
  // links work regardless of which backend version is deployed.
  const applyUrl = job.applyLink || job.applyUrl || job.url || job.sourceUrl;
  const skills = job.signals || job.skills || [];
  const [leadReason, ...restReasons] = job.reasons || [];
  const initial = (job.company || "?").trim().charAt(0).toUpperCase();
  const deadlineLabel = getDeadlineLabel(job.applicationDeadline);

  const onApply = () => {
    handleOpenJob(applyUrl);
    handleApply(job.id);
  };

  // Reporting a dead job. The student clicking through is the only check that
  // runs against every live job every day — a link that rotted this morning
  // reaches us here long before the next verification sweep would catch it.
  const [reportOpen, setReportOpen] = useState(false);
  const [reportState, setReportState] = useState("idle"); // idle | sending | error — a successful report removes this card entirely, so there's no "done" state to render
  const [reportMessage, setReportMessage] = useState("");

  const submitReport = async (reason) => {
    setReportState("sending");
    try {
      const { data } = await api.post(`/api/jobs/${job.id}/report`, { reason });
      setReportOpen(false);
      // The card is about to be removed from the list, so the confirmation
      // has to be a toast, not the inline message below (which would never
      // be seen). The job isn't gone globally — other students may still see
      // it until admin reviews the report — this only stops showing it to
      // the person who just told us it's broken.
      toast(data?.message || "Thanks, flagged for review — removed from your list.");
      handleJobReported(job.id);
    } catch {
      setReportMessage("Could not send that just now. Please try again.");
      setReportState("error");
    }
  };

  return (
    // A translucent WHITE overlay (bg-white/X) lightens whatever sits behind
    // it — against this page's violet gradient shell that produced a washed-
    // out lavender card. surface-panel/surface-deep are this app's own
    // violet-black tokens (globals.css), so a translucent layer of THOSE
    // blends toward more of the same dark violet instead of an off-brand
    // tint — genuinely glassy (backdrop-blur-xl lets the page show through)
    // without the earlier contrast bug, and lighter than a fully opaque fill.
    <div
      className={`${fraunces.variable} bg-gradient-to-br from-surface-panel/60 to-surface-deep/75 backdrop-blur-xl rounded-lg border-l-[3px] ${accentBorder} p-4`}
    >
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-xs font-extrabold text-purple-300 shrink-0">
              {initial}
            </div>
            <span className="text-xs font-semibold text-white/55 truncate">
              {job.company}
              {job.location && ` · ${job.location}`}
              {job.workType && ` · ${job.workType}`}
            </span>
          </div>

          <h3
            className="text-xl sm:text-2xl font-extrabold text-white leading-tight mt-2"
            style={{ fontFamily: "var(--font-fraunces-var)" }}
          >
            {job.title}
          </h3>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 ${getStatusColor(job.userAction)}`}
            >
              {getStatusText(job.userAction)}
            </span>
            {job.seniority && (
              <span className="px-2 py-0.5 bg-white/5 text-white/50 border border-white/10 rounded-full text-xs font-semibold capitalize">
                {job.seniority}
              </span>
            )}
            {deadlineLabel && (
              <span
                title="A reviewer confirmed this deadline directly from the posting"
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border bg-amber-500/10 text-amber-300 border-amber-500/20"
              >
                <Clock size={11} className="shrink-0" />
                {deadlineLabel}
              </span>
            )}
            {/* Never gates whether a job shows up — purely so a student whose
                extension doesn't fill this one knows Outmail hasn't confirmed
                it yet, rather than assuming the extension is broken (OUT-275). */}
            <span
              title={
                job.autofillReady
                  ? "Outmail's extension has a confirmed mapping for this application form."
                  : "Outmail hasn't confirmed the extension can fill this form yet — fill it by hand."
              }
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                job.autofillReady
                  ? "bg-green-500/10 text-green-300 border-green-500/20"
                  : "bg-white/5 text-white/40 border-white/10"
              }`}
            >
              <Wand2 size={11} className="shrink-0" />
              {job.autofillReady ? "Autofill ready" : "Fill manually"}
            </span>
          </div>
        </div>

        {job.matchScore != null && (
          <div className="text-right shrink-0">
            <div
              className={`text-3xl font-bold leading-none ${getPriorityScoreColor(job.matchScore)}`}
              style={{ fontFamily: "var(--font-fraunces-var)" }}
            >
              {job.matchScore}
            </div>
            <div className="text-[9.5px] text-white/40 uppercase tracking-wide mt-1 whitespace-nowrap">
              Outmail Score
            </div>
          </div>
        )}
      </div>

      {/* Why matched (OUT-27 reasons) — the lead reason carries the card's
          main editorial voice; any extras fall back to the old chip style
          rather than competing for the same spotlight. */}
      {leadReason && (
        <p className="mt-3 text-[15px] leading-snug text-white/80 italic">
          &ldquo;{leadReason.detail}&rdquo;
        </p>
      )}
      {restReasons.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {restReasons.map((r, i) => (
            <span
              key={i}
              className="flex items-center gap-1 px-2.5 py-1 bg-green-500/10 border border-green-500/20 text-green-200 rounded-md text-[11px] font-medium"
            >
              <Sparkles size={11} className="shrink-0" /> {r.detail}
            </span>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((signal, i) => (
            <span
              key={i}
              className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-200 rounded-md text-[11px] font-medium"
            >
              {signal}
            </span>
          ))}
        </div>
      )}

      {reportState === "error" && <p className="mt-3 text-sm text-red-300/90">{reportMessage}</p>}

      {reportOpen && (
        <div className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
          <p className="text-sm text-white/70 mb-3">What&apos;s wrong with this one?</p>
          <div className="flex flex-wrap gap-2">
            {[
              ["LINK_BROKEN", "Link is broken"],
              ["NOT_ACCEPTING", "No longer accepting applications"],
              ["WRONG_ROLE", "Not the role it says"],
              ["OTHER", "Something else"],
            ].map(([reason, label]) => (
              <button
                key={reason}
                onClick={() => submitReport(reason)}
                disabled={reportState === "sending"}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/75 border border-white/10 transition-colors disabled:opacity-50"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setReportOpen(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center gap-3 mt-3">
        {job.compensation ? (
          <span className="text-sm text-white/55">{job.compensation}</span>
        ) : (
          <span />
        )}
        <div className="flex flex-wrap gap-2">
          {isNew ? (
            <>
              <button
                onClick={() => handleDiscard(job.id)}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full border border-white/15 text-white/65 hover:text-white hover:border-white/30 font-bold text-xs transition-all active:scale-95"
              >
                <X size={14} /> Discard
              </button>
              <button
                onClick={() => setReportOpen((v) => !v)}
                title="Tell us this job is closed or the link is broken"
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full border border-white/15 text-white/65 hover:text-amber-300 hover:border-amber-500/40 font-bold text-xs transition-all active:scale-95"
              >
                <AlertTriangle size={14} /> Report
              </button>
              <button
                onClick={onApply}
                className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground font-extrabold text-xs transition-all active:scale-95"
              >
                <CheckCircle size={14} /> Apply Now
              </button>
            </>
          ) : (
            <button
              onClick={() => handleResetStatus(job.id)}
              className="flex items-center justify-center gap-1.5 px-5 py-2 rounded-full border border-white/15 text-white hover:border-white/30 font-bold text-xs transition-all active:scale-95"
            >
              Reset Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
