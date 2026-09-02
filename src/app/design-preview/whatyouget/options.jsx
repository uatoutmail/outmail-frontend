"use client";
import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { Radio, Search, GraduationCap, BarChart3, Check, ArrowRight } from "lucide-react";
import { Reveal, MaskLines, Count, Kicker, EASE_OUT } from "@/component/motion/kit";

/** Copy is fixed; only the arrangement changes. */
export const BENEFITS = [
  { Icon: Radio, n: "01", t: "Direct recruiter outreach",
    d: "Bypass the ATS and land in a recruiter's inbox — from your own Gmail, personalised from your resume.",
    stat: "5/day", statL: "warm-up, growing" },
  { Icon: Search, n: "02", t: "Curated job intelligence",
    d: "Openings ranked by hiring urgency and company growth, scored against your resume with the reasoning shown.",
    stat: "94", statL: "match score, explained" },
  { Icon: GraduationCap, n: "03", t: "Expert mentorship sessions",
    d: "Live sessions with people who have navigated the exact path you're on. Real advice, not generic tips.",
    stat: "25", statL: "seats, capped" },
  { Icon: BarChart3, n: "04", t: "Campaign analytics",
    d: "Opens, replies and outreach performance in real time — so you know what is working and where to push.",
    stat: "12mo", statL: "one payment" },
];

const HEAD = ["Every edge you need,", "in one place."];

/* ═══ 1 · ROWS — no giant mock. Each benefit carries its own number, so the
       right-hand column stops being a large empty rectangle. ═══ */
