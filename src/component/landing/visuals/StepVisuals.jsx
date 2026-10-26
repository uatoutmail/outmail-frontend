"use client";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import React from "react";
import { EASE_BACK } from "@/component/motion/kit";

/**
 * The small visual inside each story panel — five treatments.
 *
 * Only the SUB-BLOCK changes. The panel, its caption bar, heading and body
 * copy are untouched.
 *
 * The current set is schematic: a coloured chip, three bars, a gradient dot.
 * Schematic reads as illustration. The alternatives borrow the furniture of
 * real interfaces — monospace timestamps, table headers, browser form chrome,
 * log lines — because that furniture is what the eye uses to decide whether
 * it is looking at a product or a picture of one.
 *
 * `kind` is one of send | match | fill | mentor, one per panel.
 */

const Box = ({ children, mono = false }) => (
  <div
    className={`rounded-xl border border-white/10 bg-black/25 overflow-hidden ${mono ? "font-mono" : ""}`}
  >
    {children}
  </div>
);

/* ── 1 · CURRENT ─────────────────────────────────────────────────────────── */
function Current({ kind, reduce }) {
  const base = "rounded-xl border border-white/10 bg-black/25 p-4";
  if (kind === "match")
    return (
      <div className={base}>
        {[
          { l: "Razorpay · SDE Intern", s: 94 },
          { l: "Zomato · Backend Intern", s: 88 },
          { l: "Meesho · Platform", s: 81 },
        ].map((m, i) => (
          <motion.div
            key={m.l}
            className="flex items-center gap-2 mb-2 last:mb-0"
            initial={reduce ? false : { opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.12 }}
          >
            <span className="text-[11px] text-white/55 flex-1 truncate">{m.l}</span>
            <span className="text-[11px] font-mono text-primary">{m.s}</span>
          </motion.div>
        ))}
      </div>
    );
  if (kind === "send")
    return (
      <div className={`${base} flex items-center gap-3`}>
        <motion.div
          initial={reduce ? false : { scale: 0.7, rotate: -15 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: EASE_BACK }}
          className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0"
        >
          <Mail size={16} className="text-white" />
        </motion.div>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
            sent from her Gmail
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
            4 queued
          </span>
        </div>
      </div>
    );
  if (kind === "fill")
    return (
      <div className={`${base} space-y-2`}>
        {["Full name", "Notice period", "Why this role?"].map((f, i) => (
          <motion.div
            key={f}
            className="flex items-center gap-2"
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 * i, duration: 0.3 }}
          >
            <span className="text-[11px] text-white/50">{f}</span>
            <span className="ml-auto h-1 flex-1 max-w-[52px] rounded-full bg-primary/40" />
          </motion.div>
        ))}
      </div>
    );
  return (
    <div className={`${base} flex items-center gap-3`}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-light shrink-0" />
      <div className="flex-1">
        <div className="h-1.5 w-full rounded-full bg-white/20 mb-1.5" />
        <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

/* ── 2 · INTERFACE ────────────────────────────────────────────────────────
   Each block borrows the chrome of the surface it represents: a mail row, a
   results table with a header, a browser form, a calendar invite. */
function Interface({ kind }) {
  if (kind === "send")
    return (
      <Box>
        <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[1.5px] text-white/25">Sent</span>
          <span className="font-mono text-[9px] text-emerald-300">09:14</span>
        </div>
        <div className="px-3 py-2.5">
          <p className="text-[11px] text-white/70 truncate">Backend intern — payments tooling</p>
          <p className="text-[10px] text-white/35 truncate">to talent@—————.com · resume.pdf</p>
        </div>
      </Box>
    );
  if (kind === "match")
    return (
      <Box>
        <div className="grid grid-cols-12 px-3 py-1.5 border-b border-white/[0.06] text-[9px] uppercase tracking-[1.5px] text-white/25">
          <span className="col-span-8">Role</span>
          <span className="col-span-4 text-right">Score</span>
        </div>
        {[
          ["Backend Intern", 94],
          ["Platform Engineer", 88],
          ["Data Analyst", 58],
        ].map(([r, s]) => (
          <div
            key={r}
            className="grid grid-cols-12 px-3 py-1.5 border-b border-white/[0.04] last:border-0"
          >
            <span className="col-span-8 text-[11px] text-white/60 truncate">{r}</span>
            <span
              className={`col-span-4 text-right font-mono text-[11px] ${s > 80 ? "text-primary" : "text-white/25"}`}
            >
              {s}
            </span>
          </div>
        ))}
      </Box>
    );
  if (kind === "fill")
    return (
      <Box>
        <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
          <span className="w-1.5 h-1.5 rounded-full bg-white/15" />
          <span className="font-mono text-[9px] text-white/25 ml-1">careers.—————.com</span>
        </div>
        <div className="p-3 space-y-2">
          {[
            ["Full name", "Ananya R."],
            ["Notice period", "Immediate"],
            ["Why this role?", "Auto-filled"],
          ].map(([l, v]) => (
            <div key={l}>
              <p className="text-[9px] text-white/25 mb-0.5">{l}</p>
              <div className="rounded border border-primary/30 bg-primary/[0.07] px-2 py-1 text-[10px] text-white/60">
                {v}
              </div>
            </div>
          ))}
        </div>
      </Box>
    );
  return (
    <Box>
      <div className="px-3 py-1.5 border-b border-white/[0.06] flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[1.5px] text-white/25">Next session</span>
        <span className="font-mono text-[9px] text-primary">Sat 11:00</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[11px] text-white/70">Interview loops — what they actually ask</p>
        <p className="text-[10px] text-white/35 mt-0.5">
          18 of 25 seats · questions open till Friday
        </p>
      </div>
    </Box>
  );
}

/* ── 3 · TERMINAL ─────────────────────────────────────────────────────────
   System output. The least decorated option, and the hardest to mistake for
   an illustration. Suits an audience that reads logs. */
function Terminal({ kind }) {
  const lines = {
    send: [
      ["09:14", "send", "ok", "talent@—————.com"],
      ["09:14", "attach", "ok", "resume.pdf"],
      ["—", "queue", "4 pending", ""],
    ],
    match: [
      ["scan", "1,284 openings", "", ""],
      ["rank", "resume v3", "", ""],
      ["match", "94", "backend intern", ""],
    ],
    fill: [
      ["fill", "full_name", "ok", ""],
      ["fill", "notice_period", "ok", ""],
      ["fill", "why_this_role", "ok", ""],
    ],
    mentor: [
      ["sat", "11:00", "session", "interview loops"],
      ["seats", "18/25", "", ""],
      ["q&a", "open", "till fri", ""],
    ],
  }[kind];
  return (
    <Box mono>
      <div className="px-3 py-1.5 border-b border-white/[0.06] text-[9px] text-white/25">
        outmail · log
      </div>
      <div className="px-3 py-2 space-y-1">
        {lines.map((l, i) => (
          <div key={i} className="flex gap-2 text-[10px]">
            <span className="text-white/25 w-10 shrink-0">{l[0]}</span>
            <span className="text-white/60 flex-1 truncate">{l[1]}</span>
            {l[2] && (
              <span className={l[2] === "ok" ? "text-emerald-300" : "text-primary"}>{l[2]}</span>
            )}
          </div>
        ))}
      </div>
    </Box>
  );
}

/* ── 4 · RECEIPT ──────────────────────────────────────────────────────────
   Each block as an itemised line with dotted leaders — the same device the
   pricing page uses, so the page has one visual language. */
function Receipt({ kind }) {
  const rows = {
    send: [
      ["Recipient", "verified"],
      ["Sent from", "your Gmail"],
      ["Today", "1 of 5"],
    ],
    match: [
      ["Openings scanned", "1,284"],
      ["Above 80", "12"],
      ["Best match", "94"],
    ],
    fill: [
      ["Fields filled", "14"],
      ["You typed", "0"],
      ["Time saved", "19 min"],
    ],
    mentor: [
      ["Next session", "Sat 11:00"],
      ["Seats left", "7 of 25"],
      ["Recording", "included"],
    ],
  }[kind];
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 space-y-2 font-mono">
      {rows.map(([l, v]) => (
        <div key={l} className="flex items-baseline gap-2 text-[10px]">
          <span className="text-white/40">{l}</span>
          <span className="flex-1 border-b border-dotted border-white/12 translate-y-[-3px]" />
          <span className="text-primary">{v}</span>
        </div>
      ))}
    </div>
  );
}

/* ── 5 · MINIMAL ──────────────────────────────────────────────────────────
   One number and one label. Nothing to mistake for a screenshot, nothing to
   mistake for generated art either. The safest option by some distance. */
function Minimal({ kind }) {
  const d = {
    send: ["5", "emails a day, from your inbox"],
    match: ["94", "match score, and the reason for it"],
    fill: ["19", "minutes saved per application"],
    mentor: ["25", "seats, meeting every fortnight"],
  }[kind];
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-4 flex items-baseline gap-3">
      <span className="font-syne text-3xl font-bold text-primary leading-none">{d[0]}</span>
      <span className="text-[11px] text-white/45 leading-snug">{d[1]}</span>
    </div>
  );
}

// Receipt is the production default; the rest stay for the content lab.
const SETS = [Receipt, Current, Interface, Terminal, Minimal];

export function StepVisual({ kind, reduce, variant = 0 }) {
  const C = SETS[variant] || SETS[0];
  return <C kind={kind} reduce={reduce} />;
}

export const STEP_VISUALS = [
  { label: "Current" },
  { label: "Previous" },
  { label: "Interface" },
  { label: "Terminal" },
  { label: "Minimal" },
];
