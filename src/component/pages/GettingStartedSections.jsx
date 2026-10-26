"use client";
import { motion, useReducedMotion } from "framer-motion";
import {
  FileText,
  KeyRound,
  MonitorDown,
  Puzzle,
  SlidersHorizontal,
  Check,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import React from "react";
import { Reveal, MaskLines, Kicker, EASE_OUT } from "@/component/motion/kit";
import { STEPS, AFTER_SETUP, TROUBLESHOOTING } from "@/lib/gettingStarted";

/**
 * /getting-started — the setup guide the welcome email links to.
 *
 * It is a page rather than a long email for a reason worth keeping: this is the
 * document people come back to at step three on a Sunday, and an email is the
 * worst possible place to re-find something. It is also the only customer
 * document that is public, so it doubles as the honest answer to "what does
 * this actually make me install?" for someone still deciding.
 *
 * The copy lives in src/lib/gettingStarted.js — see the note there about why.
 */

/** Icons are chosen here, not in the data, so the data stays serialisable. */
const ICONS = {
  resume: FileText,
  key: KeyRound,
  desktop: MonitorDown,
  extension: Puzzle,
  preferences: SlidersHorizontal,
};

/** Orientation strip — the same device the features page opens with. */
export function StepChips() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <Reveal>
        <Kicker className="mb-5">You can stop after step three and Outmail will be sending</Kicker>
      </Reveal>
      <div className="flex flex-wrap gap-2.5">
        {STEPS.map((s, i) => {
          const Icon = ICONS[s.icon];
          return (
            <Reveal key={s.id} delay={i * 0.06}>
              <motion.a
                href={`#${s.id}`}
                whileHover={reduce ? {} : { y: -3 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="inline-flex items-center gap-2.5 rounded-pill border border-white/12 bg-white/[0.03] hover:border-primary/50 pl-4 pr-3 py-3 transition-colors"
              >
                <Icon size={15} className="text-primary" />
                <span className="font-syne text-sm font-semibold">{s.t}</span>
                <ArrowUpRight size={13} className="text-white/25" />
              </motion.a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/**
 * The app-password panel.
 *
 * Step 2 is where people stop, and they stop because handing a password-shaped
 * thing to a third party feels wrong — which is a correct instinct. So the
 * answer to "where does this go" is set out on the page rather than left to be
 * discovered in a support reply, and the code's real shape is shown so nobody
 * wonders whether they copied the right string.
 */
function KeychainNote() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={14} className="text-primary" />
        <span className="text-[10px] uppercase tracking-[2px] text-primary">Where it is kept</span>
      </div>
      <div
        aria-hidden
        className="font-mono text-sm text-white/70 tracking-[0.25em] mb-4 select-none"
      >
        abcd efgh ijkl mnop
      </div>
      <p className="text-[13px] text-white/45 leading-relaxed">
        In your own computer&apos;s keychain — macOS Keychain or Windows Credential Manager. It is
        never sent to our servers and we cannot read it. Revoking it in your Google account stops
        all sending immediately.
      </p>
    </div>
  );
}

/**
 * The five steps as numbered chapters — the same treatment /features uses, so
 * the guide reads as part of the site rather than a help doc bolted on.
 */
export function SetupChapters() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16 space-y-24">
      {STEPS.map((s) => (
        <div key={s.id} id={s.id} className="scroll-mt-24">
          <Reveal>
            <div className="flex items-start gap-6 md:gap-10">
              <span className="font-syne text-[16vw] md:text-[8vw] font-bold leading-[0.8] bg-gradient-to-b from-primary/40 to-transparent bg-clip-text text-transparent shrink-0">
                {s.n}
              </span>
              <div className="flex-1 pt-2">
                <span className="text-[10px] uppercase tracking-[2px] text-primary">{s.pill}</span>
                <h2 className="font-syne text-3xl md:text-5xl font-bold tracking-tight mt-2 mb-4">
                  {s.t}
                </h2>
                <p className="text-white/50 leading-relaxed max-w-xl mb-6">{s.d}</p>
                <div className="grid gap-x-8 gap-y-2 max-w-2xl mb-7">
                  {s.points.map((point) => (
                    <span key={point} className="flex gap-2.5 text-sm text-white/55">
                      <Check size={14} className="text-primary shrink-0 mt-0.5" />
                      {point}
                    </span>
                  ))}
                </div>
                {s.note === "keychain" && <KeychainNote />}
              </div>
            </div>
          </Reveal>
        </div>
      ))}
    </section>
  );
}

/** What the product does once setup is done — expectations, set once. */
export function AfterSetup() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <Reveal>
        <Kicker className="mb-4">Once setup is done</Kicker>
        <MaskLines
          lines={["What happens", "next."]}
          accentIdx={1}
          className="font-syne text-3xl md:text-4xl font-bold tracking-tight mb-10"
        />
      </Reveal>
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        {AFTER_SETUP.map(([label, body], i) => (
          <Reveal key={label} delay={i * 0.05}>
            <div className="grid grid-cols-12 gap-3 px-6 py-5 border-b border-white/[0.06] last:border-0 items-start">
              <span className="col-span-12 md:col-span-4 text-[13px] text-white/45 mb-1 md:mb-0">
                {label}
              </span>
              <span className="col-span-12 md:col-span-8 text-[13px] text-white/70">{body}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/**
 * The four things support is actually asked, answered before they are asked.
 * Also the source of the page's FAQ structured data.
 */
export function Troubleshooting() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <Reveal>
        <Kicker className="mb-4">When it does not work</Kicker>
        <MaskLines
          lines={["The four things", "people get stuck on."]}
          accentIdx={1}
          className="font-syne text-3xl md:text-4xl font-bold tracking-tight mb-10"
        />
      </Reveal>
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
        {TROUBLESHOOTING.map((t, i) => (
          <Reveal key={t.q} delay={i * 0.05}>
            <div className="border-t border-white/12 pt-5">
              <h3 className="font-syne text-lg font-bold mb-2">{t.q}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{t.a}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
