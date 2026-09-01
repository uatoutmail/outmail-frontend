"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Briefcase, Zap, Users, ArrowRight, ArrowLeft, Check, RotateCw, MousePointerClick, Eye } from "lucide-react";

const SceneShapes  = dynamic(() => import("./scenes").then((m) => m.SceneShapes),  { ssr: false });
const SceneBlob    = dynamic(() => import("./scenes").then((m) => m.SceneBlob),    { ssr: false });
const SceneNetwork = dynamic(() => import("./scenes").then((m) => m.SceneNetwork), { ssr: false });

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * LANDING PAGE — options for EVERY real section.
 *
 * Mapped to what src/app/page.js actually renders: Hero, Features, Partners,
 * CtaOne, AboutUs, Testimonials, CTA.
 *
 * Feedback applied:
 *   3D tilt      — entrance was laggy. The scale-in is gone; it now fades and
 *                  the tilt spring is stiffer, so it feels immediate.
 *   Live deck    — dropped.
 *   Morph steps  — manual next/prev, no auto-advance.
 *   Gradient sweep + glow — kept as the CTA.
 */

const EASE_OUT = [0.16, 1, 0.3, 1];
const EASE_BACK = [0.34, 1.56, 0.64, 1];

function Section({ n, title, blurb, options, children }) {
  const [pick, setPick] = useState(0);
  const [replay, setReplay] = useState(0);
  return (
    <section className="mb-20">
      <div className="flex items-start gap-4 mb-4">
        <span className="font-syne text-3xl font-bold text-primary/40 leading-none">{n}</span>
        <div>
          <h2 className="font-syne text-2xl font-bold">{title}</h2>
          <p className="text-sm text-white/45 mt-1 max-w-2xl leading-relaxed">{blurb}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {options.map((o, i) => (
          <button key={o.name} onClick={() => { setPick(i); setReplay((r) => r + 1); }}
            className={`text-xs px-4 py-2 rounded-full border transition-colors duration-200 ${
              pick === i ? "border-primary bg-primary/15 text-white" : "border-white/12 text-white/50 hover:border-white/30"}`}>
            {o.name}{o.lib && <span className="ml-1.5 opacity-50">· {o.lib}</span>}
          </button>
        ))}
        <button onClick={() => setReplay((r) => r + 1)} className="ml-1 text-white/35 hover:text-primary transition-colors"><RotateCw size={14} /></button>
      </div>
      <div className="relative rounded-3xl border border-white/10 bg-black/30 p-8 md:p-12 overflow-hidden min-h-[400px] flex items-center">
        <div key={`${pick}-${replay}`} className="w-full">{children(pick)}</div>
      </div>
      <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.02] p-4">
        <p className="text-xs text-primary font-mono mb-1.5">{options[pick].spec}</p>
        <p className="text-sm text-white/55 leading-relaxed">{options[pick].note}</p>
      </div>
    </section>
  );
}

const HERO_COPY = (
  <>
    <p className="text-xs uppercase tracking-[3px] text-primary mb-5">Built for your placement year</p>
    <h1 className="font-syne text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
      Get seen by <span className="bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent">real recruiters.</span>
    </h1>
    <p className="text-white/50 max-w-lg">One payment. Twelve months. Less than a month of LinkedIn Premium.</p>
  </>
);

/* ---- 1a. tilt, FIXED: no scale-in, stiffer spring ---- */
function HeroTilt({ reduce }) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const cfg = { stiffness: 260, damping: 26, mass: 0.5 };
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), cfg);
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), cfg);
  return (
    <div style={{ perspective: 1100 }}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5); }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}>
      {/* fade only — the scale-in was what read as lag */}
      <motion.div style={reduce ? {} : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "linear" }}>
        <div style={{ transform: "translateZ(55px)" }}>{HERO_COPY}</div>
        <p className="text-[10px] uppercase tracking-[2px] text-white/25 mt-6">Move your cursor · no entrance animation, instant tilt</p>
      </motion.div>
    </div>
  );
}

