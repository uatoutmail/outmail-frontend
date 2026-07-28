"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CalendarDays, CheckCircle2, ShieldCheck, Sparkles, Briefcase } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

// Weekly plan review & approval (OUT-147). Every Sunday the backend prepares
// next week's outreach; depending on the approval mode the student confirms
// the whole week, each day, or nothing (auto).
const MODES = [
  { value: "weekly", label: "Weekly approval", hint: "One click on Sunday arms the whole week (default)" },
  { value: "daily", label: "Daily approval", hint: "Each morning's batch waits for your tap" },
  { value: "auto", label: "Automatic", hint: "The plan sends without asking" },
];

// Mailbox-validation state per recipient (OUT-176). 'unknown' means the
// validator hasn't run for this address — we say so plainly rather than
// implying the mailbox was checked.
const VALIDATION_UI = {
  valid: { label: "Verified", className: "bg-green-500/10 border-green-500/20 text-green-300" },
  risky: { label: "Risky", className: "bg-amber-500/10 border-amber-500/20 text-amber-300" },
  invalid: { label: "Invalid", className: "bg-red-500/10 border-red-500/20 text-red-300" },
  unknown: { label: "Validation pending", className: "bg-white/5 border-white/10 text-gray-400" },
};

const ValidationBadge = ({ status }) => {
  const ui = VALIDATION_UI[status] || VALIDATION_UI.unknown;
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] border ${ui.className}`}>
      {ui.label}
    </span>
  );
};

const WeeklyPlan = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  const fetchPlan = useCallback(async () => {
    try {
      const response = await api.get("/api/outreach/week-plan");
      setData(response.data);
    } catch (error) {
      console.warn("Error fetching week plan:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const setMode = async (mode) => {
    try {
      await api.post("/api/outreach/approval-mode", { mode });
      toast.success(`Approval mode set to ${mode}`);
      setData((prev) => ({ ...prev, mode }));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update mode");
    }
  };

  const approve = async (scope, date) => {
    setApproving(true);
    try {
      const response = await api.post("/api/outreach/week-plan/approve", { scope, date });
      toast.success(response.data.message || "Approved");
      await fetchPlan();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to approve");
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/20 border-t-white"></div>
      </div>
    );
  }

  const plan = data?.plan;
  const mode = data?.mode || "weekly";
  const weekApproved = plan && (plan.status === "approved" || plan.status === "auto");

  return (
    <div className="mt-6 mb-10 space-y-6">
      {/* Approval mode */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck size={20} className="text-purple-400" />
          <h2 className="text-lg font-bold text-white">Approval mode</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`text-left p-4 rounded-xl border transition-all ${
                mode === m.value
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <p className={`text-sm font-semibold ${mode === m.value ? "text-purple-300" : "text-white"}`}>{m.label}</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{m.hint}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Plan */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
              <CalendarDays size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Your week plan</h2>
              <p className="text-sm text-gray-400 mt-1">
                {plan
                  ? `Week of ${new Date(plan.weekOf).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · ${plan.totalEmails} planned emails`
                  : "Prepared every Sunday from that week's market intelligence and your resume."}
              </p>
            </div>
          </div>
          {plan && (
            weekApproved ? (
              <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold">
                <CheckCircle2 size={16} /> {plan.status === "auto" ? "Auto mode — sends automatically" : "Week approved"}
              </span>
            ) : mode !== "daily" ? (
              <button
                onClick={() => approve("week")}
                disabled={approving}
                className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors disabled:bg-purple-800"
              >
                {approving ? "Approving…" : "Approve week"}
              </button>
            ) : null
          )}
        </div>

        {!plan ? (
          <div className="p-10 text-center border border-dashed border-white/20 rounded-xl bg-white/10">
            <h3 className="text-lg font-semibold text-gray-300 mb-1">No plan yet</h3>
            <p className="text-sm text-gray-500">
              Your first weekly plan is generated on Sunday night once auto-mailing is enabled and your desktop agent is connected.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {Object.entries(plan.days).map(([day, rows]) => {
              const dayApproved = weekApproved || plan.approvedDays?.[day] === true;
              return (
                <div key={day} className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
                    <p className="text-sm font-semibold text-white">
                      {new Date(`${day}T12:00:00Z`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
                      <span className="text-gray-400 font-normal"> · {rows.length} emails</span>
                    </p>
                    {mode === "daily" && !dayApproved && (
                      <button
                        onClick={() => approve("day", day)}
                        disabled={approving}
                        className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
                      >
                        Approve day
                      </button>
                    )}
                    {dayApproved && (
                      <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle2 size={13} /> Approved</span>
                    )}
                  </div>
                  <div className="divide-y divide-white/5">
                    {rows.map((row) => (
                      <div key={row.id} className="px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white truncate">
                              {row.recipient_name || row.recipient_email}
                            </span>
                            {row.job_role && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-300 flex-shrink-0">
                                <Briefcase size={10} /> {row.job_role}
                              </span>
                            )}
                          </div>
                          {row.reason && (
                            <p className="text-xs text-gray-400 mt-0.5 flex items-start gap-1">
                              <Sparkles size={12} className="text-purple-400/70 mt-0.5 flex-shrink-0" />
                              <span className="truncate">{row.reason}</span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {typeof row.confidence_score === "number" && (
                            <span className="text-[11px] text-gray-500">
                              {Math.round(row.confidence_score * 100)}% match
                            </span>
                          )}
                          <ValidationBadge status={row.validation_status} />
                          <span className="text-[11px] text-gray-500 capitalize">{row.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyPlan;
