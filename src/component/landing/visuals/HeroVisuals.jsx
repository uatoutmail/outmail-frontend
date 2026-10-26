"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Briefcase, Check, Mail, Paperclip, Search } from "lucide-react";
import React from "react";
import { EASE_BACK } from "@/component/motion/kit";

/**
 * Hero visuals — five treatments of the same idea.
 *
 * WHY THE CURRENT ONE READS AS "AI-GENERATED"
 *   Not because of the colours. Because it is an IDEALISED ABSTRACTION: two
 *   perfectly rounded cards, floating in space, with a gradient circle for a
 *   face and no timestamps, no chrome, no alignment imperfection. Real product
 *   screenshots have window furniture, monospace numbers, dates, statuses and
 *   things that do not line up.
 *
 *   The variants below move toward "screenshot of the actual product" and away
 *   from "illustration of the concept".
 *
 * A SEPARATE PROBLEM, FIXED IN VARIANTS 2-5
 *   "Priya Sharma · Talent · Razorpay" is an invented person attributed to a
 *   real, named company. It reads as a fabricated endorsement, and it is the
 *   kind of thing a company's brand team writes in about. The alternatives
 *   describe a ROLE at an anonymised employer, which is both honest and, as it
 *   happens, more believable.
 */

const float = (reduce, dur, amp) =>
  reduce
    ? {}
    : {
        animate: { y: [0, -amp, 0] },
        transition: { duration: dur, repeat: Infinity, ease: "easeInOut" },
        style: { willChange: "transform" },
      };

const Glow = () => (
  <div
    aria-hidden
    className="absolute right-8 top-16 w-[340px] h-[340px]"
    style={{
      background:
        "radial-gradient(circle at center, color-mix(in srgb, var(--brand-primary) 32%, transparent), transparent 68%)",
    }}
  />
);

const Frame = ({ children }) => (
  <div
    className="relative w-full h-[380px] hidden lg:block"
    style={{ transformStyle: "preserve-3d" }}
  >
    <Glow />
    {children}
  </div>
);

/* ── 1 · CURRENT ─────────────────────────────────────────────────────────── */
export function HeroCurrent() {
  const reduce = useReducedMotion();
  return (
    <Frame>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ duration: 0.7, delay: 0.4, ease: EASE_BACK }}
        style={{ transform: "translateZ(90px)" }}
        className="absolute right-16 top-4 w-[260px]"
      >
        <motion.div
          {...float(reduce, 5.5, 10)}
          className="rounded-2xl border border-white/15 bg-[#171029]/90 p-5 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-light shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">Priya Sharma</p>
              <p className="text-[11px] text-white/45 truncate">Talent · Razorpay</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
              <Check size={9} /> verified
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">
              <Mail size={9} /> emailed
            </span>
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 34, rotate: 5 }}
        animate={{ opacity: 1, y: 0, rotate: 5 }}
        transition={{ duration: 0.7, delay: 0.75, ease: EASE_BACK }}
        style={{ transform: "translateZ(40px)" }}
        className="absolute right-4 top-48 w-[250px]"
      >
        <motion.div
          {...float(reduce, 7, 13)}
          className="rounded-2xl border border-white/12 bg-[#140e24]/90 p-5 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-3">
            <Briefcase size={15} className="text-accent-light" />
            <span className="font-mono text-sm text-primary font-semibold">94</span>
          </div>
          <p className="text-sm font-semibold mb-1">SDE Intern · Razorpay</p>
          <p className="text-[11px] text-white/45 mb-3">Bengaluru · matched to your resume</p>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-[94%] bg-gradient-to-r from-primary to-accent-light" />
          </div>
        </motion.div>
      </motion.div>
    </Frame>
  );
}

/* ── 2 · SENT MAIL ────────────────────────────────────────────────────────
   A mail client, with the furniture a real one has: window controls, a To
   field, a subject line, an attachment, and a sent timestamp. The recruiter
   is a ROLE at an unnamed company, so nothing is attributed to anyone real. */
