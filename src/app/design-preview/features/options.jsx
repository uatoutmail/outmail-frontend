"use client";
import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { Mail, Briefcase, Zap, Users, Check, ArrowRight, ArrowUpRight, TrendingUp, Clock, Target } from "lucide-react";
import { Reveal, MaskLines, Count, Cta, Kicker, EASE_OUT } from "@/component/motion/kit";

/** One source of truth for the copy, so a layout choice never changes the claims. */
export const OFFERINGS = [
  { n: "01", t: "Cold outreach", I: Mail, pill: "Reach",
    d: "Personalised emails to verified recruiters, sent from your own Gmail — never from us. Warm-up starts at five a day and grows only while you are actually sending.",
    points: ["Verified recruiter and company discovery", "Written from your resume, not a template", "Replies land in your inbox, not ours"] },
  { n: "02", t: "Matched jobs", I: Briefcase, pill: "Find",
    d: "Openings aggregated from job boards and company sites, scored against your resume with the reasoning shown, so you spend effort where you have a real chance.",
    points: ["Explainable match score", "Deduplicated across sources", "Filtered to entry-level by default"] },
  { n: "03", t: "One-click autofill", I: Zap, pill: "Apply",
    d: "A browser extension that completes applications from answers you wrote once — so twenty minutes goes into the tenth application, not the first.",
    points: ["Answers saved once, reused everywhere", "Works on the ATS forms students actually hit", "You review before anything submits"] },
  { n: "04", t: "Mentorship", I: Users, pill: "Close",
    d: "Bi-weekly sessions with people who have already been through the loop you are about to enter. Twenty-five seats, because a mentor with a hundred students is not a mentor.",
    points: ["Live sessions and recordings", "Mentor Q&A between sessions", "Priority support"] },
];

const STATS = [
  { v: 250, suffix: "+", l: "applications per opening", sub: "a recruiter reads perhaps twelve" },
  { v: 4, suffix: "", l: "things that decide the outcome", sub: "reach, search, forms, guidance" },
  { v: 12, suffix: " mo", l: "for one payment", sub: "nothing renews" },
];

/* ══════════════════════ SECTION A — AT A GLANCE ══════════════════════ */

/** A1 · Stat band — the argument in three numbers before any feature copy. */
export function GlanceStats() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid sm:grid-cols-3 gap-4">
        {STATS.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.08}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 h-full">
              <p className="font-syne text-5xl font-bold text-primary leading-none mb-3">
                <Count to={s.v} suffix={s.suffix} />
              </p>
              <p className="text-sm text-white/70 leading-snug">{s.l}</p>
              <p className="text-xs text-white/35 mt-1.5">{s.sub}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** A2 · Chip row — the four capabilities as one compact orientation strip. */
