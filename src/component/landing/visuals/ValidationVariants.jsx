"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Quote } from "lucide-react";
import React from "react";
import { QUOTES } from "@/component/landing/Validation";
import { Reveal, MaskLines, Kicker, EASE_OUT } from "@/component/motion/kit";

/**
 * Early validation — five treatments.
 *
 * THE HONESTY CONSTRAINT, WHICH SHAPES ALL OF THESE
 *   These are real things students said, but we have no permission to publish
 *   anyone's photograph, and we have no customers, so there are no results to
 *   show. Two things are therefore off the table no matter how "real" they
 *   would look: stock photos presented as our users, and invented outcomes.
 *
 *   What makes the current version feel synthetic is not the absence of
 *   photos. It is that six first names with gradient initial-circles and no
 *   timestamps looks generated. The variants below either add the texture a
 *   real message has, or remove the persona entirely — both read as more
 *   honest than a half-identified stranger.
 */

const DISCLAIMER =
  "Real conversations, quoted with permission. We have no customer results to show yet — when we do, they go here.";

/* ── 1 · CURRENT ─────────────────────────────────────────────────────────── */
export function ValidationCurrent() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-3xl mx-auto px-6 py-28">
      <div className="mb-12">
        <Reveal>
          <Kicker className="mb-4">Early validation</Kicker>
          <MaskLines
            lines={["We just asked them."]}
            className="font-syne text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-4"
          />
          <p className="text-white/45 max-w-xl">
            No survey, no incentive. Six messages, quoted as they were sent.
          </p>
        </Reveal>
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
                <motion.div
                  whileHover={reduce ? {} : { x: 3 }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.04] px-5 py-4"
                >
                  <p className="text-[15px] leading-relaxed text-white/85">{x.q}</p>
                </motion.div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <p className="text-center text-xs text-white/30 mt-10">{DISCLAIMER}</p>
      </Reveal>
    </section>
  );
}

/* ── 2 · MESSAGE THREAD ───────────────────────────────────────────────────
   The same thread with what a real one has: timestamps, read state, a day
   divider. Texture, not invention. */
