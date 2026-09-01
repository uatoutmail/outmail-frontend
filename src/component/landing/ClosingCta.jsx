"use client";
import { Check } from "lucide-react";
import { Reveal, Count, Cta } from "@/component/motion/kit";
import { OFFERINGS } from "./Editorial";

export default function ClosingCta() {
  return (
    <section className="relative max-w-4xl mx-auto px-6 py-28 text-center">
      {/* A radial-gradient, not `blur-[130px]` on a filled circle. A 520px blur
          forces the compositor to re-rasterise that whole square every paint —
          on a scrolling page that is a dropped frame you can feel. The gradient
          is free and looks the same. */}
      <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] pointer-events-none"
        style={{ background: "radial-gradient(circle at center, color-mix(in srgb, var(--brand-primary) 26%, transparent), transparent 68%)" }} />
      <div className="relative">
        <Reveal>
          <p className="font-syne text-4xl md:text-6xl font-bold tracking-tight mb-5">
            Your placement year<br />starts <span className="bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent">now.</span>
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="text-white/50 mb-3">
            <span className="font-syne text-3xl font-bold text-white"><Count to={999} prefix="₹" /></span>
            <span className="ml-2">for twelve months</span>
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-sm text-white/35 mb-9">No subscription. Nothing renews. Full refund within 7 days.</p>
        </Reveal>
        <Reveal delay={0.3}><div><Cta label="Start your year" /></div></Reveal>
        <Reveal delay={0.4}>
          {/* Mentorship is deliberately absent from this strip: it is PLAN_B at
              ₹4,999, and listing it under ₹999 is the kind of claim a refund
              request gets built on. */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-10 text-xs text-white/35">
            {OFFERINGS.filter((o) => o.t !== "Mentorship").map((o) => (
              <span key={o.t} className="inline-flex items-center gap-1.5"><Check size={11} className="text-primary" />{o.t}</span>
            ))}
            <span className="inline-flex items-center gap-1.5 text-white/25">Mentorship from ₹4,999</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
