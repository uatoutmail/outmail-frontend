"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Minus, Users, ArrowRight, Sparkles } from "lucide-react";
import { Reveal, MaskLines, Count, Cta, EASE_OUT } from "../kit";

/**
 * PRICING — five layouts, both tiers.
 *
 * ⚠ PREVIEW ONLY. Every number below is hardcoded so the layouts can be judged
 * offline. The production section MUST read /api/payments/plans, exactly as
 * src/component/pricing.jsx does: a page that carried its own copy of the
 * prices is how we once advertised "$0 free forever" for a plan the backend
 * charged for (OUT-232). Whichever layout is chosen gets rewired to the API
 * before it ships.
 *
 * A CORRECTION THIS SECTION FORCES: the landing page currently lists
 * mentorship among the things ₹999 buys. It does not — mentorship is PLAN_B at
 * ₹4,999. Every layout here states that split explicitly.
 */
const PLANS = {
  a: {
    code: "PLAN_A", name: "Outreach & Jobs", price: 999, list: 1499,
    tagline: "Everything you need to get interviews.",
    features: [
      "AI-personalised cold emails from your own Gmail",
      "Verified recruiter and company discovery",
      "Resume-matched job feed with an explainable score",
      "One-click Autofill browser extension",
      "Hiring-signal targeting and send scheduling",
      "Outreach analytics",
    ],
  },
  b: {
    code: "PLAN_B", name: "Outreach, Jobs & Mentorship", price: 4999, list: null, seats: 25, seatsLeft: 25,
    tagline: "Everything above, plus real mentors.",
    features: [
      "Everything in Outreach & Jobs",
      "Bi-weekly mentorship with people who have done it",
      "Mentor Q&A and session recordings",
      "Personalised career guidance",
      "Priority support",
    ],
  },
};

/* Rows for the ledger + toggle views. `a` false / `b` true is the whole
   difference between the plans, and saying so plainly is the strongest
   argument either way. */
const MATRIX = [
  { label: "Cold outreach to verified recruiters", a: true, b: true },
  { label: "Resume-matched job feed", a: true, b: true },
  { label: "One-click application autofill", a: true, b: true },
  { label: "Send scheduling and analytics", a: true, b: true },
  { label: "Bi-weekly mentorship sessions", a: false, b: true },
  { label: "Mentor Q&A and recordings", a: false, b: true },
  { label: "Priority support", a: false, b: true },
];

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;
const TERMS = "One payment. Twelve months. Nothing renews. Full refund within 7 days.";

function Head({ lines, sub, center = true }) {
  return (
    <Reveal className={center ? "text-center" : ""}>
      <p className="text-[10px] uppercase tracking-[4px] text-primary mb-4">Pricing</p>
      <MaskLines lines={lines} className="font-syne text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]" />
      {sub && <p className={`text-white/45 mt-4 ${center ? "max-w-lg mx-auto" : "max-w-lg"}`}>{sub}</p>}
    </Reveal>
  );
}

/** Seats are the only genuinely scarce thing we sell — 25 mentorship places.
    Shown as a real count, never a fake countdown. */
function Seats({ left = PLANS.b.seatsLeft, total = PLANS.b.seats, className = "" }) {
  const pct = Math.round((left / total) * 100);
  return (
    <div className={className}>
      <div className="flex items-center justify-between text-[11px] mb-1.5">
        <span className="inline-flex items-center gap-1.5 text-white/45"><Users size={12} className="text-primary" />Mentorship seats</span>
        <span className="font-mono text-primary">{left} of {total} left</span>
      </div>
      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_OUT }} className="h-full bg-gradient-to-r from-primary to-accent-light" />
      </div>
    </div>
  );
}

/* ═══ P1 · WEIGHTED CARDS — side by side, but not equal. The ₹999 card is
       larger and marked, because it is the decision almost everyone makes. ═══ */
