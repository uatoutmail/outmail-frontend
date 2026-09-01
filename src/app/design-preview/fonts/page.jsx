"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

/**
 * FONT COMPARISON — /design-preview/fonts
 *
 * Six pairings rendered with Outmail's ACTUAL content, because specimens lie:
 * a font that looks great on "The quick brown fox" can fall apart on
 * "Get seen by real recruiters" at 72px, and on ₹999 in a pricing card.
 *
 * Loaded from Google Fonts via <link> for preview only. Whichever wins moves
 * into next/font in layout.js, which self-hosts and removes the network hop.
 *
 * Candidates are from the ui-ux-pro-max typography catalogue, filtered to
 * pairings whose stated audience is startups / youth / tech.
 */

const OPTIONS = [
  {
    id: "geist",
    name: "Syne + Geist",
    tag: "What you ship today",
    heading: "'Syne', sans-serif",
    body: "'Geist', sans-serif",
    note: "The baseline. Straight-sided, tight, engineered. Every option below is curvier than this — compare against it.",
    verdict: "Baseline",
  },
  {
    id: "figtree",
    name: "Syne + Figtree",
    tag: "Softly rounded",
    heading: "'Syne', sans-serif",
    body: "'Figtree', sans-serif",
    note: "Gently rounded terminals and open counters. Friendly without being childish — the curve is felt rather than seen. Probably the most usable of the curvy options.",
    verdict: "Curvy but still professional",
  },
  {
    id: "nunito",
    name: "Syne + Nunito Sans",
    tag: "Rounded terminals",
    heading: "'Syne', sans-serif",
    body: "'Nunito Sans', sans-serif",
    note: "Visibly rounded letter ends. Warm and approachable, and a real contrast against Syne's sharp angles — the pairing has actual tension, which is what makes a pairing interesting.",
    verdict: "Warmest contrast with Syne",
  },
  {
    id: "quicksand",
    name: "Syne + Quicksand",
    tag: "Fully geometric-round",
    heading: "'Syne', sans-serif",
    body: "'Quicksand', sans-serif",
    note: "Built from near-perfect circles with rounded ends. Unmistakably soft. Watch it in the paragraph — at small sizes the roundness costs some legibility, which is the trade you are making.",
    verdict: "Softest. Check legibility",
  },
  {
    id: "urbanist",
    name: "Syne + Urbanist",
    tag: "Circular geometric",
    heading: "'Syne', sans-serif",
    body: "'Urbanist', sans-serif",
    note: "Low-contrast and circular, closer to Futura than to Helvetica. Curvy in structure rather than in its terminals, so it stays crisp while still feeling round.",
    verdict: "Round shapes, sharp edges",
  },
  {
    id: "gabarito",
    name: "Syne + Gabarito",
    tag: "Curvy and characterful",
    heading: "'Syne', sans-serif",
    body: "'Gabarito', sans-serif",
    note: "Newer, and it has opinions — slightly flared strokes and a bounce to the rhythm. Has personality of its own rather than deferring entirely to Syne, so read a full paragraph before deciding.",
    verdict: "Most personality",
  },
  {
    id: "fraunces",
    name: "Syne + Fraunces",
    tag: "Soft serif — wonky by design",
    heading: "'Syne', sans-serif",
    body: "'Fraunces', serif",
    note: "A serif with a deliberate 'wonk' axis — soft, slightly off-kilter, warm. The biggest departure here and the most memorable. Editorial and human rather than corporate.",
    verdict: "The bold one",
  },
  {
    id: "baloo",
    name: "Syne + Baloo 2",
    tag: "Rounded — and reads Devanagari",
    heading: "'Syne', sans-serif",
    body: "'Baloo 2', sans-serif",
    note: "Chunky and fully rounded. The practical point: it ships Devanagari alongside Latin, so if you ever put Hindi on the site — plausible for Indian students — the type stays consistent instead of falling back to a system font.",
    verdict: "Curvy, and future-proof for Hindi",
  },
];

