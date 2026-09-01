"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform, useReducedMotion, animate } from "framer-motion";
import { Mail, Sparkles, ArrowRight, Check, Zap } from "lucide-react";

/**
 * DESIGN PREVIEW — /design-preview
 *
 * A proposal, not a change. Nothing here is imported by the product.
 *
 * DIRECTION: "Vibrant & Block-based" from the ui-ux-pro-max catalogue —
 * bold, energetic, large type (32px+), 48px+ block gaps, 200-300ms hovers.
 * Chosen over Minimalism because the audience is Gen Z students who have to
 * believe, in about four seconds, that real engineers built this.
 *
 * THE ORGANISING IDEA: motion carries the explaining, not paragraphs. Where a
 * normal site writes "we send personalised emails to verified recruiters", this
 * SHOWS it happening once and says nothing. Copy is reduced to labels.
 *
 * Motion timings are taken from the catalogue's motion.csv rather than invented:
 *   hover micro-interaction   200-300ms   power2.out
 *   scroll reveal             400-600ms   power2.out
 *   stagger list              300-450ms   back.out(1.4)
 * Framer's cubic-bezier equivalents are used below.
 *
 * EVERY animation is gated on prefers-reduced-motion. An energetic site that
 * ignores that setting is not impressive, it is inaccessible.
 */

const EASE_OUT = [0.16, 1, 0.3, 1];        // power2.out equivalent
const EASE_BACK = [0.34, 1.56, 0.64, 1];   // back.out(1.4) equivalent