export function GlanceChips() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <Reveal><Kicker className="mb-5">Four things, one subscription-free year</Kicker></Reveal>
      <div className="flex flex-wrap gap-2.5">
        {OFFERINGS.map((o, i) => (
          <Reveal key={o.t} delay={i * 0.06}>
            <motion.a href={`#f-${o.n}`} whileHover={reduce ? {} : { y: -3 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="inline-flex items-center gap-2.5 rounded-pill border border-white/12 bg-white/[0.03] hover:border-primary/50 pl-4 pr-3 py-3 transition-colors">
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

/** A3 · Index — a contents page. Reads as documentation rather than a pitch. */
export function GlanceIndex() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <Reveal><Kicker className="mb-6">Contents</Kicker></Reveal>
      <div className="border-t border-white/10">
        {OFFERINGS.map((o, i) => (
          <Reveal key={o.t} delay={i * 0.05}>
            <a href={`#f-${o.n}`} className="group flex items-baseline gap-5 py-4 border-b border-white/10 hover:bg-white/[0.02] transition-colors">
              <span className="font-mono text-xs text-primary/60 w-8 shrink-0">{o.n}</span>
              <span className="font-syne text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">{o.t}</span>
              <span className="hidden md:block flex-1 border-b border-dotted border-white/12 translate-y-[-4px]" />
              <span className="text-[10px] uppercase tracking-[2px] text-white/30">{o.pill}</span>
              <ArrowRight size={14} className="text-white/20 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** A4 · Ticker — reuses the landing page's kinetic language as the strip. */
export function GlanceTicker() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-10%", "6%"]);
  return (
    <section ref={ref} className="py-14 overflow-hidden border-y border-white/8">
      <motion.p style={reduce ? {} : { x, willChange: "transform" }}
        className="font-syne text-[11vw] md:text-[7vw] font-bold leading-none whitespace-nowrap">
        REACH <span className="text-primary">·</span> FIND <span className="text-primary">·</span> APPLY{" "}
        <span className="text-primary">·</span> CLOSE <span className="text-primary">·</span> REACH{" "}
        <span className="text-primary">·</span> FIND <span className="text-primary">·</span>
      </motion.p>
    </section>
  );
}

/* ══════════════════════ SECTION B — THE FOUR FEATURES ══════════════════════ */

function Mock({ kind }) {
  const base = "rounded-xl border border-white/10 bg-black/30 p-5";
  if (kind === "01") return (
    <div className={base}>
      <p className="text-[11px] text-white/35 mb-3">To: priya.sharma@razorpay.com</p>
      <p className="text-sm text-white/75 leading-relaxed mb-4">
        Hi Priya — I saw Razorpay is hiring backend interns. I built a payments
        reconciliation tool in college that handled…
      </p>
      <div className="flex gap-1.5">
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">sent from your Gmail</span>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">4 queued</span>
      </div>
    </div>
  );
  if (kind === "02") return (
    <div className={`${base} space-y-2.5`}>
      {[{ l: "Razorpay · SDE Intern", s: 94 }, { l: "Zomato · Backend Intern", s: 88 }, { l: "Meesho · Platform", s: 81 }].map((m) => (
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
  if (kind === "03") return (
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
      {["Every other Saturday · live", "Q&A between sessions", "Recordings if you miss one"].map((l) => (
        <div key={l} className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent-light shrink-0" />
          <span className="text-[12px] text-white/60">{l}</span>
        </div>
      ))}
    </div>
  );
}

/** B1 · Alternating spreads — one full row per feature, sides swapping. */
export function FeaturesAlternating() {
  return (
    <div className="divide-y divide-white/8">
      {OFFERINGS.map((o, i) => (
        <section key={o.t} id={`f-${o.n}`} className="px-6 py-20 scroll-mt-20">
          <div className={`max-w-5xl mx-auto md:flex items-center gap-14 ${i % 2 ? "md:flex-row-reverse" : ""}`}>
            <Reveal className="md:w-1/2">
              <div className="flex items-center gap-2.5 mb-4">
                <o.I size={16} className="text-primary" />
                <span className="text-[10px] uppercase tracking-[2px] text-primary">{o.pill}</span>
              </div>
              <MaskLines lines={[o.t]} className="font-syne text-3xl md:text-4xl font-bold tracking-tight mb-4" />
              <p className="text-white/50 leading-relaxed mb-6">{o.d}</p>
              <ul className="space-y-2">
                {o.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm text-white/60"><Check size={14} className="text-primary shrink-0 mt-0.5" />{p}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15} className="md:w-1/2 mt-8 md:mt-0">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/12 to-transparent p-6">
                <Mock kind={o.n} />
              </div>
            </Reveal>
          </div>
        </section>
      ))}
    </div>
  );
}

/** B2 · Sticky index — the list pins on the left, detail scrolls past it. */
export function FeaturesSticky() {
  const [active, setActive] = useState(0);
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-4 md:sticky md:top-24 md:self-start">
          <Kicker className="mb-5">What Outmail does</Kicker>
          <div className="space-y-1">
            {OFFERINGS.map((o, i) => (
              <button key={o.t} onClick={() => setActive(i)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  active === i ? "bg-primary/12 text-white" : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"}`}>
                <o.I size={15} className={active === i ? "text-primary" : "text-white/25"} />
                <span className="font-syne text-[15px] font-semibold">{o.t}</span>
              </button>
            ))}
          </div>
          <div className="mt-7"><Cta label="Start your year" /></div>
        </div>
        <div className="md:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div key={active}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-9">
              <span className="text-[10px] uppercase tracking-[2px] text-primary">{OFFERINGS[active].pill}</span>
              <p className="font-syne text-3xl font-bold tracking-tight mt-3 mb-4">{OFFERINGS[active].t}</p>
              <p className="text-white/50 leading-relaxed mb-6">{OFFERINGS[active].d}</p>
              <ul className="space-y-2 mb-7">
                {OFFERINGS[active].points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm text-white/60"><Check size={14} className="text-primary shrink-0 mt-0.5" />{p}</li>
                ))}
              </ul>
              <Mock kind={OFFERINGS[active].n} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/** B3 · Bento — asymmetric grid, everything visible at once. */
export function FeaturesBento() {
  const reduce = useReducedMotion();
  const span = ["md:col-span-7 md:row-span-2", "md:col-span-5", "md:col-span-5", "md:col-span-7"];
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <Reveal><Kicker className="mb-8">What Outmail does</Kicker></Reveal>
      <div className="grid md:grid-cols-12 gap-4">
        {OFFERINGS.map((o, i) => (
          <Reveal key={o.t} delay={i * 0.07} className={`col-span-12 ${span[i]}`}>
            <motion.div whileHover={reduce ? {} : { y: -4 }} transition={{ duration: 0.22, ease: EASE_OUT }}
              className="h-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <o.I size={16} className="text-primary" />
                </span>
                <span className="text-[10px] uppercase tracking-[2px] text-primary">{o.pill}</span>
              </div>
              <p className="font-syne text-2xl font-bold mb-2.5">{o.t}</p>
              <p className="text-sm text-white/50 leading-relaxed mb-5">{o.d}</p>
              {i === 0 && <Mock kind={o.n} />}
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** B4 · Numbered chapters — big numerals, editorial rhythm, one per screen. */
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
                <p className="font-syne text-3xl md:text-5xl font-bold tracking-tight mt-2 mb-4">{o.t}</p>
                <p className="text-white/50 leading-relaxed max-w-xl mb-6">{o.d}</p>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 max-w-2xl mb-7">
                  {o.points.map((p) => (
                    <span key={p} className="flex gap-2.5 text-sm text-white/55"><Check size={14} className="text-primary shrink-0 mt-0.5" />{p}</span>
                  ))}
                </div>
                <div className="max-w-md"><Mock kind={o.n} /></div>
              </div>
            </div>
          </Reveal>
        </div>
      ))}
    </section>
  );
}

/* ══════════════════════ SECTION C — CLOSING PROOF ══════════════════════ */

/** C1 · Honest comparison against what a student does today. */
export function ProofComparison() {
  const rows = [
    { l: "How many of the right people see you", a: "Whoever the ATS surfaces", b: "Recruiters you chose, emailed as you" },
    { l: "How you find openings", a: "Scroll LinkedIn, filter manually", b: "Aggregated and scored against your resume" },
    { l: "Time per application", a: "~20 minutes of retyping", b: "One click from saved answers" },
    { l: "Who you ask about the interview", a: "Nobody", b: "A mentor who has done it" },
  ];
  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <Reveal>
        <Kicker className="mb-4">Against what you do today</Kicker>
        <MaskLines lines={["The same effort,", "pointed differently."]} accentIdx={1}
          className="font-syne text-3xl md:text-4xl font-bold tracking-tight mb-10" />
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
              <span className="col-span-12 md:col-span-4 text-[13px] text-white/45 mb-1 md:mb-0">{r.l}</span>
              <span className="col-span-6 md:col-span-4 text-[13px] text-white/30">{r.a}</span>
              <span className="col-span-6 md:col-span-4 text-[13px] text-white/75">{r.b}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** C2 · Metric band — three claims we can actually stand behind. */
export function ProofMetrics() {
  const items = [
    { I: Target, t: "You choose who", d: "Every recruiter is one you approved, at a company you picked." },
    { I: Clock, t: "Five a day, growing", d: "A deliberate warm-up that keeps your Gmail inside normal sending behaviour." },
    { I: TrendingUp, t: "Reasoning shown", d: "Every match score explains itself, so you can disagree with it." },
  ];
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-3 gap-4">
        {items.map((x, i) => (
          <Reveal key={x.t} delay={i * 0.08}>
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <x.I size={18} className="text-primary mb-4" />
              <p className="font-syne text-lg font-bold mb-2">{x.t}</p>
              <p className="text-sm text-white/45 leading-relaxed">{x.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** C3 · Nothing — go straight from features to the CTA. */
export function ProofNone() { return null; }

export const GLANCE = [
  { label: "Stats", C: GlanceStats },
  { label: "Chips", C: GlanceChips },
  { label: "Index", C: GlanceIndex },
  { label: "Ticker", C: GlanceTicker },
];
export const FEATURE_LAYOUTS = [
  { label: "Alternating", C: FeaturesAlternating },
  { label: "Sticky index", C: FeaturesSticky },
  { label: "Bento", C: FeaturesBento },
  { label: "Chapters", C: FeaturesChapters },
];
export const PROOF = [
  { label: "Comparison", C: ProofComparison },
  { label: "Metrics", C: ProofMetrics },
  { label: "None", C: ProofNone },
];
