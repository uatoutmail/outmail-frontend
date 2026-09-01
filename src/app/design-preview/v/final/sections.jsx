"use client";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { Mail, Briefcase, Zap, Check, Plus, MessageSquare } from "lucide-react";
import { Reveal, MaskLines, Cta, EASE_OUT, EASE_BACK } from "../kit";

/* ═══════════ KINETIC BAND — the four offerings, in product order ═══════════ */
export function KineticBand() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["-14%", "8%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["10%", "-12%"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["-8%", "10%"]);

  // Order follows how the product is actually used: you reach out, we find the
  // openings, applications get filled, mentors help you close. Pricing was
  // removed — a price does not belong in the same breath as the capabilities.
  const rows = [
    { x: x1, cls: "text-white", text: "COLD OUTREACH · COLD OUTREACH · " },
    { x: x2, cls: "", grad: true, text: "JOB AGGREGATION · JOB AGGREGATION · " },
    { x: x3, cls: "text-white/20", text: "AUTOFILL · MENTORSHIP · AUTOFILL · MENTORSHIP · " },
  ];
  return (
    <section ref={ref} className="py-24 overflow-hidden border-y border-white/8">
      <Reveal className="px-6 max-w-5xl mx-auto mb-10">
        <p className="text-[10px] uppercase tracking-[4px] text-primary">Everything Outmail does</p>
      </Reveal>
      <div className="space-y-1 md:space-y-2">
        {rows.map((r, i) => (
          <motion.p key={i} style={reduce ? {} : { x: r.x }}
            className={`font-syne text-[13vw] md:text-[9vw] font-bold leading-[0.95] whitespace-nowrap ${r.cls}`}>
            {r.grad
              ? <span className="bg-gradient-to-r from-primary to-accent-light bg-clip-text text-transparent">{r.text}</span>
              : r.text}
          </motion.p>
        ))}
      </div>
    </section>
  );
}

/* ═══════════ THE STORY — problems, and what solves each ═══════════ */
const STORY = [
  {
    n: "01", pill: "the pile",
    problem: "She applied to 180 openings. Four replied.",
    detail: "Every one went into an ATS behind 250 other applications. Nobody read hers, because nobody read most of them.",
    fix: "Outmail writes to the person doing the hiring instead — from Ananya's own Gmail, personalised from her resume, so it arrives as a message rather than a submission.",
    offering: "Cold outreach", I: Mail, visual: "send",
  },
  {
    n: "02", pill: "the search",
    problem: "She was applying to whatever LinkedIn showed her.",
    detail: "Most of it was senior, or the wrong stack, or closed weeks ago. She spent more time filtering than applying.",
    fix: "Outmail aggregates openings from across job boards and company sites, scores each one against her resume, and shows the reasoning — so she only spends effort where she has a real chance.",
    offering: "Job aggregation", I: Briefcase, visual: "match",
  },
  {
    n: "03", pill: "the forms",
    problem: "Each application took twenty minutes of retyping.",
    detail: "Same name, same notice period, same 'why do you want to work here', typed again into a slightly different form.",
    fix: "Outmail's extension fills them in one click, from answers she wrote once — so the twenty minutes goes into the ten applications that matter instead of the first one.",
    offering: "One-click autofill", I: Zap, visual: "fill",
  },
  {
    n: "04", pill: "the interview",
    problem: "Then a recruiter replied, and she had nobody to ask.",
    detail: "No seniors at that company, no alumni she knew, no idea what the loop looked like or what they would ask.",
    fix: "Bi-weekly mentorship with people who have already been through it — for the part where getting the interview stops being the hard bit.",
    offering: "Mentorship", I: MessageSquare, visual: "mentor",
  },
];