export function PricingWeighted() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-5xl mx-auto px-6 py-28">
      <Head lines={["Two plans.", "One of them is for most people."]}
        sub="Both are a single payment for one placement year. Neither renews." />
      <div className="grid md:grid-cols-12 gap-5 mt-14 items-start">
        {/* PLAN A */}
        <motion.div whileHover={reduce ? {} : { y: -5 }} transition={{ duration: 0.25, ease: EASE_OUT }}
          className="md:col-span-7 rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/12 to-transparent p-8 relative">
          <span className="absolute -top-2.5 left-8 text-[9px] uppercase tracking-[2px] bg-primary text-white rounded-pill px-3 py-1">Most students</span>
          <p className="font-syne text-2xl font-bold mb-1 mt-2">{PLANS.a.name}</p>
          <p className="text-sm text-white/45 mb-6">{PLANS.a.tagline}</p>
          <div className="flex items-end gap-3 mb-1">
            <span className="font-syne text-6xl font-bold leading-none"><Count to={PLANS.a.price} prefix="₹" /></span>
            <span className="text-lg text-white/25 line-through mb-1.5">{inr(PLANS.a.list)}</span>
          </div>
          <p className="text-xs text-white/35 mb-7">for twelve months · all taxes included</p>
          <Cta label="Start your year" />
          <ul className="mt-8 space-y-2.5">
            {PLANS.a.features.map((f) => (
              <li key={f} className="flex gap-2.5 text-sm text-white/60"><Check size={15} className="text-primary shrink-0 mt-0.5" />{f}</li>
            ))}
          </ul>
        </motion.div>

        {/* PLAN B */}
        <motion.div whileHover={reduce ? {} : { y: -5 }} transition={{ duration: 0.25, ease: EASE_OUT }}
          className="md:col-span-5 rounded-3xl border border-white/12 bg-white/[0.03] p-8">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={15} className="text-accent-light" />
            <p className="font-syne text-xl font-bold">{PLANS.b.name}</p>
          </div>
          <p className="text-sm text-white/45 mb-6">{PLANS.b.tagline}</p>
          <p className="font-syne text-4xl font-bold leading-none mb-1">{inr(PLANS.b.price)}</p>
          <p className="text-xs text-white/35 mb-6">for twelve months · all taxes included</p>
          <Seats className="mb-6" />
          <a href="/pricing" className="block text-center font-syne font-semibold text-sm border border-white/20 hover:border-primary hover:text-primary rounded-btn px-5 py-3 transition-colors">
            Take a mentorship seat
          </a>
          <ul className="mt-7 space-y-2.5">
            {PLANS.b.features.map((f) => (
              <li key={f} className="flex gap-2.5 text-sm text-white/55"><Check size={14} className="text-accent-light shrink-0 mt-0.5" />{f}</li>
            ))}
          </ul>
        </motion.div>
      </div>
      <Reveal delay={0.2}><p className="text-center text-xs text-white/30 mt-8">{TERMS}</p></Reveal>
    </section>
  );
}

/* ═══ P2 · ANCHOR + UPGRADE — one decision at a time. ₹999 is the whole
       section; mentorship arrives afterwards as a band, not a rival column.
       Removes the ₹999-against-₹4,999 sticker shock entirely. ═══ */
export function PricingAnchor() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-4xl mx-auto px-6 py-28">
      <Head lines={["₹999. For the year."]}
        sub="Less than a month of LinkedIn Premium, for the season that decides your first job." />
      <Reveal delay={0.1}>
        <div className="mt-12 rounded-3xl border border-primary/35 bg-gradient-to-b from-primary/12 to-transparent p-10 text-center relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[300px] rounded-full bg-primary/20 blur-[110px]" />
          <div className="relative">
            <p className="font-syne text-xl font-bold mb-1">{PLANS.a.name}</p>
            <p className="text-sm text-white/45 mb-7">{PLANS.a.tagline}</p>
            <div className="flex items-end justify-center gap-3 mb-2">
              <span className="font-syne text-7xl font-bold leading-none"><Count to={PLANS.a.price} prefix="₹" /></span>
              <span className="text-xl text-white/25 line-through mb-2">{inr(PLANS.a.list)}</span>
            </div>
            <p className="text-xs text-white/35 mb-8">{TERMS}</p>
            <Cta label="Start your year" />
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5 mt-10 text-left max-w-xl mx-auto">
              {PLANS.a.features.map((f) => (
                <span key={f} className="flex gap-2.5 text-sm text-white/55"><Check size={15} className="text-primary shrink-0 mt-0.5" />{f}</span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* the upgrade, sequenced after the main decision */}
      <Reveal delay={0.15}>
        <motion.div whileHover={reduce ? {} : { borderColor: "rgba(167,139,250,0.45)" }}
          className="mt-5 rounded-2xl border border-white/12 bg-white/[0.03] p-7 md:flex items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-accent-light" />
              <span className="text-[10px] uppercase tracking-[2px] text-accent-light">Optional upgrade</span>
            </div>
            <p className="font-syne text-xl font-bold mb-1.5">Add bi-weekly mentorship — {inr(PLANS.b.price)}</p>
            <p className="text-sm text-white/45 leading-relaxed mb-4 md:mb-0">
              Everything above, plus sessions with people who have already done this. Twenty-five seats,
              because a mentor with a hundred students is not a mentor.
            </p>
          </div>
          <div className="md:w-56 shrink-0">
            <Seats className="mb-4" />
            <a href="/pricing" className="block text-center font-syne font-semibold text-sm border border-white/20 hover:border-accent-light hover:text-accent-light rounded-btn px-5 py-2.5 transition-colors">
              Take a seat
            </a>
          </div>
        </motion.div>
      </Reveal>
    </section>
  );
}

