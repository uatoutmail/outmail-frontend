"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Mail, Briefcase, Zap, Users, ArrowRight, Check } from "lucide-react";
import { Reveal, Words, MaskLines, Tilt, Count, Cta, EASE_OUT } from "../kit";

/**
 * THE ASSEMBLED LANDING PAGE — a proposal, not the real page yet.
 *
 * Built from the four structures picked:
 *   hero        3D cursor tilt, tuned for smoothness
 *   offerings   KINETIC TYPE — the four things Outmail does, as moving type
 *   features    EDITORIAL magazine spread
 *   how it works HORIZONTAL JOURNEY
 *
 * Each is used where it is strongest rather than as a showcase. The order also
 * solves the content requirement: all four offerings are named twice — once as
 * kinetic type you cannot miss, once in the editorial spread with detail.
 */

const OFFERINGS = [
  { t: "Cold outreach", d: "Personalised emails to verified recruiters, sent from your own Gmail — never from us.", I: Mail },
  { t: "Matched jobs", d: "Openings scored against your resume, with the reasoning shown so you know why.", I: Briefcase },
  { t: "One-click autofill", d: "Applications completed from answers you saved once, by a browser extension.", I: Zap },
  { t: "Mentorship", d: "Bi-weekly sessions with people who have navigated the path you are on. 25 seats.", I: Users },
];

const JOURNEY = [
  { n: "01", t: "Upload your resume", d: "Once. We read it and build your profile from it." },
  { n: "02", t: "We find the people", d: "Verified recruiters at companies hiring for what you can do." },
  { n: "03", t: "We write the emails", d: "Personalised from your resume. Never a template." },
  { n: "04", t: "You approve", d: "Or switch that off and let it run all week." },
  { n: "05", t: "It sends as you", d: "From your inbox. Replies come to you, not to us." },
];

/* ---- KINETIC TYPE BAND — names every offering, twice, unmissably ---- */
function KineticBand() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["-14%", "8%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["10%", "-12%"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["-8%", "10%"]);
  return (
    <section ref={ref} className="py-24 overflow-hidden border-y border-white/8">
      <Reveal className="px-6 max-w-5xl mx-auto mb-10">
        <p className="text-[10px] uppercase tracking-[4px] text-primary">Everything Outmail does</p>
      </Reveal>
      <div className="space-y-1 md:space-y-2">
        <motion.p style={reduce ? {} : { x: x1 }} className="font-syne text-[13vw] md:text-[9vw] font-bold leading-[0.95] whitespace-nowrap text-white">
          COLD OUTREACH <span className="text-primary">·</span> MATCHED JOBS <span className="text-primary">·</span>
        </motion.p>
        <motion.p style={reduce ? {} : { x: x2 }} className="font-syne text-[13vw] md:text-[9vw] font-bold leading-[0.95] whitespace-nowrap">
          <span className="bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent">AUTOFILL · MENTORSHIP · AUTOFILL ·</span>
        </motion.p>
        <motion.p style={reduce ? {} : { x: x3 }} className="font-syne text-[13vw] md:text-[9vw] font-bold leading-[0.95] whitespace-nowrap text-white/12">
          ₹999 · TWELVE MONTHS · NO SUBSCRIPTION ·
        </motion.p>
      </div>
    </section>
  );
}