export function HeroSentMail() {
  const reduce = useReducedMotion();
  return (
    <Frame>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: EASE_BACK }}
        style={{ transform: "translateZ(80px)" }}
        className="absolute right-2 top-2 w-[330px]"
      >
        <motion.div
          {...float(reduce, 6.5, 8)}
          className="rounded-xl border border-white/15 bg-[#12101c] shadow-2xl overflow-hidden"
        >
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 bg-white/[0.03]">
            <span className="w-2 h-2 rounded-full bg-white/20" />
            <span className="w-2 h-2 rounded-full bg-white/20" />
            <span className="w-2 h-2 rounded-full bg-white/20" />
            <span className="ml-2 text-[10px] text-white/35 font-mono">New message</span>
          </div>
          <div className="px-4 py-2.5 border-b border-white/[0.06] flex gap-2 text-[11px]">
            <span className="text-white/30 w-8">To</span>
            <span className="text-white/70">talent@—————.com</span>
          </div>
          <div className="px-4 py-2.5 border-b border-white/[0.06] flex gap-2 text-[11px]">
            <span className="text-white/30 w-8">From</span>
            <span className="text-white/70">you@college.edu</span>
          </div>
          <div className="px-4 py-2.5 border-b border-white/[0.06] text-[11px]">
            <span className="text-white/80">
              Backend intern — built a payments reconciliation tool
            </span>
          </div>
          <div className="px-4 py-3 text-[11px] leading-relaxed text-white/45">
            Hi — I saw you are hiring backend interns. In my final year I built a reconciliation
            tool that handled 40k transactions a day…
          </div>
          <div className="px-4 py-2.5 flex items-center justify-between border-t border-white/[0.06] bg-white/[0.02]">
            <span className="inline-flex items-center gap-1.5 text-[10px] text-white/45">
              <Paperclip size={10} /> resume.pdf
            </span>
            <span className="font-mono text-[10px] text-emerald-300">sent 09:14</span>
          </div>
        </motion.div>
      </motion.div>
    </Frame>
  );
}

/* ── 3 · TODAY'S QUEUE ────────────────────────────────────────────────────
   What the product actually does, as an operations panel. Monospace times,
   real statuses, a daily cap. Reads as a running system, not a concept. */
export function HeroQueue() {
  const reduce = useReducedMotion();
  const rows = [
    ["09:02", "Fintech · Bengaluru", "sent"],
    ["09:31", "Marketplace · Gurugram", "sent"],
    ["10:15", "SaaS · Pune", "sent"],
    ["11:40", "Fintech · Mumbai", "opened"],
    ["—", "Logistics · Hyderabad", "queued"],
  ];
  const tone = { sent: "text-emerald-300", opened: "text-primary", queued: "text-white/35" };
  return (
    <Frame>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: EASE_BACK }}
        style={{ transform: "translateZ(80px)" }}
        className="absolute right-2 top-6 w-[340px]"
      >
        <motion.div
          {...float(reduce, 7, 9)}
          className="rounded-xl border border-white/15 bg-[#12101c] shadow-2xl overflow-hidden"
        >
          <div className="px-4 py-2.5 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
            <span className="text-[11px] font-semibold">Today&rsquo;s outreach</span>
            <span className="font-mono text-[10px] text-white/35">5 / 5</span>
          </div>
          {rows.map(([t, who, st]) => (
            <div
              key={who}
              className="px-4 py-2.5 flex items-center gap-3 border-b border-white/[0.05] last:border-0"
            >
              <span className="font-mono text-[10px] text-white/30 w-9">{t}</span>
              <span className="text-[11px] text-white/70 flex-1 truncate">{who}</span>
              <span className={`font-mono text-[10px] ${tone[st]}`}>{st}</span>
            </div>
          ))}
          <div className="px-4 py-2.5 bg-white/[0.02] text-[10px] text-white/30">
            Daily cap 5 · next window 09:00 tomorrow
          </div>
        </motion.div>
      </motion.div>
    </Frame>
  );
}

/* ── 4 · MATCH TABLE ──────────────────────────────────────────────────────
   The scoring, as a table with a header row and a reason column. Tables read
   as data; cards read as marketing. */
