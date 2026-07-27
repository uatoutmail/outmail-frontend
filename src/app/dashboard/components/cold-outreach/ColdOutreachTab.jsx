import React, { useState, useEffect, useCallback } from "react";
import { Mail, Zap, AlertTriangle, Building2, MapPin, Briefcase, ChevronRight, ChevronLeft, User, CheckCircle2, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import CustomOutreach from "./CustomOutreach";
import WeeklyPlan from "./WeeklyPlan";

const ColdOutreachTab = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [hasResumes, setHasResumes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paginating, setPaginating] = useState(false);

  // Custom Outreach form states
  const [activeSubTab, setActiveSubTab] = useState("matched");
  const [resumes, setResumes] = useState([]);

  // My Outreach (queued + sent, all lanes) — user-scoped history
  const [outreachHistory, setOutreachHistory] = useState(null);

  // Agent status strip (OUT-150): live view of the thing that actually sends.
  const [agentStatus, setAgentStatus] = useState(null);
  useEffect(() => {
    let timer;
    const fetchAgent = async () => {
      try {
        const res = await api.get('/api/agent/status');
        setAgentStatus(res.data);
      } catch (error) {
        console.warn('Error fetching agent status:', error.message);
      }
    };
    fetchAgent();
    timer = setInterval(fetchAgent, 30000);
    return () => clearInterval(timer);
  }, []);

  const fetchOutreachHistory = useCallback(async () => {
    try {
      const response = await api.get('/api/outreach/status');
      setOutreachHistory(response.data);
    } catch (error) {
      console.warn('Error fetching outreach history:', error.message);
    }
  }, []);

  useEffect(() => {
    if (activeSubTab === 'history') fetchOutreachHistory();
  }, [activeSubTab, fetchOutreachHistory]);

  const fetchCompanies = useCallback(async (pageNum) => {
    try {
      const response = await api.get('/api/outreach/companies', {
        params: { page: pageNum, limit: 10 },
      });
      if (response.data) {
        setCompanies(response.data.companies || []);
        setPagination(response.data.pagination || null);
      }
    } catch (error) {
      console.warn('Error fetching companies:', error.message);
    }
  }, []);

  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resumesResponse = await api.get('/api/resumes').catch(() => ({ data: [] }));
        if (resumesResponse.data && resumesResponse.data.length > 0) {
          setResumes(resumesResponse.data);
          setHasResumes(true);
        }
        await fetchCompanies(1);
      } catch (error) {
        console.warn('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchCompanies]);

  const handlePageChange = async (newPage) => {
    setPage(newPage);
    setPaginating(true);
    await fetchCompanies(newPage);
    setPaginating(false);
  };

  const handleRunTestPipeline = async (company) => {
    const contact = company.contacts?.[0];
    if (!contact?.email) {
      toast.error('No contact email available for this company');
      return;
    }

    if (!hasResumes) {
      toast.error('Please upload a resume in Settings first');
      return;
    }

    if (!user?.hasGmailConnected) {
      toast.error('Please connect your Gmail in the OutMail desktop app first');
      return;
    }

    setSelectedCompany(company);
    setIsTestLoading(true);
    
    try {
      await api.post('/api/outreach/single', {
        companyEmailId: contact.id,
      });

      toast.success(`Outreach queued! Your desktop app will send the email to ${company.name} within a minute while it's online.`);
    } catch (error) {
      console.error('Error running outreach:', error);
      toast.error(error.response?.data?.error || 'An error occurred while triggering the outreach.');
    } finally {
      setIsTestLoading(false);
      setSelectedCompany(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none px-2 sm:px-6 md:px-10 py-6 font-syne">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 mt-10">Cold Outreach Pipeline</h1>
          <p className="text-white text-sm sm:text-base">
            {activeSubTab === "matched" 
              ? "Companies matched to your resume's industry profile. Select one to launch personalized outreach." 
              : "Send custom outreach email to any target email using your resume and a job description."
            }
          </p>
        </div>
        {pagination && activeSubTab === "matched" && (
          <span className="text-sm text-gray-400 mt-2 sm:mt-0">
            {pagination.total} companies found
          </span>
        )}
      </div>

      {/* Agent status strip (OUT-150) */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs">
        <span className={`flex items-center gap-1.5 font-semibold ${agentStatus?.online ? 'text-green-400' : 'text-red-400'}`}>
          <span className={`w-2 h-2 rounded-full ${agentStatus?.online ? 'bg-green-400' : 'bg-red-400'}`}></span>
          Desktop app {agentStatus?.online ? 'online' : 'offline'}
        </span>
        <span className={`flex items-center gap-1.5 ${user?.hasGmailConnected ? 'text-gray-300' : 'text-yellow-400'}`}>
          <Mail size={12} />
          Gmail {user?.hasGmailConnected ? 'connected' : 'not connected'}
        </span>
        {agentStatus?.usage && (
          <span className="text-gray-300">
            Today: <span className="font-semibold text-white">{agentStatus.usage.dailyUsed}/{agentStatus.usage.dailyLimit}</span> sent
          </span>
        )}
        {[0, 6].includes(new Date().getDay()) && (
          <span className="text-blue-300">Weekend — sending resumes Monday</span>
        )}
        {!agentStatus?.online && (
          <span className="text-gray-400">Open the OutMail desktop app to send queued emails (link it from the Overview page).</span>
        )}
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="flex border-b border-white/10 mb-8 gap-6">
        <button
          onClick={() => setActiveSubTab("matched")}
          className={`pb-3 font-semibold text-lg relative transition-colors ${
            activeSubTab === "matched" ? "text-purple-400" : "text-gray-400 hover:text-white"
          }`}
        >
          Matched Companies
          {activeSubTab === "matched" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("custom")}
          className={`pb-3 font-semibold text-lg relative transition-colors ${
            activeSubTab === "custom" ? "text-purple-400" : "text-gray-400 hover:text-white"
          }`}
        >
          Custom Outreach
          {activeSubTab === "custom" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("history")}
          className={`pb-3 font-semibold text-lg relative transition-colors ${
            activeSubTab === "history" ? "text-purple-400" : "text-gray-400 hover:text-white"
          }`}
        >
          My Outreach
          {activeSubTab === "history" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("plan")}
          className={`pb-3 font-semibold text-lg relative transition-colors ${
            activeSubTab === "plan" ? "text-purple-400" : "text-gray-400 hover:text-white"
          }`}
        >
          Weekly Plan
          {activeSubTab === "plan" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-purple-500 rounded-full" />
          )}
        </button>
      </div>

      {activeSubTab === "matched" && (
        <div className="mt-6 mb-10 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/10">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
              <Building2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Targeted Companies
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Select a company to automatically generate and send a tailored outreach email using your resume.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {!hasResumes && (
              <div className="p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertTriangle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-semibold mb-1">Resume Required</h4>
                  <p className="text-sm text-red-400/80">
                    You need to upload at least one resume in the Settings before you can run outreach campaigns. The AI uses your resume to generate personalized emails.
                  </p>
                </div>
              </div>
            )}

            {!user?.hasGmailConnected && (
              <div className="p-4 mb-6 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
                <AlertTriangle size={18} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-yellow-400 font-semibold mb-1">Gmail Connection Required</h4>
                  <p className="text-sm text-yellow-400/80">
                    Connect your Gmail in the Outmail desktop app before sending outreach emails — your app password stays on your own computer.
                  </p>
                  {typeof window !== "undefined" && typeof window.outmail?.openAgentSettings === "function" && (
                    <button
                      onClick={() => window.outmail.openAgentSettings()}
                      className="mt-3 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition"
                    >
                      Open Agent &amp; Gmail Settings
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className={`flex flex-col gap-4 transition-opacity duration-200 ${paginating ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              {companies.length > 0 ? (
                companies.map((company) => {
                  const contact = company.contacts?.[0];
                  const contactName = contact
                    ? [contact.first_name, contact.last_name].filter(Boolean).join(' ')
                    : null;

                  return (
                    <div 
                      key={company.id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 rounded-xl border border-white/10 bg-white/10 hover:bg-white/15 hover:border-white/25 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-4 mb-4 md:mb-0">
                        <div className="w-12 h-12 bg-white/20 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner">
                          <span className="text-lg font-bold text-white/80">{company.name.charAt(0)}</span>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">{company.name}</h3>
                          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-gray-400">
                            {company.industry && (
                              <div className="flex items-center gap-1.5">
                                <Briefcase size={14} className="text-purple-400/70" />
                                <span>{company.industry}</span>
                              </div>
                            )}
                            {company.location && (
                              <>
                                <div className="hidden md:block w-1 h-1 rounded-full bg-gray-600"></div>
                                <div className="flex items-center gap-1.5">
                                  <MapPin size={14} className="text-green-400/70" />
                                  <span>{company.location}</span>
                                </div>
                              </>
                            )}
                            {contactName && (
                              <>
                                <div className="hidden md:block w-1 h-1 rounded-full bg-gray-600"></div>
                                <div className="flex items-center gap-1.5">
                                  <User size={14} className="text-blue-400/70" />
                                  <span>{contactName}{contact?.title ? ` · ${contact.title}` : ''}</span>
                                </div>
                              </>
                            )}
                            {contact?.email && (
                              <>
                                <div className="hidden md:block w-1 h-1 rounded-full bg-gray-600"></div>
                                <div className="flex items-center gap-1.5">
                                  <Mail size={14} className="text-yellow-400/70" />
                                  <span className="truncate max-w-[200px]">{contact.email}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {contact?.contacted ? (
                        <div className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold w-full md:w-auto bg-green-500/10 border border-green-500/20 text-green-400">
                          <CheckCircle2 size={16} />
                          Contacted
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRunTestPipeline(company)}
                          disabled={isTestLoading || !hasResumes || !contact?.email || !user?.hasGmailConnected}
                          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all duration-300 w-full md:w-auto ${
                            isTestLoading && selectedCompany?.id === company.id
                              ? 'bg-purple-600/50 cursor-not-allowed border border-purple-500/30 text-white/70'
                              : !hasResumes || isTestLoading || !contact?.email || !user?.hasGmailConnected
                              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                              : 'bg-white/10 hover:bg-purple-600 border border-white/10 hover:border-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/20'
                          }`}
                        >
                          {isTestLoading && selectedCompany?.id === company.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Zap size={16} className={(!hasResumes || isTestLoading || !contact?.email) ? "text-gray-500" : "text-yellow-400"} />
                              Run Outreach
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-10 text-center border border-dashed border-white/20 rounded-xl bg-white/10">
                  <div className="mx-auto w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3">
                    <Building2 size={24} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-1">No Companies Found</h3>
                  <p className="text-sm text-gray-500">No companies match your resume&apos;s industry profile yet.</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={!pagination.hasPrevPage}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pagination.hasPrevPage
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/25'
                      : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                  }`}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) {
                        acc.push('...');
                      }
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === '...' ? (
                        <span key={`ellipsis-${idx}`} className="text-gray-500 px-1">…</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => handlePageChange(item)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                            page === item
                              ? 'bg-purple-600 text-white border border-purple-500'
                              : 'bg-white/10 hover:bg-white/20 text-gray-300 border border-white/10'
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pagination.hasNextPage
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/25'
                      : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
                  }`}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === "custom" && (
        <CustomOutreach resumes={resumes} hasResumes={hasResumes} user={user} />
      )}

      {activeSubTab === "plan" && <WeeklyPlan />}

      {activeSubTab === "history" && (
        <div className="mt-6 mb-10 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                <Mail size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">My Outreach</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Every email you&apos;ve queued — including custom ones — and what happened to it.
                  Queued emails are sent by your desktop app.
                </p>
              </div>
            </div>
            {outreachHistory?.counts && (
              <div className="hidden sm:flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                  {(outreachHistory.counts.waiting || 0) + (outreachHistory.counts.queued || 0)} queued
                </span>
                <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                  {outreachHistory.counts.sent || 0} sent
                </span>
                {(outreachHistory.counts.failed || 0) + (outreachHistory.counts.expired || 0) > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                    {(outreachHistory.counts.failed || 0) + (outreachHistory.counts.expired || 0)} failed/expired
                  </span>
                )}
              </div>
            )}
          </div>

          {!outreachHistory ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-white"></div>
            </div>
          ) : outreachHistory.emails?.length === 0 ? (
            <div className="p-10 text-center border border-dashed border-white/20 rounded-xl bg-white/10">
              <h3 className="text-lg font-semibold text-gray-300 mb-1">No outreach yet</h3>
              <p className="text-sm text-gray-500">Emails you queue from Matched Companies or Custom Outreach will show up here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {outreachHistory.emails.map((email) => {
                const statusStyles = {
                  waiting: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
                  queued: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
                  sent: 'bg-green-500/10 border-green-500/20 text-green-400',
                  failed: 'bg-red-500/10 border-red-500/20 text-red-400',
                  expired: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
                };
                const statusLabel = {
                  waiting: 'Queued',
                  queued: 'Sending',
                  sent: 'Sent',
                  failed: 'Failed',
                  expired: 'Expired',
                }[email.status] || email.status;
                const laneLabel = { planned: 'Auto', single: 'Company', custom: 'Custom' }[email.lane] || email.lane;
                const when = email.sent_at || email.created_at;
                return (
                  <div key={email.id} className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white truncate">{email.recipient_name || email.recipient_email}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 border border-white/10 text-gray-300 flex-shrink-0">{laneLabel}</span>
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{email.subject || '(no subject)'}</p>
                      {email.error_message && email.status !== 'sent' && (
                        <p className="text-[11px] text-red-400/80 truncate mt-0.5">{email.error_message}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Clock size={12} />
                        {when ? new Date(when).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-xs border ${statusStyles[email.status] || statusStyles.expired}`}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ColdOutreachTab;
