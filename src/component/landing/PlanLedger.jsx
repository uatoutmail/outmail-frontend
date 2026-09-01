"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Minus, Users, Flame } from "lucide-react";
import { formatPaise } from "@/lib/paymentOutcome";
import { Reveal, EASE_OUT } from "@/component/motion/kit";

/**
 * The plan ledger — the agreed pricing layout, shared by the landing section
 * and the pricing page so the two can never disagree about what a plan
 * includes. Purely presentational: it is handed plans and a CTA renderer, and
 * knows nothing about checkout.
 *
 * A ledger rather than cards because the plans differ by exactly one thing.
 * The mentorship-only rows are tinted so that difference reads as a block.
 *
 * Feature copy lives here because it is presentation. Every NUMBER comes from
 * the plan objects, which come from /api/payments/plans — this site once
 * advertised "$0 free forever" for a plan the backend charged ₹499 for
 * (OUT-232), and hardcoded copy carrying numbers is how that happens.
 */
export const MATRIX = [
  { label: "Cold outreach to verified recruiters", a: true, b: true },
  { label: "Resume-matched job feed with an explainable score", a: true, b: true },
  { label: "One-click application autofill", a: true, b: true },
  { label: "Send scheduling, hiring-signal targeting, analytics", a: true, b: true },
  { label: "Bi-weekly mentorship sessions", a: false, b: true },
  { label: "Mentor Q&A and session recordings", a: false, b: true },
  { label: "Priority support", a: false, b: true },
];

/**
 * The launch offer.
 *
 * States what the offer is, who it is for, and what happens when it ends — in
 * that order, and with no countdown timer. A cohort cap is a promise we can
 * keep; a clock is one we would have to keep resetting, and a reset clock is
 * the most recognisable dark pattern there is.
 *
 * The places-remaining bar renders ONLY when the API supplies a real number.
 * Inventing one would be a false scarcity claim — actionable under the CCPA
 * 2023 dark-pattern guidelines, and disproved by refreshing the page.
 */
export function LaunchBanner({ plan }) {
  // The observer lives on the banner, not on the bar. The bar starts at width
  // 0 inside an overflow-hidden track — a zero-area target clipped by an
  // ancestor is exactly the shape IntersectionObserver is least reliable
  // about, and the same trap that blanked every masked heading.
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  if (!plan || !(plan.list_amount > plan.amount)) return null;
  if (plan.launchPlacesLeft === 0) return null;   // cohort full: the offer is over

  const price = formatPaise(plan.amount, plan.currency);
  const listPrice = formatPaise(plan.list_amount, plan.currency);
  const left = plan.launchPlacesLeft;
  const total = plan.launchPlacesTotal;
  const known = typeof left === "number" && typeof total === "number" && total > 0;
  const pct = known ? Math.max(2, Math.round(((total - left) / total) * 100)) : 0;

  return (
    <Reveal delay={0.06}>
      <div ref={ref} className="rounded-2xl border border-primary/35 bg-gradient-to-r from-primary/15 via-primary/[0.07] to-transparent px-6 py-5 mb-4 text-left">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 justify-between">
          <div className="flex items-center gap-3">
            <span aria-hidden className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
              <Flame size={16} className="text-primary" />
            </span>
            <div>
              <p className="font-syne font-bold text-[15px] leading-tight">
                Launch price — {price} instead of{" "}
                <span className="text-white/35 line-through font-normal">{listPrice}</span>
              </p>
              <p className="text-xs text-white/45 mt-0.5">
                {known ? `For the first ${total.toLocaleString("en-IN")} students in India. ` : ""}
                After that it is {listPrice}.
              </p>
            </div>
          </div>
          {known && (
            <div className="w-full sm:w-56">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-white/45">Launch places</span>
                <span className="font-mono text-primary">
                  {left.toLocaleString("en-IN")} of {total.toLocaleString("en-IN")} left
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={inView ? { width: `${pct}%` } : undefined}
                  transition={{ duration: 0.9, ease: EASE_OUT }}
                  className="h-full bg-gradient-to-r from-primary to-accent-light" />
              </div>
            </div>
          )}
        </div>
        <p className="text-[11px] text-white/30 mt-3">
          Buy at the launch price and you keep the full year at that price — we never ask for the difference later.
        </p>
      </div>
    </Reveal>
  );
}

function PriceCell({ plan, accent }) {
  if (!plan) return <span className="inline-block w-20 h-7 rounded bg-white/10 animate-pulse align-middle" aria-hidden />;
  return (
    <>
      <p className="font-syne text-2xl sm:text-3xl font-bold leading-none">
        {formatPaise(plan.amount, plan.currency)}
      </p>
      {plan.list_amount > plan.amount && (
        <p className="text-[11px] text-white/25 line-through mt-1">
          {formatPaise(plan.list_amount, plan.currency)}
        </p>
      )}
      {plan.seatsRemaining != null && (
        <p className={`text-[11px] mt-1 font-mono inline-flex items-center gap-1 ${accent}`}>
          <Users size={10} />
          {plan.seatsRemaining > 0 ? `${plan.seatsRemaining}/${plan.max_seats} seats` : "fully subscribed"}
        </p>
      )}
    </>
  );
}

export default function PlanLedger({ a, b, renderCtaA, renderCtaB, footNote }) {
  return (
    <Reveal delay={0.1}>
      <div className="rounded-2xl border border-white/10 overflow-hidden text-left">
        <div className="grid grid-cols-12 gap-3 px-5 sm:px-6 py-6 border-b border-white/10 bg-white/[0.02] items-end">
          <div className="col-span-6" />
          <div className="col-span-3 text-center">
            <p className="text-[10px] uppercase tracking-[2px] text-primary mb-1.5">Outreach &amp; Jobs</p>
            <PriceCell plan={a} accent="text-primary" />
          </div>
          <div className="col-span-3 text-center">
            <p className="text-[10px] uppercase tracking-[2px] text-accent-light mb-1.5">+ Mentorship</p>
            <PriceCell plan={b} accent="text-accent-light" />
          </div>
        </div>

        {MATRIX.map((r, i) => (
          <Reveal key={r.label} delay={i * 0.03}>
            <div className={`grid grid-cols-12 gap-3 px-5 sm:px-6 py-4 items-center border-b border-white/[0.06] ${!r.a ? "bg-accent-light/[0.05]" : ""}`}>
              <span className="col-span-6 text-[13px] sm:text-sm text-white/60 leading-snug">{r.label}</span>
              <span className="col-span-3 flex justify-center">
                {r.a ? <Check size={16} className="text-primary" aria-label="included" />
                     : <Minus size={16} className="text-white/15" aria-label="not included" />}
              </span>
              <span className="col-span-3 flex justify-center">
                {r.b ? <Check size={16} className="text-accent-light" aria-label="included" />
                     : <Minus size={16} className="text-white/15" aria-label="not included" />}
              </span>
            </div>
          </Reveal>
        ))}

        <div className="grid grid-cols-12 gap-3 px-5 sm:px-6 py-6 items-center bg-white/[0.02]">
          <span className="col-span-12 sm:col-span-6 text-[11px] text-white/30 leading-relaxed mb-3 sm:mb-0">
            {footNote ?? "One payment. Twelve months. Nothing renews. All taxes included. Full refund within 7 days."}
          </span>
          <div className="col-span-6 sm:col-span-3 flex justify-center">{renderCtaA?.(a)}</div>
          <div className="col-span-6 sm:col-span-3 flex justify-center">{renderCtaB?.(b)}</div>
        </div>
      </div>
    </Reveal>
  );
}
