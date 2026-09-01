"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, CreditCard, Shield, Sparkles } from "lucide-react";
import { Reveal, MaskLines, EASE_OUT } from "../kit";

/**
 * FAQ — grouped by worry. LOCKED.
 *
 * Money / Privacy / Product, because someone anxious about the Gmail app
 * password should not have to scroll past the refund policy to reach it.
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


export default FaqTabbed;
