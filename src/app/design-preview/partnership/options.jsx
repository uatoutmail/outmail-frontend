"use client";
import React, { useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Check, Minus, BarChart3, Users, ShieldCheck, FileSpreadsheet, Phone, ArrowRight } from "lucide-react";
import { Reveal, MaskLines, Count, Kicker, EASE_OUT } from "@/component/motion/kit";

/** The argument a placement officer is being asked to fund. */
export const GAP = [
  { n: "01", t: "Campus drives only reach the companies that come", d: "Everyone outside your drive calendar is invisible to your students, and that is most of the market." },
  { n: "02", t: "Students with no network apply blind", d: "They send into ATS queues, hear nothing, and conclude the problem is them." },
  { n: "03", t: "You have no view of what happens off campus", d: "Placement reporting stops at the drive. Everything your students do alone is unmeasured." },
];

export const OFFICE_GETS = [
  { I: Users, t: "Every student covered", d: "Outreach, matched jobs, autofill and mentorship for the whole batch, not just the top decile." },
  { I: BarChart3, t: "Off-campus visibility", d: "Applications, outreach sent and replies received, aggregated across your cohort." },
  { I: FileSpreadsheet, t: "Reporting you can hand upward", d: "Placement-season numbers that include the work students do outside your drives." },
  { I: ShieldCheck, t: "Sending stays with the student", d: "Every email goes from the student's own Gmail, on their approval. Your institution is never the sender." },
];