export function HeroMatches() {
  const reduce = useReducedMotion();
  const rows = [
    ["SDE Intern", "94", "Node, Postgres, payments"],
    ["Backend Intern", "88", "Node, REST, 2 of 3 skills"],
    ["Platform Eng", "81", "Docker, CI, no Kafka"],
    ["Data Analyst", "58", "SQL only, no Python"],
  ];
  return (
    <Frame>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: EASE_BACK }}
        style={{ transform: "translateZ(80px)" }}
        className="absolute right-2 top-8 w-[350px]"
      >
        <motion.div
          {...float(reduce, 7.5, 9)}
          className="rounded-xl border border-white/15 bg-[#12101c] shadow-2xl overflow-hidden"
        >
          <div className="px-4 py-2.5 border-b border-white/10 bg-white/[0.03] flex items-center gap-2">
            <Search size={12} className="text-white/35" />
            <span className="text-[11px] font-semibold">Matched to your resume</span>
          </div>
          <div className="grid grid-cols-12 px-4 py-2 text-[9px] uppercase tracking-[1.5px] text-white/25 border-b border-white/[0.06]">
            <span className="col-span-5">Role</span>
            <span className="col-span-2 text-right">Score</span>
            <span className="col-span-5 pl-3">Why</span>
          </div>
          {rows.map(([role, score, why]) => (
            <div
              key={role}
              className="grid grid-cols-12 px-4 py-2.5 items-center border-b border-white/[0.05] last:border-0"
            >
              <span className="col-span-5 text-[11px] text-white/75 truncate">{role}</span>
              <span
                className={`col-span-2 text-right font-mono text-[11px] ${Number(score) > 80 ? "text-primary" : "text-white/30"}`}
              >
                {score}
              </span>
              <span className="col-span-5 pl-3 text-[10px] text-white/35 truncate">{why}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </Frame>
  );
}

/* ── 5 · ANONYMISED CARDS ─────────────────────────────────────────────────
   The current layout, kept, with the invented person removed. Same design,
   nothing attributed to a real company or a real human. */
export function HeroAnonymised() {
  const reduce = useReducedMotion();
  return (
    <Frame>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ duration: 0.7, delay: 0.4, ease: EASE_BACK }}
        style={{ transform: "translateZ(90px)" }}
        className="absolute right-16 top-4 w-[266px]"
      >
        <motion.div
          {...float(reduce, 5.5, 10)}
          className="rounded-2xl border border-white/15 bg-[#171029]/90 p-5 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <Mail size={15} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">Engineering Manager</p>
              <p className="text-[11px] text-white/45 truncate">Fintech · Bengaluru</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
              <Check size={9} /> deliverable
            </span>
            <span className="font-mono text-[9px] text-white/30">emailed 09:14</span>
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 34, rotate: 5 }}
        animate={{ opacity: 1, y: 0, rotate: 5 }}
        transition={{ duration: 0.7, delay: 0.75, ease: EASE_BACK }}
        style={{ transform: "translateZ(40px)" }}
        className="absolute right-4 top-48 w-[254px]"
      >
        <motion.div
          {...float(reduce, 7, 13)}
          className="rounded-2xl border border-white/12 bg-[#140e24]/90 p-5 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-3">
            <Briefcase size={15} className="text-accent-light" />
            <span className="font-mono text-sm text-primary font-semibold">94</span>
          </div>
          <p className="text-sm font-semibold mb-1">Backend Intern</p>
          <p className="text-[11px] text-white/45 mb-3">Node, Postgres, payments · 3 of 3 skills</p>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-[94%] bg-gradient-to-r from-primary to-accent-light" />
          </div>
        </motion.div>
      </motion.div>
    </Frame>
  );
}

export const HERO_VISUALS = [
  { label: "Current", C: HeroAnonymised },
  { label: "Sent mail", C: HeroSentMail },
  { label: "Today's queue", C: HeroQueue },
  { label: "Match table", C: HeroMatches },
  { label: "Previous", C: HeroCurrent },
];
