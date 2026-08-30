"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/component/DashboardLayout";
import {
  LayoutDashboard,
  Mail,
  Users,
  Briefcase,
  SlidersHorizontal,
  ClipboardList, CreditCard } from "lucide-react";

// Import Components
import DashboardOverview from "./components/overview/DashboardOverview";
import ColdOutreachTab from "./components/cold-outreach/ColdOutreachTab";
import MentorshipTab from "./components/mentorship/MentorshipTab";
import JobOpeningsTab from "./components/jobs/JobOpeningsTab";
import SettingsTab from "./components/settings/SettingsTab";
import AutofillDataTab from "./components/autofill/AutofillDataTab";
import LockedFeatureOverlay from "./components/LockedFeatureOverlay";
import BillingTab from "./components/billing/BillingTab";
import { hasFeature, lockReason, UPGRADE_TARGET, daysUntilExpiry } from "@/lib/planAccess";
import { pendingActivation, acknowledge } from "@/lib/planActivation";

const studentNavItems = [
  { label: "Dashboard", action: "dashboard", icon: LayoutDashboard },
  { label: "Cold Outreach", action: "coldOutreach", icon: Mail },
  { label: "Mentorship", action: "mentorship", icon: Users },
  { label: "Job Openings", action: "jobOpenings", icon: Briefcase },
  { label: "Autofill Data", action: "autofillData", icon: ClipboardList },
  { label: "Billing", action: "billing", icon: CreditCard },
  { label: "Settings", action: "settings", icon: SlidersHorizontal },
];

export default function Page() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");
  // A plan that became active without the user ever seeing a confirmation —
  // the webhook-only path (OUT-228).
  const [justActivated, setJustActivated] = useState(null);

  useEffect(() => {
    if (user) setJustActivated(pendingActivation(user));
  }, [user]);

  // Check if user has stored token
  const hasStoredToken = () => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated && !hasStoredToken()) {
      window.location.href = '/';
    }
  }, [isAuthenticated, loading]);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-l from-black via-[#6c00ff] to-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout
      theme="dark"
      user={user}
      portalName="Student Portal"
      navItems={studentNavItems}
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      logout={logout}
      title=""
      subtitle=""
    >
      {/* A user can pay, close the tab before /verify fires, and be activated by
          the webhook seconds later — having seen no confirmation at all. They
          would return to a dashboard that looks unchanged and reasonably pay
          again. This catches that case on the next load (OUT-228). */}
      {/* Expiry warning rides every dashboard section, not just Billing. With a
          one-time annual payment nothing charges the card again, so a lapse that
          is only visible on a page nobody visits is a lapse nobody notices — and
          silent expiry reads as "the product broke", not "my plan ended". */}
      <ExpiryNotice user={user} onGoToBilling={() => setActiveSection("billing")} />

      {justActivated && (
        <div className="mb-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-4 flex items-start justify-between gap-4" role="status">
          <div>
            <p className="font-semibold text-emerald-200">
              Your {justActivated.name} plan is active.
            </p>
            <p className="text-sm text-emerald-200/80 mt-1">
              Your placement year has started — everything is unlocked. You have not been charged twice.
            </p>
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => { acknowledge(user); setJustActivated(null); }}
            className="text-emerald-200/60 hover:text-emerald-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Conditional rendering based on activeSection */}
      {activeSection === "dashboard" && <DashboardOverview />}
      {activeSection === "coldOutreach" && <ColdOutreachTab />}
      {/* Gating comes from lib/planAccess so the ladder is defined once and
          matches the server. It previously keyed off PLAN_C, which is retired,
          and PLAN_B for jobs — neither matches what we sell (OUT-225). */}
      {activeSection === "mentorship" && (
        hasFeature(user, 'mentorship')
          ? <MentorshipTab />
          : <LockedFeatureOverlay
              feature="Expert Mentorship"
              reason={lockReason(user, 'mentorship')}
              targetPlan={UPGRADE_TARGET.mentorship}
            />
      )}
      {activeSection === "jobOpenings" && (
        hasFeature(user, 'jobOpenings')
          ? <JobOpeningsTab />
          : <LockedFeatureOverlay
              feature="Curated Job Openings"
              reason={lockReason(user, 'jobOpenings')}
              targetPlan={UPGRADE_TARGET.jobOpenings}
            />
      )}
      {activeSection === "autofillData" && <AutofillDataTab />}
      {activeSection === "billing" && <BillingTab />}
      {activeSection === "settings" && <SettingsTab />}
    </DashboardLayout>
  );
}

/**
 * Warns before the placement year ends, and states plainly what has stopped
 * once it has. Quiet until the last 30 days — a countdown running all year is
 * noise, and noise is ignored exactly when it starts to matter.
 */
function ExpiryNotice({ user, onGoToBilling }) {
  const days = daysUntilExpiry(user);
  if (days == null || days > 30) return null;

  const expired = days < 0;
  return (
    <div
      className={`mb-6 rounded-2xl border px-6 py-4 flex items-start justify-between gap-4 ${
        expired ? "border-red-500/40 bg-red-500/10" : "border-amber-500/40 bg-amber-500/10"
      }`}
      role="status"
    >
      <div>
        <p className={`font-semibold ${expired ? "text-red-200" : "text-amber-200"}`}>
          {expired
            ? "Your placement year has ended"
            : `Your placement year ends in ${days} day${days === 1 ? "" : "s"}`}
        </p>
        <p className={`text-sm mt-1 ${expired ? "text-red-200/80" : "text-amber-200/80"}`}>
          {expired
            ? "Sending is paused and job openings are hidden. Nothing has been deleted — renew and everything comes back."
            : "Renewing early adds to the days you have left rather than replacing them."}
        </p>
      </div>
      <button
        type="button"
        onClick={onGoToBilling}
        className="shrink-0 bg-white text-black font-bold py-2 px-5 rounded-full text-sm hover:bg-gray-100"
      >
        {expired ? "Renew" : "View billing"}
      </button>
    </div>
  );
}