/* ═══ GAP — 3 layouts ═══ */
export function GapPanels() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <Reveal>
        <Kicker className="mb-4">The off-campus gap</Kicker>
        <MaskLines lines={["Your drives are working.", "The other 90% isn't."]} accentIdx={1}
          className="font-syne text-3xl md:text-4xl font-bold tracking-tight mb-10" />
      </Reveal>
      <div className="grid md:grid-cols-3 gap-4">
        {GAP.map((g, i) => (
          <Reveal key={g.n} delay={i * 0.08}>
            <motion.div whileHover={reduce ? {} : { y: -4 }} transition={{ duration: 0.22, ease: EASE_OUT }}
              className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <p className="font-syne text-3xl font-bold text-primary/25 leading-none mb-4">{g.n}</p>
              <h3 className="font-syne text-lg font-bold mb-2.5 leading-snug">{g.t}</h3>
              <p className="text-sm text-white/45 leading-relaxed">{g.d}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function GapBeforeAfter() {
  const rows = [
    { l: "Reach", a: "The companies that visit campus", b: "Any company hiring, anywhere" },
    { l: "Student effort", a: "Blind applications into ATS queues", b: "Targeted outreach from their own inbox" },
    { l: "Your visibility", a: "Stops at the drive", b: "Cohort-level reporting all season" },
  ];
  return (
    <section className="py-20">
      <Reveal className="max-w-5xl mx-auto px-6 mb-10">
        <Kicker className="mb-4">The off-campus gap</Kicker>
        <MaskLines lines={["Left is today.", "Right is with Outmail."]} accentIdx={1}
          className="font-syne text-3xl md:text-4xl font-bold tracking-tight" />
      </Reveal>
      <div className="space-y-px">
        {rows.map((r, i) => (
          <Reveal key={r.l} delay={i * 0.06}>
            <div className="grid md:grid-cols-12 border-y border-white/8">
              <div className="md:col-span-3 px-6 md:px-10 py-6 flex items-center">
                <span className="text-[10px] uppercase tracking-[3px] text-white/30">{r.l}</span>
              </div>
              <div className="md:col-span-4 px-6 md:px-10 py-6 bg-white/[0.015]">
                <p className="text-[15px] text-white/40 leading-relaxed">{r.a}</p>
              </div>
              <div className="md:col-span-5 px-6 md:px-10 py-6 bg-primary/[0.06] border-l border-primary/20">
                <p className="text-[15px] text-white/80 leading-relaxed">{r.b}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function GapStat() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20 text-center">
      <Reveal>
        <Kicker className="mb-6">The off-campus gap</Kicker>
        <p className="font-syne text-6xl md:text-8xl font-bold text-primary leading-none mb-5">
          <Count to={250} suffix="+" />
        </p>
        <MaskLines lines={["applications per opening,", "and your drives are not in that pile."]} accentIdx={1}
          className="font-syne text-2xl md:text-3xl font-bold tracking-tight mb-6" />
        <p className="text-white/45 max-w-xl mx-auto leading-relaxed">
          Campus drives reach the companies that come to you. Everything else your students do
          alone, blind, and unmeasured. Outmail is the part of placement season you currently
          cannot see.
        </p>
      </Reveal>
    </section>
  );
}

/* ═══ WHAT THE OFFICE GETS — 3 layouts ═══ */
export function OfficeGrid() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <Reveal><Kicker className="mb-8">What your placement office gets</Kicker></Reveal>
      <div className="grid md:grid-cols-2 gap-4">
        {OFFICE_GETS.map((o, i) => (
          <Reveal key={o.t} delay={i * 0.07}>
            <motion.div whileHover={reduce ? {} : { y: -4 }} transition={{ duration: 0.22, ease: EASE_OUT }}
              className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7 hover:border-primary/40 transition-colors">
              <o.I size={18} className="text-primary mb-4" />
              <h3 className="font-syne text-lg font-bold mb-2.5">{o.t}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{o.d}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function OfficeLedger() {
  const rows = [
    { l: "Outreach, matched jobs, autofill, mentorship", s: true, i: true },
    { l: "Cohort-level reporting across the batch", s: false, i: true },
    { l: "Onboarding session for your students", s: false, i: true },
    { l: "Named point of contact at Outmail", s: false, i: true },
    { l: "Billing handled per student", s: true, i: false },
    { l: "Billing handled institutionally", s: false, i: true },
  ];
  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <Reveal>
        <Kicker className="mb-4">What your placement office gets</Kicker>
        <MaskLines lines={["Individual, or institutional."]} className="font-syne text-3xl md:text-4xl font-bold tracking-tight mb-10" />
      </Reveal>
      <Reveal delay={0.1}>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-4 border-b border-white/10 bg-white/[0.02] text-[10px] uppercase tracking-[2px]">
            <span className="col-span-6 text-white/25">&nbsp;</span>
            <span className="col-span-3 text-center text-white/40">Student buys</span>
            <span className="col-span-3 text-center text-primary">Institution</span>
          </div>
          {rows.map((r, i) => (
            <div key={r.l} className={`grid grid-cols-12 px-6 py-4 items-center border-b border-white/[0.06] last:border-0 ${!r.s ? "bg-primary/[0.04]" : ""}`}>
              <span className="col-span-6 text-[13px] text-white/60">{r.l}</span>
              <span className="col-span-3 flex justify-center">
                {r.s ? <Check size={16} className="text-white/50" /> : <Minus size={16} className="text-white/15" />}
              </span>
              <span className="col-span-3 flex justify-center">
                {r.i ? <Check size={16} className="text-primary" /> : <Minus size={16} className="text-white/15" />}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function OfficeDashboard() {
  const [tab, setTab] = useState(0);
  const reduce = useReducedMotion();
  const tabs = ["Cohort", "Outreach", "Placements"];
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-5">
          <Kicker className="mb-4">What your placement office gets</Kicker>
          <MaskLines lines={["The season you", "currently can't see."]} accentIdx={1}
            className="font-syne text-3xl md:text-4xl font-bold tracking-tight mb-5" />
          <div className="space-y-4 mt-6">
            {OFFICE_GETS.map((o) => (
              <div key={o.t} className="flex gap-3">
                <o.I size={16} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-syne text-[15px] font-bold">{o.t}</p>
                  <p className="text-[13px] text-white/45 leading-relaxed">{o.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Reveal delay={0.15} className="md:col-span-7">
          <div className="rounded-2xl border border-white/12 bg-gradient-to-br from-primary/10 to-transparent p-2">
            <div className="rounded-xl bg-black/40 border border-white/8 overflow-hidden">
              <div className="flex gap-1 p-2 border-b border-white/8">
                {tabs.map((t, i) => (
                  <button key={t} onClick={() => setTab(i)}
                    className={`text-[11px] px-3 py-1.5 rounded-lg transition-colors ${tab === i ? "bg-primary text-white" : "text-white/40 hover:text-white/70"}`}>{t}</button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={tab}
                  initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? {} : { opacity: 0, y: -10 }} transition={{ duration: 0.24, ease: EASE_OUT }}
                  className="p-5">
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {[["Students", 420], ["Active", 318], ["Replies", 96]].map(([l, v]) => (
                      <div key={l} className="rounded-lg border border-white/8 bg-white/[0.03] p-3">
                        <p className="text-[10px] uppercase tracking-[1.5px] text-white/30 mb-1">{l}</p>
                        <p className="font-syne text-xl font-bold text-primary">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-end gap-1.5 h-24">
                    {[38, 52, 44, 71, 63, 88, 76, 94].map((h, i) => (
                      <motion.div key={i} initial={reduce ? false : { height: 0 }} animate={{ height: `${h}%` }}
                        transition={{ duration: 0.5, delay: i * 0.04, ease: EASE_OUT }}
                        className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-accent-light/70" />
                    ))}
                  </div>
                  <p className="text-[10px] text-white/25 mt-3">Illustrative. Reporting is built with your office during onboarding.</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══ CTA BAND — 2 layouts ═══ */
export function CtaBandCentred({ onBook }) {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24 text-center relative">
      <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--brand-primary) 22%, transparent), transparent 70%)" }} />
      <div className="relative">
        <Reveal>
          <MaskLines lines={["Let's talk about", "your batch."]} accentIdx={1}
            className="font-syne text-4xl md:text-5xl font-bold tracking-tight mb-5" />
          <p className="text-white/45 max-w-lg mx-auto mb-8">
            Institutional pricing depends on cohort size and what reporting you need, so it is a
            conversation rather than a number on a page.
          </p>
          <button onClick={onBook}
            className="font-syne font-semibold bg-primary hover:bg-primary-hover text-white rounded-pill px-8 py-3.5 inline-flex items-center gap-2 transition-colors">
            <Phone size={16} /> Book a call <ArrowRight size={15} />
          </button>
        </Reveal>
      </div>
    </section>
  );
}

export function CtaBandSplit({ onBook }) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <Reveal>
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/12 to-transparent p-9 md:flex items-center gap-10">
          <div className="flex-1 mb-6 md:mb-0">
            <p className="font-syne text-2xl md:text-3xl font-bold tracking-tight mb-3">Let&rsquo;s talk about your batch.</p>
            <p className="text-sm text-white/45 leading-relaxed max-w-lg">
              Institutional pricing depends on cohort size and the reporting you need, so it is a
              conversation rather than a number on a page. No discount framing, no pressure.
            </p>
          </div>
          <button onClick={onBook}
            className="shrink-0 font-syne font-semibold bg-primary hover:bg-primary-hover text-white rounded-btn px-7 py-3.5 inline-flex items-center gap-2 transition-colors">
            <Phone size={16} /> Book a call
          </button>
        </div>
      </Reveal>
    </section>
  );
}

export const GAP_LAYOUTS = [
  { label: "Panels", C: GapPanels },
  { label: "Before/after", C: GapBeforeAfter },
  { label: "Stat-led", C: GapStat },
];
export const OFFICE_LAYOUTS = [
  { label: "Grid", C: OfficeGrid },
  { label: "Ledger", C: OfficeLedger },
  { label: "Dashboard", C: OfficeDashboard },
];
export const CTA_LAYOUTS = [
  { label: "Centred", C: CtaBandCentred },
  { label: "Split band", C: CtaBandSplit },
];