function HeroShapes({ reduce }) {
  return (
    <div className="relative w-full min-h-[300px] flex items-center">
      {!reduce && <SceneShapes />}
      <div className="relative">{HERO_COPY}
        <p className="text-[10px] uppercase tracking-[2px] text-white/25 mt-6">7 floating solids · time-driven, never stutters</p>
      </div>
    </div>
  );
}

function HeroBlob({ reduce }) {
  return (
    <div className="relative w-full min-h-[300px] flex items-center">
      {!reduce && <SceneBlob />}
      <div className="relative">{HERO_COPY}
        <p className="text-[10px] uppercase tracking-[2px] text-white/25 mt-6">One morphing solid · eases toward your cursor</p>
      </div>
    </div>
  );
}

function HeroNetwork({ reduce }) {
  return (
    <div className="relative w-full min-h-[300px] flex items-center">
      {!reduce && <SceneNetwork />}
      <div className="relative">{HERO_COPY}
        <p className="text-[10px] uppercase tracking-[2px] text-white/25 mt-6">You at the centre · 26 recruiters, connected</p>
      </div>
    </div>
  );
}

/* ---- 2. FEATURES (real: 4 cards) ---- */
const FEATS = [
  { icon: Mail, t: "Smart cold outreach", d: "Personalised emails to recruiters, from your own Gmail, safely throttled." },
  { icon: Briefcase, t: "Matched job feed", d: "Openings scored against your resume, with the reasoning shown." },
  { icon: MousePointerClick, t: "One-click autofill", d: "Applications completed from answers you saved once." },
  { icon: Users, t: "Mentorship", d: "Bi-weekly sessions with people who have done it." },
];

function FeatTilt({ reduce }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4" style={{ perspective: 1200 }}>
      {FEATS.map((f, i) => <TiltCard key={f.t} {...f} i={i} reduce={reduce} />)}
    </div>
  );
}
function TiltCard({ icon: Icon, t, d, i, reduce }) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const cfg = { stiffness: 300, damping: 24, mass: 0.4 };
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [11, -11]), cfg);
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-11, 11]), cfg);
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: i * 0.07, ease: EASE_OUT }}
      style={reduce ? {} : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5); }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/12 to-transparent p-6">
      <div style={{ transform: "translateZ(45px)" }}>
        <Icon size={20} className="text-primary mb-4" />
        <p className="font-semibold mb-1.5">{t}</p>
        <p className="text-sm text-white/50 leading-relaxed">{d}</p>
      </div>
    </motion.div>
  );
}

function FeatSpotlight({ reduce }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {FEATS.map((f, i) => <SpotCard key={f.t} {...f} i={i} reduce={reduce} />)}
    </div>
  );
}
function SpotCard({ icon: Icon, t, d, i, reduce }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: i * 0.07, ease: EASE_OUT }}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set(e.clientX - r.left); y.set(e.clientY - r.top); }}
      className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 overflow-hidden">
      <motion.div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: useTransform([x, y], ([lx, ly]) => `radial-gradient(340px circle at ${lx}px ${ly}px, rgba(76,31,255,0.20), transparent 70%)`) }} />
      <div className="relative">
        <Icon size={20} className="text-primary mb-4" />
        <p className="font-semibold mb-1.5">{t}</p>
        <p className="text-sm text-white/50 leading-relaxed">{d}</p>
      </div>
    </motion.div>
  );
}

