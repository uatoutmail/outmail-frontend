"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Mail, Briefcase, Zap, MessageSquare, ArrowDown } from "lucide-react";
import { Reveal, MaskLines, Cta, EASE_OUT } from "../kit";

/**
 * FIVE WAYS TO TELL THE SAME STORY.
 *
 * The content is identical in all five — one student, four problems, four
 * fixes. Only the telling changes. Written as one exported array so the copy
 * lives in exactly one place and a layout can never drift from the others.
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

/* ═══ S1 · STICKY STORY — the baseline. Anchor on the left, chapters scroll past. ═══ */
export function StoryStacked() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-6xl mx-auto px-6 py-28">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4 md:sticky md:top-24 md:self-start">
          <SectionHead lines={["Meet Ananya.", "Final year. No referrals."]}
            sub="She is not short of effort. She is short of the four things that decide whether effort turns into interviews — and each one is a different problem." />
          <div className="hidden md:block mt-6"><Cta label="Start your year" /></div>
        </div>
        <div className="md:col-span-8 space-y-4">
          {STORY.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.05}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 hover:border-primary/40 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <p className="font-syne text-3xl font-bold text-primary/30 leading-none">{s.n}</p>
                  <span className="text-[9px] uppercase tracking-[2px] text-white/35 border border-white/15 rounded-full px-2.5 py-0.5">{s.pill}</span>
                </div>
                <p className="font-syne text-xl md:text-2xl font-bold mb-2 leading-snug">{s.problem}</p>
                <p className="text-sm text-white/45 leading-relaxed mb-5">{s.detail}</p>
                <div className="rounded-xl border-l-2 border-primary bg-primary/[0.07] pl-5 pr-4 py-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <s.I size={14} className="text-primary" />
                    <span className="text-[10px] uppercase tracking-[2px] text-primary font-medium">{s.offering}</span>
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed">{s.fix}</p>
                </div>
                <StepVisual kind={s.visual} reduce={reduce} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ S2 · CHAPTERS — scrollytelling. The chapter number is pinned and swaps
       as each chapter takes the viewport, with a progress rail beside it. ═══ */
function Chapter({ s, i, total }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 40%"] });
  const opacity = useTransform(scrollYProgress, [0, 0.35, 1], [0.25, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.35], [40, 0]);
  return (
    <motion.div ref={ref} style={reduce ? {} : { opacity, y }} className="min-h-[85vh] flex items-center">
      <div className="w-full">
        <div className="flex items-baseline gap-4 mb-6">
          <span className="font-syne text-[13vw] md:text-[7vw] font-bold leading-none bg-gradient-to-b from-white/25 to-transparent bg-clip-text text-transparent">{s.n}</span>
          <span className="text-[10px] uppercase tracking-[3px] text-primary">Chapter {i + 1} of {total} · {s.pill}</span>
        </div>
        <p className="font-syne text-3xl md:text-5xl font-bold leading-[1.06] tracking-tight max-w-2xl mb-5">{s.problem}</p>
        <p className="text-white/45 leading-relaxed max-w-lg mb-8">{s.detail}</p>
        <div className="max-w-lg rounded-2xl border border-primary/30 bg-primary/[0.07] p-6">
          <div className="flex items-center gap-2 mb-3">
            <s.I size={15} className="text-primary" />
            <span className="text-[10px] uppercase tracking-[2px] text-primary font-medium">{s.offering}</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed mb-4">{s.fix}</p>
          <StepVisual kind={s.visual} reduce={reduce} compact />
        </div>
      </div>
    </motion.div>
  );
}

export function StoryChapters() {
  const reduce = useReducedMotion();
  const track = useRef(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const railH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section className="max-w-6xl mx-auto px-6 py-28">
      <SectionHead lines={["Meet Ananya.", "This is her year."]}
        sub="Four chapters. Each one a thing that stopped her, and the thing that unstuck it."
        className="mb-16" />
      <div ref={track} className="grid md:grid-cols-12 gap-8">
        {/* the rail — a reading progress bar that belongs to the story, not the page */}
        <div className="hidden md:block md:col-span-1 relative">
          <div className="sticky top-1/3 h-[36vh] w-px bg-white/10 mx-auto">
            <motion.div style={reduce ? { height: "100%" } : { height: railH }}
              className="w-px bg-gradient-to-b from-primary to-accent-light" />
          </div>
        </div>
        <div className="md:col-span-11">
          {STORY.map((s, i) => <Chapter key={s.n} s={s} i={i} total={STORY.length} />)}
        </div>
      </div>
    </section>
  );
}

