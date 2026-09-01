"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useTransform, useMotionValue, useSpring, useInView, useReducedMotion } from "framer-motion";

/** Shared motion kit. Every concept assembles from these — that is the point. */
export const EASE_OUT = [0.16, 1, 0.3, 1];
export const EASE_BACK = [0.34, 1.56, 0.64, 1];

export function Reveal({ children, delay = 0, y = 30, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  const reduce = useReducedMotion();
  return (
    <motion.div ref={ref} className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: EASE_OUT }}>{children}</motion.div>
  );
}

export function Words({ text, className = "", accentFrom = 999, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <h1 className={className}>
      {text.split(" ").map((w, i) => (
        <motion.span key={i}
          initial={reduce ? false : { opacity: 0, y: 36, rotateX: -45 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.6, delay: delay + i * 0.07, ease: EASE_BACK }}
          className={`inline-block mr-[0.24em] ${i >= accentFrom ? "bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent" : ""}`}>
          {w}</motion.span>
      ))}
    </h1>
  );
}

export function MaskLines({ lines, className = "", accentIdx = -1 }) {
  const reduce = useReducedMotion();
  return (
    <h1 className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span className={`block ${i === accentIdx ? "bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent" : ""}`}
            initial={reduce ? false : { y: "110%" }} animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: EASE_OUT }}>{l}</motion.span>
        </span>
      ))}
    </h1>
  );
}

export function Tilt({ children, max = 11, z = 40, className = "" }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0), my = useMotionValue(0);
  const cfg = { stiffness: 300, damping: 24, mass: 0.4 };
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [max, -max]), cfg);
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-max, max]), cfg);
  return (
    <motion.div className={className}
      style={reduce ? {} : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5); }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}>
      <div style={reduce ? {} : { transform: `translateZ(${z}px)` }}>{children}</div>
    </motion.div>
  );
}

export function Count({ to, prefix = "", suffix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    let raf, start;
    const step = (ts) => { if (!start) start = ts; const p = Math.min((ts - start) / 1500, 1);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);
  return <span ref={ref} className={className}>{prefix}{v.toLocaleString("en-IN")}{suffix}</span>;
}

export function Cta({ label = "Get Outmail" }) {
  return (
    <button className="group relative overflow-hidden bg-primary text-white font-semibold px-8 py-3.5 rounded-full inline-flex items-center gap-2 shadow-[0_16px_44px_-14px_rgba(76,31,255,0.9)]">
      <span className="relative z-10">{label}</span>
      <span className="absolute inset-0 bg-gradient-to-r from-accent-light to-primary translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
    </button>
  );
}

export const FEATS = [
  { t: "Cold outreach", d: "Personalised emails to verified recruiters, from your own Gmail." },
  { t: "Matched jobs", d: "Openings scored against your resume, with the reasoning shown." },
  { t: "One-click autofill", d: "Applications completed from answers you saved once." },
  { t: "Mentorship", d: "Bi-weekly sessions with people who have done it. 25 seats." },
];

export const STEPS = [
  { n: "01", t: "Upload your resume", d: "Once. We read it and build your profile." },
  { n: "02", t: "We find the people", d: "Verified recruiters matched to what you can do." },
  { n: "03", t: "You approve, it sends", d: "From your own inbox, on your schedule." },
];

export const CONCEPTS = [
  { id: 1,  name: "Immersive 3D",       tag: "full-bleed network scene" },
  { id: 2,  name: "Horizontal journey",  tag: "scroll down, move sideways" },
  { id: 3,  name: "Scroll story",        tag: "pinned chapters" },
  { id: 4,  name: "Bento dense",         tag: "asymmetric grid throughout" },
  { id: 5,  name: "Split fixed",         tag: "sticky pitch, scrolling proof" },
  { id: 6,  name: "Kinetic type",        tag: "typography is the design" },
  { id: 7,  name: "Card peel",           tag: "cards stack and peel on scroll" },
  { id: 8,  name: "Editorial",           tag: "magazine spread" },
  { id: 9,  name: "Brutalist",           tag: "hard shadows, mono, stark" },
  { id: 10, name: "Live product",        tag: "the dashboard, running" },
];