function StepVisual({ kind, reduce }) {
  const base = "rounded-xl border border-white/10 bg-black/25 p-4";
  if (kind === "match") return (
    <div className={base}>{[{ l: "Razorpay · SDE Intern", s: 94 }, { l: "Zomato · Backend Intern", s: 88 }, { l: "Meesho · Platform", s: 81 }].map((m, i) => (
      <motion.div key={m.l} className="flex items-center gap-2 mb-2 last:mb-0"
        initial={reduce ? false : { opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.4, delay: i * 0.12 }}>
        <span className="text-[11px] text-white/55 flex-1 truncate">{m.l}</span>
        <span className="text-[11px] font-mono text-primary">{m.s}</span>
      </motion.div>
    ))}</div>
  );
  if (kind === "send") return (
    <div className={`${base} flex items-center gap-3`}>
      <motion.div initial={reduce ? false : { scale: 0.7, rotate: -15 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.45, ease: EASE_BACK }} className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
        <Mail size={16} className="text-white" />
      </motion.div>
      <div className="flex flex-wrap gap-1.5">
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">sent from her Gmail</span>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">4 queued</span>
      </div>
    </div>
  );
  if (kind === "fill") return (
    <div className={`${base} space-y-2`}>{["Full name", "Notice period", "Why this role?"].map((f, i) => (
      <motion.div key={f} className="flex items-center gap-2"
        initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ delay: 0.15 * i, duration: 0.3 }}>
        <Check size={11} className="text-primary shrink-0" />
        <span className="text-[11px] text-white/50">{f}</span>
        <span className="ml-auto h-1 flex-1 max-w-[52px] rounded-full bg-primary/40" />
      </motion.div>
    ))}</div>
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

export function StorySection() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-6xl mx-auto px-6 py-28">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-4 md:sticky md:top-24 md:self-start">
          <p className="text-[10px] uppercase tracking-[4px] text-primary mb-4">How it works</p>
          <p className="font-syne text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-5">
            Meet Ananya.<br /><span className="text-white/35">Final year. No referrals.</span>
          </p>
          <p className="text-sm text-white/45 leading-relaxed mb-6">
            She is not short of effort. She is short of the four things that actually decide whether
            effort turns into interviews — and each one is a different problem.
          </p>
          <div className="hidden md:block"><Cta label="Start your year" /></div>
        </div>

        <div className="md:col-span-8 space-y-4">
          {STORY.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.05}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 hover:border-primary/40 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <p className="font-syne text-3xl font-bold text-primary/30 leading-none">{s.n}</p>
                  <span className="text-[9px] uppercase tracking-[2px] text-white/35 border border-white/15 rounded-full px-2.5 py-0.5">{s.pill}</span>
                </div>

                {/* the problem, in her words */}
                <p className="font-syne text-xl md:text-2xl font-bold mb-2 leading-snug">{s.problem}</p>
                <p className="text-sm text-white/45 leading-relaxed mb-5">{s.detail}</p>

                {/* what Outmail does about it — visually separated so the fix is not lost in the complaint */}
                <div className="rounded-xl border-l-2 border-primary bg-primary/[0.07] pl-5 pr-4 py-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <s.I size={14} className="text-primary" />
                    <span className="text-[10px] uppercase tracking-[2px] text-primary font-medium">{s.offering}</span>
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed">{s.fix}</p>
                </div>

                <StepVisual kind={s.visual} reduce={reduce} />
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-7 text-center">
              <p className="font-syne text-xl font-bold mb-1.5">Four problems. One subscription-free year.</p>
              <p className="text-sm text-white/50">₹999 · everything above · full refund within 7 days</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════ TESTIMONIALS ═══════════ */
const QUOTES = [
  { q: "I sent 180 applications and heard back from four. I don't think anyone read them.", a: "Final year · VIT Vellore" },
  { q: "I don't know a single person at any of these companies. That's the actual problem.", a: "Final year · PES Bengaluru" },
  { q: "Everyone says referrals are how you get in. Nobody says what to do if you have none.", a: "Final year · NIT Trichy" },
  { q: "I spend more time filtering LinkedIn than actually applying anywhere.", a: "Pre-final year · Manipal" },
];

