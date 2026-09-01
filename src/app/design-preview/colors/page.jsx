"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Mail, TrendingUp } from "lucide-react";

/**
 * PALETTE COMPARISON — /design-preview/colors
 *
 * Same method as the fonts page: every option is rendered on REAL UI — hero,
 * primary button, pricing card, badge, status pill, progress bar — because a
 * palette that looks good as swatches can fall apart the moment it has to
 * carry a disabled state or a success message.
 *
 * Syne + Geist is locked, so type is constant across all of them and colour is
 * the only variable.
 *
 * THE ACTUAL QUESTION is not "which purple". It is "what is the SECOND colour".
 * Outmail today is purple-on-dark with nothing else, which is why it reads
 * slightly flat — there is no tension anywhere. Each option below answers that
 * differently.
 */

const EASE = [0.16, 1, 0.3, 1];

const PALETTES = [
  /* ============ A — violet stays, add a second colour ============ */
  { group: "A", id: "current", name: "Violet only", tag: "What you ship today",
    primary: "#6C00FF", primaryHover: "#5800D6", accent: "#AD46FF", page: "#0A0B14",
    note: "One hue, two shades. Coherent and calm — but with no contrasting colour, everything sits at the same emotional temperature. Nothing can shout because nothing is quiet.",
    verdict: "Safe. Slightly flat" },

  { group: "A", id: "lime", name: "Violet + Electric Lime", tag: "Maximum Gen-Z energy",
    primary: "#6C00FF", primaryHover: "#5800D6", accent: "#CCFF00", page: "#0A0B14",
    note: "Highest contrast here and unmistakably current — lime on violet is the fintech/creator-tool combination of the moment. One element per screen or it exhausts fast.",
    verdict: "Loudest. Highest risk and reward" },

  { group: "A", id: "cyan", name: "Violet + Electric Cyan", tag: "Technical energy",
    primary: "#6C00FF", primaryHover: "#5800D6", accent: "#22D3EE", page: "#080A14",
    note: "Cyan reads as data and systems. Cooler than lime and far easier to live with over a long session, which matters more on the dashboard than the marketing site.",
    verdict: "Energetic but calmer" },

  { group: "A", id: "magenta", name: "Violet + Hot Magenta", tag: "Analogous, saturated",
    primary: "#6C00FF", primaryHover: "#5800D6", accent: "#FF2E93", page: "#0A0B14",
    note: "Neighbouring hues, so it stays harmonious rather than clashing. A violet-to-magenta gradient is genuinely rich. Adds warmth without creating a second focal point.",
    verdict: "Richest gradients" },

  { group: "A", id: "amber", name: "Violet + Warm Amber", tag: "Complementary warmth",
    primary: "#6C00FF", primaryHover: "#5800D6", accent: "#FFB020", page: "#0B0A12",
    note: "Violet's near-complement. High contrast without aggression, and amber already carries 'progress' and 'success' meaning, so it fits your status colours instead of fighting them.",
    verdict: "Most human" },

  { group: "A", id: "mint", name: "Violet + Mint", tag: "Fresh and optimistic",
    primary: "#6C00FF", primaryHover: "#5800D6", accent: "#4ADE80", page: "#080B12",
    note: "Green reads as growth and success, which suits a product about getting hired. The catch: it is nearly your 'sent' status colour, so accent and state would blur on the dashboard.",
    verdict: "Optimistic — but clashes with status green" },

  { group: "A", id: "coral", name: "Violet + Coral", tag: "Warm and friendly",
    primary: "#6C00FF", primaryHover: "#5800D6", accent: "#FF6B6B", page: "#0B0A12",
    note: "Softer than magenta, warmer than amber. Approachable and a little playful. Sits uncomfortably close to the red used for errors, which is the main argument against it.",
    verdict: "Friendliest — watch the error red" },

  { group: "A", id: "gold", name: "Violet + Gold", tag: "Premium signal",
    primary: "#6C00FF", primaryHover: "#5800D6", accent: "#F5C445", page: "#09080F",
    note: "Gold on deep violet is the oldest premium cue there is. Reads valuable and slightly formal — closer to a membership than a student tool. Use sparingly or it tips into gaudy.",
    verdict: "Most 'worth paying for'" },

  { group: "A", id: "sky", name: "Violet + Sky Blue", tag: "Trustworthy",
    primary: "#6C00FF", primaryHover: "#5800D6", accent: "#38BDF8", page: "#080A14",
    note: "The safest accent on the page. Blue reads trustworthy and professional — which is also why it is the least memorable. Closest to what you already have with #3b82f6.",
    verdict: "Safest. Least distinctive" },

  /* ============ B — shift the base hue ============ */
  { group: "B", id: "indigo", name: "Deep Indigo + Lavender", tag: "Premium, restrained",
    primary: "#4C1FFF", primaryHover: "#3D19CC", accent: "#A78BFA", page: "#07070F",
    note: "Bluer base, darker surface. Reads more expensive and more serious — closer to a fintech than a student tool. Trades youthful energy for authority.",
    verdict: "Most premium, least playful" },

  { group: "B", id: "electric", name: "Electric Blue + Violet", tag: "Blue-led",
    primary: "#2563EB", primaryHover: "#1D4ED8", accent: "#A855F7", page: "#080B14",
    note: "Flips the hierarchy — blue leads, violet accents. Instantly more conventional and more corporate. Worth seeing because it shows how much of Outmail's character is carried by violet being primary.",
    verdict: "Conventional. Shows what violet buys you" },

  { group: "B", id: "ultra", name: "Ultraviolet + Lime", tag: "Pushed further",
    primary: "#7B2BFF", primaryHover: "#6420D6", accent: "#D4FF3F", page: "#0C0716",
    note: "Brighter, more saturated violet on a purple-tinted black. More neon overall — the surface itself carries a hue rather than being neutral dark, so the whole page feels lit from within.",
    verdict: "Most neon" },

  { group: "B", id: "teal", name: "Deep Teal + Coral", tag: "No violet at all",
    primary: "#0D9488", primaryHover: "#0F766E", accent: "#FF6B6B", page: "#06110F",
    note: "A genuine departure — no purple anywhere. Calmer and more mature, and it would mean rebuilding brand recognition from zero. Included so the violet decision is a choice rather than an assumption.",
    verdict: "The 'what if we were not purple' option" },

  /* ============ C — change the structure, not just the hue ============ */
  { group: "C", id: "mono", name: "Near-black + one neon", tag: "Monochrome with a single pop",
    primary: "#CCFF00", primaryHover: "#B8E600", accent: "#CCFF00", page: "#050505",
    note: "Almost no colour at all, then one violent accent. Extremely confident, and it forces genuine discipline — there is only one way to emphasise anything. Editorial rather than SaaS.",
    verdict: "Boldest structural choice", darkText: true },

  { group: "C", id: "light", name: "Light surfaces + violet", tag: "Not dark at all",
    primary: "#6C00FF", primaryHover: "#5800D6", accent: "#FF2E93", page: "#FAFAFB",
    note: "Every competitor in this space is dark. Light is now the contrarian choice, it photographs better in decks and screenshots, and it is easier to read on a cheap laptop in a lit room. Would be a full rebuild of every surface.",
    verdict: "Contrarian. Biggest rebuild", light: true },

  { group: "C", id: "duo", name: "Violet → Cyan gradient-led", tag: "Gradient as the identity",
    primary: "#6C00FF", primaryHover: "#5800D6", accent: "#22D3EE", page: "#070912",
    note: "Same two colours as the cyan option, but the gradient becomes the brand rather than a decoration — used on buttons, borders and key surfaces, not just text. Distinctive; harder to keep consistent.",
    verdict: "Most distinctive, hardest to maintain" },
];

