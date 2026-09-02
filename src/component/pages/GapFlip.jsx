"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import { Reveal, MaskLines, Kicker, EASE_OUT } from "@/component/motion/kit";

/**
 * The off-campus gap, as a switch.
 *
 * One panel that flips between "Today" and "With Outmail" rather than two
 * columns side by side. A reader watches the three lines change instead of
 * comparing them themselves, which is the difference between reading a
 * comparison and feeling one.
 *
 * It replaced a full-bleed table whose edge-to-edge grid lines made the
 * argument read as a spreadsheet.
 */
export const ROWS = [
  { l: "Reach", a: "The companies that visit campus", b: "Any company hiring, anywhere" },
  { l: "Student effort", a: "Blind applications into ATS queues", b: "Targeted outreach from their own inbox" },
  { l: "Your visibility", a: "Stops at the drive", b: "Cohort-level reporting all season" },
];

export function GapFlip() {
  const [on, setOn] = useState(false);
  const reduce = useReducedMotion();
  return (
    <section className="max-w-4xl mx-auto px-6 py-24">
      <Reveal className="mb-8">
        <Kicker className="mb-4">The off-campus gap</Kicker>
        <MaskLines lines={["Flip the switch."]} className="font-syne text-3xl md:text-4xl font-bold tracking-tight mb-3" />
        <p className="text-white/45 max-w-lg">Same batch, same season. The only variable is whether they have Outmail.</p>
      </Reveal>
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 rounded-pill border border-white/12 bg-white/[0.03]" role="tablist">
          {[{ k: false, l: "Today" }, { k: true, l: "With Outmail" }].map((o) => (
            <button key={o.l} role="tab" aria-selected={on === o.k} onClick={() => setOn(o.k)}
              className="relative px-6 py-2.5 font-syne text-sm font-semibold rounded-pill transition-colors">
              {on === o.k && (
                <motion.span layoutId="gap-pill" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-pill bg-primary" />
              )}
              <span className={`relative ${on === o.k ? "text-white" : "text-white/45"}`}>{o.l}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={`rounded-3xl border p-9 transition-colors duration-300 ${on ? "border-primary/35 bg-gradient-to-br from-primary/12 to-transparent" : "border-white/10 bg-white/[0.02]"}`}>
        <div className="space-y-7">
          {ROWS.map((r, i) => (
            <div key={r.l} className="grid md:grid-cols-12 gap-4 items-baseline">
              <p className="md:col-span-3 text-[10px] uppercase tracking-[2px] text-white/30">{r.l}</p>
              <div className="md:col-span-9 min-h-[28px]">
                <AnimatePresence mode="wait">
                  <motion.p key={`${r.l}-${on}`}
                    initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? {} : { opacity: 0, y: -12 }}
                    transition={{ duration: 0.28, delay: i * 0.05, ease: EASE_OUT }}
                    className={`text-lg leading-relaxed ${on ? "text-white/85" : "text-white/40"}`}>
                    {on ? r.b : r.a}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default GapFlip;
