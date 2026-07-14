import React, { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";
import JobCard from "./JobCard";
import JobPreferences from "./JobPreferences";
import { toast } from "sonner";
import { api } from "@/lib/api";

const JobOpeningsTab = () => {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // OUT-32: authenticated call to the personalized, scored feed. The backend
  // returns real matchScore + reasons per job — no client-side fabrication.
  const fetchJobs = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/jobs', { params: { page, limit: 10 } });
      if (data.success) {
        setJobOpenings(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobOpenings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
  }, []);

  // Throws on failure so callers can surface a real error instead of updating
  // the UI as if the server recorded the action.
  const recordAction = async (jobId, action) => {
    await api.post(`/api/jobs/${jobId}/interactions`, { action });
  };

  const handleApply = async (jobId) => {
    try {
      await recordAction(jobId, 'applied');
      setJobOpenings(prev => prev.map(j => (j.id === jobId ? { ...j, userAction: 'applied' } : j)));
      toast.success('Marked as applied.');
    } catch (e) {
      console.error('Failed to record action:', e);
      toast.error('Could not update this job. Please try again.');
    }
  };

  // Auto-apply: open the application so the Outmail Autofiller extension fills
  // it, and record the apply. (The extension autofills on the opened page.)
  const handleAutoApply = async (job) => {
    const applyUrl = job.applyLink || job.applyUrl || job.url || job.sourceUrl;
    if (!applyUrl) {
      toast.error('No application link is available for this job.');
      return;
    }
    window.open(applyUrl, '_blank');
    try {
      await recordAction(job.id, 'applied');
      setJobOpenings(prev => prev.map(j => (j.id === job.id ? { ...j, userAction: 'applied' } : j)));
      toast.success('Opened the application — Autofill will fill it in.');
    } catch (e) {
      console.error('Failed to record action:', e);
      toast.error("Opened the application, but couldn't save the status.");
    }
  };

  const handleDiscard = async (jobId) => {
    try {
      await recordAction(jobId, 'discarded');
      setJobOpenings(prev => prev.filter(j => j.id !== jobId));
      toast('Job discarded.');
    } catch (e) {
      console.error('Failed to record action:', e);
      toast.error('Could not discard this job. Please try again.');
    }
  };

  const handleResetStatus = async (jobId) => {
    try {
      await api.patch(`/api/jobs/${jobId}/status`, { status: 'pending' });
      setJobOpenings(prev => prev.map(j => (j.id === jobId ? { ...j, userAction: null } : j)));
      toast('Status reset.');
    } catch (e) {
      console.error('Failed to reset status:', e);
      toast.error('Could not reset status. Please try again.');
    }
  };

  const handleOpenJob = (url) => {
    if (url) window.open(url, '_blank');
  };

  const getStatusColor = (action) => {
    switch (action) {
      case 'applied': return 'text-green-400';
      case 'saved': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  const getStatusText = (action) => {
    switch (action) {
      case 'applied': return 'Applied';
      case 'saved': return 'Saved';
      default: return 'New';
    }
  };

  // Real 0–100 Outmail Score tiers.
  const getPriorityTier = (score) => {
    if (score >= 70) return { label: 'Strong Match', color: 'text-green-400', dot: 'bg-green-400', border: 'border-green-500/30' };
    if (score >= 55) return { label: 'Good Match', color: 'text-yellow-400', dot: 'bg-yellow-400', border: 'border-yellow-500/30' };
    return { label: 'Possible Match', color: 'text-blue-300', dot: 'bg-blue-300', border: 'border-blue-500/20' };
  };

  const getPriorityScoreColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 55) return 'text-yellow-400';
    return 'text-blue-300';
  };

  const visibleJobs = jobOpenings.filter(j => (filter === 'all' ? true : j.userAction === filter));
  const highPriority = visibleJobs.filter(j => j.matchScore >= 70);
  const mediumPriority = visibleJobs.filter(j => j.matchScore >= 55 && j.matchScore < 70);
  const standard = visibleJobs.filter(j => j.matchScore < 55);

  const TierHeader = ({ label, color, dot, count }) => (
    <div className="flex items-center gap-3 mt-8 mb-4">
      <span className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0`}></span>
      <span className={`text-xs font-black uppercase tracking-[0.2em] ${color}`}>{label}</span>
      <span className="text-white/20 text-xs font-medium">({count})</span>
      <div className="flex-1 h-px bg-white/5"></div>
    </div>
  );

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
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Job Openings</h1>
            {!loading && pagination.total > 0 && (
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white/50 border border-white/10 uppercase tracking-widest">
                {pagination.total} Matched
              </span>
            )}
          </div>
          <p className="text-white/40 text-sm max-w-md">
            Ranked for your profile by the Outmail Score — real skill, seniority and intent fit, not a generic list.
          </p>
        </div>

        <div className="flex bg-white/5 backdrop-blur-sm rounded-2xl p-1.5 border border-white/10 w-full sm:w-auto">
          {['all', 'applied'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold transition-all capitalize tracking-widest ${
                filter === filterType
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      <JobPreferences onSaved={() => fetchJobs(1)} />

      {loading ? (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-purple-500/20"></div>
            <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-t-2 border-purple-500 animate-spin"></div>
          </div>
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest animate-pulse">Analyzing Opportunities...</p>
        </div>
      ) : visibleJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
            <Briefcase size={32} className="text-white/20" />
          </div>
          <p className="text-white/50 text-xl font-bold mb-2">No matches yet</p>
          <p className="text-white/20 text-sm uppercase tracking-widest font-bold">Add a resume & job-hunt intent, or check back later</p>
        </div>
      ) : (
        <div className="space-y-4">
          {highPriority.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TierHeader label="Strong Match" color="text-green-400" dot="bg-green-400" count={highPriority.length} />
              <div className="grid gap-4">
                {highPriority.map(job => (
                  <JobCard key={job.id} job={job} {...cardProps} />
                ))}
              </div>
            </div>
          )}
          {mediumPriority.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <TierHeader label="Good Match" color="text-yellow-400" dot="bg-yellow-400" count={mediumPriority.length} />
              <div className="grid gap-4">
                {mediumPriority.map(job => (
                  <JobCard key={job.id} job={job} {...cardProps} />
                ))}
              </div>
            </div>
          )}
          {standard.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <TierHeader label="Possible Match" color="text-blue-400" dot="bg-blue-400" count={standard.length} />
              <div className="grid gap-4">
                {standard.map(job => (
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
            <span className="text-white/40 text-[10px] font-black uppercase tracking-tighter">Page</span>
            <span className="text-white font-bold">{pagination.page} / {pagination.totalPages}</span>
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
    </div>
  );
};

export default JobOpeningsTab;
