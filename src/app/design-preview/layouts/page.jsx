"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Briefcase, Zap, Users, ArrowRight, ArrowLeft, Check, Eye, Terminal, Clock, TrendingUp } from "lucide-react";

const SceneNetwork = dynamic(() => import("../landing/scenes").then((m) => m.SceneNetwork), { ssr: false });
const SceneBlob = dynamic(() => import("../landing/scenes").then((m) => m.SceneBlob), { ssr: false });

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * LANDING LAYOUTS — ten complete structures, not ten skins.
 *
 * These differ in how the PAGE IS BUILT: how you move through it, what is fixed
 * and what scrolls, whether content is a column or a grid or a horizontal track.
 * Animation follows structure, so choosing here decides most of the motion.
 *
 * Patterns are from the ui-ux-pro-max landing.csv (34 in the catalogue) — the
 * ones worth building for a product like this.
 */

const EASE_OUT = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

/* Frame every layout in a fixed-height scroller so ten of them fit on one page. */
function Frame({ children, tall }) {
  return (
    <div className={`relative rounded-2xl border border-white/10 bg-black/40 overflow-y-auto overflow-x-hidden ${tall ? "h-[560px]" : "h-[440px]"}`}>
      {children}
    </div>
  );
}

function Layout({ n, name, pattern, blurb, pros, cons, children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="mb-14">
      <div className="flex items-start gap-4 mb-3">
        <span className="font-syne text-3xl font-bold text-primary/40 leading-none shrink-0">{n}</span>
        <div className="flex-1">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="font-syne text-2xl font-bold">{name}</h2>
            <span className="text-[10px] uppercase tracking-[2px] text-primary/70 border border-primary/25 rounded-full px-2.5 py-0.5">{pattern}</span>
          </div>
          <p className="text-sm text-white/45 mt-1.5 max-w-2xl leading-relaxed">{blurb}</p>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="text-xs text-white/40 hover:text-primary shrink-0">{open ? "hide" : "show"}</button>
      </div>
      {open && <Frame tall={n === "04" || n === "06"}>{children}</Frame>}
      <div className="grid sm:grid-cols-2 gap-3 mt-3">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3.5">
          <p className="text-[10px] uppercase tracking-[2px] text-emerald-300/80 mb-1.5">Works because</p>
          <p className="text-xs text-white/55 leading-relaxed">{pros}</p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-3.5">
          <p className="text-[10px] uppercase tracking-[2px] text-amber-300/80 mb-1.5">Costs you</p>
          <p className="text-xs text-white/55 leading-relaxed">{cons}</p>
        </div>
      </div>
    </section>
  );
}

const FEATS = [
  { icon: Mail, t: "Cold outreach", d: "From your own Gmail." },
  { icon: Briefcase, t: "Matched jobs", d: "Scored against your resume." },
  { icon: Zap, t: "Autofill", d: "Applications in one click." },
  { icon: Users, t: "Mentorship", d: "Bi-weekly, 25 seats." },
];

