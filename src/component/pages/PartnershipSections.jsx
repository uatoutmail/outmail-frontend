"use client";
import React from "react";

import { Check, Minus, Phone, ArrowRight } from "lucide-react";
import { Reveal, MaskLines, Kicker } from "@/component/motion/kit";


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