export function Testimonials() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-5xl mx-auto px-6 py-28">
      <Reveal>
        <p className="text-[10px] uppercase tracking-[4px] text-primary mb-4">Early validation</p>
        <MaskLines lines={["We asked students first."]} className="font-syne text-4xl md:text-5xl font-bold tracking-tight mb-3" />
        <p className="text-white/45 max-w-xl mb-12">
          Before we built anything. These are unprompted — nobody was asked whether they wanted Outmail,
          only what was hard.
        </p>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-4">
        {QUOTES.map((x, i) => (
          <Reveal key={x.a} delay={i * 0.08}>
            <motion.div whileHover={reduce ? {} : { y: -4 }} transition={{ duration: 0.22, ease: EASE_OUT }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 h-full hover:border-primary/40 transition-colors duration-200">
              <p className="font-syne text-3xl text-primary/30 leading-none mb-3">&ldquo;</p>
              <p className="font-syne text-lg leading-snug mb-5">{x.q}</p>
              <p className="text-xs text-white/40">{x.a}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <p className="text-center text-xs text-white/30 mt-8">
          Real conversations, quoted with permission. We have no customer results to show yet — when we do, they go here.
        </p>
      </Reveal>
    </section>
  );
}

/* ═══════════ FAQ ═══════════ */
const FAQS = [
  { q: "Is this a subscription? Will I be charged again?",
    a: "No. You pay once for one year of access, and nothing renews automatically. We will never charge your card a second time unless you choose to buy another year." },
  { q: "Do you get access to my Gmail password?",
    a: "No, and this is worth being exact about. Sending uses a Gmail app password that you generate and that is stored only in your own computer's keychain. It is never transmitted to us and never stored on our servers. Revoking it in your Google account stops all sending immediately." },
  { q: "Are these real recruiters, or scraped emails?",
    a: "Business contact details for people who are hiring, sourced from public listings and commercial contact-data providers, and checked for deliverability before use. Every message carries an unsubscribe link, and one click removes that person permanently across every Outmail user." },
  { q: "Will this get my Gmail account banned?",
    a: "Your daily limit starts at five and grows slowly, only if you are actually sending. That warm-up is deliberate — it is what keeps your account inside normal sending behaviour rather than looking like bulk mail." },
  { q: "What happens when my year ends?",
    a: "Outreach stops and job openings are no longer shown, and we remind you before that happens. Nothing is deleted — your resume, history and saved answers stay exactly where they are and come back the moment you renew. Renewing early adds to the days you have left rather than replacing them." },
  { q: "What if it doesn't work for me?",
    a: "Ask for a refund within 7 days of paying and we refund in full, without asking you to justify it. We do not deduct for emails already sent." },
  { q: "Can you guarantee I'll get a job?",
    a: "No, and anyone who does is lying. What Outmail changes is how many of the right people see you, and how much of your time goes into the applications worth making. The rest is your profile and the market." },
];

export function Faq() {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();
  return (
    <section className="max-w-3xl mx-auto px-6 py-28">
      <Reveal>
        <p className="text-[10px] uppercase tracking-[4px] text-primary mb-4">Questions</p>
        <MaskLines lines={["The things worth asking."]} className="font-syne text-4xl md:text-5xl font-bold tracking-tight mb-12" />
      </Reveal>
      <div className="space-y-2">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.04}>
              <div className={`rounded-2xl border transition-colors duration-200 ${isOpen ? "border-primary/45 bg-primary/[0.06]" : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}>
                <button onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-start gap-4 text-left p-6">
                  <span className="flex-1 font-syne text-lg font-semibold leading-snug">{f.q}</span>
                  <motion.span animate={reduce ? {} : { rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.22, ease: EASE_OUT }}
                    className={`shrink-0 mt-1 ${isOpen ? "text-primary" : "text-white/35"}`}>
                    <Plus size={17} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div key="a"
                      initial={reduce ? false : { height: 0, opacity: 0 }}
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
      <Reveal delay={0.15}>
        <p className="text-center text-sm text-white/40 mt-10">
          Something else? <a href="/contactus" className="text-primary hover:underline">Ask us directly</a> — a person replies.
        </p>
      </Reveal>
    </section>
  );
}

/* ═══════════ STORY — alternative layout A: horizontal scroll-scrubbed chapters ═══════════ */
export function StoryHorizontal() {
  const reduce = useReducedMotion();
  const track = useRef(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["3%", "-62%"]);
  return (
    <>
      <section className="pt-20 pb-6 px-6 max-w-6xl mx-auto">
        <Reveal><p className="text-[10px] uppercase tracking-[4px] text-primary mb-4">How it works</p></Reveal>
        <Reveal delay={0.1}>
          <p className="font-syne text-4xl md:text-5xl font-bold tracking-tight">
            Meet Ananya. <span className="text-white/35">Four problems, in order.</span>
          </p>
        </Reveal>
      </section>
      <section ref={track} className="h-[340vh] relative">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <motion.div style={reduce ? {} : { x }} className="flex gap-6 px-[7vw]">
            {STORY.map((s) => (
              <div key={s.n} className="w-[82vw] md:w-[38vw] shrink-0 rounded-3xl border border-white/10 bg-gradient-to-br from-primary/12 to-transparent p-9">
                <div className="flex items-center justify-between mb-5">
                  <p className="font-syne text-5xl font-bold text-primary/25">{s.n}</p>
                  <span className="text-[9px] uppercase tracking-[2px] text-white/35 border border-white/15 rounded-full px-2.5 py-1">{s.pill}</span>
                </div>
                <p className="font-syne text-2xl font-bold mb-2 leading-snug">{s.problem}</p>
                <p className="text-sm text-white/45 leading-relaxed mb-5">{s.detail}</p>
                <div className="rounded-xl border-l-2 border-primary bg-primary/[0.07] pl-4 pr-3 py-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <s.I size={13} className="text-primary" />
                    <span className="text-[10px] uppercase tracking-[2px] text-primary">{s.offering}</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">{s.fix}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ═══════════ STORY — alternative layout B: problem/solution split, left vs right ═══════════ */
export function StorySplit() {
  const reduce = useReducedMotion();
  return (
    <section className="max-w-5xl mx-auto px-6 py-28">
      <Reveal className="mb-14">
        <p className="text-[10px] uppercase tracking-[4px] text-primary mb-4">How it works</p>
        <MaskLines lines={["Meet Ananya.", "Four problems, four fixes."]} accentIdx={1}
          className="font-syne text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]" />
      </Reveal>

      {/* the column headers make the argument before a single row is read */}
      <div className="hidden md:grid grid-cols-2 gap-6 mb-4 text-[10px] uppercase tracking-[3px]">
        <p className="text-white/25">What stops her</p>
        <p className="text-primary">What Outmail does</p>
      </div>

      <div className="space-y-3">
        {STORY.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.06}>
            <div className="grid md:grid-cols-2 gap-3 md:gap-6 items-stretch">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <p className="font-syne text-2xl font-bold text-white/15 leading-none mb-3">{s.n}</p>
                <p className="font-syne text-lg font-bold mb-2 leading-snug text-white/70">{s.problem}</p>
                <p className="text-xs text-white/35 leading-relaxed">{s.detail}</p>
              </div>
              <motion.div whileHover={reduce ? {} : { y: -3 }} transition={{ duration: 0.2, ease: EASE_OUT }}
                className="rounded-2xl border border-primary/30 bg-primary/[0.07] p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <s.I size={14} className="text-primary" />
                  <span className="text-[10px] uppercase tracking-[2px] text-primary font-medium">{s.offering}</span>
                </div>
                <p className="text-sm text-white/65 leading-relaxed mb-4 flex-1">{s.fix}</p>
                <StepVisual kind={s.visual} reduce={reduce} />
              </motion.div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