function FeatGsapReveal({ reduce }) {
  const root = useRef(null);
  useLayoutEffect(() => {
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.from(".gf", { scrollTrigger: { trigger: root.current, start: "top 80%", end: "top 40%", scrub: 0.8 },
        y: 60, opacity: 0, rotateX: -22, transformPerspective: 900, stagger: 0.12 });
    }, root);
    return () => ctx.revert();
  }, [reduce]);
  return (
    <div ref={root} className="grid sm:grid-cols-2 gap-4">
      {FEATS.map((f) => (
        <div key={f.t} className="gf rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <f.icon size={20} className="text-primary mb-4" />
          <p className="font-semibold mb-1.5">{f.t}</p>
          <p className="text-sm text-white/50 leading-relaxed">{f.d}</p>
        </div>
      ))}
      <p className="sm:col-span-2 text-center text-xs text-white/30">Scroll — cards tilt in tied to scroll position</p>
    </div>
  );
}

/* ---- 3. PARTNERS marquee ---- */
const BRANDS = ["Google", "Amazon", "Razorpay", "Zomato", "Swiggy", "Flipkart", "Adobe", "Uber", "Paytm", "Meesho"];
function MarqueeRow({ reverse, reduce, speed = 26 }) {
  return (
    <div className="flex overflow-hidden mask-fade">
      <motion.div className="flex gap-3 shrink-0"
        animate={reduce ? {} : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}>
        {[...BRANDS, ...BRANDS].map((b, i) => (
          <span key={i} className="shrink-0 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-white/60 whitespace-nowrap">{b}</span>
        ))}
      </motion.div>
    </div>
  );
}
function PartnersTwoRow({ reduce }) {
  return (<div className="space-y-3"><MarqueeRow reduce={reduce} /><MarqueeRow reduce={reduce} reverse speed={32} /></div>);
}
function PartnersOneRow({ reduce }) { return <MarqueeRow reduce={reduce} speed={30} />; }

