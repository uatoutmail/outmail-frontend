import { Briefcase, UploadCloud, Loader2, FileText } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import JobCard from "./JobCard";
import JobPreferences from "./JobPreferences";
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";

// India-student launch: /api/jobs 403s with this shape when a résumé and/or
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
      toast.success("Résumé uploaded.");
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
        We show every student a feed matched to their actual profile — that needs a résumé and to
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
            {uploading ? "Uploading…" : "Upload your résumé"}
          </button>
          <p className="text-white/25 text-[11px] mt-2">PDF, DOC, DOCX, JPG or PNG — up to 5MB.</p>
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

const JobOpeningsTab = () => {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
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
      toast.success("Marked as applied.");
    } catch (e) {
      logger.error("Failed to record action:", e);
      toast.error("Could not update this job. Please try again.");
    }
  };

  // Auto-apply: open the application so the Outmail Autofiller extension fills
  // it, and record the apply. (The extension autofills on the opened page.)
  const handleAutoApply = async (job) => {
    const applyUrl = job.applyLink || job.applyUrl || job.url || job.sourceUrl;
    if (!applyUrl) {
      toast.error("No application link is available for this job.");
      return;
    }
    window.open(applyUrl, "_blank");
    try {
      await recordAction(job.id, "applied");
      setJobOpenings((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, userAction: "applied" } : j))
      );
      toast.success("Opened the application — Autofill will fill it in.");
    } catch (e) {
      logger.error("Failed to record action:", e);
      toast.error("Opened the application, but couldn't save the status.");
    }
  };

  const handleDiscard = async (jobId) => {
    try {
      await recordAction(jobId, "discarded");
      setJobOpenings((prev) => prev.filter((j) => j.id !== jobId));
      toast("Job discarded.");
    } catch (e) {
      logger.error("Failed to record action:", e);
      toast.error("Could not discard this job. Please try again.");
    }
  };

  const handleResetStatus = async (jobId) => {
    try {
      await api.patch(`/api/jobs/${jobId}/status`, { status: "pending" });
      setJobOpenings((prev) => prev.map((j) => (j.id === jobId ? { ...j, userAction: null } : j)));
      toast("Status reset.");
    } catch (e) {
      logger.error("Failed to reset status:", e);
      toast.error("Could not reset status. Please try again.");
    }
  };

  const handleOpenJob = (url) => {
    if (url) window.open(url, "_blank");
  };

  const getStatusColor = (action) => {
    switch (action) {
      case "applied":
        return "text-green-400";
      case "saved":
        return "text-yellow-400";
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

  const visibleJobs = jobOpenings.filter((j) =>
    filter === "all" ? true : j.userAction === filter
  );
  const highPriority = visibleJobs.filter((j) => j.matchScore >= 70);
  const mediumPriority = visibleJobs.filter((j) => j.matchScore >= 55 && j.matchScore < 70);
  const standard = visibleJobs.filter((j) => j.matchScore < 55);

  const cardProps = {
    getPriorityTier,
    getPriorityScoreColor,
    getStatusColor,
    getStatusText,
    handleOpenJob,
    handleDiscard,
    handleResetStatus,
    handleApply,
    handleAutoApply,
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto font-syne pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10 pt-8 sm:pt-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Job Openings
            </h1>
            {!loading && pagination.total > 0 && (
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white/50 border border-white/10 uppercase tracking-widest">
                {pagination.total} Matched
              </span>
            )}
          </div>
          <p className="text-white/40 text-sm max-w-md">
            Ranked for your profile by the Outmail Score — real skill, seniority and intent fit, not
            a generic list.
          </p>
        </div>

        <div className="flex bg-white/5 backdrop-blur-sm rounded-2xl p-1.5 border border-white/10 w-full sm:w-auto">
          {["all", "applied"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
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

      {prerequisiteBlock ? (
        <JobPrerequisiteGate
          missing={prerequisiteBlock.missing}
          onResumeUploaded={() => fetchJobs(1)}
          onPreferencesSaved={() => fetchJobs(1)}
        />
      ) : (
        <>
          <JobPreferences onSaved={() => fetchJobs(1)} />

          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-purple-500/20"></div>
                <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-t-2 border-purple-500 animate-spin"></div>
              </div>
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest animate-pulse">
                Analyzing Opportunities...
              </p>
            </div>
          ) : visibleJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                <Briefcase size={32} className="text-white/20" />
              </div>
              <p className="text-white/50 text-xl font-bold mb-2">No matches yet</p>
              <p className="text-white/20 text-sm uppercase tracking-widest font-bold">
                Add a resume & job-hunt intent, or check back later
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {highPriority.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <TierHeader
                    label="Strong Match"
                    color="text-green-400"
                    dot="bg-green-400"
                    count={highPriority.length}
                  />
                  <div className="grid gap-4">
                    {highPriority.map((job) => (
                      <JobCard key={job.id} job={job} {...cardProps} />
                    ))}
                  </div>
                </div>
              )}
              {mediumPriority.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <TierHeader
                    label="Good Match"
                    color="text-yellow-400"
                    dot="bg-yellow-400"
                    count={mediumPriority.length}
                  />
                  <div className="grid gap-4">
                    {mediumPriority.map((job) => (
                      <JobCard key={job.id} job={job} {...cardProps} />
                    ))}
                  </div>
                </div>
              )}
              {standard.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <TierHeader
                    label="Possible Match"
                    color="text-blue-400"
                    dot="bg-blue-400"
                    count={standard.length}
                  />
                  <div className="grid gap-4">
                    {standard.map((job) => (
                      <JobCard key={job.id} job={job} {...cardProps} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-16 p-4 bg-white/5 rounded-2xl border border-white/10 w-fit mx-auto">
              <button
                disabled={pagination.page === 1}
                onClick={() => fetchJobs(pagination.page - 1)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
              >
                Prev
              </button>
              <div className="flex flex-col items-center min-w-[80px]">
                <span className="text-white/40 text-[10px] font-black uppercase tracking-tighter">
                  Page
                </span>
                <span className="text-white font-bold">
                  {pagination.page} / {pagination.totalPages}
                </span>
              </div>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => fetchJobs(pagination.page + 1)}
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