/* ═══ P3 · LEDGER — no cards at all. One table, and the difference between
       the plans is visible as a block of three rows. ═══ */
export function PricingLedger() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-28">
      <Head center={false} lines={["What each plan", "actually includes."]}
        sub="The only difference is mentorship. Rather than dress that up, here it is as a list." />
      <Reveal delay={0.1}>
        <div className="mt-12 rounded-2xl border border-white/10 overflow-hidden">
          {/* header row */}
          <div className="grid grid-cols-12 gap-3 px-6 py-6 border-b border-white/10 bg-white/[0.02] items-end">
            <div className="col-span-6" />
            <div className="col-span-3 text-center">
              <p className="text-[10px] uppercase tracking-[2px] text-primary mb-1.5">Outreach &amp; Jobs</p>
              <p className="font-syne text-3xl font-bold leading-none">{inr(PLANS.a.price)}</p>
              <p className="text-[11px] text-white/25 line-through mt-1">{inr(PLANS.a.list)}</p>
            </div>
            <div className="col-span-3 text-center">
              <p className="text-[10px] uppercase tracking-[2px] text-accent-light mb-1.5">+ Mentorship</p>
              <p className="font-syne text-3xl font-bold leading-none">{inr(PLANS.b.price)}</p>
              <p className="text-[11px] text-primary mt-1 font-mono">{PLANS.b.seatsLeft}/{PLANS.b.seats} seats</p>
            </div>
          </div>

          {MATRIX.map((r, i) => (
            <Reveal key={r.label} delay={i * 0.03}>
              <div className={`grid grid-cols-12 gap-3 px-6 py-4 items-center border-b border-white/[0.06] ${!r.a ? "bg-accent-light/[0.04]" : ""}`}>
                <span className="col-span-6 text-sm text-white/60">{r.label}</span>
                <span className="col-span-3 flex justify-center">
                  {r.a ? <Check size={16} className="text-primary" /> : <Minus size={16} className="text-white/15" />}
                </span>
                <span className="col-span-3 flex justify-center">
                  {r.b ? <Check size={16} className="text-accent-light" /> : <Minus size={16} className="text-white/15" />}
                </span>
              </div>
            </Reveal>
          ))}

          <div className="grid grid-cols-12 gap-3 px-6 py-6 items-center bg-white/[0.02]">
            <span className="col-span-6 text-xs text-white/30">{TERMS}</span>
            <div className="col-span-3 flex justify-center"><Cta label="Get it" /></div>
            <div className="col-span-3 flex justify-center">
              <a href="/pricing" className="font-syne font-semibold text-sm border border-white/20 hover:border-accent-light hover:text-accent-light rounded-btn px-5 py-2.5 transition-colors whitespace-nowrap">
                Take a seat
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ═══ P4 · SWITCH — one panel, a segmented control, and the price counts
       between the two. Most animated; keeps the page to one decision. ═══ */
