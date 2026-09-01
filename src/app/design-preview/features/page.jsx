"use client";
import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from "framer-motion";
import { Mail, Briefcase, Zap, ArrowRight, Check, RotateCw } from "lucide-react";

/**
 * /features — ANIMATION OPTIONS PER SECTION
 *
 * Same method as the fonts and colours pages: build the options, pick one.
 * Each section below offers 2–3 treatments; switch between them and compare.
 *
 * All of this is framer-motion. The "3D" options are CSS 3D transforms
 * (perspective + rotateX/Y) driven by Framer — no three.js. Notes on each
 * option say where GSAP or three.js would genuinely add something, so adding a
 * dependency stays a decision rather than an assumption.
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
              pick === i ? "border-primary bg-primary/15 text-white" : "border-white/12 text-white/50 hover:border-white/30"
            }`}>
            {o.name}
          </button>
        ))}
        <button onClick={() => setReplay((r) => r + 1)} className="ml-1 text-white/35 hover:text-primary transition-colors" aria-label="Replay">
          <RotateCw size={14} />
        </button>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/25 p-8 md:p-12 overflow-hidden min-h-[340px] flex items-center">
        <div key={`${pick}-${replay}`} className="w-full">{children(pick)}</div>
      </div>

      <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.02] p-4">
        <p className="text-xs text-primary font-mono mb-1.5">{options[pick].spec}</p>
        <p className="text-sm text-white/55 leading-relaxed">{options[pick].note}</p>
      </div>
    </section>
  );
}

/* ---------- 1. HERO ---------- */
function HeroWords({ reduce }) {
  const words = ["Everything", "you", "need", "to", "get", "interviews."];
  return (
    <h1 className="font-syne text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
      {words.map((w, i) => (
        <motion.span key={i}
          initial={reduce ? false : { opacity: 0, y: 40, rotateX: -50 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.6, delay: 0.08 * i, ease: EASE_BACK }}
          className={`inline-block mr-[0.24em] ${i === 5 ? "bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent" : ""}`}
        >{w}</motion.span>
      ))}
    </h1>
  );
}

function HeroMask({ reduce }) {
  const lines = ["Everything you need", "to get interviews."];
  return (
    <h1 className="font-syne text-4xl md:text-6xl font-bold tracking-tight leading-[1.08]">
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            initial={reduce ? false : { y: "110%" }} animate={{ y: 0 }}
            transition={{ duration: 0.75, delay: 0.12 * i, ease: EASE_OUT }}
            className={`block ${i === 1 ? "bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent" : ""}`}
          >{l}</motion.span>
        </span>
      ))}
    </h1>
  );
}

