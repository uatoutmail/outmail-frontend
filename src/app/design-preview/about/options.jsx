"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Target, Users, ShieldCheck, Compass } from "lucide-react";
import { Reveal, MaskLines, Count, Kicker, EASE_OUT } from "@/component/motion/kit";

export const PRINCIPLES = [
  { I: Target, n: "01", t: "We sell reach, not outcomes",
    d: "We will not promise you a job, and we say so on the pricing page. What Outmail changes is how many of the right people see you, and how much of your time goes into applications worth making." },
  { I: ShieldCheck, n: "02", t: "Your inbox stays yours",
    d: "Outreach sends from your own Gmail, using an app password stored in your computer's keychain and never on our servers. Revoke it in your Google account and sending stops immediately." },
  { I: Users, n: "03", t: "Built for students without referrals",
    d: "Everyone says referrals are how you get in. Almost nobody says what to do if you have none. That gap is the entire product." },
  { I: Compass, n: "04", t: "One payment, then we get out of the way",
    d: "No subscription, no upsell ladder, no usage meter running while you think. You buy a placement year and you own it." },
];

/* ═══ P1 · CARDS — 2×2. Quiet, scannable. ═══ */
export function PrinciplesCards() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <Reveal><Kicker className="mb-8">What we hold to</Kicker></Reveal>
      <div className="grid md:grid-cols-2 gap-4">
        {PRINCIPLES.map((p, i) => (
          <Reveal key={p.t} delay={i * 0.07}>
            <motion.div whileHover={reduce ? {} : { y: -4 }} transition={{ duration: 0.22, ease: EASE_OUT }}
              className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7 hover:border-primary/40 transition-colors">
              <p.I size={18} className="text-primary mb-4" />
              <h3 className="font-syne text-xl font-bold mb-2.5">{p.t}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{p.d}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══ P2 · MANIFESTO — numbered, full width, set large. Reads as commitments
       someone signed rather than as feature blurbs. ═══ */
export function PrinciplesManifesto() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <Reveal><Kicker className="mb-10">What we hold to</Kicker></Reveal>
      <div className="border-t border-white/10">
        {PRINCIPLES.map((p, i) => (
          <Reveal key={p.t} delay={i * 0.06}>
            <div className="grid md:grid-cols-12 gap-5 py-9 border-b border-white/10">
              <span className="md:col-span-2 font-syne text-4xl font-bold text-primary/25 leading-none">{p.n}</span>
              <div className="md:col-span-10">
                <h3 className="font-syne text-2xl md:text-3xl font-bold tracking-tight mb-3">{p.t}</h3>
                <p className="text-white/50 leading-relaxed max-w-2xl">{p.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══ P3 · STICKY SPLIT — heading pins while the commitments scroll past. ═══ */
export function PrinciplesSticky() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4 md:sticky md:top-24 md:self-start">
          <Kicker className="mb-4">What we hold to</Kicker>
          <MaskLines lines={["Four things", "we won't trade."]} accentIdx={1}
            className="font-syne text-3xl md:text-4xl font-bold tracking-tight leading-[1.06] mb-5" />
          <p className="text-sm text-white/45 leading-relaxed">
            Every one of these costs us something — a claim we cannot make, a price we cannot
            charge, a customer we cannot take. That is what makes them worth writing down.
          </p>
        </div>
        <div className="md:col-span-8 space-y-4">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.06}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 hover:border-primary/40 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <p.I size={16} className="text-primary" />
                  <span className="font-mono text-[11px] text-white/25">{p.n}</span>
                </div>
                <h3 className="font-syne text-xl font-bold mb-2.5">{p.t}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ P4 · STATEMENTS — each principle as a full-bleed line, scroll-scrubbed.
       Loudest option; suits a page whose job is conviction, not detail. ═══ */
function Statement({ p, i }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "end 55%"] });
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.2, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.4], [30, 0]);
  return (
    <motion.div ref={ref} style={reduce ? {} : { opacity, y }} className="py-14 border-b border-white/8">
      <div className="max-w-5xl mx-auto px-6">
        <span className="text-[10px] uppercase tracking-[3px] text-primary">{p.n}</span>
        <h3 className="font-syne text-3xl md:text-5xl font-bold tracking-tight leading-[1.08] mt-3 mb-4 max-w-3xl">{p.t}</h3>
        <p className="text-white/45 leading-relaxed max-w-xl">{p.d}</p>
      </div>
    </motion.div>
  );
}
export function PrinciplesStatements() {
  return (
    <section className="py-12">
      <Reveal className="max-w-5xl mx-auto px-6 mb-6"><Kicker>What we hold to</Kicker></Reveal>
      {PRINCIPLES.map((p, i) => <Statement key={p.t} p={p} i={i} />)}
    </section>
  );
}

/* ═══ THE PROBLEM ═══ */
export function ProblemSplit() {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-8 pb-16">
      <div className="grid md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-7">
          <MaskLines lines={["Hiring stopped", "being a numbers game.", "Nobody told students."]} accentIdx={2}
            className="font-syne text-3xl md:text-4xl font-bold leading-[1.08] tracking-tight" />
        </div>
        <Reveal delay={0.25} className="md:col-span-5 md:border-l border-white/15 md:pl-8 md:pt-2">
          <p className="font-syne text-5xl font-bold text-primary/30 leading-none mb-2"><Count to={250} suffix="+" /></p>
          <p className="text-sm text-white/50 leading-relaxed">
            applications per opening. A recruiter reads perhaps twelve of them. Applying harder
            does not move you into the twelve — being reachable does.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function ProblemBand() {
  return (
    <section className="border-y border-white/8 py-16 px-6 my-8">
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-syne text-6xl md:text-8xl font-bold text-primary leading-none mb-4"><Count to={250} suffix="+" /></p>
        <p className="font-syne text-xl md:text-2xl font-bold mb-3">applications per opening.</p>
        <p className="text-white/45 max-w-lg mx-auto leading-relaxed">
          A recruiter reads perhaps twelve. Applying harder does not move you into the twelve —
          being reachable does. That is the whole reason Outmail exists.
        </p>
      </div>
    </section>
  );
}

/* ═══ WHO RUNS IT ═══ */
export function EntityCard() {
  return (
    <section className="max-w-5xl mx-auto px-6 pb-16">
      <Reveal>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:flex items-start gap-10">
          <div className="md:w-1/3 mb-5 md:mb-0">
            <Kicker className="mb-3">Who runs Outmail</Kicker>
            <p className="font-syne text-2xl font-bold leading-snug">PrimeWork Labs LLP</p>
          </div>
          <div className="md:w-2/3 text-sm text-white/50 leading-relaxed space-y-3">
            <p>Outmail is built and operated by PrimeWork Labs LLP (LLPIN ADB-2168), registered at 1/400, UIT, Bhiwadi, Alwar, Rajasthan 301019, India.</p>
            <p>We are a small team, which is why support is a person and not a queue, and why the mentorship tier is capped at 25 seats rather than sold to everyone who asks.</p>
            <p>Questions, complaints or anything to do with your data: <a href="mailto:support@outmail.in" className="text-primary hover:underline">support@outmail.in</a>.</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function EntityLetter() {
  return (
    <section className="max-w-2xl mx-auto px-6 pb-16">
      <Reveal>
        <Kicker className="mb-5">Who runs Outmail</Kicker>
        <div className="space-y-4 text-[15px] text-white/60 leading-relaxed">
          <p>We are a small team at PrimeWork Labs LLP in Bhiwadi, Rajasthan.</p>
          <p>Small is why support is a person and not a ticket queue, and why mentorship is capped at twenty-five seats instead of sold to everyone who asks. It is also why we would rather tell you plainly that we cannot guarantee you a job than write a sentence we would have to defend later.</p>
          <p>If something about Outmail is wrong, unclear or unfair, write to us and a human will answer.</p>
        </div>
        <p className="mt-7 text-sm text-white/35">
          PrimeWork Labs LLP · LLPIN ADB-2168 · 1/400, UIT, Bhiwadi, Alwar, Rajasthan 301019, India<br />
          <a href="mailto:support@outmail.in" className="text-primary hover:underline">support@outmail.in</a>
        </p>
      </Reveal>
    </section>
  );
}

export const PROBLEM = [
  { label: "Split", C: ProblemSplit },
  { label: "Band", C: ProblemBand },
];
export const PRINCIPLES_LAYOUTS = [
  { label: "Cards", C: PrinciplesCards },
  { label: "Manifesto", C: PrinciplesManifesto },
  { label: "Sticky", C: PrinciplesSticky },
  { label: "Statements", C: PrinciplesStatements },
];
export const ENTITY = [
  { label: "Card", C: EntityCard },
  { label: "Letter", C: EntityLetter },
];
