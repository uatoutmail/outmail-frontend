"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, CreditCard, Shield, Sparkles, Mail } from "lucide-react";
import { Reveal, MaskLines, EASE_OUT } from "../kit";

/**
 * FAQ — five tellings, one set of answers.
 *
 * The questions are the ones that actually block a ₹999 decision, not the ones
 * that are comfortable to answer. Three of them (the app password, where
 * recruiter data comes from, the no-guarantee) exist because a vague answer
 * there is what would later be held against us.
 */
export const FAQS = [
  { cat: "Money", I: CreditCard,
    q: "Is this a subscription? Will I be charged again?",
    a: "No. You pay once for one year of access, and nothing renews automatically. We will never charge your card a second time unless you choose to buy another year." },
  { cat: "Money", I: CreditCard,
    q: "What if it doesn't work for me?",
    a: "Ask for a refund within 7 days of paying and we refund in full, without asking you to justify it. We do not deduct for emails already sent." },
  { cat: "Money", I: CreditCard,
    q: "What happens when my year ends?",
    a: "Outreach stops and job openings are no longer shown, and we remind you before that happens. Nothing is deleted — your resume, history and saved answers stay exactly where they are and come back the moment you renew. Renewing early adds to the days you have left rather than replacing them." },
  { cat: "Privacy", I: Shield,
    q: "Do you get access to my Gmail password?",
    a: "No, and this is worth being exact about. Sending uses a Gmail app password that you generate and that is stored only in your own computer's keychain. It is never transmitted to us and never stored on our servers. Revoking it in your Google account stops all sending immediately." },
  { cat: "Privacy", I: Shield,
    q: "Are these real recruiters, or scraped emails?",
    a: "Business contact details for people who are hiring, sourced from public listings and commercial contact-data providers, and checked for deliverability before use. Every message carries an unsubscribe link, and one click removes that person permanently across every Outmail user." },
  { cat: "Product", I: Sparkles,
    q: "Will this get my Gmail account banned?",
    a: "Your daily limit starts at five and grows slowly, only if you are actually sending. That warm-up is deliberate — it is what keeps your account inside normal sending behaviour rather than looking like bulk mail." },
  { cat: "Product", I: Sparkles,
    q: "Can you guarantee I'll get a job?",
    a: "No, and anyone who does is lying. What Outmail changes is how many of the right people see you, and how much of your time goes into the applications worth making. The rest is your profile and the market." },
];

const CATS = ["Money", "Privacy", "Product"];

function Head({ lines, center = false, sub }) {
  return (
    <Reveal className={center ? "text-center" : ""}>
      <p className="text-[10px] uppercase tracking-[4px] text-primary mb-4">Questions</p>
      <MaskLines lines={lines} className="font-syne text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]" />
      {sub && <p className={`text-white/45 mt-4 ${center ? "max-w-lg mx-auto" : "max-w-lg"}`}>{sub}</p>}
    </Reveal>
  );
}

const Ask = ({ className = "" }) => (
  <p className={`text-center text-sm text-white/40 ${className}`}>
    Something else? <a href="/contactus" className="text-primary hover:underline">Ask us directly</a> — a person replies.
  </p>
);

