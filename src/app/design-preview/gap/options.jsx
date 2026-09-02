"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Check, ArrowRight, ArrowDown } from "lucide-react";
import { Reveal, MaskLines, Kicker, EASE_OUT } from "@/component/motion/kit";

/** Copy is fixed; only the arrangement changes. */
export const ROWS = [
  { l: "Reach", a: "The companies that visit campus", b: "Any company hiring, anywhere" },
  { l: "Student effort", a: "Blind applications into ATS queues", b: "Targeted outreach from their own inbox" },
  { l: "Your visibility", a: "Stops at the drive", b: "Cohort-level reporting all season" },
];

/* ═══ 1 · TWO PANELS — one card for today, one for with Outmail, side by side.
       Contained rather than full-bleed, so it reads as a comparison instead of
       a table that has escaped its margins. ═══ */
export function GapPanels() {
  const reduce = useReducedMotion();
  const cols = [
    { t: "Today", tone: "muted", I: X, items: ROWS.map((r) => [r.l, r.a]) },
    { t: "With Outmail", tone: "brand", I: Check, items: ROWS.map((r) => [r.l, r.b]) },
  ];
  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <Reveal className="mb-10">
        <Kicker className="mb-4">The off-campus gap</Kicker>
        <MaskLines lines={["Your drives are working.", "Everything else isn't."]} accentIdx={1}
          className="font-syne text-3xl md:text-4xl font-bold tracking-tight" />
      </Reveal>
      <div className="grid md:grid-cols-2 gap-4">
        {cols.map((c, ci) => (
          <Reveal key={c.t} delay={ci * 0.1}>
            <motion.div whileHover={reduce ? {} : { y: -4 }} transition={{ duration: 0.22, ease: EASE_OUT }}
              className={`h-full rounded-3xl border p-8 ${
                c.tone === "brand" ? "border-primary/35 bg-gradient-to-br from-primary/12 to-transparent" : "border-white/10 bg-white/[0.02]"}`}>
              <p className={`text-[10px] uppercase tracking-[3px] mb-6 ${c.tone === "brand" ? "text-primary" : "text-white/30"}`}>{c.t}</p>
              <div className="space-y-6">
                {c.items.map(([l, v]) => (
                  <div key={l}>
                    <p className="text-[10px] uppercase tracking-[2px] text-white/25 mb-1.5">{l}</p>
                    <p className={`flex gap-2.5 text-[15px] leading-relaxed ${c.tone === "brand" ? "text-white/85" : "text-white/40"}`}>
                      <c.I size={15} className={`shrink-0 mt-1 ${c.tone === "brand" ? "text-primary" : "text-white/20"}`} />
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══ 2 · FLIP — one panel, a toggle between Today and With Outmail. The
       change is felt because you watch it happen rather than compare two
       columns yourself. ═══ */
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

/* ═══ 3 · ARROWS — each row states the problem, then arrows into the fix.
       Vertical, contained, and the direction of travel is explicit. ═══ */
export function GapArrows() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24">
      <Reveal className="mb-12">
        <Kicker className="mb-4">The off-campus gap</Kicker>
        <MaskLines lines={["Three things change."]} className="font-syne text-3xl md:text-4xl font-bold tracking-tight" />
      </Reveal>
      <div className="space-y-4">
        {ROWS.map((r, i) => (
          <Reveal key={r.l} delay={i * 0.08}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
              <p className="text-[10px] uppercase tracking-[3px] text-primary mb-4">{r.l}</p>
              <div className="md:flex items-center gap-6">
                <p className="md:flex-1 text-[15px] text-white/35 leading-relaxed line-through decoration-white/15">{r.a}</p>
                <span className="hidden md:flex w-9 h-9 rounded-full border border-primary/30 bg-primary/10 items-center justify-center shrink-0">
                  <ArrowRight size={15} className="text-primary" />
                </span>
                <span className="md:hidden flex my-3"><ArrowDown size={16} className="text-primary" /></span>
                <p className="md:flex-1 text-[15px] text-white/85 leading-relaxed">{r.b}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══ 4 · SPLIT SCREEN — the left half stays dim and still while the right
       half is lit. Boldest, and it keeps the full-bleed drama without the
       hard grid lines that made the table read as a spreadsheet. ═══ */
export function GapSplitScreen() {
  const reduce = useReducedMotion();
  return (
    <section className="py-24">
      <Reveal className="max-w-5xl mx-auto px-6 mb-12">
        <Kicker className="mb-4">The off-campus gap</Kicker>
        <MaskLines lines={["Left is today.", "Right is with Outmail."]} accentIdx={1}
          className="font-syne text-3xl md:text-4xl font-bold tracking-tight" />
      </Reveal>
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-px rounded-3xl overflow-hidden border border-white/10">
          <div className="bg-white/[0.015] p-9 md:p-11">
            <p className="text-[10px] uppercase tracking-[3px] text-white/25 mb-8">Without</p>
            <div className="space-y-8">
              {ROWS.map((r) => (
                <div key={r.l}>
                  <p className="text-[10px] uppercase tracking-[2px] text-white/20 mb-1.5">{r.l}</p>
                  <p className="text-lg text-white/35 leading-snug">{r.a}</p>
                </div>
              ))}
            </div>
          </div>
          <motion.div whileHover={reduce ? {} : { backgroundColor: "color-mix(in srgb, var(--brand-primary) 12%, transparent)" }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="p-9 md:p-11 relative"
            style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 14%, transparent), transparent 75%)" }}>
            <p className="text-[10px] uppercase tracking-[3px] text-primary mb-8">With Outmail</p>
            <div className="space-y-8">
              {ROWS.map((r) => (
                <div key={r.l}>
                  <p className="text-[10px] uppercase tracking-[2px] text-primary/60 mb-1.5">{r.l}</p>
                  <p className="text-lg text-white/85 leading-snug">{r.b}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══ 5 · LEDGER — the same shape as the pricing table, so a placement officer
       reads it with a format they have already learned on this site. ═══ */
export function GapLedger() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24">
      <Reveal className="mb-10">
        <Kicker className="mb-4">The off-campus gap</Kicker>
        <MaskLines lines={["What changes,", "line by line."]} accentIdx={1}
          className="font-syne text-3xl md:text-4xl font-bold tracking-tight" />
      </Reveal>
      <Reveal delay={0.1}>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-4 border-b border-white/10 bg-white/[0.02] text-[10px] uppercase tracking-[2px]">
            <span className="col-span-3 text-white/25">&nbsp;</span>
            <span className="col-span-4 text-white/30">Today</span>
            <span className="col-span-5 text-primary">With Outmail</span>
          </div>
          {ROWS.map((r, i) => (
            <Reveal key={r.l} delay={i * 0.05}>
              <div className="grid grid-cols-12 gap-3 px-6 py-6 items-start border-b border-white/[0.06] last:border-0">
                <span className="col-span-12 md:col-span-3 text-[10px] uppercase tracking-[2px] text-white/30 mb-2 md:mb-0">{r.l}</span>
                <span className="col-span-6 md:col-span-4 text-[14px] text-white/35 leading-relaxed">{r.a}</span>
                <span className="col-span-6 md:col-span-5 text-[14px] text-white/85 leading-relaxed">{r.b}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export const GAP_OPTIONS = [
  { label: "Two panels", C: GapPanels },
  { label: "Flip", C: GapFlip },
  { label: "Arrows", C: GapArrows },
  { label: "Split screen", C: GapSplitScreen },
  { label: "Ledger", C: GapLedger },
];
