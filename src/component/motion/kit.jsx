"use client";
import {
  motion,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";

/**
 * The site's motion vocabulary.
 *
 * Every animated section on the marketing site assembles from these five
 * primitives, which is what keeps the pages feeling like one product rather
 * than nine separately-designed pages. Timings and easings live here and
 * nowhere else.
 *
 * All of them honour prefers-reduced-motion by rendering the final state
 * immediately rather than by animating faster.
 */
export const EASE_OUT = [0.16, 1, 0.3, 1]; // power2.out — the house easing
export const EASE_BACK = [0.34, 1.56, 0.64, 1]; // slight overshoot, for arrivals

/** Fade-and-rise on entry. The default for anything that is not type. */
export function Reveal({ children, delay = 0, y = 30, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word arrival with a slight rotateX. For a single headline per page. */
export function Words({ text, className = "", accentFrom = 999, delay = 0, as: Tag = "h1" }) {
  const reduce = useReducedMotion();
  return (
    <Tag className={className}>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          initial={reduce ? false : { opacity: 0, y: 36, rotateX: -45 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.6, delay: delay + i * 0.07, ease: EASE_BACK }}
          className={`inline-block mr-[0.24em] ${i >= accentFrom ? "bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent" : ""}`}
        >
          {w}
        </motion.span>
      ))}
    </Tag>
  );
}

/**
 * Lines sliding up from behind a mask. The house treatment for headings.
 *
 * THE OBSERVER GOES ON THE OUTER HEADING, NEVER ON THE MASKED SPAN.
 * Each line sits inside an `overflow: hidden` wrapper and starts translated
 * 110% down — which puts it entirely outside that wrapper's clip rect.
 * IntersectionObserver clips a target against its ancestors' overflow, so an
 * observer attached to the span sees an empty intersection and never fires:
 * the line is hidden by the mask, so it can never come into view, so it is
 * never un-hidden. That deadlock silently blanked every heading on the site.
 */
export function MaskLines({ lines, className = "", accentIdx = -1, as: Tag = "h2", delay = 0 }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${i === accentIdx ? "bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent" : ""}`}
            initial={reduce ? false : { y: "110%" }}
            animate={inView || reduce ? { y: 0 } : undefined}
            transition={{ duration: 0.8, delay: delay + i * 0.1, ease: EASE_OUT }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/**
 * Cursor tilt, tuned for smoothness.
 *
 * Four things make this feel liquid rather than sticky, and all four matter:
 *
 * 1. THE RECT IS CACHED. getBoundingClientRect() forces layout, and calling it
 *    on every mousemove was the single biggest source of jank — the browser was
 *    recalculating layout dozens of times a second while also compositing a 3D
 *    transform. It is now read on enter and on resize only.
 * 2. MOTION VALUES, NEVER STATE. Nothing here triggers a React render on
 *    mouse move; Framer writes straight to the transform.
 * 3. A SOFTER SPRING WITH LOW MASS. High stiffness feels snappy but overshoots
 *    into a wobble on fast movement. 180/22 at mass 0.35 settles without ringing.
 * 4. will-change AND translateZ(0) put the element on its own compositor layer
 *    up front, so the first movement is not the frame that promotes it — which
 *    is what used to read as initial lag.
 */
export function Tilt({ children, max = 11, z = 40, className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const rect = useRef(null);
  const mx = useMotionValue(0),
    my = useMotionValue(0);
  const cfg = { stiffness: 180, damping: 22, mass: 0.35 };
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [max, -max]), cfg);
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-max, max]), cfg);

  const measure = () => {
    if (ref.current) rect.current = ref.current.getBoundingClientRect();
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={
        reduce
          ? {}
          : {
              rotateX: rx,
              rotateY: ry,
              transformStyle: "preserve-3d",
              willChange: "transform",
              transform: "translateZ(0)",
            }
      }
      onMouseEnter={measure}
      onMouseMove={(e) => {
        const r = rect.current;
        if (!r) return; // no layout read per frame
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div style={reduce ? {} : { transform: `translateZ(${z}px)` }}>{children}</div>
    </motion.div>
  );
}

/** Counts up once, on view. Indian digit grouping, because every number is INR. */
export function Count({ to, prefix = "", suffix = "", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    let raf, start;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1500, 1);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {v.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/**
 * The primary call to action. A Link, not a button — every CTA on the
 * marketing site navigates, and rendering navigation as a button loses
 * middle-click, open-in-new-tab and the status-bar preview.
 */
export function Cta({ label = "Get Outmail", href = "/pricing", className = "" }) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden bg-primary text-white font-syne font-semibold px-8 py-3.5 rounded-pill inline-flex items-center gap-2 shadow-[0_16px_44px_-14px_var(--brand-primary)] ${className}`}
    >
      <span className="relative z-10">{label}</span>
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-accent-light to-primary translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out"
      />
    </Link>
  );
}

/** The section label above every heading on the site. One component, one look. */
export function Kicker({ children, className = "" }) {
  return (
    <p className={`text-[10px] uppercase tracking-[4px] text-primary ${className}`}>{children}</p>
  );
}
