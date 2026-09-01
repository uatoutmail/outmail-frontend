"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Briefcase, Zap, MessageSquare, ArrowDown } from "lucide-react";
import { Reveal, MaskLines, EASE_OUT } from "@/component/motion/kit";

/**
 * HOW IT WORKS — comic-strip panels. LOCKED.
 *
 * Four frames: a wall she hit, and the thing that got her over it. Chosen over
 * the scrollytelling and before/after variants because it is unmistakably for
 * students rather than for their placement office — which is who buys this.
 */
export const STORY = [
  {
    n: "01", pill: "the pile", when: "August",
    problem: "She applied to 180 openings. Four replied.",
    detail: "Every one went into an ATS behind 250 other applications. Nobody read hers, because nobody read most of them.",
    fix: "Outmail writes to the person doing the hiring instead — from Ananya's own Gmail, personalised from her resume, so it arrives as a message rather than a submission.",
    offering: "Cold outreach", I: Mail, visual: "send",
  },
  {
    n: "02", pill: "the search", when: "September",
    problem: "She was applying to whatever LinkedIn showed her.",
    detail: "Most of it was senior, or the wrong stack, or closed weeks ago. She spent more time filtering than applying.",
    fix: "Outmail aggregates openings from across job boards and company sites, scores each against her resume, and shows the reasoning — so effort goes where she has a real chance.",
    offering: "Job aggregation", I: Briefcase, visual: "match",
  },
  {
    n: "03", pill: "the forms", when: "October",
    problem: "Each application took twenty minutes of retyping.",
    detail: "Same name, same notice period, same 'why do you want to work here', typed again into a slightly different form.",
    fix: "Outmail's extension fills them in one click from answers she wrote once — so twenty minutes goes into the ten applications that matter, not the first one.",
    offering: "One-click autofill", I: Zap, visual: "fill",
  },
  {
    n: "04", pill: "the interview", when: "November",
    problem: "Then a recruiter replied, and she had nobody to ask.",
    detail: "No seniors at that company, no alumni she knew, no idea what the loop looked like or what they would ask.",
    fix: "Bi-weekly mentorship with people who have already been through it — for the part where getting the interview stops being the hard bit.",
    offering: "Mentorship", I: MessageSquare, visual: "mentor",
  },
];

/* ---------- shared miniature visuals ---------- */
export function StepVisual({ kind, reduce, compact = false }) {
  const base = `rounded-xl border border-white/10 bg-black/25 ${compact ? "p-3" : "p-4"}`;
  if (kind === "match") return (
    <div className={base}>{[{ l: "Razorpay · SDE Intern", s: 94 }, { l: "Zomato · Backend Intern", s: 88 }, { l: "Meesho · Platform", s: 81 }].map((m, i) => (
      <motion.div key={m.l} className="flex items-center gap-2 mb-2 last:mb-0"
        initial={reduce ? false : { opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.4, delay: i * 0.12 }}>
        <span className="text-[11px] text-white/55 flex-1 truncate">{m.l}</span>
        <span className="text-[11px] font-mono text-primary">{m.s}</span>
      </motion.div>
    ))}</div>
  );
  if (kind === "send") return (
    <div className={`${base} flex items-center gap-3`}>
      <motion.div initial={reduce ? false : { scale: 0.7, rotate: -15 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }} className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
        <Mail size={16} className="text-white" />
      </motion.div>
      <div className="flex flex-wrap gap-1.5">
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">sent from her Gmail</span>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">4 queued</span>
      </div>
    </div>
  );
  if (kind === "fill") return (
    <div className={`${base} space-y-2`}>{["Full name", "Notice period", "Why this role?"].map((f, i) => (
      <motion.div key={f} className="flex items-center gap-2"
        initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ delay: 0.15 * i, duration: 0.3 }}>
        <span className="text-[11px] text-white/50">{f}</span>
        <span className="ml-auto h-1 flex-1 max-w-[52px] rounded-full bg-primary/40" />
      </motion.div>
    ))}</div>
  );
  return (
    <div className={`${base} flex items-center gap-3`}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-light shrink-0" />
      <div className="flex-1">
        <div className="h-1.5 w-full rounded-full bg-white/20 mb-1.5" />
        <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

function SectionHead({ kicker = "How it works", lines, sub, className = "" }) {
  return (
    <Reveal className={className}>
      <p className="text-[10px] uppercase tracking-[4px] text-primary mb-4">{kicker}</p>
      <MaskLines lines={lines} accentIdx={1}
        className="font-syne text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]" />
      {sub && <p className="text-sm text-white/45 leading-relaxed max-w-md mt-5">{sub}</p>}
    </Reveal>
  );
}

/* ═══ S5 · PANELS — comic-strip frames. Loud, staggered, unmistakably for
       students rather than for their placement office. ═══ */
export function StoryPanels() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-6xl mx-auto px-6 py-28">
      <SectionHead lines={["Meet Ananya.", "Four frames."]}
        sub="Read it like a strip. Every frame is a wall she hit, and the thing that got her over it."
        className="mb-16" />
      <div className="grid md:grid-cols-2 gap-5">
        {STORY.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.07}>
            <motion.div whileHover={reduce ? {} : { y: -6, rotate: i % 2 ? -0.6 : 0.6 }}
              transition={{ duration: 0.28, ease: EASE_OUT }}
              className={`h-full rounded-3xl border-2 border-white/12 overflow-hidden ${i % 2 ? "md:translate-y-8" : ""}`}>
              {/* caption bar, like a comic frame's top gutter */}
              <div className="bg-primary px-6 py-3 flex items-center justify-between">
                <span className="font-syne text-sm font-bold uppercase tracking-wide text-white">{s.pill}</span>
                <span className="font-syne text-sm font-bold text-white/60">{s.n}</span>
              </div>
              <div className="p-7 bg-white/[0.03]">
                <p className="font-syne text-2xl md:text-3xl font-bold leading-[1.12] mb-3">{s.problem}</p>
                <p className="text-sm text-white/40 leading-relaxed mb-6">{s.detail}</p>
                <div className="flex items-center gap-2 text-primary mb-3">
                  <ArrowDown size={14} />
                  <span className="text-[10px] uppercase tracking-[2px] font-medium">{s.offering}</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed mb-5">{s.fix}</p>
                <StepVisual kind={s.visual} reduce={reduce} compact />
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


export default StoryPanels;
