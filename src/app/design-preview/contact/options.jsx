"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mail, Phone, MapPin, GraduationCap, Building2, Users, ArrowRight, Clock } from "lucide-react";
import { Reveal, MaskLines, Kicker, EASE_OUT } from "@/component/motion/kit";

/** Preview only — the form does not submit. Wiring stays with getintouch.jsx. */
const CHANNELS = [
  { I: Mail, l: "Email", v: "support@outmail.in", href: "mailto:support@outmail.in", sub: "A person replies, usually within a day" },
  { I: Phone, l: "Phone", v: "+91 63751 19988", href: "tel:+916375119988", sub: "Mon–Sat, 10am–7pm IST" },
  { I: MapPin, l: "Registered office", v: "Bhiwadi, Rajasthan", sub: "1/400, UIT, Alwar 301019, India" },
];

const AUDIENCES = [
  { I: GraduationCap, k: "student", t: "I'm a student", d: "Questions about your account, a payment, or how outreach works.",
    fields: ["Your name", "College email", "What's going on?"] },
  { I: Building2, k: "recruiter", t: "I'm a recruiter", d: "Partnerships, or removing yourself from our contact pool.",
    fields: ["Your name", "Work email", "Company", "What do you need?"] },
  { I: Users, k: "tpo", t: "I'm a placement officer", d: "Campus plans, bulk access and reporting for your students.",
    fields: ["Your name", "Institution", "Work email", "How many students?"] },
];

function Field({ label, area = false }) {
  const cls = "w-full bg-white/[0.04] border border-white/12 rounded-btn px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[2px] text-white/35 mb-2">{label}</label>
      {area ? <textarea rows={4} className={cls} placeholder="…" /> : <input className={cls} placeholder="…" />}
    </div>
  );
}

function SubmitRow({ label = "Send message" }) {
  return (
    <div className="flex items-center gap-4 pt-1">
      <button type="button"
        className="font-syne font-semibold text-sm bg-primary hover:bg-primary-hover text-white rounded-btn px-6 py-3 transition-colors inline-flex items-center gap-2">
        {label} <ArrowRight size={15} />
      </button>
      <span className="text-xs text-white/30 inline-flex items-center gap-1.5"><Clock size={12} /> Replies within 24 hours</span>
    </div>
  );
}

