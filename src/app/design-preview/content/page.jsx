"use client";
import React, { useState } from "react";
import Footer from "@/component/Footer";
import ClosingCta from "@/component/landing/ClosingCta";
import Editorial from "@/component/landing/Editorial";
import Faq from "@/component/landing/Faq";
import Hero from "@/component/landing/Hero";
import KineticBand from "@/component/landing/KineticBand";
import PricingLedger from "@/component/landing/PricingLedger";
import Story from "@/component/landing/Story";
import Validation from "@/component/landing/Validation";
import Navbar from "@/component/Navbar";
import { HERO, EDITORIAL, CLOSING } from "@/content/landing";

/**
 * Content lab — the landing page rendered with switchable copy.
 *
 * Preview only. Every variant renders through the REAL components, so a line
 * that wraps badly, overflows a card or breaks a two-line headline shows up
 * here exactly as it would in production. Judging copy in a chat window hides
 * precisely those failures.
 *
 * Variant 0 of every set is the live wording, so "Current" is a true baseline
 * rather than an approximation.
 */
function Lab({ groups }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] max-w-[96vw]">
      <div className="rounded-2xl border border-white/15 bg-black/90 backdrop-blur-md shadow-2xl overflow-hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full px-4 py-2 text-[10px] uppercase tracking-[2px] text-white/45 hover:text-white transition-colors"
        >
          Landing — content {open ? "▾" : "▴"}
        </button>
        {open && (
          <div className="px-4 pb-3.5 space-y-2.5">
            {groups.map((g) => (
              <div key={g.name} className="flex items-center gap-3 flex-wrap">
                <span className="w-[104px] shrink-0 text-[10px] uppercase tracking-[1.5px] text-white/35">
                  {g.name}
                </span>
                <div className="flex gap-1 flex-wrap">
                  {g.opts.map((o, k) => (
                    <button
                      key={o.label}
                      onClick={() => g.set(k)}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg transition-colors duration-200 ${
                        g.i === k
                          ? "bg-primary text-white"
                          : "bg-white/8 text-white/50 hover:bg-white/15"
                      }`}
                    >
                      {k + 1}. {o.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContentLab() {
  const [hero, setHero] = useState(0);
  const [ed, setEd] = useState(0);
  const [close, setClose] = useState(0);

  return (
    <div className="min-h-screen bg-surface-page text-white">
      <Navbar variant="dark" />
      <Hero copy={HERO[hero]} />
      <KineticBand />
      <Editorial copy={EDITORIAL[ed]} />
      <Story />
      <Validation />
      <PricingLedger />
      <Faq />
      <ClosingCta copy={CLOSING[close]} />
      <Footer variant="dark" />
      <Lab
        groups={[
          { name: "Hero", opts: HERO, i: hero, set: setHero },
          { name: "Four things", opts: EDITORIAL, i: ed, set: setEd },
          { name: "Closing CTA", opts: CLOSING, i: close, set: setClose },
        ]}
      />
    </div>
  );
}
