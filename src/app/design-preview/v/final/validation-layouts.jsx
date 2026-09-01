"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal, MaskLines, EASE_OUT } from "../kit";

/**
 * EARLY VALIDATION — five tellings, one set of quotes.
 *
 * These are students describing the PROBLEM, not customers describing a result.
 * That distinction is deliberate and every layout states it: we have no
 * outcomes yet, and inventing them is the one thing that would actually be
 * indefensible at launch.
 */
export const QUOTES = [
  { q: "I sent 180 applications and heard back from four. I don't think anyone read them.", a: "Aditi", m: "Final year · VIT Vellore", tag: "the pile" },
  { q: "I don't know a single person at any of these companies. That's the actual problem.", a: "Rohan", m: "Final year · PES Bengaluru", tag: "no referrals" },
  { q: "Everyone says referrals are how you get in. Nobody says what to do if you have none.", a: "Sneha", m: "Final year · NIT Trichy", tag: "no referrals" },
  { q: "I spend more time filtering LinkedIn than actually applying anywhere.", a: "Kabir", m: "Pre-final year · Manipal", tag: "the search" },
  { q: "By the tenth form I was copy-pasting the same paragraph and hoping nobody noticed.", a: "Meera", m: "Final year · SRM Chennai", tag: "the forms" },
  { q: "A recruiter finally replied and I had no idea what to even ask her.", a: "Arjun", m: "Final year · IIIT Hyderabad", tag: "the interview" },
];

const DISCLAIMER =
  "Real conversations, quoted with permission. We have no customer results to show yet — when we do, they go here.";

function Head({ lines, sub, center = false }) {
  return (
    <Reveal className={center ? "text-center" : ""}>
      <p className="text-[10px] uppercase tracking-[4px] text-primary mb-4">Early validation</p>
      <MaskLines lines={lines} className="font-syne text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-4" />
      <p className={`text-white/45 ${center ? "max-w-xl mx-auto" : "max-w-xl"}`}>{sub}</p>
    </Reveal>
  );
}

/* ═══ V1 · GRID — four cards, plainest possible reading. ═══ */
export function ValidationGrid() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-5xl mx-auto px-6 py-28">
      <div className="mb-12">
        <Head lines={["We asked students first."]}
          sub="Before we built anything. Nobody was asked whether they wanted Outmail — only what was hard." />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {QUOTES.slice(0, 4).map((x, i) => (
          <Reveal key={x.a} delay={i * 0.08}>
            <motion.div whileHover={reduce ? {} : { y: -4 }} transition={{ duration: 0.22, ease: EASE_OUT }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 h-full hover:border-primary/40 transition-colors duration-200">
              <p className="font-syne text-3xl text-primary/30 leading-none mb-3">&ldquo;</p>
              <p className="font-syne text-lg leading-snug mb-5">{x.q}</p>
              <p className="text-xs text-white/40">{x.a} · {x.m}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}><p className="text-center text-xs text-white/30 mt-8">{DISCLAIMER}</p></Reveal>
    </section>
  );
}

/* ═══ V2 · SPOTLIGHT — one enormous quote at a time. Auto-advances, pauses on
       hover or focus, and is fully keyboard-operable. ═══ */
export function ValidationSpotlight() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = QUOTES.length;

  useEffect(() => {
    // Auto-rotation stops for reduced motion and on hover/focus — an unstoppable
    // carousel is the single most common accessibility failure in this pattern.
    if (paused || reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), 5200);
    return () => clearInterval(t);
  }, [paused, reduce, n]);

  const go = (d) => setI((v) => (v + d + n) % n);
  const x = QUOTES[i];

  return (
    <section className="max-w-4xl mx-auto px-6 py-28"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <Head center lines={["We asked students first."]}
        sub="Six conversations, before a line of product existed." />
      <div className="relative mt-14 min-h-[290px] flex items-center justify-center text-center">
        <Quote size={120} className="absolute -top-4 left-1/2 -translate-x-1/2 text-primary/[0.07]" />
        <AnimatePresence mode="wait">
          <motion.div key={i}
            initial={reduce ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
            exit={reduce ? {} : { opacity: 0, y: -22 }} transition={{ duration: 0.45, ease: EASE_OUT }}
            className="relative">
            <p className="font-syne text-2xl md:text-4xl font-bold leading-[1.25] mb-7">{x.q}</p>
            <p className="text-sm text-primary">{x.a}</p>
            <p className="text-xs text-white/35">{x.m}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-center gap-5 mt-10">
        <button onClick={() => go(-1)} aria-label="Previous quote"
          className="w-9 h-9 rounded-full border border-white/15 hover:border-primary hover:text-primary text-white/50 flex items-center justify-center transition-colors">
          <ChevronLeft size={16} />
        </button>
        <div className="flex gap-2" role="tablist" aria-label="Quotes">
          {QUOTES.map((q, k) => (
            <button key={q.a} onClick={() => setI(k)} role="tab" aria-selected={k === i}
              aria-label={`Quote ${k + 1} of ${n}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${k === i ? "w-7 bg-primary" : "w-1.5 bg-white/20 hover:bg-white/40"}`} />
          ))}
        </div>
        <button onClick={() => go(1)} aria-label="Next quote"
          className="w-9 h-9 rounded-full border border-white/15 hover:border-primary hover:text-primary text-white/50 flex items-center justify-center transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
      <p className="text-center text-xs text-white/30 mt-10">{DISCLAIMER}</p>
    </section>
  );
}