/* Scroll-reveal wrapper — the workhorse. */
function Reveal({ children, delay = 0, y = 28 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/* Numbers that count up when they enter. Cheap, and it reads as "alive". */
function Counter({ to, suffix = "", prefix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1.4, ease: EASE_OUT, onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, reduce]);
  return <span ref={ref}>{prefix}{val.toLocaleString("en-IN")}{suffix}</span>;
}

/**
 * THE MECHANISM, ANIMATED.
 * Replaces a paragraph explaining what Outmail does. It loops once on view:
 * a draft assembles, then flies to a recruiter, who replies.
 */
function OutreachMechanism() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduce = useReducedMotion();
  const go = inView && !reduce;

  return (
    <div ref={ref} className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-primary/12 via-transparent to-accent-light/8 p-8 md:p-12 overflow-hidden">
      {/* drifting glow — the only continuously animated thing on the page */}
      {!reduce && (
        <motion.div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/25 blur-[90px] pointer-events-none"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative grid md:grid-cols-3 gap-6 items-center">
        {/* 1 — your resume */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={go ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.45, ease: EASE_BACK }}
          className="rounded-2xl border border-white/12 bg-white/[0.04] p-5"
        >
          <p className="text-[10px] uppercase tracking-[2px] text-white/40 mb-3">Your resume</p>
          {[70, 92, 55].map((w, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full bg-white/20 mb-2"
              initial={reduce ? false : { width: 0 }}
              animate={go ? { width: `${w}%` } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease: EASE_OUT }}
            />
          ))}
        </motion.div>

        {/* 2 — the email in flight */}
        <div className="relative h-24 flex items-center justify-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -40, rotate: -8 }}
            animate={go ? { opacity: 1, x: 0, rotate: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.9, ease: EASE_BACK }}
            className="rounded-2xl bg-primary px-5 py-4 shadow-[0_16px_40px_-12px_rgba(108,0,255,0.7)]"
          >
            <Mail size={22} className="text-white" />
          </motion.div>
          {!reduce && (
            <motion.div
              className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
              initial={{ scaleX: 0 }}
              animate={go ? { scaleX: 1 } : {}}
              transition={{ duration: 0.7, delay: 1.1, ease: EASE_OUT }}
            />
          )}
        </div>

        {/* 3 — the recruiter replies */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          animate={go ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.45, delay: 1.5, ease: EASE_BACK }}
          className="rounded-2xl border border-white/12 bg-white/[0.04] p-5"
        >
          <p className="text-[10px] uppercase tracking-[2px] text-white/40 mb-3">A real recruiter</p>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-light" />
            <div>
              <div className="h-1.5 w-20 rounded-full bg-white/25 mb-1.5" />
              <div className="h-1.5 w-12 rounded-full bg-white/12" />
            </div>
          </div>
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={go ? { opacity: 1 } : {}}
            transition={{ delay: 2.1, duration: 0.4 }}
            className="text-xs text-primary mt-3 font-medium"
          >
            replied
          </motion.p>
        </motion.div>
      </div>

      <p className="relative text-center text-sm text-white/45 mt-8">
        That is the whole product. No paragraph needed.
      </p>
    </div>
  );
}

/* Magnetic-ish button — lifts and brightens. 200ms, per the catalogue. */
function BigButton({ children, variant = "primary" }) {
  const reduce = useReducedMotion();
  const base = "relative font-semibold text-sm px-7 py-3.5 rounded-pill transition-colors duration-200 inline-flex items-center gap-2";
  const styles = variant === "primary"
    ? "bg-primary text-white hover:bg-primary-hover shadow-[0_10px_30px_-8px_rgba(108,0,255,0.6)]"
    : "bg-white/8 text-white border border-white/15 hover:bg-white/14";
  return (
    <motion.button
      whileHover={reduce ? {} : { y: -3, scale: 1.02 }}
      whileTap={reduce ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
      className={`${base} ${styles}`}
    >
      {children}
    </motion.button>
  );
}

export default function DesignPreview() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const reduce = useReducedMotion();

  const words = ["Get", "seen", "by", "real", "recruiters."];

  return (
    <div className="min-h-screen bg-surface-page text-white overflow-x-hidden">

      {/* ---------------- HERO ---------------- */}
      <section ref={heroRef} className="relative max-w-6xl mx-auto px-6 pt-24 pb-20">
        <motion.div style={reduce ? {} : { y: heroY }}>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[3px] text-primary border border-primary/30 rounded-pill px-4 py-1.5 mb-8"
          >
            <Zap size={12} /> Built for your placement year
          </motion.p>

          {/* word-by-word entrance — the single most "designed" moment */}
          <h1 className="font-syne font-bold tracking-tight text-5xl md:text-7xl leading-[1.05] mb-6">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={reduce ? false : { opacity: 0, y: 40, rotateX: -40 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: EASE_BACK }}
                className={`inline-block mr-[0.25em] ${i === 3 ? "bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent" : ""}`}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-lg text-white/55 max-w-xl mb-9"
          >
            One payment. Twelve months. Less than a month of LinkedIn Premium.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5, ease: EASE_OUT }}
            className="flex flex-wrap gap-3"
          >
            <BigButton>Get Outmail <ArrowRight size={16} /></BigButton>
            <BigButton variant="ghost">See how it works</BigButton>
          </motion.div>
        </motion.div>
      </section>

      {/* ---------------- THE MECHANISM ---------------- */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal><OutreachMechanism /></Reveal>
      </section>

      {/* ---------------- NUMBERS ---------------- */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { n: 999, p: "₹", s: "", l: "For a full year" },
            { n: 40, p: "", s: "/day", l: "Emails at full ramp" },
            { n: 7, p: "", s: " days", l: "No-questions refund" },
            { n: 25, p: "", s: "", l: "Mentorship seats" },
          ].map((x, i) => (
            <Reveal key={x.l} delay={i * 0.08}>
              <motion.div
                whileHover={reduce ? {} : { y: -4 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-primary/40 transition-colors duration-200"
              >
                <p className="font-syne text-3xl md:text-4xl font-bold mb-1">
                  <Counter to={x.n} prefix={x.p} suffix={x.s} />
                </p>
                <p className="text-xs text-white/45 uppercase tracking-[2px]">{x.l}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- FEATURE BLOCKS ---------------- */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <Reveal>
          <h2 className="font-syne text-3xl md:text-5xl font-bold tracking-tight mb-3">
            Three things. <span className="text-white/35">That&apos;s it.</span>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {[
            { icon: Mail, t: "Outreach", d: "From your own Gmail.", c: "from-primary/20" },
            { icon: Sparkles, t: "Matched jobs", d: "Scored against your resume.", c: "from-accent-light/20" },
            { icon: Check, t: "Autofill", d: "Applications in one click.", c: "from-accent/20" },
          ].map(({ icon: Icon, t, d, c }, i) => (
            <Reveal key={t} delay={i * 0.1}>
              <motion.div
                whileHover={reduce ? {} : { y: -6 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className={`group rounded-3xl border border-white/10 bg-gradient-to-br ${c} to-transparent p-8 h-full hover:border-primary/50 transition-colors duration-200`}
              >
                <motion.div
                  whileHover={reduce ? {} : { rotate: -8, scale: 1.1 }}
                  transition={{ duration: 0.25, ease: EASE_BACK }}
                  className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-6"
                >
                  <Icon size={20} className="text-primary" />
                </motion.div>
                <p className="font-syne text-2xl font-bold mb-2">{t}</p>
                <p className="text-white/50">{d}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-24 text-sm text-white/35 leading-relaxed">
        <p className="text-white/55 mb-2">Preview only — nothing here is applied to the product.</p>
        <p className="max-w-2xl">
          Every animation respects <code className="text-white/60">prefers-reduced-motion</code>.
          Turn it on in your OS and reload — the page renders instantly and completely,
          with no motion at all. An energetic site that ignores that is not impressive,
          it is inaccessible.
        </p>
      </div>
    </div>
  );
}