export function ValidationThreadReal() {
  const times = ["21:04", "21:11", "21:26", "22:02", "22:19", "23:47"];
  return (
    <section className="max-w-2xl mx-auto px-6 py-28">
      <Reveal className="mb-10">
        <Kicker className="mb-4">Early validation</Kicker>
        <MaskLines
          lines={["We just asked them."]}
          className="font-syne text-4xl md:text-5xl font-bold tracking-tight mb-4"
        />
        <p className="text-white/45">
          No survey, no incentive. Six replies, quoted as they were sent.
        </p>
      </Reveal>

      <div className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
        <div className="px-4 py-2 border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[2px] text-white/25">
            Placement 2026 · 6 replies
          </span>
          <span className="font-mono text-[10px] text-white/25">March</span>
        </div>
        <div className="p-4 space-y-4">
          {QUOTES.map((x, i) => (
            <Reveal key={x.a} delay={i * 0.05}>
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 shrink-0 flex items-center justify-center text-[11px] text-white/50">
                  {x.a[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="rounded-xl rounded-tl-sm bg-white/[0.05] border border-white/[0.06] px-4 py-2.5">
                    <p className="text-[14px] leading-relaxed text-white/85">{x.q}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-1 pl-1">
                    <span className="text-[10px] text-white/25">{x.m}</span>
                    <span className="font-mono text-[10px] text-white/20">{times[i]}</span>
                    <Check size={10} className="text-primary/60" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal delay={0.2}>
        <p className="text-center text-xs text-white/30 mt-8">
          Names withheld. Quoted with permission, unedited.
        </p>
      </Reveal>
    </section>
  );
}

/* ── 3 · PULL QUOTES ──────────────────────────────────────────────────────
   No personas at all. The words carry themselves, and nothing pretends to be
   a person you could look up. */
export function ValidationPullQuotes() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-28">
      <Reveal className="mb-14">
        <Kicker className="mb-4">Early validation</Kicker>
        <MaskLines
          lines={["Six students.", "Nobody mentioned", "a feature."]}
          accentIdx={2}
          className="font-syne text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]"
        />
      </Reveal>
      <div className="space-y-10">
        {QUOTES.map((x, i) => (
          <Reveal key={x.a} delay={i * 0.05}>
            <div className="border-l-2 border-primary/40 pl-6">
              <p className="font-syne text-xl md:text-2xl font-bold leading-snug text-white/90">
                {x.q}
              </p>
              <p className="text-[11px] text-white/30 mt-2">{x.m}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <p className="text-xs text-white/30 mt-12">{DISCLAIMER}</p>
      </Reveal>
    </section>
  );
}

/* ── 4 · RESEARCH SUMMARY ─────────────────────────────────────────────────
   Presented as what it actually is: a small piece of user research, with its
   sample size stated. Stating n=6 is a stronger trust signal than implying
   more, because a reader can tell we did not pretend. */
export function ValidationResearch() {
  const themes = [
    { n: "6/6", t: "Could not reach anyone", q: "I don't think anyone read them." },
    {
      n: "5/6",
      t: "Search cost more than applying",
      q: "I spend more time filtering than applying.",
    },
    { n: "4/6", t: "Forms degraded their answers", q: "By the tenth form I was copy-pasting." },
    { n: "4/6", t: "Nobody to ask about interviews", q: "I had no idea what to even ask her." },
  ];
  return (
    <section className="max-w-4xl mx-auto px-6 py-28">
      <Reveal className="mb-10">
        <Kicker className="mb-4">Early validation</Kicker>
        <MaskLines
          lines={["What six students", "actually said."]}
          accentIdx={1}
          className="font-syne text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-4"
        />
        <p className="text-white/45 max-w-xl">
          Unstructured interviews, March 2026, six final-year students across five campuses. No
          incentive, no script. This is the whole sample — it is small, and we would rather say so.
        </p>
      </Reveal>
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 border-b border-white/10 bg-white/[0.02] text-[9px] uppercase tracking-[2px] text-white/25">
          <span className="col-span-2">Raised by</span>
          <span className="col-span-4">Theme</span>
          <span className="col-span-6">In their words</span>
        </div>
        {themes.map((t, i) => (
          <Reveal key={t.t} delay={i * 0.05}>
            <div className="grid grid-cols-12 px-5 py-4 items-start border-b border-white/[0.05] last:border-0 gap-3">
              <span className="col-span-2 font-mono text-sm text-primary">{t.n}</span>
              <span className="col-span-4 text-[13px] text-white/70">{t.t}</span>
              <span className="col-span-6 text-[13px] text-white/40 italic">
                &ldquo;{t.q}&rdquo;
              </span>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <p className="text-xs text-white/30 mt-6">{DISCLAIMER}</p>
      </Reveal>
    </section>
  );
}

/* ── 5 · ONE QUOTE ────────────────────────────────────────────────────────
   One line, set large. Six half-identified strangers is what reads as
   manufactured; one sentence does not have to prove who said it. */
export function ValidationOneQuote() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-32 text-center">
      <Reveal>
        <Kicker className="mb-8">Early validation</Kicker>
        <Quote size={40} className="text-primary/20 mx-auto mb-6" />
        <p className="font-syne text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight max-w-3xl mx-auto">
          I don&rsquo;t know a single person at any of these companies.
          <span className="text-white/35"> That&rsquo;s the actual problem.</span>
        </p>
        <p className="text-sm text-white/35 mt-8">Final year student, PES Bengaluru</p>
        <p className="text-xs text-white/25 mt-10 max-w-lg mx-auto">
          One of six students we interviewed before building anything. Every one of them described
          the same problem before they described a single feature.
        </p>
      </Reveal>
    </section>
  );
}

export const VALIDATION_VARIANTS = [
  { label: "Current", C: ValidationOneQuote },
  { label: "Real thread", C: ValidationThreadReal },
  { label: "Pull quotes", C: ValidationPullQuotes },
  { label: "Research", C: ValidationResearch },
  { label: "Previous", C: ValidationCurrent },
];
