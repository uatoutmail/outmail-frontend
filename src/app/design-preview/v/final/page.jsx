"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { Mail, Briefcase, Zap, Users, ArrowRight, Check, FileText, Send, MousePointerClick, MessageSquare } from "lucide-react";
import { Reveal, Words, MaskLines, Tilt, Count, Cta, EASE_OUT, EASE_BACK } from "../kit";

/**
 * THE ASSEMBLED LANDING PAGE — proposal.
 *
 * Changes in this pass:
 *  · HERO now carries TWO propositions. The first sentence lands, then a second
 *    animates in beneath it about matched jobs — because outreach alone
 *    undersells the product, and job aggregation was invisible above the fold.
 *  · THE JOURNEY is no longer outreach-only. Five steps that span all four
 *    offerings, and three layout options for the section since the horizontal
 *    version read as empty next to the editorial spread above it.
 */

const OFFERINGS = [
  { t: "Cold outreach", d: "Personalised emails to verified recruiters, sent from your own Gmail — never from us.", I: Mail },
  { t: "Matched jobs", d: "Openings scored against your resume, with the reasoning shown so you know why.", I: Briefcase },
  { t: "One-click autofill", d: "Applications completed from answers you saved once, by a browser extension.", I: Zap },
  { t: "Mentorship", d: "Bi-weekly sessions with people who have navigated the path you are on. 25 seats.", I: Users },
];

/* Spans all four offerings, not just outreach. */
const JOURNEY = [
  { n: "01", t: "Upload your resume", d: "Once. We read it and build a profile from what you can actually do.",
    I: FileText, pill: "setup", visual: "resume" },
  { n: "02", t: "We find both sides", d: "Recruiters worth writing to, and openings worth applying for — scored against your profile.",
    I: Briefcase, pill: "outreach + jobs", visual: "match" },
  { n: "03", t: "Emails go out as you", d: "Personalised, from your own inbox, on a schedule you approve. Replies come to you.",
    I: Send, pill: "outreach", visual: "send" },
  { n: "04", t: "Applications autofill", d: "The openings you want, completed in one click from answers you saved once.",
    I: MousePointerClick, pill: "autofill", visual: "fill" },
  { n: "05", t: "Mentors help you close", d: "Bi-weekly sessions with people who have done it, for when interviews start landing.",
    I: MessageSquare, pill: "mentorship", visual: "mentor" },
];