export function PricingSwitch() {
  const [b, setB] = useState(false);
  const reduce = useReducedMotion();
  const p = b ? PLANS.b : PLANS.a;
  return (
    <section className="max-w-3xl mx-auto px-6 py-28">
      <Head lines={["Pick your year."]} sub="Same twelve months either way. The question is only whether you want mentors in it." />

      <Reveal delay={0.1}>
        <div className="flex justify-center mt-10">
          <div className="inline-flex p-1 rounded-pill border border-white/12 bg-white/[0.03]" role="tablist">
            {[{ k: false, l: "Just the tools" }, { k: true, l: "Tools + mentors" }].map((o) => (
              <button key={o.l} role="tab" aria-selected={b === o.k} onClick={() => setB(o.k)}
                className="relative px-6 py-2.5 font-syne text-sm font-semibold rounded-pill transition-colors duration-200">
                {b === o.k && (
                  <motion.span layoutId="price-pill" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
                    className="absolute inset-0 rounded-pill bg-primary" />
                )}
                <span className={`relative ${b === o.k ? "text-white" : "text-white/45"}`}>{o.l}</span>
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-8 rounded-3xl border border-primary/30 bg-gradient-to-b from-primary/10 to-transparent p-10 text-center min-h-[430px]">
          <AnimatePresence mode="wait">
            <motion.div key={p.code}
              initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              exit={reduce ? {} : { opacity: 0, y: -18 }} transition={{ duration: 0.3, ease: EASE_OUT }}>
              <p className="font-syne text-xl font-bold mb-1">{p.name}</p>
              <p className="text-sm text-white/45 mb-7">{p.tagline}</p>
              <div className="flex items-end justify-center gap-3 mb-2">
                {/* the number counts rather than swaps — the jump from 999 to
                    4,999 is the point of the control, so it should be felt */}
                <span className="font-syne text-7xl font-bold leading-none"><Count to={p.price} prefix="₹" /></span>
                {p.list && <span className="text-xl text-white/25 line-through mb-2">{inr(p.list)}</span>}
              </div>
              <p className="text-xs text-white/35 mb-6">for twelve months · all taxes included</p>
              {b && <Seats className="max-w-xs mx-auto mb-6" />}
              <Cta label={b ? "Take a seat" : "Start your year"} />
              <div className="grid sm:grid-cols-2 gap-x-7 gap-y-2 mt-9 text-left max-w-lg mx-auto">
                {p.features.map((f) => (
                  <span key={f} className="flex gap-2.5 text-sm text-white/55">
                    <Check size={14} className={`shrink-0 mt-0.5 ${b ? "text-accent-light" : "text-primary"}`} />{f}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>
      <Reveal delay={0.2}><p className="text-center text-xs text-white/30 mt-6">{TERMS}</p></Reveal>
    </section>
  );
}

/* ═══ P5 · RECEIPT — priced like an itemised bill. Unusual for SaaS, and it
       suits a one-time payment far better than a subscription card does. ═══ */
export function PricingReceipt() {
  const reduce = useReducedMotion();
  const [b, setB] = useState(false);
  const lines = [
    { l: "Cold outreach · 12 months", v: "included" },
    { l: "Matched job feed · 12 months", v: "included" },
    { l: "One-click autofill · 12 months", v: "included" },
    { l: "Bi-weekly mentorship · 12 months", v: b ? "included" : "not added", muted: !b },
    { l: "Taxes", v: "included" },
    { l: "Renewal charges", v: "none" },
  ];
  return (
    <section className="max-w-3xl mx-auto px-6 py-28">
      <Head lines={["No line items", "you didn't expect."]}
        sub="One payment, itemised. What you see is the total — nothing is added at checkout." />
      <Reveal delay={0.1}>
        <div className="mt-12 rounded-2xl border border-white/12 bg-white/[0.03] overflow-hidden">
          <div className="px-7 py-5 border-b border-dashed border-white/12 flex items-center justify-between">
            <p className="font-syne font-bold">Outmail · one placement year</p>
            <span className="text-[10px] uppercase tracking-[2px] text-primary">Estimate</span>
          </div>

          <div className="px-7 py-5 space-y-3 font-mono text-[13px]">
            {lines.map((r) => (
              <div key={r.l} className={`flex items-baseline gap-3 ${r.muted ? "text-white/20" : "text-white/55"}`}>
                <span>{r.l}</span>
                <span className="flex-1 border-b border-dotted border-white/12 translate-y-[-3px]" />
                <span className={r.muted ? "" : "text-primary"}>{r.v}</span>
              </div>
            ))}
          </div>

          <button onClick={() => setB((v) => !v)}
            className={`w-full px-7 py-4 border-y border-dashed border-white/12 flex items-center justify-between text-left transition-colors ${
              b ? "bg-accent-light/[0.07]" : "hover:bg-white/[0.03]"}`}>
            <span className="flex items-center gap-2.5">
              <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${b ? "bg-accent-light border-accent-light" : "border-white/25"}`}>
                {b && <Check size={11} className="text-black" />}
              </span>
              <span className="text-sm text-white/70">Add mentorship — {PLANS.b.seatsLeft} of {PLANS.b.seats} seats left</span>
            </span>
            <span className="font-mono text-sm text-white/45">+{inr(PLANS.b.price - PLANS.a.price)}</span>
          </button>

          <div className="px-7 py-6 flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[2px] text-white/35 mb-1">Total, once</p>
              <motion.p key={b ? "b" : "a"}
                initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="font-syne text-5xl font-bold leading-none">
                {inr(b ? PLANS.b.price : PLANS.a.price)}
              </motion.p>
              {!b && <p className="text-xs text-white/25 line-through mt-1.5">{inr(PLANS.a.list)}</p>}
            </div>
            <div className="text-right">
              <Cta label="Pay once" />
              <p className="text-[11px] text-white/30 mt-2.5 flex items-center justify-end gap-1">
                Refundable for 7 days <ArrowRight size={11} />
              </p>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.2}><p className="text-center text-xs text-white/30 mt-6">{TERMS}</p></Reveal>
    </section>
  );
}

export const PRICING_LAYOUTS = [
  { label: "Weighted cards", C: PricingWeighted },
  { label: "Anchor + upgrade", C: PricingAnchor },
  { label: "Ledger", C: PricingLedger },
  { label: "Switch", C: PricingSwitch },
  { label: "Receipt", C: PricingReceipt },
];