function Sample({ opt, active, onSelect }) {
  return (
    <motion.button
      onClick={() => onSelect(opt.id)}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`text-left w-full rounded-3xl border p-8 transition-colors duration-200 ${
        active ? "border-primary bg-primary/[0.07]" : "border-white/10 bg-white/[0.02] hover:border-white/25"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-lg font-semibold" style={{ fontFamily: opt.heading }}>{opt.name}</p>
          <p className="text-xs uppercase tracking-[2px] text-white/40 mt-1">{opt.tag}</p>
        </div>
        {active && (
          <span className="shrink-0 inline-flex items-center gap-1.5 text-xs text-primary border border-primary/40 rounded-pill px-3 py-1">
            <Check size={12} /> Selected
          </span>
        )}
      </div>

      {/* The real hero, at real size */}
      <p className="text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight mb-4" style={{ fontFamily: opt.heading }}>
        Get seen by <span className="bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent">real</span> recruiters.
      </p>

      {/* Real body copy */}
      <p className="text-base text-white/60 leading-relaxed mb-5 max-w-xl" style={{ fontFamily: opt.body }}>
        One payment. Twelve months. Outmail emails real recruiters from your own inbox
        and puts matched openings in front of you — for less than a month of LinkedIn Premium.
      </p>

      {/* Real pricing — numerals matter more than people expect */}
      <div className="flex items-baseline gap-3 mb-5" style={{ fontFamily: opt.heading }}>
        <span className="text-3xl font-bold">₹999</span>
        <span className="text-sm text-white/40 line-through">₹1,499</span>
        <span className="text-sm text-white/50" style={{ fontFamily: opt.body }}>for one year</span>
      </div>

      {/* Real UI chrome */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-pill inline-flex items-center gap-2" style={{ fontFamily: opt.body }}>
          Get Outmail <ArrowRight size={14} />
        </span>
        <span className="text-xs uppercase tracking-[2px] text-white/45" style={{ fontFamily: opt.body }}>
          25 of 25 seats left
        </span>
      </div>

      <p className="text-sm text-white/45 leading-relaxed mt-6 pt-6 border-t border-white/8" style={{ fontFamily: opt.body }}>
        {opt.note}
      </p>
      <p className="text-xs text-primary mt-3" style={{ fontFamily: opt.body }}>{opt.verdict}</p>
    </motion.button>
  );
}

export default function FontPreview() {
  const [selected, setSelected] = useState("current");
  return (
    <div className="min-h-screen bg-surface-page text-white">
      {/* preview-only font loading */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400..800&family=Figtree:wght@300..900&family=Nunito+Sans:opsz,wght@6..12,200..1000&family=Quicksand:wght@300..700&family=Urbanist:wght@100..900&family=Gabarito:wght@400..900&family=Fraunces:opsz,wght@9..144,100..900&family=Baloo+2:wght@400..800&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-[4px] text-primary mb-3">Typography</p>
        <h1 className="font-syne text-4xl md:text-5xl font-bold tracking-tight mb-4">What goes under Syne</h1>
        <p className="text-white/55 max-w-2xl leading-relaxed mb-4">
          Syne stays. The decision is what sits underneath — and these are deliberately
          spread across different SHAPES rather than variations on the same grotesque:
          rounded terminals, circular geometry, a soft serif, and one that reads Devanagari.
        </p>
        <p className="text-sm text-white/40 max-w-2xl leading-relaxed mb-12">
          You currently load <strong className="text-white/60">five families</strong>. Whichever wins,
          the target is three: display, body, and mono for data.
        </p>

        <div className="space-y-5">
          {OPTIONS.map((o) => (
            <Sample key={o.id} opt={o} active={selected === o.id} onSelect={setSelected} />
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-7">
          <p className="text-sm text-white/70 mb-3 font-medium">How I would decide</p>
          <ul className="text-sm text-white/50 space-y-2.5 leading-relaxed list-disc pl-5">
            <li>Ignore the headings — they are identical everywhere. Read the paragraph instead.</li>
            <li>Read one paragraph properly in each. The one you stop noticing is doing its job.</li>
            <li>Check the ₹999 — numerals differ more than letters, and pricing is where it matters.</li>
            <li>Curvier reads friendlier — and less authoritative. For a paid tool that is a real trade, not a free win.</li>
            <li>Quicksand and Baloo lose the most legibility at 14px. Read the small grey line under the price in each.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