const GROUPS = {
  A: { title: "A — Violet stays, add a second colour", sub: "Lowest risk. Keeps every existing asset and all brand recognition." },
  B: { title: "B — Shift the base hue", sub: "Bigger change. Affects the logo, screenshots and anything already printed." },
  C: { title: "C — Change the structure", sub: "Not a recolour. These change how the whole site is built." },
};

function Preview({ p, active, onSelect }) {
  const style = {
    "--p": p.primary, "--ph": p.primaryHover, "--a": p.accent, "--bg": p.page,
  };
  return (
    <motion.button
      onClick={() => onSelect(p.id)}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: EASE }}
      style={style}
      className={`text-left w-full rounded-3xl border p-8 transition-colors duration-200 ${
        active ? "border-white/40" : "border-white/10 hover:border-white/25"
      }`}
    >
      <div className="rounded-2xl p-7" style={{ background: "var(--bg)" }}>
        {/* header + swatches */}
        <div className="flex items-start justify-between gap-4 mb-7">
          <div>
            <p className={`font-syne text-lg font-bold ${p.light ? "text-slate-900" : "text-white"}`}>{p.name}</p>
            <p className={`text-xs uppercase tracking-[2px] mt-1 ${p.light ? "text-slate-500" : "text-white/40"}`}>{p.tag}</p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            {[p.primary, p.accent, p.page].map((c) => (
              <div key={c} className="w-7 h-7 rounded-lg border border-white/15" style={{ background: c }} />
            ))}
          </div>
        </div>

        {/* hero */}
        <p className={`font-syne text-3xl md:text-4xl font-bold tracking-tight leading-[1.1] mb-3 ${p.light ? "text-slate-900" : "text-white"}`}>
          Get seen by{" "}
          <span style={{ backgroundImage: `linear-gradient(90deg, var(--p), var(--a))`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            real
          </span>{" "}
          recruiters.
        </p>
        <p className={`text-sm mb-6 max-w-lg ${p.light ? "text-slate-600" : "text-white/50"}`}>
          One payment. Twelve months. Less than a month of LinkedIn Premium.
        </p>

        {/* the things colour actually has to carry */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className={`text-sm font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2 ${p.darkText ? "text-black" : "text-white"}`} style={{ background: "var(--p)" }}>
            Get Outmail <ArrowRight size={14} />
          </span>
          <span className="text-sm font-medium px-4 py-2.5 rounded-full border" style={{ color: "var(--a)", borderColor: "var(--a)" }}>
            See how it works
          </span>
          <span className="text-[10px] uppercase tracking-[2px] px-3 py-1.5 rounded-full text-black font-semibold" style={{ background: "var(--a)" }}>
            25 seats left
          </span>
        </div>

        {/* card + data */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border p-5" style={{ borderColor: `${p.primary}55`, background: `${p.primary}0F` }}>
            <Mail size={16} style={{ color: "var(--p)" }} className="mb-3" />
            <p className={`font-semibold text-sm mb-1 ${p.light ? "text-slate-900" : "text-white"}`}>Outreach &amp; Jobs</p>
            <p className={`text-2xl font-syne font-bold ${p.light ? "text-slate-900" : "text-white"}`}>₹999</p>
            <div className="mt-3 space-y-1.5">
              {["Cold outreach", "Matched jobs"].map((f) => (
                <p key={f} className="flex items-center gap-2 text-xs text-white/60">
                  <Check size={11} style={{ color: "var(--p)" }} />{f}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/45 uppercase tracking-[2px]">This week</span>
              <TrendingUp size={14} style={{ color: "var(--a)" }} />
            </div>
            <p className={`text-2xl font-syne font-bold mb-3 ${p.light ? "text-slate-900" : "text-white"}`}>18 sent</p>
            {/* progress — colour has to read as progress, not decoration */}
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
              <div className="h-full rounded-full" style={{ width: "62%", background: `linear-gradient(90deg, var(--p), var(--a))` }} />
            </div>
            <div className="flex gap-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">sent</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">queued</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-white/50 leading-relaxed mt-6">{p.note}</p>
      <p className="text-xs mt-3 font-medium" style={{ color: p.accent }}>{p.verdict}</p>
    </motion.button>
  );
}

export default function ColorPreview() {
  const [sel, setSel] = useState("current");
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <p className="text-xs uppercase tracking-[4px] text-primary mb-3">Colour</p>
        <h1 className="font-syne text-4xl md:text-5xl font-bold tracking-tight mb-4">
          What is the second colour?
        </h1>
        <p className="text-white/55 max-w-2xl leading-relaxed mb-3">
          Violet stays as the brand. The real question is what sits against it — because today
          there is nothing, and that is why the site reads slightly flat. With one hue and two
          shades, nothing can shout, since everything speaks at the same volume.
        </p>
        <p className="text-sm text-white/40 max-w-2xl leading-relaxed mb-12">
          Sixteen options in three groups. Each is shown on real UI — hero, primary button,
          outline button, scarcity badge, pricing card, progress bar and status pills. Swatches
          flatter; a palette earns its place by surviving a scarcity badge and a status pill
          sitting next to each other.
        </p>

        {Object.entries(GROUPS).map(([key, g]) => (
          <div key={key} className="mb-14">
            <h2 className="font-syne text-xl font-bold mb-1">{g.title}</h2>
            <p className="text-sm text-white/40 mb-6">{g.sub}</p>
            <div className="space-y-5">
              {PALETTES.filter((p) => p.group === key).map((p) => (
                <Preview key={p.id} p={p} active={sel === p.id} onSelect={setSel} />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-7">
          <p className="text-sm text-white/70 mb-3 font-medium">How I would decide</p>
          <ul className="text-sm text-white/50 space-y-2.5 leading-relaxed list-disc pl-5">
            <li>Look at the <strong className="text-white/70">seats-left badge</strong>. That is the accent doing its real job — scarcity has to catch the eye without looking like an error.</li>
            <li>Check the accent against the green and amber status pills. If it competes with them, your dashboard will be noisy.</li>
            <li>Squint. If two colours fight for attention at once, the page has no focal point.</li>
            <li>Lime and cyan need <em>dark</em> text on them; magenta and violet need white. That constrains where each can be used.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