/* ═══ S3 · DIARY — a timeline with months down the middle. Reads as an
       account of a year rather than a list of features. ═══ */
export function StoryDiary() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-5xl mx-auto px-6 py-28">
      <SectionHead lines={["Ananya's year,", "in four entries."]}
        sub="Placement season is not one decision, it is a sequence of small defeats. Here is the sequence, and where Outmail interrupts it."
        className="text-center mx-auto mb-16 [&_p:last-child]:mx-auto" />
      <div className="relative">
        <div className="absolute left-[19px] md:left-1/2 md:-translate-x-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-primary/60 via-white/12 to-transparent" />
        <div className="space-y-14">
          {STORY.map((s, i) => (
            <Reveal key={s.n} delay={0.05}>
              <div className={`md:flex items-start gap-10 ${i % 2 ? "md:flex-row-reverse" : ""}`}>
                {/* the month marker sits on the rail */}
                <div className="md:w-1/2 md:text-right relative pl-12 md:pl-0 md:pr-0">
                  <span className={`absolute left-0 md:left-1/2 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/15 ${i % 2 ? "md:-translate-x-1/2 md:left-auto md:-right-[5px]" : "md:left-auto md:-right-[5px]"}`} />
                  <p className="text-[10px] uppercase tracking-[3px] text-primary mb-2">{s.when}</p>
                  <p className={`font-syne text-2xl md:text-3xl font-bold leading-snug mb-2 ${i % 2 ? "md:text-left" : ""}`}>{s.problem}</p>
                  <p className={`text-sm text-white/40 leading-relaxed ${i % 2 ? "md:text-left" : ""}`}>{s.detail}</p>
                </div>
                <div className="md:w-1/2 mt-5 md:mt-0 pl-12 md:pl-0">
                  <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/12 to-transparent p-6">
                    <div className="flex items-center gap-2 mb-2.5">
                      <s.I size={14} className="text-primary" />
                      <span className="text-[10px] uppercase tracking-[2px] text-primary font-medium">{s.offering}</span>
                    </div>
                    <p className="text-sm text-white/65 leading-relaxed mb-4">{s.fix}</p>
                    <StepVisual kind={s.visual} reduce={reduce} compact />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ S4 · BEFORE / AFTER — one full-bleed pane per chapter, her side dimmed
       and Outmail's side lit. The contrast carries the argument. ═══ */
export function StoryBeforeAfter() {
  const reduce = useReducedMotion();
  return (
    <section className="py-28">
      <SectionHead lines={["Meet Ananya.", "Left is without. Right is with."]}
        sub="Same student, same market, same four weeks. The only variable is Outmail."
        className="max-w-5xl mx-auto px-6 mb-14" />
      <div className="space-y-px">
        {STORY.map((s, i) => (
          <Reveal key={s.n} delay={0.04}>
            <div className="grid md:grid-cols-2 border-y border-white/8">
              {/* without */}
              <div className="p-8 md:p-12 bg-white/[0.015] relative">
                <span className="absolute top-5 right-6 text-[9px] uppercase tracking-[3px] text-white/20">Without</span>
                <p className="font-syne text-5xl font-bold text-white/[0.07] leading-none mb-5">{s.n}</p>
                <p className="font-syne text-xl md:text-2xl font-bold text-white/55 leading-snug mb-3">{s.problem}</p>
                <p className="text-sm text-white/28 leading-relaxed max-w-sm">{s.detail}</p>
              </div>
              {/* with */}
              <motion.div whileHover={reduce ? {} : { backgroundColor: "rgba(76,31,255,0.10)" }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="p-8 md:p-12 bg-primary/[0.06] border-l border-primary/20 relative">
                <span className="absolute top-5 right-6 text-[9px] uppercase tracking-[3px] text-primary/70">With Outmail</span>
                <div className="flex items-center gap-2 mb-5">
                  <s.I size={16} className="text-primary" />
                  <span className="text-[10px] uppercase tracking-[2px] text-primary font-medium">{s.offering}</span>
                </div>
                <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-md mb-6">{s.fix}</p>
                <div className="max-w-sm"><StepVisual kind={s.visual} reduce={reduce} compact /></div>
              </motion.div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
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

export const STORY_LAYOUTS = [
  { label: "Sticky story", C: StoryStacked },
  { label: "Chapters", C: StoryChapters },
  { label: "Diary", C: StoryDiary },
  { label: "Before / after", C: StoryBeforeAfter },
  { label: "Panels", C: StoryPanels },
];
