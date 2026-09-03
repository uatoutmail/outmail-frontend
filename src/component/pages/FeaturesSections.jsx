"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Briefcase, Zap, Users, Check, ArrowUpRight } from "lucide-react";
import React from "react";
import { Reveal, MaskLines, Kicker, EASE_OUT } from "@/component/motion/kit";

/**
 * The /features page, built from the chosen layouts: capability chips as the
 * orientation strip, numbered chapters for the four offerings, and an honest
 * comparison against what a student does today.
 *
 * One source of truth for the copy, so nothing here can drift from the claims
 * the landing page and the pricing ledger make.
 */
export const OFFERINGS = [
  {
    n: "01",
    t: "Cold outreach",
    I: Mail,
    pill: "Reach",
    d: "Personalised emails to verified recruiters, sent from your own Gmail — never from us. Warm-up starts at five a day and grows only while you are actually sending.",
    points: [
      "Verified recruiter and company discovery",
      "Written from your resume, not a template",
      "Replies land in your inbox, not ours",
    ],
  },
  {
    n: "02",
    t: "Matched jobs",
    I: Briefcase,
    pill: "Find",
    d: "Openings aggregated from job boards and company sites, scored against your resume with the reasoning shown, so you spend effort where you have a real chance.",
    points: [
      "Explainable match score",
      "Deduplicated across sources",
      "Filtered to entry-level by default",
    ],
  },
  {
    n: "03",
    t: "One-click autofill",
    I: Zap,
    pill: "Apply",
    d: "A browser extension that completes applications from answers you wrote once — so twenty minutes goes into the tenth application, not the first.",
    points: [
      "Answers saved once, reused everywhere",
      "Works on the ATS forms students actually hit",
      "You review before anything submits",
    ],
  },
  {
    n: "04",
    t: "Mentorship",
    I: Users,
    pill: "Close",
    d: "Bi-weekly sessions with people who have already been through the loop you are about to enter. Twenty-five seats, because a mentor with a hundred students is not a mentor.",
    points: ["Live sessions and recordings", "Mentor Q&A between sessions", "Priority support"],
  },
];

