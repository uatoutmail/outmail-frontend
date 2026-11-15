import { Briefcase, UploadCloud, Loader2, FileText, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import JobCard from "./JobCard";
import JobPreferences from "./JobPreferences";
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";
import { openExternal } from "@/lib/safeUrl";

// India-student launch: /api/jobs 403s with this shape when a resume and/or
// a seeking-type preference are missing — hard prerequisites, not just
// "better matching if you fill this in". Renders in place of the job list
// rather than routing the user away, so completing it is a single step.
const JobPrerequisiteGate = ({ missing, onResumeUploaded, onPreferencesSaved }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const needsResume = missing.includes("resume");
  const needsSeekingType = missing.includes("seekingType");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await api.post("/api/resumes/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resume uploaded.");
      onResumeUploaded();
    } catch (err) {
      toast.error(`Upload failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center py-16 px-6 bg-white/5 rounded-3xl border border-dashed border-purple-500/30 text-center">
      <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
        <FileText size={32} className="text-purple-300" />
      </div>
      <p className="text-white text-xl font-bold mb-2">One more step before job openings unlock</p>
      <p className="text-white/40 text-sm max-w-md mb-8">
        We show every student a feed matched to their actual profile, and that needs a resume and to
        know what you&apos;re looking for first.
      </p>

      {needsResume && (
        <div className="w-full max-w-sm mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            {uploading ? "Uploading…" : "Upload your resume"}
          </button>
          <p className="text-white/25 text-[11px] mt-2">PDF, DOC, DOCX, JPG or PNG, up to 5MB.</p>
        </div>
      )}

      {!needsResume && needsSeekingType && (
        <div className="w-full max-w-md text-left">
          <JobPreferences forceOpen onSaved={onPreferencesSaved} />
        </div>
      )}
    </div>
  );
};

// Hoisted out of JobOpeningsTab (react-hooks/static-components) - a
// component declared inside another component's body is recreated on
// every render.
const TierHeader = ({ label, color, dot, count }) => (
  <div className="flex items-center gap-3 mt-8 mb-4">
    <span className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0`}></span>
    <span className={`text-xs font-black uppercase tracking-[0.2em] ${color}`}>{label}</span>
    <span className="text-white/20 text-xs font-medium">({count})</span>
    <div className="flex-1 h-px bg-white/5"></div>
  </div>
);

// A student who skips a few days comes back to a flat, growing pile with no
// way to tell what's actually new — this is the toggle for the "already
// shown" half of that split (see the unseen/seen split in the render below).
// Collapsed by default; the count stays visible either way. Styled as an
// unmistakable disclosure panel (boxed, bordered, its own chevron badge) —
// a plain text link read as decoration, not something to click (2026-11-15).
const AlreadyShownToggle = ({ count, expanded, onToggle }) => (
  <button
    onClick={onToggle}
    aria-expanded={expanded}
    className="w-full flex items-center justify-between gap-3 px-4 py-3 my-3 rounded-xl border border-white/10 bg-gradient-to-br from-surface-panel/60 to-surface-deep/75 backdrop-blur-xl hover:border-white/20 transition-all text-left"
  >
    <span className="text-sm font-bold text-white/70">
      Already shown <span className="text-white/40 font-semibold">({count})</span>
    </span>
    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white/60 shrink-0">
      {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
    </span>
  </button>
);

// One match tier (Strong/Good/Possible), split into jobs new to this student
// (always expanded) and jobs already shown before (collapsed behind
// AlreadyShownToggle) — UNLESS useAccordion is false, in which case every
// job in the tier renders expanded regardless of seenBefore. useAccordion is
// driven by the TOTAL job count across every tier combined (computed by the
// caller): with 10 or fewer jobs total, hiding anything behind a toggle just
// adds a click for no real decluttering benefit, so everything shows in the
// plain editorial layout; past that the accordion earns its keep. Hoisted
// for the same reason as TierHeader — react-hooks/static-components.
const TierSection = ({
  tierKey,
  label,
  color,
  dot,
  jobs,
  cardProps,
  expandedSeen,
  onToggleSeen,
  animClass,
  useAccordion,
}) => {
  if (jobs.length === 0) return null;
  const unseen = useAccordion ? jobs.filter((j) => !j.seenBefore) : jobs;
  const seen = useAccordion ? jobs.filter((j) => j.seenBefore) : [];
  const seenExpanded = !!expandedSeen[tierKey];
  return (
    <div className={animClass}>
      <TierHeader label={label} color={color} dot={dot} count={jobs.length} />
      {unseen.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {unseen.map((job) => (
            <JobCard key={job.id} job={job} {...cardProps} />
          ))}
        </div>
      )}
      {seen.length > 0 && (
        <>
          <AlreadyShownToggle
            count={seen.length}
            expanded={seenExpanded}
            onToggle={() => onToggleSeen(tierKey)}
          />
          {seenExpanded && (
            <div className="grid grid-cols-1 gap-3">
              {seen.map((job) => (
                <JobCard key={job.id} job={job} {...cardProps} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const JobOpeningsTab = () => {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  // Applied and Discarded are each a durable query of their own
  // (GET /api/jobs/applied / /discarded), NOT a client-side filter over the
  // ranked feed above — an applied/discarded job is excluded from the ranked
  // pool entirely on the next fresh fetch (backend), so filtering jobOpenings
  // client-side would just show an empty result once that happens. Kept as
  // separate state so switching back to "All" doesn't need a refetch.
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appliedLoading, setAppliedLoading] = useState(false);
  const [appliedPagination, setAppliedPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [appliedLoaded, setAppliedLoaded] = useState(false);
  const [discardedJobs, setDiscardedJobs] = useState([]);
  const [discardedLoading, setDiscardedLoading] = useState(false);
  const [discardedPagination, setDiscardedPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [discardedLoaded, setDiscardedLoaded] = useState(false);
  // Per-tier collapse state for the "already shown" split below — keyed by
  // tier label, default collapsed.
  const [expandedSeen, setExpandedSeen] = useState({});
  // { missing: ['resume'|'seekingType', ...] } when /api/jobs 403s on an
  // incomplete prerequisite, null once cleared. Distinct from a plain fetch
  // error — this isn't "something went wrong", it's "one more step".
  const [prerequisiteBlock, setPrerequisiteBlock] = useState(null);

  // OUT-32: authenticated call to the personalized, scored feed. The backend
  // returns real matchScore + reasons per job — no client-side fabrication.
  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/jobs", { params: { page, limit: 10 } });
      if (data.success) {
        setPrerequisiteBlock(null);
        setJobOpenings(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      if (
        error.response?.status === 403 &&
        error.response?.data?.error === "job_prerequisites_incomplete"
      ) {
        setPrerequisiteBlock({ missing: error.response.data.missing || [] });
        setJobOpenings([]);
      } else {
        logger.error("Error fetching jobs:", error);
        setJobOpenings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchJobs is async and only calls setState after its awaits resolve.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobs(1);
  }, []);

  const fetchAppliedJobs = async (page = 1) => {
    setAppliedLoading(true);
    try {
      const { data } = await api.get("/api/jobs/applied", { params: { page, limit: 10 } });
      if (data.success) {
        setAppliedJobs(data.data);
        setAppliedPagination(data.pagination);
        setAppliedLoaded(true);
      }
    } catch (error) {
      logger.error("Error fetching applied jobs:", error);
    } finally {
      setAppliedLoading(false);
    }
  };

  const fetchDiscardedJobs = async (page = 1) => {
    setDiscardedLoading(true);
    try {
      const { data } = await api.get("/api/jobs/discarded", { params: { page, limit: 10 } });
      if (data.success) {
        setDiscardedJobs(data.data);
        setDiscardedPagination(data.pagination);
        setDiscardedLoaded(true);
      }
    } catch (error) {
      logger.error("Error fetching discarded jobs:", error);
    } finally {
      setDiscardedLoading(false);
    }
  };

  const handleFilterChange = (next) => {
    setFilter(next);
    if (next === "applied" && !appliedLoaded) fetchAppliedJobs(1);
    else if (next === "discarded" && !discardedLoaded) fetchDiscardedJobs(1);
  };

  // Throws on failure so callers can surface a real error instead of updating
  // the UI as if the server recorded the action.
  const recordAction = async (jobId, action) => {
    await api.post(`/api/jobs/${jobId}/interactions`, { action });
  };

  const handleApply = async (jobId) => {
    try {
      await recordAction(jobId, "applied");
      setJobOpenings((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, userAction: "applied" } : j))
      );
      // The Applied tab's own list is now stale — it won't include this job
      // until refetched. Forcing a refetch next time it's opened, rather than
      // trying to splice a feed-shaped job into the applied-shaped list here.
      setAppliedLoaded(false);
      toast.success("Marked as applied.");
    } catch (e) {
      logger.error("Failed to record action:", e);
      toast.error("Could not update this job. Please try again.");
    }
  };

  const handleDiscard = async (jobId) => {
    try {
      await recordAction(jobId, "discarded");
      // Same "don't vanish mid-session" treatment as Apply: a discard click
      // might be a mis-click or a change of mind, so the card stays in All
      // (badge flips to Discarded, Reset Status appears) rather than
      // disappearing instantly — it only actually leaves "All" on the next
      // fresh fetch, once the backend's ranked pool excludes it.
      setJobOpenings((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, userAction: "discarded" } : j))
      );
      // The Discarded tab's own list is now stale, same reasoning as
      // appliedLoaded below.
      setDiscardedLoaded(false);
      toast("Job discarded.");
    } catch (e) {
      logger.error("Failed to record action:", e);
      toast.error("Could not discard this job. Please try again.");
    }
  };

  // A student reporting a job (JobCard's submitReport, already succeeded by
  // the time this is called) is as strong a signal as discarding it — the
  // posting stays on OUR side (admin's review desk still needs to see it to
  // confirm/dismiss the report), but there is no reason to keep showing it
  // to the one person who just told us it's broken.
  const handleJobReported = (jobId) => {
    setJobOpenings((prev) => prev.filter((j) => j.id !== jobId));
  };

  const handleResetStatus = async (jobId) => {
    try {
      await api.patch(`/api/jobs/${jobId}/status`, { status: "pending" });
      setJobOpenings((prev) => prev.map((j) => (j.id === jobId ? { ...j, userAction: null } : j)));
      // Resetting clears the backend's applied/discarded JobInteraction row
      // too (see updateJobStatus), so this job genuinely leaves whichever
      // history list it was in — drop it here instead of waiting on a
      // refetch, since the user is very likely looking at that exact tab
      // right now when they click this.
      setAppliedJobs((prev) => prev.filter((j) => j.id !== jobId));
      setDiscardedJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast("Status reset.");
    } catch (e) {
      logger.error("Failed to reset status:", e);
      toast.error("Could not reset status. Please try again.");
    }
  };

  const handleOpenJob = (url) => {
    // Job links come from the aggregation pipeline, not from us. openExternal
    // refuses anything that is not http/https/mailto and always opens with
    // noopener — see lib/safeUrl.js.
    if (!openExternal(url)) {
      toast.error("That job link looks invalid, so we did not open it.");
    }
  };

  const getStatusColor = (action) => {
    switch (action) {
      case "applied":
        return "text-green-400";
      case "saved":
        return "text-yellow-400";
      case "discarded":
        return "text-red-400";
      default:
        return "text-blue-400";
    }
  };

  const getStatusText = (action) => {
    switch (action) {
      case "applied":
        return "Applied";
      case "saved":
        return "Saved";
      case "discarded":
        return "Discarded";
      default:
        return "New";
    }
  };

  // Real 0–100 Outmail Score tiers.
  const getPriorityTier = (score) => {
    if (score >= 70)
      return {
        label: "Strong Match",
        color: "text-green-400",
        dot: "bg-green-400",
        border: "border-green-500/30",
      };
    if (score >= 55)
      return {
        label: "Good Match",
        color: "text-yellow-400",
        dot: "bg-yellow-400",
        border: "border-yellow-500/30",
      };
    return {
      label: "Possible Match",
      color: "text-blue-300",
      dot: "bg-blue-300",
      border: "border-blue-500/20",
    };
  };

  const getPriorityScoreColor = (score) => {
    if (score >= 70) return "text-green-400";
    if (score >= 55) return "text-yellow-400";
    return "text-blue-300";
  };

  // "All" stays inclusive of applied/discarded/saved jobs FOR THE REST OF
  // THIS SESSION (badge + Reset Status in place) — a student who just
  // clicked Apply/Discard to see what a posting was shouldn't have it
  // vanish from their feed before they've actually decided. It only
  // actually leaves "All" on the next fresh fetch, once the backend's
  // ranked pool excludes it (see outmail-backend's matchingService.js).
  // Applied/Discarded are each a wholly separate, durably-fetched list, not
  // a filter over jobOpenings.
  const isHistoryTab = filter === "applied" || filter === "discarded";
  const TAB_CONFIG = {
    all: {
      jobs: jobOpenings,
      loading,
      pagination,
      fetch: fetchJobs,
      label: "Matched",
      loadingCopy: "Analyzing Opportunities...",
      emptyTitle: "No matches yet",
      emptyBody: "Add a resume & job-hunt intent, or check back later",
    },
    applied: {
      jobs: appliedJobs,
      loading: appliedLoading,
      pagination: appliedPagination,
      fetch: fetchAppliedJobs,
      label: "Applied",
      loadingCopy: "Loading your applications...",
      emptyTitle: "No applications yet",
      emptyBody: "Jobs you apply to will show up here",
    },
    discarded: {
      jobs: discardedJobs,
      loading: discardedLoading,
      pagination: discardedPagination,
      fetch: fetchDiscardedJobs,
      label: "Discarded",
      loadingCopy: "Loading discarded jobs...",
      emptyTitle: "No discarded jobs",
      emptyBody: "Jobs you discard will show up here",
    },
  };
  const active = TAB_CONFIG[filter];
  const visibleJobs = active.jobs;
  const highPriority = isHistoryTab ? [] : visibleJobs.filter((j) => j.matchScore >= 70);
  const mediumPriority = isHistoryTab
    ? []
    : visibleJobs.filter((j) => j.matchScore >= 55 && j.matchScore < 70);
  const standard = isHistoryTab ? [] : visibleJobs.filter((j) => j.matchScore < 55);
  // Total across ALL tiers combined, not per tier — the cap is about how
  // much is on the CURRENT PAGE at once (the accordion's own job), not a
  // claim about the full matched set.
  const totalVisibleCount = highPriority.length + mediumPriority.length + standard.length;
  const useAccordion = totalVisibleCount > 10;
  // The summary row's own numbers, unlike totalVisibleCount above, come
  // straight from the backend (pagination.newCount/shownCount) rather than
  // being derived from whatever page is loaded — deriving them client-side
  // would silently cap at one page's worth once there's more than `limit`
  // matches (see outmail-backend#245).
  const newCount = active.pagination.newCount ?? 0;
  const shownCount = active.pagination.shownCount ?? 0;
  const activeLoading = active.loading;
  const activePagination = active.pagination;
  const toggleSeen = (tierKey) =>
    setExpandedSeen((prev) => ({ ...prev, [tierKey]: !prev[tierKey] }));

  const cardProps = {
    getPriorityTier,
    getPriorityScoreColor,
    getStatusColor,
    getStatusText,
    handleOpenJob,
    handleDiscard,
    handleResetStatus,
    handleApply,
    handleJobReported,
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto font-syne pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10 pt-8 sm:pt-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Job Openings
            </h1>
            {/* Applied/Discarded have no new-vs-shown split, so they keep the
                plain count pill — the big-number row below is specific to
                the live ranked feed. */}
            {isHistoryTab && !activeLoading && activePagination.total > 0 && (
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white/50 border border-white/10 uppercase tracking-widest">
                {activePagination.total} {active.label}
              </span>
            )}
          </div>
          <p className="text-white/40 text-sm max-w-md">
            Ranked for your profile by the Outmail Score: real skill, seniority and intent fit, not
            a generic list.
          </p>
        </div>

        <div className="flex bg-white/5 backdrop-blur-sm rounded-2xl p-1.5 border border-white/10 w-full sm:w-auto">
          {["all", "applied", "discarded"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => handleFilterChange(filterType)}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all capitalize tracking-widest ${
                filter === filterType
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/40"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Big-number summary — the editorial card design's own stat row
          (new/matched/already-shown), not a generic "X Matched" badge.
          Only meaningful on the live ranked feed. */}
      {!isHistoryTab && !activeLoading && activePagination.total > 0 && (
        <div className="flex items-center gap-10 pb-6 mb-6 border-b border-white/10">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-accent-light leading-none">
              {newCount}
            </div>
            <div className="text-xs text-white/45 mt-1.5">new openings</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white leading-none">
              {activePagination.total}
            </div>
            <div className="text-xs text-white/45 mt-1.5">matched to you</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white/40 leading-none">
              {shownCount}
            </div>
            <div className="text-xs text-white/45 mt-1.5">already shown</div>
          </div>
        </div>
      )}

      {prerequisiteBlock ? (
        <JobPrerequisiteGate
          missing={prerequisiteBlock.missing}
          onResumeUploaded={() => fetchJobs(1)}
          onPreferencesSaved={() => fetchJobs(1)}
        />
      ) : (
        <>
          <JobPreferences onSaved={() => fetchJobs(1)} />

          {activeLoading ? (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-purple-500/20"></div>
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-t-2 border-purple-500 animate-spin"></div>
              </div>
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest animate-pulse">
                {active.loadingCopy}
              </p>
            </div>
          ) : visibleJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase size={32} className="text-white/20" />
              </div>
              <p className="text-white/50 text-xl font-bold mb-2">{active.emptyTitle}</p>
              <p className="text-white/20 text-sm uppercase tracking-widest font-bold">
                {active.emptyBody}
              </p>
            </div>
          ) : isHistoryTab ? (
            // Application/discard history, most recent first — never
            // re-ranked by match score, so no tiers here.
            <div className="grid grid-cols-1 gap-3">
              {visibleJobs.map((job) => (
                <JobCard key={job.id} job={job} {...cardProps} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <TierSection
                tierKey="strong"
                label="Strong Match"
                color="text-green-400"
                dot="bg-green-400"
                jobs={highPriority}
                cardProps={cardProps}
                expandedSeen={expandedSeen}
                onToggleSeen={toggleSeen}
                useAccordion={useAccordion}
                animClass="animate-in fade-in slide-in-from-bottom-4 duration-500"
              />
              <TierSection
                tierKey="good"
                label="Good Match"
                color="text-yellow-400"
                dot="bg-yellow-400"
                jobs={mediumPriority}
                cardProps={cardProps}
                expandedSeen={expandedSeen}
                onToggleSeen={toggleSeen}
                useAccordion={useAccordion}
                animClass="animate-in fade-in slide-in-from-bottom-4 duration-700"
              />
              <TierSection
                tierKey="possible"
                label="Possible Match"
                color="text-blue-400"
                dot="bg-blue-400"
                jobs={standard}
                cardProps={cardProps}
                expandedSeen={expandedSeen}
                onToggleSeen={toggleSeen}
                useAccordion={useAccordion}
                animClass="animate-in fade-in slide-in-from-bottom-4 duration-1000"
              />
            </div>
          )}

          {/* Pagination Controls */}
          {!activeLoading && activePagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-16 p-4 bg-white/5 rounded-2xl border border-white/10 w-fit mx-auto">
              <button
                disabled={activePagination.page === 1}
                onClick={() => active.fetch(activePagination.page - 1)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
              >
                Prev
              </button>
              <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-tighter">
                  Page
                </span>
                <span className="text-white font-bold">
                  {activePagination.page} / {activePagination.totalPages}
                </span>
              </div>
              <button
                disabled={activePagination.page === activePagination.totalPages}
                onClick={() => active.fetch(activePagination.page + 1)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobOpeningsTab;
