"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, MaskLines, EASE_OUT } from "@/component/motion/kit";

/**
 * EARLY VALIDATION — the conversation thread. LOCKED.
 *
 * The quotes are shown as the messages they actually were, and Outmail replies
 * at the end so the section closes its own argument.
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


export default ValidationThread;
