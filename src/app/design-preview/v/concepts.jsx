"use client";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { Mail, Briefcase, Zap, Users, ArrowRight, ArrowLeft, Check, Clock, TrendingUp, Terminal, Eye } from "lucide-react";
import { Reveal, Words, MaskLines, Tilt, Count, Cta, FEATS, STEPS, EASE_OUT, EASE_BACK } from "./kit";

const SceneNetwork = dynamic(() => import("../landing/scenes").then((m) => m.SceneNetwork), { ssr: false });
const SceneShapes  = dynamic(() => import("../landing/scenes").then((m) => m.SceneShapes),  { ssr: false });
const SceneBlob    = dynamic(() => import("../landing/scenes").then((m) => m.SceneBlob),    { ssr: false });

const ICONS = [Mail, Briefcase, Zap, Users];
const Wrap = ({ children }) => <div className="min-h-screen bg-surface-page text-white pb-32">{children}</div>;

/* ═══════════ 1 · IMMERSIVE 3D ═══════════ */
export function C1() {
  const reduce = useReducedMotion();
  return (
    <Wrap>
      <section className="relative h-screen flex items-center justify-center text-center px-6">
        {!reduce && <SceneNetwork />}
        <div className="relative">
          <MaskLines lines={["You, connected to", "every recruiter hiring."]} accentIdx={1}
            className="font-syne text-5xl md:text-7xl font-bold tracking-tight leading-[1.04] mb-6" />
          <Reveal delay={0.5}><p className="text-white/50 mb-8 max-w-md mx-auto">₹999 for a placement year. Less than a month of LinkedIn Premium.</p></Reveal>
          <Reveal delay={0.65}><Cta /></Reveal>
        </div>
        <motion.div className="absolute bottom-8 text-[10px] uppercase tracking-[3px] text-white/25"
          animate={reduce ? {} : { y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity }}>scroll</motion.div>
      </section>
      <section className="max-w-4xl mx-auto px-6 py-24 grid sm:grid-cols-2 gap-4">
        {FEATS.map((f, i) => { const I = ICONS[i]; return (
          <Reveal key={f.t} delay={i * 0.08}>
            <Tilt className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/12 to-transparent p-7 h-full">
              <I size={20} className="text-primary mb-4" />
              <p className="font-syne text-xl font-bold mb-1.5">{f.t}</p>
              <p className="text-sm text-white/50 leading-relaxed">{f.d}</p>
            </Tilt>
          </Reveal>); })}
      </section>
    </Wrap>
  );
}