/* ═══ V3 · MARQUEE WALL — two counter-scrolling rows. Picks up the kinetic
       band's language, so the page has one motion idea rather than five. ═══ */
function Row({ items, reverse, reduce }) {
  const doubled = [...items, ...items];   // duplicated so the loop has no seam
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <motion.div className="flex gap-4 shrink-0"
        animate={reduce ? {} : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 42, repeat: Infinity, ease: "linear" }}>
        {doubled.map((x, i) => (
          <div key={i} className="w-[340px] shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[9px] uppercase tracking-[2px] text-primary mb-3">{x.tag}</p>
            <p className="font-syne text-base leading-snug mb-4">{x.q}</p>
            <p className="text-xs text-white/35">{x.a} · {x.m}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function ValidationMarquee() {
  const reduce = useReducedMotion();
  return (
    <section className="py-28 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <Head lines={["Everyone said", "the same four things."]}
          sub="Six students, six campuses, no prompting. The overlap is the reason Outmail exists." />
      </div>
      <div className="space-y-4">
        <Row items={QUOTES} reduce={reduce} />
        <Row items={[...QUOTES].reverse()} reverse reduce={reduce} />
      </div>
      <p className="text-center text-xs text-white/30 mt-10 px-6">{DISCLAIMER}</p>
    </section>
  );
}

/* ═══ V4 · PINBOARD — uneven, slightly tilted notes. Reads as raw research
       rather than as marketing copy, which is what these actually are. ═══ */
export function ValidationPinboard() {
  const reduce = useReducedMotion();
  const tilt = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.9];
  const span = ["md:col-span-7", "md:col-span-5", "md:col-span-5", "md:col-span-7", "md:col-span-6", "md:col-span-6"];
  return (
    <section className="max-w-5xl mx-auto px-6 py-28">
      <div className="mb-12">
        <Head lines={["The research wall."]}
          sub="Unedited lines from our first six conversations. We put them on a wall and built against them." />
      </div>
      <div className="grid md:grid-cols-12 gap-4">
        {QUOTES.map((x, i) => (
          <Reveal key={x.a} delay={i * 0.06} className={`col-span-12 ${span[i]}`}>
            <motion.div initial={reduce ? false : { rotate: tilt[i] }}
              whileHover={reduce ? {} : { rotate: 0, y: -5, scale: 1.015 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="h-full rounded-xl border border-white/12 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 relative">
              {/* the pin */}
              <span className="absolute -top-1.5 left-6 w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/40" />
              <p className="font-syne text-lg leading-snug mb-4 mt-2">{x.q}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-white/35">{x.a} · {x.m}</p>
                <span className="text-[9px] uppercase tracking-[2px] text-primary/70 border border-primary/25 rounded-full px-2 py-0.5">{x.tag}</span>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}><p className="text-center text-xs text-white/30 mt-10">{DISCLAIMER}</p></Reveal>
    </section>
  );
}

/* ═══ V5 · THREAD — the quotes as the messages they were. Honest to their
       origin, and the format students read all day. ═══ */
export function ValidationThread() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-3xl mx-auto px-6 py-28">
      <div className="mb-12">
        <Head lines={["We just asked them."]}
          sub="No survey, no incentive. Six messages, quoted as they were sent." />
      </div>
      <div className="space-y-5">
        {QUOTES.map((x, i) => (
          <Reveal key={x.a} delay={i * 0.07}>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent-light shrink-0 flex items-center justify-center font-syne text-sm font-bold text-white">
                {x.a[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-sm font-medium text-white/80">{x.a}</span>
                  <span className="text-[11px] text-white/30">{x.m}</span>
                </div>
                <motion.div whileHover={reduce ? {} : { x: 3 }} transition={{ duration: 0.2, ease: EASE_OUT }}
                  className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.04] px-5 py-4">
                  <p className="text-[15px] leading-relaxed text-white/85">{x.q}</p>
                </motion.div>
              </div>
            </div>
          </Reveal>
        ))}
        {/* our reply closes the thread — the section makes its own point */}
        <Reveal delay={0.15}>
          <div className="flex items-start gap-3 flex-row-reverse">
            <div className="w-9 h-9 rounded-full bg-primary shrink-0 flex items-center justify-center font-syne text-xs font-bold text-white">
              O
            </div>
            <div className="max-w-md">
              <p className="text-sm font-medium text-white/80 mb-1.5 text-right">Outmail</p>
              <div className="rounded-2xl rounded-tr-sm border border-primary/30 bg-primary/12 px-5 py-4">
                <p className="text-[15px] leading-relaxed text-white/85">
                  So we built the four things that fix exactly those four problems.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.2}><p className="text-center text-xs text-white/30 mt-10">{DISCLAIMER}</p></Reveal>
    </section>
  );
}

export const VALIDATION_LAYOUTS = [
  { label: "Grid", C: ValidationGrid },
  { label: "Spotlight", C: ValidationSpotlight },
  { label: "Marquee", C: ValidationMarquee },
  { label: "Pinboard", C: ValidationPinboard },
  { label: "Thread", C: ValidationThread },
];