export function BenefitRows() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <Reveal>
        <Kicker className="mb-5">What you get</Kicker>
        <MaskLines lines={HEAD} accentIdx={1}
          className="font-syne text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05] mb-4" />
        <p className="text-white/45 max-w-xl mb-12">
          Outreach, hiring intelligence and guidance — so you are not just applying, you are
          positioning yourself where the applying actually counts.
        </p>
      </Reveal>
      <div className="border-t border-white/10">
        {BENEFITS.map((b, i) => (
          <Reveal key={b.t} delay={i * 0.06}>
            <div className="grid md:grid-cols-12 gap-5 items-center py-7 border-b border-white/10 group">
              <div className="md:col-span-1">
                <b.Icon size={19} className="text-primary" />
              </div>
              <div className="md:col-span-6">
                <h3 className="font-syne text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">{b.t}</h3>
              </div>
              <div className="md:col-span-3">
                <p className="text-sm text-white/45 leading-relaxed">{b.d}</p>
              </div>
              <div className="md:col-span-2 md:text-right">
                <p className="font-syne text-2xl font-bold text-primary leading-none">{b.stat}</p>
                <p className="text-[11px] text-white/30 mt-1">{b.statL}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══ 2 · BENTO — asymmetric tiles. Fills the width without one big mock. ═══ */
export function BenefitBento() {
  const reduce = useReducedMotion();
  const span = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7"];
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <Reveal className="max-w-2xl mb-10">
        <Kicker className="mb-5">What you get</Kicker>
        <MaskLines lines={HEAD} accentIdx={1}
          className="font-syne text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]" />
      </Reveal>
      <div className="grid md:grid-cols-12 gap-4">
        {BENEFITS.map((b, i) => (
          <Reveal key={b.t} delay={i * 0.07} className={`col-span-12 ${span[i]}`}>
            <motion.div whileHover={reduce ? {} : { y: -4 }} transition={{ duration: 0.22, ease: EASE_OUT }}
              className="h-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between mb-5">
                <span className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <b.Icon size={17} className="text-primary" />
                </span>
                <span className="font-syne text-2xl font-bold text-primary/70">{b.stat}</span>
              </div>
              <h3 className="font-syne text-xl font-bold mb-2.5">{b.t}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{b.d}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══ 3 · STACKED CARDS — cards overlap and lift apart on scroll. The most
       "product" of the options, and it fills height without dead space. ═══ */
function StackCard({ b, i, total, progress }) {
  const reduce = useReducedMotion();
  const y = useTransform(progress, [i / total, (i + 1) / total], [0, -18 * (total - i)]);
  const scale = useTransform(progress, [i / total, 1], [1, 1 - (total - i) * 0.02]);
  return (
    <motion.div style={reduce ? {} : { y, scale }}
      className="sticky top-28 rounded-3xl border border-white/12 bg-[#150f24]/95 p-8 shadow-2xl"
      >
      <div className="flex items-center gap-3 mb-4">
        <span className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
          <b.Icon size={17} className="text-primary" />
        </span>
        <span className="font-mono text-xs text-white/25">{b.n}</span>
        <span className="ml-auto font-syne text-xl font-bold text-primary">{b.stat}</span>
      </div>
      <h3 className="font-syne text-2xl font-bold mb-2.5">{b.t}</h3>
      <p className="text-sm text-white/50 leading-relaxed max-w-lg">{b.d}</p>
    </motion.div>
  );
}
export function BenefitStack() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return (
    <section className="max-w-4xl mx-auto px-6 py-24">
      <Reveal className="mb-10">
        <Kicker className="mb-5">What you get</Kicker>
        <MaskLines lines={HEAD} accentIdx={1}
          className="font-syne text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]" />
      </Reveal>
      <div ref={ref} className="space-y-6 pb-24">
        {BENEFITS.map((b, i) => (
          <StackCard key={b.t} b={b} i={i} total={BENEFITS.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

/* ═══ 4 · SPLIT TABS — heading and list on the left, and the right pane shows
       only the selected benefit. Keeps the split, kills the dead rectangle. ═══ */
export function BenefitTabs() {
  const [k, setK] = useState(0);
  const reduce = useReducedMotion();
  const b = BENEFITS[k];
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5">
          <Kicker className="mb-5">What you get</Kicker>
          <MaskLines lines={HEAD} accentIdx={1}
            className="font-syne text-4xl font-bold tracking-tight leading-[1.05] mb-7" />
          <div className="space-y-1">
            {BENEFITS.map((x, i) => (
              <button key={x.t} onClick={() => setK(i)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
                  k === i ? "bg-primary/12 text-white" : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"}`}>
                <x.Icon size={16} className={k === i ? "text-primary" : "text-white/25"} />
                <span className="font-syne text-[15px] font-semibold">{x.t}</span>
                {k === i && <ArrowRight size={14} className="ml-auto text-primary" />}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div key={k}
              initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={reduce ? {} : { opacity: 0, y: -16 }} transition={{ duration: 0.3, ease: EASE_OUT }}
              className="rounded-3xl border border-white/12 bg-gradient-to-br from-primary/12 to-transparent p-9">
              <p className="font-syne text-6xl font-bold text-primary leading-none mb-2">{b.stat}</p>
              <p className="text-xs text-white/35 mb-7">{b.statL}</p>
              <h3 className="font-syne text-2xl font-bold mb-3">{b.t}</h3>
              <p className="text-white/55 leading-relaxed">{b.d}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ═══ 5 · MARQUEE + LIST — a kinetic band names the four, the list explains
       them. Reuses the landing page's motion language on the pricing page. ═══ */
export function BenefitMarquee() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-8%", "6%"]);
  return (
    <section ref={ref} className="py-24">
      <Reveal className="max-w-5xl mx-auto px-6 mb-8">
        <Kicker className="mb-5">What you get</Kicker>
        <MaskLines lines={HEAD} accentIdx={1}
          className="font-syne text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05]" />
      </Reveal>
      <div className="overflow-hidden py-6 mb-10 border-y border-white/8">
        <motion.p style={reduce ? {} : { x, willChange: "transform" }}
          className="font-syne text-[9vw] md:text-[5.5vw] font-bold leading-none whitespace-nowrap text-white/85">
          OUTREACH <span className="text-primary">·</span> INTELLIGENCE <span className="text-primary">·</span>{" "}
          MENTORSHIP <span className="text-primary">·</span> ANALYTICS <span className="text-primary">·</span>{" "}
          OUTREACH <span className="text-primary">·</span>
        </motion.p>
      </div>
      <div className="max-w-5xl mx-auto px-6 grid sm:grid-cols-2 gap-x-10 gap-y-8">
        {BENEFITS.map((b, i) => (
          <Reveal key={b.t} delay={i * 0.06}>
            <div className="flex gap-4">
              <b.Icon size={18} className="text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-syne text-lg font-bold mb-1.5">{b.t}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{b.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export const WHAT_YOU_GET = [
  { label: "Rows", C: BenefitRows },
  { label: "Bento", C: BenefitBento },
  { label: "Stack", C: BenefitStack },
  { label: "Split tabs", C: BenefitTabs },
  { label: "Marquee", C: BenefitMarquee },
];
