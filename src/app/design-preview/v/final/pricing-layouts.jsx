"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check, Minus, Users, Flame } from "lucide-react";
import { Reveal, MaskLines, Cta, EASE_OUT } from "../kit";

/**
 * PRICING — the ledger. LOCKED.
 *
 * No cards. One table, and the difference between the plans reads as a block
 * of three rows rather than as two competing sales pitches. Chosen because the
 * plans differ by exactly one thing — mentorship — and dressing that up costs
 * more trust than it buys.
 *
 * ⚠ PREVIEW ONLY. Every number below is hardcoded so the layout can be judged
 * offline. Before this ships it MUST read /api/payments/plans, exactly as
 * src/component/pricing.jsx does: a page carrying its own copy of the prices is
 * how we once advertised "$0 free forever" for a plan the backend charged for
 * (OUT-232).
 *
 * TWO THINGS THE BACKEND STILL OWES THIS SECTION
 *  1. `launchPlacesLeft` — a real count of paid PLAN_A orders subtracted from
 *     1,000. It must not be a decorative number that ticks down on a timer.
 *     Under the CCPA 2023 dark-pattern guidelines a false scarcity claim is
 *     actionable, and this one is easy to disprove.
 *  2. ₹1,499 must be the genuine price once the launch cohort is full. A
 *     struck-through price that never applies is misleading reference pricing
 *     under the same guidelines. The Refund policy already commits to
 *     honouring the launch price for anyone who bought at it.
 */
const PLANS = {
  a: { code: "PLAN_A", price: 999, list: 1499 },
  b: { code: "PLAN_B", price: 4999, seats: 25, seatsLeft: 25 },
};

const LAUNCH_TOTAL = 1000;

/* The only difference between the plans is the last three rows. Saying that
   plainly is a stronger argument than any card layout makes. */
const MATRIX = [
  { label: "Cold outreach to verified recruiters", a: true, b: true },
  { label: "Resume-matched job feed with an explainable score", a: true, b: true },
  { label: "One-click application autofill", a: true, b: true },
  { label: "Send scheduling, hiring-signal targeting, analytics", a: true, b: true },
  { label: "Bi-weekly mentorship sessions", a: false, b: true },
  { label: "Mentor Q&A and session recordings", a: false, b: true },
  { label: "Priority support", a: false, b: true },
];

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

/**
 * The launch offer. States what the offer is, who it is for, and what happens
 * when it ends — in that order, with no timer. A cohort cap is a claim we can
 * actually keep; a countdown clock is one we would have to keep resetting.
 */
function LaunchBanner({ placesLeft = LAUNCH_TOTAL }) {
  const taken = LAUNCH_TOTAL - placesLeft;
  const pct = Math.max(2, Math.round((taken / LAUNCH_TOTAL) * 100));
  return (
    <Reveal delay={0.06}>
      <div className="rounded-2xl border border-primary/35 bg-gradient-to-r from-primary/15 via-primary/[0.07] to-transparent px-6 py-5 mb-4">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 justify-between">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
              <Flame size={16} className="text-primary" />
            </span>
            <div>
              <p className="font-syne font-bold text-[15px] leading-tight">
                Launch price — {inr(PLANS.a.price)} instead of{" "}
                <span className="text-white/35 line-through font-normal">{inr(PLANS.a.list)}</span>
              </p>
              <p className="text-xs text-white/45 mt-0.5">
                For the first {LAUNCH_TOTAL.toLocaleString("en-IN")} students in India. After that it is {inr(PLANS.a.list)}.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-56">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-white/45">Launch places</span>
              <span className="font-mono text-primary">
                {placesLeft.toLocaleString("en-IN")} of {LAUNCH_TOTAL.toLocaleString("en-IN")} left
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE_OUT }}
                className="h-full bg-gradient-to-r from-primary to-accent-light" />
            </div>
          </div>
        </div>
        <p className="text-[11px] text-white/30 mt-3">
          Buy at the launch price and you keep the full year at that price — we never ask for the difference later.
        </p>
      </div>
    </Reveal>
  );
}

export function PricingLedger({ placesLeft = LAUNCH_TOTAL }) {
  return (
    <section className="max-w-4xl mx-auto px-6 py-28">
      <Reveal>
        <p className="text-[10px] uppercase tracking-[4px] text-primary mb-4">Pricing</p>
        <MaskLines lines={["What each plan", "actually includes."]}
          className="font-syne text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]" />
        <p className="text-white/45 mt-4 max-w-lg">
          The only difference is mentorship. Rather than dress that up, here it is as a list.
          One payment either way — nothing renews.
        </p>
      </Reveal>

      <div className="mt-12">
        <LaunchBanner placesLeft={placesLeft} />

        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-white/10 overflow-hidden">
            {/* header row */}
            <div className="grid grid-cols-12 gap-3 px-5 sm:px-6 py-6 border-b border-white/10 bg-white/[0.02] items-end">
              <div className="col-span-6" />
              <div className="col-span-3 text-center">
                <p className="text-[10px] uppercase tracking-[2px] text-primary mb-1.5">Outreach &amp; Jobs</p>
                <p className="font-syne text-2xl sm:text-3xl font-bold leading-none">{inr(PLANS.a.price)}</p>
                <p className="text-[11px] text-white/25 line-through mt-1">{inr(PLANS.a.list)}</p>
              </div>
              <div className="col-span-3 text-center">
                <p className="text-[10px] uppercase tracking-[2px] text-accent-light mb-1.5">+ Mentorship</p>
                <p className="font-syne text-2xl sm:text-3xl font-bold leading-none">{inr(PLANS.b.price)}</p>
                <p className="text-[11px] text-accent-light mt-1 font-mono inline-flex items-center gap-1">
                  <Users size={10} />{PLANS.b.seatsLeft}/{PLANS.b.seats} seats
                </p>
              </div>
            </div>

            {MATRIX.map((r, i) => (
              <Reveal key={r.label} delay={i * 0.03}>
                <div className={`grid grid-cols-12 gap-3 px-5 sm:px-6 py-4 items-center border-b border-white/[0.06] ${!r.a ? "bg-accent-light/[0.05]" : ""}`}>
                  <span className="col-span-6 text-[13px] sm:text-sm text-white/60 leading-snug">{r.label}</span>
                  <span className="col-span-3 flex justify-center">
                    {r.a ? <Check size={16} className="text-primary" /> : <Minus size={16} className="text-white/15" />}
                  </span>
                  <span className="col-span-3 flex justify-center">
                    {r.b ? <Check size={16} className="text-accent-light" /> : <Minus size={16} className="text-white/15" />}
                  </span>
                </div>
              </Reveal>
            ))}

            <div className="grid grid-cols-12 gap-3 px-5 sm:px-6 py-6 items-center bg-white/[0.02]">
              <span className="col-span-12 sm:col-span-6 text-[11px] text-white/30 leading-relaxed mb-3 sm:mb-0">
                One payment. Twelve months. Nothing renews. All taxes included.
                Full refund within 7 days.
              </span>
              <div className="col-span-6 sm:col-span-3 flex justify-center"><Cta label="Get it" /></div>
              <div className="col-span-6 sm:col-span-3 flex justify-center">
                <a href="/pricing"
                  className="font-syne font-semibold text-sm border border-white/20 hover:border-accent-light hover:text-accent-light rounded-btn px-5 py-2.5 transition-colors whitespace-nowrap">
                  Take a seat
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default PricingLedger;