/* ---- tiny per-step visuals so the panels are not just number + text ---- */
function StepVisual({ kind, reduce }) {
  const base = "rounded-xl border border-white/10 bg-black/25 p-4";
  if (kind === "resume") return (
    <div className={base}>{[78, 94, 60, 40].map((w, i) => (
      <motion.div key={i} className="h-1.5 rounded-full bg-white/20 mb-2"
        initial={reduce ? false : { width: 0 }} whileInView={{ width: `${w}%` }} viewport={{ once: true }}
        transition={{ duration: 0.45, delay: i * 0.09, ease: EASE_OUT }} />
    ))}</div>
  );
  if (kind === "match") return (
    <div className={`${base} flex items-center gap-3`}>
      <div className="flex-1 space-y-1.5">
        {[{ l: "Razorpay · SDE Intern", s: 94 }, { l: "Zomato · Backend", s: 88 }].map((m, i) => (
          <motion.div key={m.l} className="flex items-center gap-2"
            initial={reduce ? false : { opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.12 }}>
            <span className="text-[10px] text-white/55 flex-1 truncate">{m.l}</span>
            <span className="text-[10px] font-mono text-primary">{m.s}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
  if (kind === "send") return (
    <div className={`${base} flex items-center gap-3`}>
      <motion.div initial={reduce ? false : { scale: 0.7, rotate: -15 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.45, ease: EASE_BACK }} className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
        <Mail size={16} className="text-white" />
      </motion.div>
      <div className="flex gap-1.5">
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">sent</span>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">4 queued</span>
      </div>
    </div>
  );
  if (kind === "fill") return (
    <div className={`${base} space-y-2`}>{["Name", "Notice period", "Why this role?"].map((f, i) => (
      <motion.div key={f} className="flex items-center gap-2"
        initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ delay: 0.15 * i, duration: 0.3 }}>
        <Check size={11} className="text-primary shrink-0" />
        <span className="text-[10px] text-white/50">{f}</span>
        <span className="ml-auto h-1 flex-1 max-w-[46px] rounded-full bg-primary/40" />
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

/* ═══ HERO — two propositions ═══ */
function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="min-h-screen flex items-center px-6 relative" style={{ perspective: 1200 }}>
      <div className="max-w-5xl mx-auto w-full">
        <Tilt max={9} z={60} className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[4px] text-primary mb-6">Built for your placement year</p>

          {/* proposition one */}
          <MaskLines lines={["Get seen by", "real recruiters."]} accentIdx={1}
            className="font-syne text-5xl md:text-7xl font-bold tracking-tight leading-[1.03]" />

          {/* proposition two — arrives after the first has landed */}
          <div className="mt-3 overflow-hidden">
            <motion.p
              initial={reduce ? false : { y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85, ease: EASE_OUT }}
              className="font-syne text-3xl md:text-5xl font-bold tracking-tight leading-[1.08] text-white/45">
              And find the jobs{" "}
              <span className="bg-gradient-to-r from-accent-light to-primary bg-clip-text text-transparent">worth applying to.</span>
            </motion.p>
          </div>

          <Reveal delay={1.35}>
            <p className="text-lg text-white/50 max-w-lg mt-8 mb-9">
              Cold outreach, matched jobs, one-click autofill and mentorship — one payment,
              twelve months. Less than a month of LinkedIn Premium.
            </p>
          </Reveal>
          <Reveal delay={1.5}>
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
  );
}

/* ═══ KINETIC TYPE ═══ */
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

/* ═══ EDITORIAL FEATURES ═══ */
function Editorial() {
  return (
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
            one of the twelve — and how you find the openings worth that effort.
          </p>
        </Reveal>
        {OFFERINGS.map((o, i) => (
          <Reveal key={o.t} delay={i * 0.06} className={i % 2 === 0 ? "col-span-12 md:col-span-7" : "col-span-12 md:col-span-5"}>
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
  );
}

/* ═══ JOURNEY — three layout options ═══ */
function JourneyHorizontal({ reduce }) {
  const track = useRef(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["3%", "-70%"]);
  return (
    <section ref={track} className="h-[380vh] relative">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={reduce ? {} : { x }} className="flex gap-6 px-[7vw]">
          {JOURNEY.map((p) => (
            <div key={p.n} className="w-[78vw] md:w-[34vw] shrink-0 rounded-3xl border border-white/10 bg-gradient-to-br from-primary/14 to-transparent p-9">
              <div className="flex items-center justify-between mb-6">
                <p className="font-syne text-6xl font-bold text-primary/25">{p.n}</p>
                <span className="text-[9px] uppercase tracking-[2px] text-primary border border-primary/30 rounded-full px-2.5 py-1">{p.pill}</span>
              </div>
              <p className="font-syne text-2xl font-bold mb-2.5">{p.t}</p>
              <p className="text-sm text-white/50 leading-relaxed mb-6">{p.d}</p>
              <StepVisual kind={p.visual} reduce={reduce} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function JourneyStickySplit({ reduce }) {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-28">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4 md:sticky md:top-24 md:self-start">
          <p className="text-[10px] uppercase tracking-[4px] text-primary mb-4">How it works</p>
          <p className="font-syne text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-5">
            Five steps.<br /><span className="text-white/35">Then it runs.</span>
          </p>
          <p className="text-sm text-white/45 leading-relaxed mb-6">
            Setup takes one upload. Everything after that happens on a schedule you control —
            across outreach, jobs, applications and mentorship.
          </p>
          <Cta label="Start now" />
        </div>
        <div className="md:col-span-8 space-y-4">
          {JOURNEY.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.05}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 hover:border-primary/40 transition-colors duration-200">
                <div className="flex items-start gap-5">
                  <p className="font-syne text-4xl font-bold text-primary/30 shrink-0 leading-none">{p.n}</p>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <p className="font-syne text-xl font-bold">{p.t}</p>
                      <span className="text-[9px] uppercase tracking-[2px] text-primary border border-primary/30 rounded-full px-2.5 py-0.5">{p.pill}</span>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed mb-4">{p.d}</p>
                    <StepVisual kind={p.visual} reduce={reduce} />
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

function JourneyZigzag({ reduce }) {
  return (
    <section className="max-w-5xl mx-auto px-6 pb-28">
      <Reveal className="text-center mb-14">
        <p className="text-[10px] uppercase tracking-[4px] text-primary mb-4">How it works</p>
        <p className="font-syne text-4xl md:text-5xl font-bold tracking-tight">Five steps. Then it runs.</p>
      </Reveal>
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent-light to-transparent hidden md:block" />
        <div className="space-y-10">
          {JOURNEY.map((p, i) => (
            <Reveal key={p.n} delay={0.05}>
              <div className={`md:flex items-center gap-10 ${i % 2 ? "md:flex-row-reverse" : ""}`}>
                <div className="md:w-1/2">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <p className="font-syne text-5xl font-bold text-primary/25 leading-none">{p.n}</p>
                    <span className="text-[9px] uppercase tracking-[2px] text-primary border border-primary/30 rounded-full px-2.5 py-1">{p.pill}</span>
                  </div>
                  <p className="font-syne text-2xl font-bold mb-2">{p.t}</p>
                  <p className="text-sm text-white/50 leading-relaxed">{p.d}</p>
                </div>
                <div className="md:w-1/2 mt-4 md:mt-0">
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/12 to-transparent p-5">
                    <StepVisual kind={p.visual} reduce={reduce} />
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

export default function FinalLanding() {
  const reduce = useReducedMotion();
  const [journey, setJourney] = useState(1); // default: sticky split

  return (
    <div className="min-h-screen bg-surface-page text-white">
      <Hero />
      <KineticBand />
      <Editorial />

      {journey === 0 && (
        <>
          <section className="pt-20 pb-6 text-center px-6">
            <Reveal><p className="text-[10px] uppercase tracking-[4px] text-primary mb-4">How it works</p></Reveal>
            <Reveal delay={0.1}><p className="font-syne text-4xl md:text-5xl font-bold tracking-tight">Five steps. Then it runs.</p></Reveal>
          </section>
          <JourneyHorizontal reduce={reduce} />
        </>
      )}
      {journey === 1 && <div className="pt-20"><JourneyStickySplit reduce={reduce} /></div>}
      {journey === 2 && <div className="pt-20"><JourneyZigzag reduce={reduce} /></div>}

      {/* CTA */}
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

      {/* section-level switcher for the journey layout only */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="rounded-2xl border border-white/15 bg-black/85 backdrop-blur-xl px-4 py-2.5 shadow-2xl">
          <p className="text-[10px] uppercase tracking-[2px] text-white/40 text-center mb-2">&ldquo;Five steps&rdquo; layout</p>
          <div className="flex gap-1.5">
            {["Horizontal", "Sticky split", "Zigzag"].map((l, i) => (
              <button key={l} onClick={() => setJourney(i)}
                className={`text-xs px-3.5 py-1.5 rounded-lg transition-colors duration-200 ${
                  journey === i ? "bg-primary text-white" : "bg-white/8 text-white/50 hover:bg-white/15"}`}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