function Hero3D({ reduce }) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 150, damping: 20 });
  return (
    <div style={{ perspective: 1000 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      <motion.div style={reduce ? {} : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        initial={reduce ? false : { opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      >
        <h1 className="font-syne text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]" style={{ transform: "translateZ(50px)" }}>
          Everything you need to{" "}
          <span className="bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent">get interviews.</span>
        </h1>
        <p className="text-white/45 mt-4 text-sm" style={{ transform: "translateZ(20px)" }}>Move your cursor across this block</p>
      </motion.div>
    </div>
  );
}

/* ---------- 2. FEATURE SHOWCASE ---------- */
const FEATURES = [
  { icon: Mail, t: "Cold outreach", d: "Personalised emails to verified recruiters, sent from your own Gmail." },
  { icon: Briefcase, t: "Matched jobs", d: "Openings scored against your resume, with the reasoning shown." },
  { icon: Zap, t: "Autofill", d: "Applications completed in one click, from answers you saved once." },
];

function CardsStagger({ reduce }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {FEATURES.map(({ icon: Icon, t, d }, i) => (
        <motion.div key={t}
          initial={reduce ? false : { opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: EASE_BACK }}
          whileHover={reduce ? {} : { y: -6 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-primary/50 transition-colors duration-200"
        >
          <Icon size={20} className="text-primary mb-4" />
          <p className="font-semibold mb-1.5">{t}</p>
          <p className="text-sm text-white/50 leading-relaxed">{d}</p>
        </motion.div>
      ))}
    </div>
  );
}

function CardsTilt({ reduce }) {
  return (
    <div className="grid md:grid-cols-3 gap-4" style={{ perspective: 1200 }}>
      {FEATURES.map(({ icon: Icon, t, d }, i) => (
        <TiltCard key={t} i={i} reduce={reduce} Icon={Icon} t={t} d={d} />
      ))}
    </div>
  );
}
function TiltCard({ i, reduce, Icon, t, d }) {
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 18 });
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.1, ease: EASE_OUT }}
      style={reduce ? {} : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-primary/12 to-transparent p-6"
    >
      <div style={{ transform: "translateZ(40px)" }}>
        <Icon size={20} className="text-primary mb-4" />
        <p className="font-semibold mb-1.5">{t}</p>
        <p className="text-sm text-white/50 leading-relaxed">{d}</p>
      </div>
    </motion.div>
  );
}

function CardsDeck({ reduce }) {
  const [top, setTop] = useState(0);
  return (
    <div className="relative h-[240px] max-w-md mx-auto" style={{ perspective: 1200 }}>
      {FEATURES.map(({ icon: Icon, t, d }, i) => {
        const pos = (i - top + FEATURES.length) % FEATURES.length;
        return (
          <motion.div key={t}
            animate={reduce ? {} : { y: pos * 16, scale: 1 - pos * 0.05, zIndex: 10 - pos, opacity: pos > 2 ? 0 : 1, rotateX: pos * 3 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            onClick={() => setTop((t2) => (t2 + 1) % FEATURES.length)}
            className="absolute inset-x-0 top-0 rounded-2xl border border-white/12 bg-surface-panel p-7 cursor-pointer shadow-2xl"
          >
            <Icon size={22} className="text-primary mb-4" />
            <p className="font-syne text-xl font-bold mb-1.5">{t}</p>
            <p className="text-sm text-white/50 leading-relaxed">{d}</p>
            <p className="text-[10px] uppercase tracking-[2px] text-white/30 mt-4">Click to cycle</p>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---------- 3. PROCESS ---------- */
const STEPS = [
  { n: "01", t: "Upload your resume", d: "We read it once." },
  { n: "02", t: "We find the companies", d: "Verified recruiters, matched to you." },
  { n: "03", t: "You approve, it sends", d: "From your own inbox, on your schedule." },
];

function ProcessLine({ reduce }) {
  return (
    <div className="relative">
      <motion.div
        className="absolute left-[19px] top-2 w-px bg-gradient-to-b from-primary to-accent-light origin-top"
        initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ duration: 1.1, ease: EASE_OUT }}
        style={{ height: "calc(100% - 16px)" }}
      />
      <div className="space-y-7">
        {STEPS.map((s, i) => (
          <motion.div key={s.n}
            initial={reduce ? false : { opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.25, ease: EASE_OUT }}
            className="flex gap-5 items-start relative"
          >
            <div className="w-10 h-10 shrink-0 rounded-full bg-surface-page border-2 border-primary flex items-center justify-center text-xs font-bold text-primary z-10">
              {s.n}
            </div>
            <div className="pt-2">
              <p className="font-semibold">{s.t}</p>
              <p className="text-sm text-white/45 mt-0.5">{s.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProcessMorph({ reduce }) {
  const [step, setStep] = useState(0);
  return (
    <div className="text-center">
      <div className="flex justify-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <button key={s.n} onClick={() => setStep(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-10 bg-primary" : "w-6 bg-white/15"}`} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step}
          initial={reduce ? false : { opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          <p className="font-syne text-5xl font-bold text-primary/30 mb-3">{STEPS[step].n}</p>
          <p className="font-syne text-2xl font-bold mb-2">{STEPS[step].t}</p>
          <p className="text-white/50">{STEPS[step].d}</p>
        </motion.div>
      </AnimatePresence>
      <button onClick={() => setStep((s) => (s + 1) % STEPS.length)}
        className="mt-8 text-sm text-primary inline-flex items-center gap-1.5 hover:gap-2.5 transition-all duration-200">
        Next step <ArrowRight size={14} />
      </button>
    </div>
  );
}

function ProcessScrub({ reduce }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  return (
    <div ref={ref}>
      <motion.div style={reduce ? {} : { x }} className="flex gap-4">
        {STEPS.map((s) => (
          <div key={s.n} className="min-w-[240px] rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="font-syne text-3xl font-bold text-primary/35 mb-2">{s.n}</p>
            <p className="font-semibold mb-1">{s.t}</p>
            <p className="text-sm text-white/45">{s.d}</p>
          </div>
        ))}
      </motion.div>
      <p className="text-xs text-white/30 mt-4 text-center">Scroll the page — the row drifts against it</p>
    </div>
  );
}

/* ---------- 4. CTA ---------- */
function CtaMagnetic({ reduce }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 15 }), sy = useSpring(y, { stiffness: 250, damping: 15 });
  return (
    <div className="text-center">
      <p className="font-syne text-3xl md:text-4xl font-bold mb-6">Ready when you are.</p>
      <motion.button
        style={reduce ? {} : { x: sx, y: sy }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          x.set((e.clientX - r.left - r.width / 2) * 0.35);
          y.set((e.clientY - r.top - r.height / 2) * 0.35);
        }}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        className="bg-primary text-white font-semibold px-9 py-4 rounded-full inline-flex items-center gap-2 shadow-[0_16px_40px_-12px_rgba(76,31,255,0.8)]"
      >Get Outmail <ArrowRight size={16} /></motion.button>
      <p className="text-xs text-white/30 mt-5">Move your cursor near the button</p>
    </div>
  );
}

function CtaSweep({ reduce }) {
  return (
    <div className="text-center">
      <p className="font-syne text-3xl md:text-4xl font-bold mb-6">Ready when you are.</p>
      <button className="group relative overflow-hidden bg-primary text-white font-semibold px-9 py-4 rounded-full inline-flex items-center gap-2">
        <span className="relative z-10 inline-flex items-center gap-2">Get Outmail <ArrowRight size={16} /></span>
        {!reduce && (
          <span className="absolute inset-0 bg-gradient-to-r from-accent-light to-primary translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
        )}
      </button>
      <p className="text-xs text-white/30 mt-5">Hover the button</p>
    </div>
  );
}

export default function FeatureOptions() {
  const reduce = useReducedMotion();
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-[4px] text-primary mb-3">Page 1 of 8 · /features</p>
        <h1 className="font-syne text-4xl md:text-5xl font-bold tracking-tight mb-4">Pick the motion</h1>
        <p className="text-white/55 max-w-2xl leading-relaxed mb-3">
          Four sections, each with alternatives. Switch between them and compare — some only
          reveal themselves on hover or scroll, so the hint under each tells you what to do.
        </p>
        <p className="text-sm text-white/40 max-w-2xl leading-relaxed mb-12">
          All framer-motion. The 3D options are CSS 3D transforms with perspective — no three.js.
          Notes say where a new dependency would genuinely earn its place.
        </p>

        <Section n="1" title="Hero"
          blurb="First four seconds. This is where someone decides whether real engineers built this."
          options={[
            { name: "Word-by-word", spec: "600ms · back.out · 80ms stagger · rotateX -50°", note: "Each word flips up into place. The most 'designed' of the three and the one people notice. Reserve it for one h1 per site — used repeatedly it reads as a gimmick." },
            { name: "Line mask reveal", spec: "750ms · power2.out · translateY 110% inside overflow-hidden", note: "Lines slide up from behind a mask, like a title card. Calmer and more editorial than word-by-word, and it holds up better with longer headlines. This is the one most premium sites use." },
            { name: "3D cursor tilt", spec: "spring 150/20 · perspective 1000 · ±14°", note: "The whole heading tilts toward your cursor with real depth. Cheap 3D that feels expensive — but it does nothing on touch devices, so it must not carry meaning." },
          ]}
        >{(p) => p === 0 ? <HeroWords reduce={reduce} /> : p === 1 ? <HeroMask reduce={reduce} /> : <Hero3D reduce={reduce} />}</Section>

        <Section n="2" title="The three features"
          blurb="Outreach, matched jobs, autofill. The core of what ₹999 buys."
          options={[
            { name: "Stagger + lift", spec: "500ms · back.out · 100ms apart · hover y-6", note: "Cards arrive in sequence, lift on hover. Safe, fast, works everywhere, reads as competent rather than remarkable. The sensible default." },
            { name: "3D tilt cards", spec: "spring 200/18 · perspective 1200 · ±12° · translateZ 40px", note: "Each card tracks your cursor independently with content floating above the surface. Genuinely impressive and the closest thing here to CRED. Costs nothing extra — no library needed." },
            { name: "Stacked deck", spec: "500ms · power2.out · z-stack with rotateX", note: "Cards stack like a physical deck; click to cycle. Interactive and memorable, but it hides two of three features behind an interaction — a real risk on a page whose job is explaining." },
          ]}
        >{(p) => p === 0 ? <CardsStagger reduce={reduce} /> : p === 1 ? <CardsTilt reduce={reduce} /> : <CardsDeck reduce={reduce} />}</Section>

        <Section n="3" title="How it works"
          blurb="Three steps. The section that most needs motion to replace paragraphs."
          options={[
            { name: "Drawing timeline", spec: "1100ms line draw · steps at 250ms intervals", note: "A vertical line draws itself, steps appear along it. Reads as a sequence, which is exactly what it is. Clear on mobile too, since it is already vertical." },
            { name: "Morphing steps", spec: "400ms crossfade · scale 0.97 · AnimatePresence", note: "One step at a time, morphing between. Focuses attention completely — and requires an interaction to see everything, which costs you the scanners." },
            { name: "Scroll-drifting row", spec: "scrub-linked · translateX 8% → -8%", note: "The row drifts horizontally as the page scrolls. Subtle depth without hijacking the scroll. This is the pattern GSAP ScrollTrigger is famous for, but Framer's useScroll does it natively." },
          ]}
        >{(p) => p === 0 ? <ProcessLine reduce={reduce} /> : p === 1 ? <ProcessMorph reduce={reduce} /> : <ProcessScrub reduce={reduce} />}</Section>

        <Section n="4" title="Closing CTA"
          blurb="The last thing before they decide."
          options={[
            { name: "Magnetic button", spec: "spring 250/15 · 0.35 cursor follow", note: "The button leans toward your cursor. A signature Awwwards-era detail — delightful, and it makes the button slightly harder to click, which is a real cost on the primary conversion action." },
            { name: "Gradient sweep", spec: "500ms · translateX -101% → 0 · ease-out", note: "A gradient wipes across on hover. Less clever than magnetic and it never fights the click. On the button that takes ₹999, I would choose reliability over delight." },
          ]}
        >{(p) => p === 0 ? <CtaMagnetic reduce={reduce} /> : <CtaSweep reduce={reduce} />}</Section>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
          <p className="text-sm text-white/70 mb-3 font-medium">On adding GSAP or three.js</p>
          <ul className="text-sm text-white/50 space-y-2.5 leading-relaxed list-disc pl-5">
            <li><strong className="text-white/70">GSAP</strong> — everything above is Framer. GSAP earns its place for long scroll-scrubbed sequences that pin a section and play through it. Worth adding only if we build one of those.</li>
            <li><strong className="text-white/70">three.js</strong> — real 3D geometry, ~150KB gzipped plus a renderer running constantly. That is a genuine cost on a cheap laptop. The CSS-3D options here get most of the effect for none of the weight.</li>
            <li><strong className="text-white/70">Lenis</strong> — smooth scroll inertia. Cheap, and it makes every scroll animation feel more expensive. This is the one I would actually add.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
