"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

/**
 * The CTA for a plan the pricing page shows but does not sell yet (mentorship,
 * 2026-09-19 — see `comingSoon` on the plan object from /api/payments/plans).
 *
 * Rather than build a real waitlist table, this reuses the existing
 * /api/contact pipeline: a click posts a contact message tagged with
 * `role: "Mentorship interest"`, which already shows up in the admin contact
 * inbox with nothing new to deploy on that side. `createOrder` refuses this
 * plan server-side regardless of what this component does, so there is no
 * path to actually paying for it even if this button is bypassed.
 */
export default function ComingSoonCta({ plan, primary = false }) {
  const { isAuthenticated, user } = useAuth();
  const storageKey = plan ? `outmail_interest_${plan.code}` : null;

  const [joined, setJoined] = useState(
    () =>
      typeof window !== "undefined" && storageKey && window.localStorage.getItem(storageKey) === "1"
  );
  const [askingForEmail, setAskingForEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!plan) return null;

  const submit = async (emailOverride) => {
    setSubmitting(true);
    setError(null);
    try {
      await api.post(
        "/api/contact",
        {
          name: user?.display_name || "Outmail visitor",
          email: emailOverride || user?.email,
          role: "Mentorship interest",
          message: `Interested in the ${plan.name || plan.code} plan once it opens for purchase.`,
        },
        { quiet: true }
      );
      if (storageKey) window.localStorage.setItem(storageKey, "1");
      setJoined(true);
      setAskingForEmail(false);
    } catch {
      setError("Could not reach us just now — try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClick = () => {
    if (joined || submitting) return;
    if (isAuthenticated && user?.email) {
      submit();
    } else {
      setAskingForEmail(true);
    }
  };

  const buttonClass = `font-syne font-semibold text-sm rounded-btn px-5 py-2.5 transition-colors whitespace-nowrap disabled:opacity-45 disabled:cursor-not-allowed ${
    primary
      ? "bg-primary hover:bg-primary-hover text-white"
      : "border border-white/20 hover:border-accent-light hover:text-accent-light text-white"
  }`;

  if (askingForEmail) {
    return (
      <div className="flex flex-col items-stretch gap-2 w-full max-w-[240px]">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            aria-label="Email for mentorship waitlist"
            className="flex-1 min-w-0 bg-white/[0.04] border border-white/12 rounded-btn px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-primary"
          />
          <button
            type="button"
            disabled={submitting || !email.includes("@")}
            onClick={() => submit(email)}
            className={buttonClass}
          >
            {submitting ? "…" : "Notify me"}
          </button>
        </div>
        {error && <p className="text-red-300 text-xs">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button type="button" onClick={handleClick} disabled={submitting} className={buttonClass}>
        {joined ? "You're on the list" : submitting ? "…" : "Coming soon"}
      </button>
      {error && <p className="text-red-300 text-xs">{error}</p>}
    </div>
  );
}