/* ═══ 1 · SPLIT — channels beside the form. The arrangement most people expect. ═══ */
export function ContactSplit() {
  return (
    <section id="contact-us" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-20">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <Kicker className="mb-4">Reach us</Kicker>
          <MaskLines lines={["Three ways", "to get an answer."]} accentIdx={1}
            className="font-syne text-3xl md:text-4xl font-bold tracking-tight mb-7" />
          <div className="space-y-3">
            {CHANNELS.map((c, i) => (
              <Reveal key={c.l} delay={i * 0.07}>
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
                  <span className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                    <c.I size={15} className="text-primary" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[2px] text-white/35 mb-1">{c.l}</p>
                    {c.href
                      ? <a href={c.href} className="block text-sm text-white hover:text-primary transition-colors truncate">{c.v}</a>
                      : <p className="text-sm text-white">{c.v}</p>}
                    <p className="text-xs text-white/35 mt-0.5">{c.sub}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={0.15} className="md:col-span-7">
          <div className="rounded-3xl border border-white/12 bg-white/[0.03] p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5"><Field label="Your name" /><Field label="Email" /></div>
            <Field label="Subject" />
            <Field label="Message" area />
            <SubmitRow />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══ 2 · ROUTER — pick who you are first, and the form changes.
       Fewer irrelevant fields, and it tells a recruiter unprompted that
       removing themselves from the pool is a thing they can do. ═══ */
export function ContactRouter() {
  const [k, setK] = useState(0);
  const reduce = useReducedMotion();
  const a = AUDIENCES[k];
  return (
    <section id="contact-us" className="max-w-4xl mx-auto px-6 py-20 scroll-mt-20">
      <Reveal>
        <Kicker className="mb-4">Reach us</Kicker>
        <MaskLines lines={["Who's asking?"]} className="font-syne text-3xl md:text-4xl font-bold tracking-tight mb-3" />
        <p className="text-white/45 mb-8">So we can send it to the right person and skip the fields that do not apply.</p>
      </Reveal>
      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        {AUDIENCES.map((x, i) => (
          <button key={x.k} onClick={() => setK(i)}
            className={`text-left rounded-2xl border p-5 transition-colors ${
              k === i ? "border-primary/50 bg-primary/[0.08]" : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}>
            <x.I size={17} className={k === i ? "text-primary" : "text-white/30"} />
            <p className="font-syne text-[15px] font-bold mt-3 mb-1">{x.t}</p>
            <p className="text-xs text-white/40 leading-relaxed">{x.d}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={a.k}
          initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          exit={reduce ? {} : { opacity: 0, y: -14 }} transition={{ duration: 0.28, ease: EASE_OUT }}
          className="rounded-3xl border border-white/12 bg-white/[0.03] p-8 space-y-5">
          {a.fields.map((f, i) => <Field key={f} label={f} area={i === a.fields.length - 1} />)}
          <SubmitRow />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

/* ═══ 3 · CENTRED — one column, nothing beside it. Least to look at. ═══ */
export function ContactCentred() {
  return (
    <section id="contact-us" className="max-w-2xl mx-auto px-6 py-20 scroll-mt-20">
      <Reveal className="text-center mb-10">
        <Kicker className="mb-4">Reach us</Kicker>
        <MaskLines lines={["Say what you need."]} className="font-syne text-3xl md:text-4xl font-bold tracking-tight mb-3" />
        <p className="text-white/45">Or email <a href="mailto:support@outmail.in" className="text-primary hover:underline">support@outmail.in</a> — same inbox, same person.</p>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="rounded-3xl border border-white/12 bg-white/[0.03] p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5"><Field label="Your name" /><Field label="Email" /></div>
          <Field label="Message" area />
          <SubmitRow />
        </div>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8 text-xs text-white/35">
          {CHANNELS.map((c) => (
            <span key={c.l} className="inline-flex items-center gap-2"><c.I size={12} className="text-primary" />{c.v}</span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ═══ 4 · CHANNELS FIRST — big contact cards, form underneath.
       Best when most people want an address, not a form. ═══ */
export function ContactChannelsFirst() {
  const reduce = useReducedMotion();
  return (
    <section id="contact-us" className="max-w-5xl mx-auto px-6 py-20 scroll-mt-20">
      <Reveal>
        <Kicker className="mb-4">Reach us</Kicker>
        <MaskLines lines={["Pick a channel."]} className="font-syne text-3xl md:text-4xl font-bold tracking-tight mb-8" />
      </Reveal>
      <div className="grid md:grid-cols-3 gap-4 mb-14">
        {CHANNELS.map((c, i) => (
          <Reveal key={c.l} delay={i * 0.08}>
            <motion.a href={c.href || "#contact-form"} whileHover={reduce ? {} : { y: -4 }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              className="block h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-7 hover:border-primary/40 transition-colors">
              <c.I size={20} className="text-primary mb-4" />
              <p className="text-[10px] uppercase tracking-[2px] text-white/35 mb-1.5">{c.l}</p>
              <p className="font-syne text-lg font-bold mb-1.5 break-words">{c.v}</p>
              <p className="text-xs text-white/40 leading-relaxed">{c.sub}</p>
            </motion.a>
          </Reveal>
        ))}
      </div>
      <Reveal id="contact-form">
        <div className="rounded-3xl border border-white/12 bg-white/[0.03] p-8">
          <p className="font-syne text-xl font-bold mb-6">Or write to us here</p>
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5"><Field label="Your name" /><Field label="Email" /></div>
            <Field label="Message" area />
            <SubmitRow />
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ═══ LEGAL BLOCK — required by DPDP (named grievance officer) and checked by
       Razorpay during merchant activation. Only the presentation varies. ═══ */
const LEGAL = [
  { t: "Registered entity", rows: [["Name", "PrimeWork Labs LLP"], ["LLPIN", "ADB-2168"], ["Address", "1/400, UIT, Bhiwadi, Alwar, Rajasthan 301019, India"]] },
  { t: "Grievance Officer", rows: [["Name", "Vishu Tomer"], ["Role", "Designated Partner"], ["Email", "admin@outmail.in"], ["Phone", "+91 63751 19988"]] },
  { t: "Support", rows: [["Email", "support@outmail.in"], ["Hours", "Mon–Sat, 10am–7pm IST"], ["Response", "Within 24 hours"]] },
];

export function LegalColumns() {
  return (
    <section className="border-t border-white/10 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal><Kicker className="mb-8">Company &amp; legal</Kicker></Reveal>
        <div className="grid md:grid-cols-3 gap-8 text-sm">
          {LEGAL.map((g, i) => (
            <Reveal key={g.t} delay={i * 0.07}>
              <h3 className="font-syne text-white font-bold mb-3">{g.t}</h3>
              <dl className="space-y-1.5">
                {g.rows.map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <dt className="text-white/30 w-20 shrink-0 text-xs pt-0.5">{k}</dt>
                    <dd className="text-white/60 text-[13px]">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LegalTable() {
  return (
    <section className="border-t border-white/10 py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Reveal><Kicker className="mb-6">Company &amp; legal</Kicker></Reveal>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          {LEGAL.flatMap((g) => g.rows.map(([k, v]) => [g.t, k, v])).map(([g, k, v], i) => (
            <div key={`${g}${k}`} className={`grid grid-cols-12 gap-3 px-5 py-3.5 text-[13px] ${i % 2 ? "bg-white/[0.02]" : ""}`}>
              <span className="col-span-4 text-white/30">{g} · {k}</span>
              <span className="col-span-8 text-white/65">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LegalCompact() {
  return (
    <section className="border-t border-white/10 py-14 px-6">
      <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-white/[0.02] p-7">
        <Kicker className="mb-4">Company &amp; legal</Kicker>
        <p className="text-sm text-white/55 leading-relaxed">
          Outmail is operated by <strong className="text-white">PrimeWork Labs LLP</strong> (LLPIN ADB-2168),
          1/400, UIT, Bhiwadi, Alwar, Rajasthan 301019, India. Grievance Officer:{" "}
          <strong className="text-white">Vishu Tomer</strong>, Designated Partner —{" "}
          <a href="mailto:admin@outmail.in" className="text-primary hover:underline">admin@outmail.in</a>,
          +91 63751 19988. General support:{" "}
          <a href="mailto:support@outmail.in" className="text-primary hover:underline">support@outmail.in</a>,
          Mon–Sat 10am–7pm IST.
        </p>
      </div>
    </section>
  );
}

export const CONTACT_LAYOUTS = [
  { label: "Split", C: ContactSplit },
  { label: "Router", C: ContactRouter },
  { label: "Centred", C: ContactCentred },
  { label: "Channels first", C: ContactChannelsFirst },
];
export const LEGAL_LAYOUTS = [
  { label: "Columns", C: LegalColumns },
  { label: "Table", C: LegalTable },
  { label: "Compact", C: LegalCompact },
];