/* ============ 01 · CLASSIC STACK ============ */
function LayoutClassic({ reduce }) {
  return (
    <div className="p-8">
      <div className="text-center max-w-xl mx-auto mb-10">
        <p className="text-[10px] uppercase tracking-[3px] text-primary mb-3">Placement year</p>
        <h3 className="font-syne text-3xl font-bold mb-3">Get seen by real recruiters.</h3>
        <p className="text-sm text-white/50 mb-5">One payment. Twelve months.</p>
        <button className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-full">Get Outmail</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {FEATS.map((f, i) => (
          <motion.div key={f.t} initial={reduce ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: EASE_OUT }}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <f.icon size={16} className="text-primary mb-2" />
            <p className="text-sm font-semibold">{f.t}</p>
            <p className="text-xs text-white/45">{f.d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============ 02 · BENTO GRID ============ */
function LayoutBento({ reduce }) {
  const cell = "rounded-2xl border border-white/10 p-5 relative overflow-hidden";
  return (
    <div className="p-6 grid grid-cols-4 auto-rows-[92px] gap-3">
      <motion.div initial={reduce ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease: EASE_OUT }}
        className={`${cell} col-span-4 row-span-2 bg-gradient-to-br from-primary/25 via-primary/5 to-transparent flex flex-col justify-center`}>
        <h3 className="font-syne text-3xl font-bold leading-tight">Get seen by<br /><span className="text-accent-light">real recruiters.</span></h3>
      </motion.div>
      {[
        { c: "col-span-2 row-span-2", label: "₹999", sub: "for one year", big: true },
        { c: "col-span-2", label: "40/day", sub: "at full ramp" },
        { c: "col-span-1", label: "25", sub: "seats" },
        { c: "col-span-1", label: "7d", sub: "refund" },
        { c: "col-span-2 row-span-2", label: "Your Gmail", sub: "not ours", icon: Mail },
        { c: "col-span-2", label: "Verified", sub: "recruiters only", icon: Check },
        { c: "col-span-2", label: "Matched", sub: "to your resume", icon: Briefcase },
      ].map((b, i) => (
        <motion.div key={i} initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: EASE_OUT }}
          className={`${cell} ${b.c} bg-white/[0.03] hover:border-primary/50 transition-colors duration-200 flex flex-col justify-center`}>
          {b.icon && <b.icon size={15} className="text-primary mb-1.5" />}
          <p className={`font-syne font-bold ${b.big ? "text-3xl" : "text-lg"}`}>{b.label}</p>
          <p className="text-[11px] text-white/40">{b.sub}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ============ 03 · HORIZONTAL JOURNEY ============ */
function LayoutHorizontal({ reduce }) {
  const wrap = useRef(null);
  const { scrollYProgress } = useScroll({ container: wrap });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-72%"]);
  const panels = [
    { n: "01", t: "You upload a resume", d: "Once. That is the whole setup." },
    { n: "02", t: "We find the people", d: "Verified recruiters, matched to what you can do." },
    { n: "03", t: "We write the emails", d: "Personalised, not templated." },
    { n: "04", t: "You approve", d: "Or switch that off and let it run." },
    { n: "05", t: "It sends as you", d: "From your inbox. Replies come to you." },
  ];
  return (
    <div ref={wrap} className="h-full overflow-y-auto">
      <div className="h-[220%] relative">
        <div className="sticky top-0 h-[440px] flex items-center overflow-hidden">
          <motion.div style={reduce ? {} : { x }} className="flex gap-5 px-8">
            {panels.map((p) => (
              <div key={p.n} className="w-[300px] shrink-0 rounded-2xl border border-white/10 bg-gradient-to-br from-primary/12 to-transparent p-7">
                <p className="font-syne text-5xl font-bold text-primary/30 mb-4">{p.n}</p>
                <p className="font-syne text-xl font-bold mb-2">{p.t}</p>
                <p className="text-sm text-white/50 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </motion.div>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[2px] text-white/30">Scroll inside this frame ↓ — the track moves sideways</p>
        </div>
      </div>
    </div>
  );
}

/* ============ 04 · SCROLL STORYTELLING ============ */
function LayoutStory({ reduce }) {
  const wrap = useRef(null);
  const { scrollYProgress } = useScroll({ container: wrap });
  const chapters = [
    { k: "problem", t: "250 applications per opening.", d: "Yours is one of them.", tint: "from-red-500/20" },
    { k: "why", t: "Nobody reads the pile.", d: "Referrals and direct contact do the work.", tint: "from-amber-500/20" },
    { k: "fix", t: "So write to a person instead.", d: "From your own inbox, to someone who is hiring.", tint: "from-primary/25" },
  ];
  const idx = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 0, 1, 2]);
  const [active, setActive] = useState(0);
  useLayoutEffect(() => idx.on("change", (v) => setActive(Math.round(v))), [idx]);
  return (
    <div ref={wrap} className="h-full overflow-y-auto">
      <div className="h-[300%] relative">
        <div className={`sticky top-0 h-[560px] flex items-center justify-center bg-gradient-to-b ${chapters[active].tint} to-transparent transition-colors duration-700`}>
          <AnimatePresence mode="wait">
            <motion.div key={chapters[active].k} className="text-center px-10"
              initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}>
              <p className="font-syne text-3xl md:text-4xl font-bold mb-3 max-w-lg">{chapters[active].t}</p>
              <p className="text-white/50">{chapters[active].d}</p>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-5 flex gap-2">
            {chapters.map((c, i) => <div key={c.k} className={`h-1 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-primary" : "w-4 bg-white/15"}`} />)}
          </div>
          <p className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[2px] text-white/30">Scroll inside — chapters replace each other in place</p>
        </div>
      </div>
    </div>
  );
}

/* ============ 05 · SPLIT SCREEN ============ */
function LayoutSplit({ reduce }) {
  return (
    <div className="grid md:grid-cols-2 h-full">
      <div className="sticky top-0 h-full flex flex-col justify-center p-8 bg-gradient-to-br from-primary/15 to-transparent">
        <p className="text-[10px] uppercase tracking-[3px] text-primary mb-3">Placement year</p>
        <h3 className="font-syne text-3xl font-bold leading-tight mb-3">Get seen by real recruiters.</h3>
        <p className="text-sm text-white/50 mb-5">One payment. Twelve months.</p>
        <button className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-full self-start">Get Outmail</button>
        <p className="text-[10px] uppercase tracking-[2px] text-white/25 mt-6">Fixed ← → scrolls</p>
      </div>
      <div className="overflow-y-auto p-6 space-y-3">
        {[...FEATS, ...FEATS].map((f, i) => (
          <motion.div key={i} initial={reduce ? false : { opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <f.icon size={16} className="text-primary mb-2" />
            <p className="text-sm font-semibold">{f.t}</p>
            <p className="text-xs text-white/45">{f.d}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============ 06 · FULL-BLEED 3D IMMERSIVE ============ */
function LayoutImmersive({ reduce }) {
  return (
    <div className="relative h-full">
      {!reduce && <SceneNetwork />}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-10">
        <h3 className="font-syne text-4xl md:text-5xl font-bold leading-tight mb-4">
          You, connected to<br /><span className="bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent">every recruiter hiring.</span>
        </h3>
        <p className="text-sm text-white/50 mb-6 max-w-sm">No nav, no cards, no scroll hints. Just the idea.</p>
        <button className="bg-primary text-white text-sm font-semibold px-7 py-3 rounded-full">Get Outmail</button>
        <p className="absolute bottom-5 text-[10px] uppercase tracking-[2px] text-white/25">Everything else lives below the fold</p>
      </div>
    </div>
  );
}

/* ============ 07 · BEFORE / AFTER ============ */
function LayoutBeforeAfter() {
  const [pos, setPos] = useState(50);
  return (
    <div className="p-8 h-full flex flex-col justify-center">
      <h3 className="font-syne text-2xl font-bold text-center mb-6">Drag to see the difference</h3>
      <div className="relative rounded-2xl overflow-hidden border border-white/12 h-[220px] select-none">
        <div className="absolute inset-0 bg-white/[0.03] p-6 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-[2px] text-white/35 mb-3">Without Outmail</p>
          <div className="flex items-end gap-1 h-16">
            {Array.from({ length: 26 }).map((_, i) => <div key={i} className="w-2 rounded-t bg-white/12" style={{ height: `${14 + (i % 6) * 9}px` }} />)}
          </div>
          <p className="text-xs text-white/40 mt-3">One of 250 in a pile</p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-transparent p-6 flex flex-col justify-center"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
          <p className="text-[10px] uppercase tracking-[2px] text-primary mb-3">With Outmail</p>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent-light" />
            <div><p className="text-sm font-semibold">Priya Sharma</p><p className="text-[11px] text-white/45">replied in 2 days</p></div>
          </div>
          <p className="text-xs text-white/50 mt-3">A person, who wrote back</p>
        </div>
        <div className="absolute inset-y-0 w-0.5 bg-primary" style={{ left: `${pos}%` }} />
        <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(+e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize" />
      </div>
    </div>
  );
}

/* ============ 08 · LIVE PRODUCT ============ */
function LayoutLive({ reduce }) {
  return (
    <div className="p-7">
      <div className="text-center mb-6">
        <h3 className="font-syne text-2xl font-bold mb-2">This is running right now.</h3>
        <p className="text-sm text-white/45">The product, not a screenshot of it.</p>
      </div>
      <div className="rounded-2xl border border-white/12 bg-surface-panel overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/8">
          <div className="flex gap-1.5">{["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}</div>
          <p className="text-[11px] text-white/35 ml-2">outmail.in/dashboard</p>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] text-emerald-300">
            <motion.span className="w-1.5 h-1.5 rounded-full bg-emerald-400" animate={reduce ? {} : { opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />live
          </span>
        </div>
        <div className="p-5 grid grid-cols-3 gap-3">
          {[{ l: "Sent this week", v: "18", i: Mail }, { l: "Replies", v: "3", i: TrendingUp }, { l: "Queued", v: "4", i: Clock }].map((s, i) => (
            <motion.div key={s.l} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-xl bg-white/[0.04] p-3.5">
              <s.i size={13} className="text-primary mb-2" />
              <p className="font-syne text-xl font-bold">{s.v}</p>
              <p className="text-[10px] text-white/40">{s.l}</p>
            </motion.div>
          ))}
        </div>
        <div className="px-5 pb-5">
          <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-primary to-accent-light"
              initial={reduce ? false : { width: 0 }} animate={{ width: "62%" }} transition={{ duration: 1, ease: EASE_OUT }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ 09 · EDITORIAL ============ */
function LayoutEditorial({ reduce }) {
  return (
    <div className="p-8">
      <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
        className="text-[10px] uppercase tracking-[4px] text-primary mb-6">Issue 01 — The visibility problem</motion.p>
      <div className="grid grid-cols-12 gap-4 items-start">
        <motion.h3 initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE_OUT }}
          className="col-span-8 font-syne text-4xl font-bold leading-[1.02] tracking-tight">
          Most resumes are never<br />read by a<br /><span className="italic text-accent-light">human being.</span>
        </motion.h3>
        <motion.div initial={reduce ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
          className="col-span-4 border-l border-white/15 pl-4 pt-2">
          <p className="text-xs text-white/50 leading-relaxed">An opening gets 250 applications. A recruiter reads perhaps twelve. The other 238 were never a competition.</p>
        </motion.div>
        <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="col-span-5 col-start-2 mt-4 rounded-xl bg-primary/12 border border-primary/25 p-5">
          <p className="font-syne text-lg font-bold mb-1">So don&apos;t apply.</p>
          <p className="text-xs text-white/55">Write to the person doing the hiring.</p>
        </motion.div>
        <motion.p initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="col-span-4 col-start-8 mt-4 text-[11px] text-white/35 leading-relaxed">
          Outmail sends personalised emails to verified recruiters from your own Gmail. ₹999 for a year.
        </motion.p>
      </div>
    </div>
  );
}

/* ============ 10 · TERMINAL / BRUTALIST ============ */
function LayoutTerminal({ reduce }) {
  const lines = [
    "$ outmail init --resume ./resume.pdf",
    "  parsed  ·  12 skills, 3 projects",
    "$ outmail find --role 'backend intern'",
    "  matched 24 recruiters at 19 companies",
    "$ outmail send --approve",
    "  sent 5 · queued 19 · from you@gmail.com",
  ];
  return (
    <div className="p-8 font-mono">
      <div className="rounded-xl border-2 border-primary bg-black p-6 shadow-[8px_8px_0_0_var(--brand-primary)]">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
          <Terminal size={14} className="text-primary" />
          <span className="text-xs text-white/50">outmail — zsh</span>
        </div>
        {lines.map((l, i) => (
          <motion.p key={i} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.25 * i, duration: 0.2 }}
            className={`text-xs mb-1.5 ${l.startsWith("$") ? "text-white" : "text-primary/80"}`}>{l}</motion.p>
        ))}
        <motion.span animate={reduce ? {} : { opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}
          className="inline-block w-2 h-3.5 bg-primary mt-1" />
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button className="border-2 border-white bg-white text-black text-xs font-bold px-5 py-2.5 shadow-[4px_4px_0_0_var(--brand-primary)]">GET OUTMAIL</button>
        <span className="text-xs text-white/40">₹999 / year</span>
      </div>
    </div>
  );
}

export default function Layouts() {
  const reduce = useReducedMotion();
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-[4px] text-primary mb-3">Landing page · ten structures</p>
        <h1 className="font-syne text-4xl md:text-5xl font-bold tracking-tight mb-4">Pick the shape</h1>
        <p className="text-white/55 max-w-2xl leading-relaxed mb-3">
          These are not ten skins of the same page — they differ in how the page is BUILT: what is
          fixed and what moves, whether content is a column, a grid or a sideways track, and how
          you travel through it. Choosing here decides most of the motion.
        </p>
        <p className="text-sm text-white/40 max-w-2xl leading-relaxed mb-12">
          Several need you to scroll <em>inside</em> the frame — the hint at the bottom of each says so.
          Patterns are named from the catalogue&apos;s 34 landing structures.
        </p>

        <Layout n="01" name="Classic stack" pattern="Hero + Features + CTA"
          blurb="What you have now. Vertical column, section after section."
          pros="Everyone knows how to read it. Fastest to build, easiest to maintain, never confuses anyone, and works identically on mobile."
          cons="Completely forgettable. This is the shape of every SaaS landing page, so it signals nothing about whether you can build."
        ><LayoutClassic reduce={reduce} /></Layout>

        <Layout n="02" name="Bento grid" pattern="Bento Grid Showcase"
          blurb="Asymmetric tiles of different sizes. Apple's product pages, Linear's marketing."
          pros="Dense without feeling cluttered, and it lets one tile be huge while another is a single number. Reads as considered and modern, and it is genuinely fun to scan."
          cons="Needs real content in every tile or the gaps show. Hard to get right on mobile, where it collapses to a column and loses the point."
        ><LayoutBento reduce={reduce} /></Layout>

        <Layout n="03" name="Horizontal journey" pattern="Horizontal Scroll Journey"
          blurb="You scroll down, the content moves sideways. The section pins while a track slides past."
          pros="Immediately memorable — most people have seen it maybe twice. Perfect for a sequence, which is exactly what the outreach flow is."
          cons="Hijacks scroll, which some people hate. Genuinely awkward on touch. Use for ONE section, never the whole page."
        ><LayoutHorizontal reduce={reduce} /></Layout>

        <Layout n="04" name="Scroll storytelling" pattern="Scroll-Triggered Storytelling"
          blurb="A pinned frame where chapters replace each other as you scroll. The background shifts with the argument."
          pros="Best structure here for making someone FEEL the problem before you sell. Problem, why, fix — one idea at a time with nothing else competing."
          cons="Slow. You are asking for real attention before showing the product, which some visitors will not give. Needs the writing to be genuinely good."
        ><LayoutStory reduce={reduce} /></Layout>

        <Layout n="05" name="Split screen" pattern="Hero-Centric + Feature-Rich"
          blurb="Pitch fixed on the left, content scrolling on the right."
          pros="The CTA never leaves the screen, which is the strongest conversion property on this page. Feels like an app rather than a brochure."
          cons="Halves your headline width. Collapses to a normal stack on mobile, so the effect is desktop-only — and most of your students are on phones."
        ><LayoutSplit reduce={reduce} /></Layout>

        <Layout n="06" name="Full-bleed 3D" pattern="Immersive / Interactive Experience"
          blurb="The 3D scene IS the first screen. No cards, no nav noise — one idea and one button."
          pros="Maximum 'real engineers built this' in the first second, which is the exact four-second problem you described. The network scene also happens to be a picture of the product."
          cons="150KB and a render loop before anyone reads a word. Says nothing concrete — everything that explains the product is below the fold and some people never scroll."
        ><LayoutImmersive reduce={reduce} /></Layout>

        <Layout n="07" name="Before / after" pattern="Before-After Transformation"
          blurb="A draggable divider between the pile of 250 resumes and a recruiter who replied."
          pros="Interactive proof rather than a claim. Dragging it makes the reader do the comparison themselves, which is far more persuasive than being told."
          cons="One trick. It carries a section beautifully and cannot carry a page, and it needs the two states to be visually obvious at a glance."
        ><LayoutBeforeAfter /></Layout>

        <Layout n="08" name="Live product" pattern="Real-Time / Operations Landing"
          blurb="The real dashboard, running, on the landing page. Not a screenshot."
          pros="The most credible thing you can show. It answers 'does this actually work' before anyone asks, and it is the only option here that is impossible to fake."
          cons="Needs real data to be impressive, and yours is empty today — CompanyEmail is 0 in production. This becomes the best option on this page the moment the pool is populated."
        ><LayoutLive reduce={reduce} /></Layout>

        <Layout n="09" name="Editorial" pattern="Storytelling / Magazine"
          blurb="Broken grid, big type, asymmetric columns. A magazine spread, not a landing page."
          pros="Nothing else in this market looks like this. Signals taste and confidence, and it suits an argument-led pitch — which yours is, because the category needs explaining."
          cons="Type-heavy, and you said you wanted less content, not more. Also the hardest to keep coherent on mobile, where a broken grid just becomes a column."
        ><LayoutEditorial reduce={reduce} /></Layout>

        <Layout n="10" name="Terminal / brutalist" pattern="Neubrutalism"
          blurb="Hard borders, offset shadows, monospace, a fake CLI showing the product working."
          pros="Instant credibility with technical students, and cheap to build — no images, no 3D, no render loop. Very Gen Z, and it is the fastest-loading option here by a distance."
          cons="Alienates non-technical students, and a CLI is not how anyone uses Outmail — it would be a lie about the product. Ages fast, too."
        ><LayoutTerminal reduce={reduce} /></Layout>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
          <p className="text-sm text-white/70 mb-3 font-medium">You do not have to pick just one</p>
          <p className="text-sm text-white/50 leading-relaxed mb-3">
            The strongest landing pages combine two or three of these. A plausible Outmail page:
          </p>
          <ul className="text-sm text-white/50 space-y-2 leading-relaxed list-disc pl-5">
            <li><strong className="text-white/70">Full-bleed 3D</strong> for the hero — the four-second problem</li>
            <li><strong className="text-white/70">Scroll storytelling</strong> for the visibility argument — make them feel it</li>
            <li><strong className="text-white/70">Horizontal journey</strong> for how it works — it is a sequence</li>
            <li><strong className="text-white/70">Bento grid</strong> for features and numbers — dense, scannable</li>
            <li><strong className="text-white/70">Live product</strong> once the recruiter pool exists</li>
          </ul>
          <p className="text-sm text-white/40 leading-relaxed mt-4">
            Tell me which shapes you want and in what order, and I will assemble the real page from them.
          </p>
        </div>
      </div>
    </div>
  );
}