/** Orientation strip — four capabilities, each jumping to its chapter. */
export function GlanceChips() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <Reveal>
        <Kicker className="mb-5">Four things, one subscription-free year</Kicker>
      </Reveal>
      <div className="flex flex-wrap gap-2.5">
        {OFFERINGS.map((o, i) => (
          <Reveal key={o.t} delay={i * 0.06}>
            <motion.a
              href={`#f-${o.n}`}
              whileHover={reduce ? {} : { y: -3 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="inline-flex items-center gap-2.5 rounded-pill border border-white/12 bg-white/[0.03] hover:border-primary/50 pl-4 pr-3 py-3 transition-colors"
            >
              <o.I size={15} className="text-primary" />
              <span className="font-syne text-sm font-semibold">{o.t}</span>
              <ArrowUpRight size={13} className="text-white/25" />
            </motion.a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Mock({ kind }) {
  const base = "rounded-xl border border-white/10 bg-black/30 p-5";
  if (kind === "01")
    return (
      <div className={base}>
        <p className="text-[11px] text-white/35 mb-3">To: priya.sharma@razorpay.com</p>
        <p className="text-sm text-white/75 leading-relaxed mb-4">
          Hi Priya — I saw Razorpay is hiring backend interns. I built a payments reconciliation
          tool in college that handled…
        </p>
        <div className="flex gap-1.5">
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
            sent from your Gmail
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
            4 queued
          </span>
        </div>
      </div>
    );
  if (kind === "02")
    return (
      <div className={`${base} space-y-2.5`}>
        {[
          { l: "Razorpay · SDE Intern", s: 94 },
          { l: "Zomato · Backend Intern", s: 88 },
          { l: "Meesho · Platform", s: 81 },
        ].map((m) => (
          <div key={m.l} className="flex items-center gap-3">
            <span className="text-[12px] text-white/60 flex-1 truncate">{m.l}</span>
            <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${m.s}%` }} />
            </div>
            <span className="text-[11px] font-mono text-primary w-6 text-right">{m.s}</span>
          </div>
        ))}
      </div>
    );
  if (kind === "03")
    return (
      <div className={`${base} space-y-2.5`}>
        {["Full name", "Notice period", "Why this role?", "Expected CTC"].map((f) => (
          <div key={f} className="flex items-center gap-2.5">
            <Check size={12} className="text-primary shrink-0" />
            <span className="text-[12px] text-white/50">{f}</span>
            <span className="ml-auto h-1.5 flex-1 max-w-[70px] rounded-full bg-primary/35" />
          </div>
        ))}
      </div>
    );
  return (
    <div className={`${base} space-y-3`}>
      {["Every other Saturday · live", "Q&A between sessions", "Recordings if you miss one"].map(
        (l) => (
          <div key={l} className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent-light shrink-0" />
            <span className="text-[12px] text-white/60">{l}</span>
          </div>
        )
      )}
    </div>
  );
}

/** The four offerings as numbered chapters — big numerals, editorial rhythm. */
export function FeaturesChapters() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20 space-y-24">
      {OFFERINGS.map((o) => (
        <div key={o.t} id={`f-${o.n}`} className="scroll-mt-20">
          <Reveal>
            <div className="flex items-start gap-6 md:gap-10">
              <span className="font-syne text-[16vw] md:text-[8vw] font-bold leading-[0.8] bg-gradient-to-b from-primary/40 to-transparent bg-clip-text text-transparent shrink-0">
                {o.n}
              </span>
              <div className="flex-1 pt-2">
                <span className="text-[10px] uppercase tracking-[2px] text-primary">{o.pill}</span>
                <p className="font-syne text-3xl md:text-5xl font-bold tracking-tight mt-2 mb-4">
                  {o.t}
                </p>
                <p className="text-white/50 leading-relaxed max-w-xl mb-6">{o.d}</p>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 max-w-2xl mb-7">
                  {o.points.map((p) => (
                    <span key={p} className="flex gap-2.5 text-sm text-white/55">
                      <Check size={14} className="text-primary shrink-0 mt-0.5" />
                      {p}
                    </span>
                  ))}
                </div>
                <div className="max-w-md">
                  <Mock kind={o.n} />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      ))}
    </section>
  );
}

/** The close: an honest comparison against what a student does today. */
export function ProofComparison() {
  const rows = [
    {
      l: "How many of the right people see you",
      a: "Whoever the ATS surfaces",
      b: "Recruiters you chose, emailed as you",
    },
    {
      l: "How you find openings",
      a: "Scroll LinkedIn, filter manually",
      b: "Aggregated and scored against your resume",
    },
    { l: "Time per application", a: "~20 minutes of retyping", b: "One click from saved answers" },
    { l: "Who you ask about the interview", a: "Nobody", b: "A mentor who has done it" },
  ];
  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <Reveal>
        <Kicker className="mb-4">Against what you do today</Kicker>
        <MaskLines
          lines={["The same effort,", "pointed differently."]}
          accentIdx={1}
          className="font-syne text-3xl md:text-4xl font-bold tracking-tight mb-10"
        />
      </Reveal>
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-4 border-b border-white/10 bg-white/[0.02] text-[10px] uppercase tracking-[2px]">
          <span className="col-span-4 text-white/25">&nbsp;</span>
          <span className="col-span-4 text-white/25">Without</span>
          <span className="col-span-4 text-primary">With Outmail</span>
        </div>
        {rows.map((r, i) => (
          <Reveal key={r.l} delay={i * 0.05}>
            <div className="grid grid-cols-12 gap-3 px-6 py-5 border-b border-white/[0.06] last:border-0 items-start">
              <span className="col-span-12 md:col-span-4 text-[13px] text-white/45 mb-1 md:mb-0">
                {r.l}
              </span>
              <span className="col-span-6 md:col-span-4 text-[13px] text-white/30">{r.a}</span>
              <span className="col-span-6 md:col-span-4 text-[13px] text-white/75">{r.b}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