/* ═══ F1 · ACCORDION — one open at a time, least to read. ═══ */
export function FaqAccordion() {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();
  return (
    <section className="max-w-3xl mx-auto px-6 py-28">
      <div className="mb-12"><Head lines={["The things worth asking."]} /></div>
      <div className="space-y-2">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.04}>
              <div className={`rounded-2xl border transition-colors duration-200 ${isOpen ? "border-primary/45 bg-primary/[0.06]" : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}
                  className="w-full flex items-start gap-4 text-left p-6">
                  <span className="flex-1 font-syne text-lg font-semibold leading-snug">{f.q}</span>
                  <motion.span animate={reduce ? {} : { rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.22, ease: EASE_OUT }}
                    className={`shrink-0 mt-1 ${isOpen ? "text-primary" : "text-white/35"}`}><Plus size={17} /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div key="a" initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE_OUT }} className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm text-white/55 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
      <Reveal delay={0.15}><Ask className="mt-10" /></Reveal>
    </section>
  );
}

/* ═══ F2 · TABBED — grouped by what the worry actually is. Someone anxious
       about privacy should not have to read about refunds first. ═══ */
export function FaqTabbed() {
  const [cat, setCat] = useState(CATS[0]);
  const [open, setOpen] = useState(null);
  const reduce = useReducedMotion();
  const shown = FAQS.filter((f) => f.cat === cat);
  return (
    <section className="max-w-4xl mx-auto px-6 py-28">
      <div className="mb-10"><Head center lines={["What's on your mind?"]} sub="Pick the thing you are actually worried about." /></div>
      <div className="flex justify-center gap-2 mb-8 flex-wrap" role="tablist">
        {CATS.map((c) => {
          const I = FAQS.find((f) => f.cat === c).I;
          const on = cat === c;
          return (
            <button key={c} role="tab" aria-selected={on}
              onClick={() => { setCat(c); setOpen(null); }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm transition-colors duration-200 ${
                on ? "bg-primary text-white" : "border border-white/12 text-white/50 hover:text-white hover:border-white/30"}`}>
              <I size={14} />{c}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={cat}
          initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          exit={reduce ? {} : { opacity: 0, y: -14 }} transition={{ duration: 0.28, ease: EASE_OUT }}
          className="space-y-2">
          {shown.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={`rounded-2xl border transition-colors duration-200 ${isOpen ? "border-primary/45 bg-primary/[0.06]" : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}>
                <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}
                  className="w-full flex items-start gap-4 text-left p-6">
                  <span className="flex-1 font-syne text-lg font-semibold leading-snug">{f.q}</span>
                  <motion.span animate={reduce ? {} : { rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.22 }}
                    className={`shrink-0 mt-1 ${isOpen ? "text-primary" : "text-white/35"}`}><Plus size={17} /></motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE_OUT }} className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm text-white/55 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
      <Reveal delay={0.15}><Ask className="mt-10" /></Reveal>
    </section>
  );
}

/* ═══ F3 · EDITORIAL — nothing hidden. Every answer already open, set like a
       magazine Q&A. Costs length, buys trust: no click implies no evasion. ═══ */
export function FaqEditorial() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-28">
      <div className="mb-14">
        <Head lines={["Nothing here", "is behind a click."]}
          sub="Every answer, open. If an answer needed hiding it would need rewriting instead." />
      </div>
      <div className="space-y-10">
        {FAQS.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.04}>
            <div className="grid md:grid-cols-12 gap-5 border-t border-white/10 pt-8">
              <div className="md:col-span-1">
                <p className="font-syne text-3xl font-bold text-primary/30 leading-none">{String(i + 1).padStart(2, "0")}</p>
              </div>
              <div className="md:col-span-11">
                <p className="font-syne text-xl md:text-2xl font-bold leading-snug mb-3">{f.q}</p>
                <p className="text-[15px] text-white/50 leading-relaxed max-w-2xl">{f.a}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.15}><Ask className="mt-14" /></Reveal>
    </section>
  );
}

/* ═══ F4 · SPLIT — questions pinned left, the chosen answer set large on the
       right. Scannable list and a readable answer at the same time. ═══ */
export function FaqSplit() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const f = FAQS[i];
  return (
    <section className="max-w-6xl mx-auto px-6 py-28">
      <div className="mb-12"><Head lines={["The things worth asking."]} /></div>
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5 md:sticky md:top-24 md:self-start space-y-1">
          {FAQS.map((x, k) => (
            <button key={x.q} onClick={() => setI(k)} aria-current={k === i}
              className={`w-full text-left px-4 py-3.5 rounded-xl transition-colors duration-200 flex gap-3 items-start ${
                k === i ? "bg-primary/12 text-white" : "text-white/45 hover:text-white/80 hover:bg-white/[0.04]"}`}>
              <span className={`font-mono text-[11px] mt-1 shrink-0 ${k === i ? "text-primary" : "text-white/25"}`}>
                {String(k + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] font-medium leading-snug">{x.q}</span>
            </button>
          ))}
        </div>
        <div className="md:col-span-7">
          <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 to-transparent p-9 md:min-h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div key={i}
                initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={reduce ? {} : { opacity: 0, y: -16 }} transition={{ duration: 0.32, ease: EASE_OUT }}>
                <div className="flex items-center gap-2 mb-5">
                  <f.I size={15} className="text-primary" />
                  <span className="text-[10px] uppercase tracking-[2px] text-primary font-medium">{f.cat}</span>
                </div>
                <p className="font-syne text-2xl md:text-3xl font-bold leading-snug mb-5">{f.q}</p>
                <p className="text-[15px] text-white/60 leading-relaxed">{f.a}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Reveal delay={0.15}><Ask className="mt-12" /></Reveal>
    </section>
  );
}

/* ═══ F5 · CARDS — a grid that expands in place. Denser above the fold than
       a single column, so more questions are visible before any scrolling. ═══ */
export function FaqCards() {
  const [open, setOpen] = useState(null);
  const reduce = useReducedMotion();
  return (
    <section className="max-w-5xl mx-auto px-6 py-28">
      <div className="mb-12"><Head center lines={["The things worth asking."]}
        sub="Tap any card. Nothing here has a longer answer somewhere else." /></div>
      <div className="grid md:grid-cols-2 gap-4 items-start">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.05}>
              <motion.button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}
                whileHover={reduce ? {} : { y: -3 }} transition={{ duration: 0.2, ease: EASE_OUT }}
                className={`w-full text-left rounded-2xl border p-6 transition-colors duration-200 ${
                  isOpen ? "border-primary/45 bg-primary/[0.07]" : "border-white/10 bg-white/[0.03] hover:border-primary/30"}`}>
                <div className="flex items-center gap-2 mb-3">
                  <f.I size={13} className={isOpen ? "text-primary" : "text-white/30"} />
                  <span className={`text-[9px] uppercase tracking-[2px] ${isOpen ? "text-primary" : "text-white/30"}`}>{f.cat}</span>
                  <motion.span animate={reduce ? {} : { rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.22 }}
                    className={`ml-auto ${isOpen ? "text-primary" : "text-white/25"}`}><Plus size={15} /></motion.span>
                </div>
                <p className="font-syne text-lg font-semibold leading-snug">{f.q}</p>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE_OUT }} className="overflow-hidden">
                      <p className="pt-4 text-sm text-white/55 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </Reveal>
          );
        })}
      </div>
      <Reveal delay={0.15}>
        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-white/40">
          <Mail size={14} className="text-primary" />
          <span>Something else? <a href="/contactus" className="text-primary hover:underline">Ask us directly</a> — a person replies.</span>
        </div>
      </Reveal>
    </section>
  );
}

export const FAQ_LAYOUTS = [
  { label: "Accordion", C: FaqAccordion },
  { label: "Tabbed", C: FaqTabbed },
  { label: "Editorial", C: FaqEditorial },
  { label: "Split", C: FaqSplit },
  { label: "Cards", C: FaqCards },
];