export default function FinalLanding() {
  const reduce = useReducedMotion();
  const track = useRef(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["3%", "-70%"]);

  return (
    <div className="min-h-screen bg-surface-page text-white">

      {/* ═══ 1 · HERO — 3D tilt ═══ */}
      <section className="min-h-screen flex items-center px-6" style={{ perspective: 1200 }}>
        <div className="max-w-5xl mx-auto w-full">
          <Tilt max={9} z={60} className="max-w-3xl">
            <p className="text-[10px] uppercase tracking-[4px] text-primary mb-6">Built for your placement year</p>
            <MaskLines lines={["Get seen by", "real recruiters."]} accentIdx={1}
              className="font-syne text-5xl md:text-7xl font-bold tracking-tight leading-[1.03] mb-7" />
            <Reveal delay={0.5}>
              <p className="text-lg text-white/50 max-w-lg mb-9">
                Cold outreach, matched jobs, autofill and mentorship — one payment, twelve months.
                Less than a month of LinkedIn Premium.
              </p>
            </Reveal>
            <Reveal delay={0.62}>
              <div className="flex flex-wrap items-center gap-4">
                <Cta />
                <span className="text-sm text-white/35">₹999 · full refund within 7 days</span>
              </div>
            </Reveal>
          </Tilt>
        </div>
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[3px] text-white/25"
          animate={reduce ? {} : { y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity }}>scroll</motion.div>
      </section>

      {/* ═══ 2 · KINETIC TYPE ═══ */}
      <KineticBand />

      {/* ═══ 3 · EDITORIAL FEATURES ═══ */}
      <section className="max-w-5xl mx-auto px-6 py-28">
        <Reveal><p className="text-[10px] uppercase tracking-[4px] text-primary mb-10">The four things</p></Reveal>
        <div className="grid grid-cols-12 gap-x-10 gap-y-16">
          <div className="col-span-12 md:col-span-7">
            <MaskLines lines={["Most resumes are", "never read by a", "human being."]} accentIdx={2}
              className="font-syne text-4xl md:text-5xl font-bold leading-[1.03] tracking-tight" />
          </div>
          <Reveal delay={0.3} className="col-span-12 md:col-span-5 md:border-l border-white/15 md:pl-8 md:pt-3">
            <p className="font-syne text-5xl font-bold text-primary/30 leading-none mb-2"><Count to={250} suffix="+" /></p>
            <p className="text-sm text-white/50 leading-relaxed">
              applications per opening. A recruiter reads perhaps twelve. Outmail is how you become
              one of the twelve instead of one of the 250.
            </p>
          </Reveal>

          {OFFERINGS.map((o, i) => (
            <Reveal key={o.t} delay={i * 0.06}
              className={i % 2 === 0 ? "col-span-12 md:col-span-7" : "col-span-12 md:col-span-5"}>
              <div className="border-t border-white/12 pt-5">
                <div className="flex items-baseline gap-3 mb-2">
                  <o.I size={17} className="text-primary translate-y-0.5" />
                  <p className="font-syne text-2xl md:text-3xl font-bold">{o.t}</p>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">{o.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══ 4 · HORIZONTAL JOURNEY ═══ */}
      <section className="pt-20 pb-6 text-center px-6">
        <Reveal><p className="text-[10px] uppercase tracking-[4px] text-primary mb-4">How it works</p></Reveal>
        <Reveal delay={0.1}>
          <p className="font-syne text-4xl md:text-5xl font-bold tracking-tight">Five steps. Then it runs.</p>
        </Reveal>
      </section>
      <section ref={track} className="h-[380vh] relative">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <motion.div style={reduce ? {} : { x }} className="flex gap-6 px-[7vw]">
            {JOURNEY.map((p) => (
              <div key={p.n} className="w-[78vw] md:w-[36vw] shrink-0 rounded-3xl border border-white/10 bg-gradient-to-br from-primary/14 to-transparent p-10">
                <p className="font-syne text-7xl font-bold text-primary/25 mb-6">{p.n}</p>
                <p className="font-syne text-2xl md:text-3xl font-bold mb-3">{p.t}</p>
                <p className="text-white/50 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ 5 · PRICING + CTA ═══ */}
      <section className="relative max-w-4xl mx-auto px-6 py-28 text-center">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-primary/18 blur-[130px] pointer-events-none" />
        <div className="relative">
          <Reveal>
            <p className="font-syne text-4xl md:text-6xl font-bold tracking-tight mb-5">
              Your placement year<br />starts <span className="bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent">now.</span>
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-white/50 mb-3">
              <span className="font-syne text-3xl font-bold text-white"><Count to={999} prefix="₹" /></span>
              <span className="ml-2">for twelve months</span>
            </p>
          </Reveal>
          <Reveal delay={0.2}><p className="text-sm text-white/35 mb-9">No subscription. Nothing renews. Full refund within 7 days.</p></Reveal>
          <Reveal delay={0.3}><div><Cta /></div></Reveal>
          <Reveal delay={0.4}>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-10 text-xs text-white/35">
              {OFFERINGS.map((o) => (
                <span key={o.t} className="inline-flex items-center gap-1.5"><Check size={11} className="text-primary" />{o.t}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