/* ---- 4. CTAONE — "Why visibility matters" ---- */
function VisibilityCounter({ reduce }) {
  const [n, setN] = useState(reduce ? 250 : 0);
  useEffect(() => {
    if (reduce) return;
    let raf, start;
    const step = (ts) => { if (!start) start = ts; const p = Math.min((ts - start) / 1600, 1);
      setN(Math.round(250 * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);
  return (
    <div className="text-center">
      <p className="font-syne text-6xl md:text-7xl font-bold mb-3">
        <span className="bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent">{n}+</span>
      </p>
      <p className="font-syne text-2xl font-bold mb-2">applications per opening</p>
      <p className="text-white/50 max-w-md mx-auto">Most resumes are never seen by a human. Outreach is how you skip the pile.</p>
    </div>
  );
}
function VisibilityStack({ reduce }) {
  return (
    <div className="text-center">
      <div className="relative h-32 mb-7 flex items-end justify-center gap-1">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div key={i}
            initial={reduce ? false : { height: 0 }} animate={{ height: `${18 + (i % 7) * 11}px` }}
            transition={{ duration: 0.5, delay: i * 0.025, ease: EASE_OUT }}
            className={`w-2.5 rounded-t ${i === 23 ? "bg-primary" : "bg-white/12"}`} />
        ))}
        <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="absolute -top-1 right-0 text-[10px] text-primary flex items-center gap-1"><Eye size={11} /> you</motion.div>
      </div>
      <p className="font-syne text-2xl font-bold mb-2">One of 250. Or the one who wrote.</p>
      <p className="text-white/50 max-w-md mx-auto">Every bar is a resume in the same pile. Only one of them reached a person directly.</p>
    </div>
  );
}

/* ---- 5. ABOUT — steps, manual control ---- */
const STEPS = [
  { n: "01", t: "Upload your resume", d: "Once. We read it and build your profile." },
  { n: "02", t: "We find the companies", d: "Verified recruiters matched to what you can actually do." },
  { n: "03", t: "You approve, it sends", d: "From your own inbox, on your schedule." },
];
function StepsManual({ reduce }) {
  const [s, setS] = useState(0);
  const [dir, setDir] = useState(1);
  const go = (d) => { setDir(d); setS((x) => (x + d + STEPS.length) % STEPS.length); };
  return (
    <div className="text-center">
      <div className="flex justify-center gap-2 mb-9">
        {STEPS.map((x, i) => (
          <button key={x.n} onClick={() => { setDir(i > s ? 1 : -1); setS(i); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === s ? "w-10 bg-primary" : "w-5 bg-white/15 hover:bg-white/30"}`} />
        ))}
      </div>
      <div className="min-h-[190px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={s} custom={dir}
            initial={reduce ? false : { opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }} transition={{ duration: 0.32, ease: EASE_OUT }}>
            <p className="font-syne text-6xl font-bold text-primary/25 mb-3">{STEPS[s].n}</p>
            <p className="font-syne text-2xl md:text-3xl font-bold mb-2">{STEPS[s].t}</p>
            <p className="text-white/50 max-w-md mx-auto">{STEPS[s].d}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-3 mt-6">
        <button onClick={() => go(-1)} className="w-10 h-10 rounded-full border border-white/15 hover:border-primary hover:text-primary text-white/50 flex items-center justify-center transition-colors duration-200"><ArrowLeft size={15} /></button>
        <button onClick={() => go(1)} className="px-6 h-10 rounded-full bg-primary text-white text-sm font-semibold inline-flex items-center gap-2">Next <ArrowRight size={15} /></button>
      </div>
    </div>
  );
}

/* ---- 6. TESTIMONIALS ---- */
const QUOTES = [
  { q: "I sent 200 applications and heard back from four.", a: "Final year, VIT" },
  { q: "I don't know anyone at these companies. That's the whole problem.", a: "Final year, PES" },
  { q: "Referrals are the only thing that works and I have none.", a: "Final year, NIT" },
];
function QuotesStagger({ reduce }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {QUOTES.map((x, i) => (
        <motion.div key={x.a}
          initial={reduce ? false : { opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.12, ease: EASE_BACK }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="font-syne text-lg leading-snug mb-4">&ldquo;{x.q}&rdquo;</p>
          <p className="text-xs text-white/40">{x.a}</p>
        </motion.div>
      ))}
    </div>
  );
}
function QuotesTyping({ reduce }) {
  const [i, setI] = useState(0);
  return <TypedQuote key={i} i={i} setI={setI} reduce={reduce} />;
}

function TypedQuote({ i, setI, reduce }) {
  const full = QUOTES[i].q;
  // Keyed on `i`, so changing quote remounts the typing state rather than
  // resetting it from inside an effect — no cascading render, and the reduced
  // motion case resolves in the initial value instead of after a paint.
  const [len, setLen] = useState(reduce ? full.length : 0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setLen((l) => (l >= full.length ? (clearInterval(id), l) : l + 1)), 28);
    return () => clearInterval(id);
  }, [full, reduce]);
  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(() => setI((x) => (x + 1) % QUOTES.length), 4600);
    return () => clearTimeout(id);
  }, [i, reduce]);
  return (
    <div className="text-center max-w-2xl mx-auto">
      <p className="font-syne text-2xl md:text-3xl leading-snug min-h-[100px]">
        &ldquo;{full.slice(0, len)}<span className="text-primary animate-pulse">|</span>&rdquo;
      </p>
      <p className="text-sm text-white/40 mt-4">{QUOTES[i].a}</p>
      <p className="text-[10px] uppercase tracking-[2px] text-white/25 mt-6">Typed, as if said out loud</p>
    </div>
  );
}

/* ---- 7. CTA — locked: sweep + glow ---- */
function CtaFinal() {
  return (
    <div className="relative text-center">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full bg-primary/22 blur-[120px] pointer-events-none" />
      <div className="relative">
        <p className="font-syne text-3xl md:text-5xl font-bold mb-4">Your placement year starts now.</p>
        <p className="text-white/50 mb-8">₹999 for twelve months. Full refund within 7 days.</p>
        <button className="group relative overflow-hidden bg-primary text-white font-semibold px-9 py-4 rounded-full inline-flex items-center gap-2 shadow-[0_18px_50px_-14px_rgba(76,31,255,0.9)]">
          <span className="relative z-10 inline-flex items-center gap-2">Get Outmail <ArrowRight size={16} /></span>
          <span className="absolute inset-0 bg-gradient-to-r from-accent-light to-primary translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
        </button>
        <p className="text-[10px] uppercase tracking-[2px] text-white/25 mt-6">Locked · sweep on hover, lit backdrop</p>
      </div>
    </div>
  );
}

export default function LandingOptions() {
  const reduce = useReducedMotion();
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <style>{`.mask-fade{mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}`}</style>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-[4px] text-primary mb-3">Landing page · every section</p>
        <h1 className="font-syne text-4xl md:text-5xl font-bold tracking-tight mb-4">The front door</h1>
        <p className="text-white/55 max-w-2xl leading-relaxed mb-3">
          Mapped to what the real page renders: Hero, Features, Partners, Why-visibility, About,
          Testimonials, CTA. Your feedback is applied — the tilt no longer scales in, the deck is
          gone, steps have manual controls, and the CTA is locked.
        </p>
        <p className="text-sm text-white/40 max-w-2xl leading-relaxed mb-12">
          Three genuine 3D scenes are on offer for the hero. All are time-driven or eased toward a
          target, never snapped per frame, and capped at 1.5× pixel ratio — that is what makes 3D
          feel smooth rather than expensive.
        </p>

        <Section n="1" title="Hero" blurb="Four seconds to convince someone real engineers built this."
          options={[
            { name: "3D tilt (fixed)", lib: "framer", spec: "spring 260/26 · no scale-in · 0.35s linear fade", note: "The lag you felt was the 0.7s scale-in fighting the tilt spring. Removed — it now fades in flat and the spring is stiffer and lighter, so the tilt responds immediately. Compare against the previous version: same idea, much snappier." },
            { name: "Floating solids", lib: "three.js", spec: "7 meshes · Float · time-driven rotation · dpr 1.5", note: "Icosahedrons, tori and octahedrons drifting weightlessly behind the copy. Rotation is driven by elapsed time rather than per-frame increments, so a dropped frame never causes a stutter. The most 'we can build things' of the three." },
            { name: "Morphing solid", lib: "three.js", spec: "1 distorted sphere · 96 segments · lerp 0.04 to pointer", note: "A single liquid-metal object that eases toward your cursor. One object means maximum smoothness and the lowest cost of the three scenes. Feels premium rather than busy." },
            { name: "Connection network", lib: "three.js", spec: "26 nodes · line segments from origin · 0.06 rad/s", note: "You at the centre, lines out to recruiters. The only scene that MEANS something — it is a picture of the product, not decoration. That makes it the strongest candidate despite being the least flashy." },
          ]}
        >{(p) => p === 0 ? <HeroTilt reduce={reduce} /> : p === 1 ? <HeroShapes reduce={reduce} /> : p === 2 ? <HeroBlob reduce={reduce} /> : <HeroNetwork reduce={reduce} />}</Section>

        <Section n="2" title="Features" blurb="Four cards. Currently 'Everything You Need to Land the Job'."
          options={[
            { name: "3D tilt cards", lib: "framer", spec: "spring 300/24 · ±11° · translateZ 45px", note: "Your pick, applied to all four. Content floats above the card surface so the depth is real. Stiffer spring than the hero so it feels responsive at card size." },
            { name: "Cursor spotlight", lib: "framer", spec: "340px radial gradient tracking the pointer", note: "A soft light follows your cursor inside each card. Subtler than tilt and it works on any card size — the pattern Linear and Vercel use. No transform, so it never fights text rendering." },
            { name: "Scroll-tied reveal", lib: "GSAP", spec: "ScrollTrigger scrub 0.8 · rotateX -22° · 0.12 stagger", note: "Cards tilt into place tied to scroll position, so you control the pace by scrolling. Scroll the page to see it." },
          ]}
        >{(p) => p === 0 ? <FeatTilt reduce={reduce} /> : p === 1 ? <FeatSpotlight reduce={reduce} /> : <FeatGsapReveal reduce={reduce} />}</Section>

        <Section n="3" title="Partners" blurb="The company marquee. Currently a mix of MNC icons and Indian names."
          options={[
            { name: "Two rows, opposed", lib: "framer", spec: "26s and 32s linear loops, opposite directions", note: "Two rows drifting against each other with a soft mask at both edges. More visual interest than one row, and the differing speeds stop it looking mechanical." },
            { name: "Single row", lib: "framer", spec: "30s linear loop", note: "Calmer and takes half the vertical space. If the section is only there for credibility rather than emphasis, one row says it and moves on." },
          ]}
        >{(p) => p === 0 ? <PartnersTwoRow reduce={reduce} /> : <PartnersOneRow reduce={reduce} />}</Section>

        <Section n="4" title="Why visibility matters" blurb="Currently 'Most Resumes Never Get Seen'. The emotional argument for the product."
          options={[
            { name: "Counting number", lib: "framer", spec: "1600ms cubic ease-out · rAF", note: "250+ applications per opening, counting up. One number, stated plainly. The fastest way to make the problem feel real." },
            { name: "The pile", lib: "framer", spec: "24 bars · 25ms stagger · height reveal", note: "Twenty-four bars grow into a pile of resumes; one is highlighted as you. This is the mechanism-animation idea applied to a statistic — it shows the problem instead of asserting it, and it is the more memorable of the two." },
          ]}
        >{(p) => p === 0 ? <VisibilityCounter reduce={reduce} /> : <VisibilityStack reduce={reduce} />}</Section>

        <Section n="5" title="How it works" blurb="Currently the About section. Three steps."
          options={[
            { name: "Manual steps", lib: "framer", spec: "320ms directional slide · next/prev + dots", note: "Your pick, fixed. No auto-advance — Next and Back buttons plus clickable dots, and the slide direction follows which way you moved. Faster transition than before (320ms, was 400ms)." },
          ]}
        >{() => <StepsManual reduce={reduce} />}</Section>

        <Section n="6" title="Testimonials" blurb="Currently 'Early Validation — Students Want This. Badly.'"
          options={[
            { name: "Stagger cards", lib: "framer", spec: "500ms · back.out · 120ms apart", note: "Three quotes arriving together. All visible at once, which suits scanners and keeps the section short." },
            { name: "Typed, one at a time", lib: "framer", spec: "28ms per character · 4.6s per quote", note: "Each quote types out as if being said aloud, then cycles. Slower to read everything, but far more affecting — these are real things students said, and typing them lands them as speech rather than marketing copy." },
          ]}
        >{(p) => p === 0 ? <QuotesStagger reduce={reduce} /> : <QuotesTyping reduce={reduce} />}</Section>

        <Section n="7" title="Closing CTA" blurb="Locked from your last round."
          options={[{ name: "Sweep + glow", lib: "css", spec: "500ms translateX sweep · 460px radial glow, 120px blur", note: "Your pick. Pure CSS, no runtime cost, works on touch, never fights the click." }]}
        >{() => <CtaFinal />}</Section>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
          <p className="text-sm text-white/70 mb-3 font-medium">On the three 3D scenes</p>
          <ul className="text-sm text-white/50 space-y-2.5 leading-relaxed list-disc pl-5">
            <li><strong className="text-white/70">Pick at most one.</strong> three.js runs a render loop the whole time it is on screen. One hero scene is a statement; two is a battery complaint.</li>
            <li><strong className="text-white/70">The network scene is the only one that means something.</strong> It is a picture of the product — you, connected to recruiters. The other two are beautiful decoration, which is a weaker reason to pay 150KB.</li>
            <li><strong className="text-white/70">All three disable entirely under reduced motion</strong> and the copy stays fully readable, because the text is never inside the canvas.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