/* ═══════════ 2 · HORIZONTAL JOURNEY ═══════════ */
export function C2() {
  const reduce = useReducedMotion();
  const track = useRef(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-68%"]);
  const panels = [
    { n: "01", t: "You upload a resume", d: "Once. That is the entire setup." },
    { n: "02", t: "We find the people", d: "Verified recruiters, matched to what you can actually do." },
    { n: "03", t: "We write the emails", d: "Personalised from your resume. Not a template." },
    { n: "04", t: "You approve", d: "Or switch that off and let it run all week." },
    { n: "05", t: "It sends as you", d: "From your inbox. Replies come to you, not to us." },
  ];
  return (
    <Wrap>
      <section className="h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <Words text="Five steps. Then it runs." accentFrom={2}
          className="font-syne text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6" />
        <Reveal delay={0.5}><p className="text-white/50">Keep scrolling — the story moves sideways.</p></Reveal>
      </section>
      <section ref={track} className="h-[400vh] relative">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <motion.div style={reduce ? {} : { x }} className="flex gap-6 px-[8vw]">
            {panels.map((p) => (
              <div key={p.n} className="w-[76vw] md:w-[38vw] shrink-0 rounded-3xl border border-white/10 bg-gradient-to-br from-primary/14 to-transparent p-10">
                <p className="font-syne text-7xl font-bold text-primary/25 mb-6">{p.n}</p>
                <p className="font-syne text-2xl md:text-3xl font-bold mb-3">{p.t}</p>
                <p className="text-white/50 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      <section className="h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <Reveal><p className="font-syne text-4xl font-bold mb-6">That is the whole product.</p></Reveal>
        <Reveal delay={0.15}><Cta /></Reveal>
      </section>
    </Wrap>
  );
}

/* ═══════════ 3 · SCROLL STORY ═══════════ */
export function C3() {
  const reduce = useReducedMotion();
  const wrap = useRef(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const [act, setAct] = useState(0);
  useEffect(() => scrollYProgress.on("change", (v) => setAct(v < 0.3 ? 0 : v < 0.62 ? 1 : 2)), [scrollYProgress]);
  const acts = [
    { t: "250 applications per opening.", d: "Yours is one of them.", tint: "from-red-500/18" },
    { t: "A recruiter reads maybe twelve.", d: "The other 238 were never a competition.", tint: "from-amber-500/18" },
    { t: "So write to a person instead.", d: "From your own inbox, to someone who is hiring right now.", tint: "from-primary/25" },
  ];
  return (
    <Wrap>
      <section ref={wrap} className="h-[320vh] relative">
        <div className={`sticky top-0 h-screen flex items-center justify-center bg-gradient-to-b ${acts[act].tint} to-transparent transition-colors duration-1000`}>
          <div className="text-center px-6 max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div key={act}
                initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}>
                <p className="font-syne text-4xl md:text-6xl font-bold leading-[1.06] mb-5">{acts[act].t}</p>
                <p className="text-lg text-white/50">{acts[act].d}</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex justify-center gap-2 mt-12">
              {acts.map((a, i) => <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === act ? "w-10 bg-primary" : "w-5 bg-white/15"}`} />)}
            </div>
          </div>
        </div>
      </section>
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <Reveal><p className="font-syne text-4xl md:text-5xl font-bold mb-4">Outmail does exactly that.</p></Reveal>
        <Reveal delay={0.12}><p className="text-white/50 mb-8">₹999 for twelve months.</p></Reveal>
        <Reveal delay={0.22}><Cta /></Reveal>
      </section>
    </Wrap>
  );
}

/* ═══════════ 4 · BENTO DENSE ═══════════ */
export function C4() {
  const cell = "rounded-3xl border border-white/10 p-6 relative overflow-hidden";
  return (
    <Wrap>
      <section className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-4 auto-rows-[110px] gap-4">
        <Reveal className="col-span-4 md:col-span-3 row-span-2">
          <div className={`${cell} h-full bg-gradient-to-br from-primary/28 via-primary/8 to-transparent flex flex-col justify-center`}>
            <MaskLines lines={["Get seen by", "real recruiters."]} accentIdx={1}
              className="font-syne text-4xl md:text-5xl font-bold leading-[1.05]" />
          </div>
        </Reveal>
        <Reveal delay={0.1} className="col-span-4 md:col-span-1 row-span-2">
          <div className={`${cell} h-full bg-white/[0.04] flex flex-col justify-center items-center text-center`}>
            <Count to={999} prefix="₹" className="font-syne text-4xl font-bold" />
            <p className="text-xs text-white/40 mt-1">for one year</p>
          </div>
        </Reveal>
        {[
          { c: "col-span-2", v: "40/day", l: "at full ramp", I: TrendingUp },
          { c: "col-span-2", v: "7 days", l: "no-questions refund", I: Check },
          { c: "col-span-2 row-span-2", v: "Your Gmail", l: "we never see the password", I: Mail, big: true },
          { c: "col-span-1", v: "25", l: "seats", I: Users },
          { c: "col-span-1", v: "0", l: "spam", I: Zap },
          { c: "col-span-2", v: "Verified", l: "every recruiter checked", I: Briefcase },
        ].map((b, i) => (
          <Reveal key={i} delay={0.15 + i * 0.05} className={b.c}>
            <div className={`${cell} h-full bg-white/[0.03] hover:border-primary/50 transition-colors duration-200 flex flex-col justify-center`}>
              <b.I size={15} className="text-primary mb-2" />
              <p className={`font-syne font-bold ${b.big ? "text-2xl" : "text-lg"}`}>{b.v}</p>
              <p className="text-[11px] text-white/40">{b.l}</p>
            </div>
          </Reveal>
        ))}
        <Reveal delay={0.5} className="col-span-4">
          <div className={`${cell} bg-primary/15 flex items-center justify-between gap-4 flex-wrap`}>
            <p className="font-syne text-xl font-bold">Your placement year starts now.</p><Cta />
          </div>
        </Reveal>
      </section>
    </Wrap>
  );
}

/* ═══════════ 5 · SPLIT FIXED ═══════════ */
export function C5() {
  return (
    <Wrap>
      <div className="grid md:grid-cols-2">
        <div className="md:sticky md:top-0 md:h-screen flex flex-col justify-center px-8 md:px-14 py-20 bg-gradient-to-br from-primary/18 to-transparent">
          <p className="text-[10px] uppercase tracking-[3px] text-primary mb-5">Built for your placement year</p>
          <Words text="Get seen by real recruiters." accentFrom={3}
            className="font-syne text-4xl md:text-5xl font-bold tracking-tight leading-[1.06] mb-5" />
          <Reveal delay={0.5}><p className="text-white/50 mb-8">One payment. Twelve months. Nothing renews.</p></Reveal>
          <Reveal delay={0.6}><div><Cta /></div></Reveal>
        </div>
        <div className="px-8 md:px-12 py-20 space-y-4">
          {[...FEATS, ...STEPS.map((s) => ({ t: s.t, d: s.d }))].map((f, i) => (
            <Reveal key={i} delay={0.04 * i}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-primary/40 transition-colors duration-200">
                <p className="font-syne text-lg font-bold mb-1.5">{f.t}</p>
                <p className="text-sm text-white/50 leading-relaxed">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Wrap>
  );
}

/* ═══════════ 6 · KINETIC TYPE ═══════════ */
export function C6() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["-12%", "6%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["8%", "-10%"]);
  return (
    <Wrap>
      <section className="h-screen flex flex-col justify-center overflow-hidden">
        <MaskLines lines={["GET", "SEEN"]} accentIdx={1}
          className="font-syne text-[22vw] md:text-[16vw] font-bold leading-[0.82] tracking-tighter px-6" />
        <Reveal delay={0.6} className="px-6 mt-8">
          <p className="text-white/50 max-w-md">Cold outreach to real recruiters, from your own inbox. ₹999 for a placement year.</p>
        </Reveal>
        <Reveal delay={0.75} className="px-6 mt-7"><div><Cta /></div></Reveal>
      </section>
      <section ref={ref} className="py-24 overflow-hidden space-y-3">
        <motion.p style={reduce ? {} : { x: x1 }} className="font-syne text-[10vw] font-bold leading-none whitespace-nowrap text-white/8">
          OUTREACH · MATCHED JOBS · AUTOFILL · MENTORSHIP ·
        </motion.p>
        <motion.p style={reduce ? {} : { x: x2 }} className="font-syne text-[10vw] font-bold leading-none whitespace-nowrap text-primary/20">
          ₹999 · TWELVE MONTHS · NO SUBSCRIPTION ·
        </motion.p>
      </section>
      <section className="max-w-3xl mx-auto px-6 pb-24 space-y-10">
        {FEATS.map((f, i) => (
          <Reveal key={f.t} delay={i * 0.06}>
            <div className="border-t border-white/10 pt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <p className="font-syne text-3xl md:text-4xl font-bold">{f.t}</p>
              <p className="text-sm text-white/45 flex-1 min-w-[220px]">{f.d}</p>
            </div>
          </Reveal>
        ))}
      </section>
    </Wrap>
  );
}

/* ═══════════ 7 · CARD PEEL ═══════════ */
export function C7() {
  const reduce = useReducedMotion();
  const cards = [
    { t: "We find the recruiter", d: "Verified, hiring now, matched to your profile.", I: Briefcase, tint: "from-primary/25" },
    { t: "We write the email", d: "Personalised from your resume. Never a template.", I: Mail, tint: "from-accent-light/25" },
    { t: "It sends as you", d: "From your own Gmail. Replies come straight to you.", I: Zap, tint: "from-primary/25" },
  ];
  return (
    <Wrap>
      <section className="h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <Words text="Three things happen." accentFrom={2}
          className="font-syne text-5xl md:text-7xl font-bold tracking-tight mb-5" />
        <Reveal delay={0.4}><p className="text-white/50">Scroll — each one stacks on the last.</p></Reveal>
      </section>
      {cards.map((c, i) => (
        <section key={c.t} className="h-screen sticky top-0 flex items-center justify-center px-6" style={{ zIndex: i + 1 }}>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 60, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-25%" }} transition={{ duration: 0.6, ease: EASE_OUT }}
            className={`w-full max-w-2xl rounded-[2rem] border border-white/12 bg-gradient-to-br ${c.tint} to-surface-page p-12 shadow-2xl`}
            style={{ marginTop: i * 26 }}>
            <c.I size={26} className="text-primary mb-6" />
            <p className="font-syne text-3xl md:text-4xl font-bold mb-3">{c.t}</p>
            <p className="text-white/55 text-lg leading-relaxed">{c.d}</p>
          </motion.div>
        </section>
      ))}
      <section className="h-[70vh] flex flex-col items-center justify-center text-center px-6 relative z-10 bg-surface-page">
        <Reveal><p className="font-syne text-4xl font-bold mb-6">₹999 for twelve months.</p></Reveal>
        <Reveal delay={0.12}><Cta /></Reveal>
      </section>
    </Wrap>
  );
}

/* ═══════════ 8 · EDITORIAL ═══════════ */
export function C8() {
  return (
    <Wrap>
      <section className="max-w-5xl mx-auto px-6 py-20">
        <Reveal><p className="text-[10px] uppercase tracking-[4px] text-primary mb-10">Issue 01 — The visibility problem</p></Reveal>
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 md:col-span-8">
            <MaskLines lines={["Most resumes are", "never read by a", "human being."]} accentIdx={2}
              className="font-syne text-4xl md:text-6xl font-bold leading-[1.02] tracking-tight" />
          </div>
          <Reveal delay={0.4} className="col-span-12 md:col-span-4 md:border-l border-white/15 md:pl-6 md:pt-3">
            <p className="text-sm text-white/50 leading-relaxed">
              An opening receives 250 applications. A recruiter reads perhaps twelve. The other 238
              were never in a competition — they were in a queue nobody reached the end of.
            </p>
          </Reveal>
          <Reveal delay={0.55} className="col-span-12 md:col-span-6 md:col-start-2 mt-8">
            <div className="rounded-2xl bg-primary/12 border border-primary/25 p-8">
              <p className="font-syne text-2xl font-bold mb-2">So do not apply.</p>
              <p className="text-white/55">Write to the person doing the hiring. That is the entire idea.</p>
            </div>
          </Reveal>
          <Reveal delay={0.7} className="col-span-12 md:col-span-4 md:col-start-8 mt-8">
            <p className="font-syne text-6xl font-bold text-primary/25 leading-none mb-2"><Count to={250} suffix="+" /></p>
            <p className="text-xs text-white/40">applications per opening</p>
          </Reveal>
        </div>
        <div className="mt-20 grid md:grid-cols-2 gap-x-12 gap-y-10">
          {FEATS.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.07}>
              <p className="font-syne text-2xl font-bold mb-2 border-b border-white/12 pb-2">{f.t}</p>
              <p className="text-sm text-white/50 leading-relaxed">{f.d}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2} className="mt-16 text-center"><div><Cta /></div></Reveal>
      </section>
    </Wrap>
  );
}

/* ═══════════ 9 · BRUTALIST ═══════════ */
export function C9() {
  const reduce = useReducedMotion();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-32 font-mono">
      <section className="max-w-4xl mx-auto px-6 py-20">
        <Words text="GET SEEN." accentFrom={9}
          className="font-syne text-6xl md:text-8xl font-bold tracking-tighter mb-8" />
        <div className="border-2 border-primary bg-black p-6 shadow-[10px_10px_0_0_var(--brand-primary)] mb-10">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/15">
            <Terminal size={14} className="text-primary" /><span className="text-xs text-white/50">outmail — zsh</span>
          </div>
          {["$ outmail init --resume ./resume.pdf", "  parsed · 12 skills, 3 projects",
            "$ outmail find --role 'backend intern'", "  matched 24 recruiters at 19 companies",
            "$ outmail send --approve", "  sent 5 · queued 19 · from you@gmail.com"].map((l, i) => (
            <motion.p key={i} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.22, duration: 0.15 }}
              className={`text-xs md:text-sm mb-1.5 ${l.startsWith("$") ? "text-white" : "text-primary/85"}`}>{l}</motion.p>
          ))}
          <motion.span animate={reduce ? {} : { opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}
            className="inline-block w-2.5 h-4 bg-primary mt-1" />
        </div>
        <div className="grid sm:grid-cols-2 gap-5 mb-12">
          {FEATS.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.06}>
              <div className="border-2 border-white bg-black p-5 shadow-[6px_6px_0_0_var(--brand-primary)] h-full">
                <p className="font-syne text-lg font-bold mb-1.5 uppercase">{f.t}</p>
                <p className="text-xs text-white/60 leading-relaxed">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <button className="border-2 border-white bg-white text-black text-sm font-bold px-7 py-3.5 shadow-[6px_6px_0_0_var(--brand-primary)] hover:shadow-[3px_3px_0_0_var(--brand-primary)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-150">
            GET OUTMAIL
          </button>
          <span className="text-sm text-white/50">₹999 / YEAR · 7-DAY REFUND</span>
        </div>
      </section>
    </div>
  );
}

/* ═══════════ 10 · LIVE PRODUCT ═══════════ */
export function C10() {
  const reduce = useReducedMotion();
  return (
    <Wrap>
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <MaskLines lines={["This is the product,", "running right now."]} accentIdx={1}
            className="font-syne text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-5" />
          <Reveal delay={0.45}><p className="text-white/50">Not a screenshot. Not a mockup.</p></Reveal>
        </div>
        <Reveal delay={0.2}>
          <Tilt max={5} z={20} className="rounded-3xl border border-white/12 bg-surface-panel overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/8">
              <div className="flex gap-1.5">{["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}</div>
              <p className="text-xs text-white/35 ml-3">outmail.in/dashboard</p>
              <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] text-emerald-300">
                <motion.span className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  animate={reduce ? {} : { opacity: [1, 0.25, 1] }} transition={{ duration: 2, repeat: Infinity }} />live
              </span>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[{ l: "Sent this week", v: 18, I: Mail }, { l: "Replies", v: 3, I: TrendingUp },
                { l: "Queued", v: 4, I: Clock }, { l: "Companies", v: 19, I: Briefcase }].map((s, i) => (
                <Reveal key={s.l} delay={0.3 + i * 0.08}>
                  <div className="rounded-2xl bg-white/[0.04] p-4">
                    <s.I size={14} className="text-primary mb-2.5" />
                    <p className="font-syne text-2xl font-bold"><Count to={s.v} /></p>
                    <p className="text-[11px] text-white/40">{s.l}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between text-xs text-white/40 mb-2">
                <span>Weekly send cap</span><span>18 of 29</span>
              </div>
              <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-primary to-accent-light"
                  initial={reduce ? false : { width: 0 }} whileInView={{ width: "62%" }} viewport={{ once: true }}
                  transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.5 }} />
              </div>
              <div className="flex gap-2 mt-4">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">18 sent</span>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">4 queued</span>
              </div>
            </div>
          </Tilt>
        </Reveal>
        <div className="mt-16 grid sm:grid-cols-2 gap-4">
          {FEATS.map((f, i) => { const I = ICONS[i]; return (
            <Reveal key={f.t} delay={i * 0.07}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 h-full">
                <I size={18} className="text-primary mb-3" />
                <p className="font-syne text-lg font-bold mb-1.5">{f.t}</p>
                <p className="text-sm text-white/50 leading-relaxed">{f.d}</p>
              </div>
            </Reveal>); })}
        </div>
        <Reveal delay={0.2} className="mt-14 text-center"><div><Cta /></div></Reveal>
      </section>
    </Wrap>
  );
}

export const RENDERERS = { 1: C1, 2: C2, 3: C3, 4: C4, 5: C5, 6: C6, 7: C7, 8: C8, 9: C9, 10: C10 };
