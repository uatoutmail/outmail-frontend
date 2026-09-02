"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { GraduationCap, Building2, Users, ArrowRight, Clock, Check } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Reveal, MaskLines, Kicker, EASE_OUT } from "@/component/motion/kit";

/**
 * The contact form.
 *
 * WHY IT ASKS WHO YOU ARE FIRST
 *   Three very different people land here and only one of them is a customer.
 *   Choosing first means nobody fills in a field that does not apply to them,
 *   and — the part that matters — a recruiter is told unprompted that removing
 *   themselves from our contact pool is a thing they can ask for. That is an
 *   obligation, so it should not be buried in a free-text box.
 *
 * Posts to the same POST /api/contact the previous form used, with `role`
 * carrying the audience so the inbox can be triaged.
 */
const AUDIENCES = [
  {
    I: GraduationCap, k: "student", role: "Student", t: "I'm a student",
    d: "Questions about your account, a payment, or how outreach works.",
    fields: [
      { n: "name", l: "Your name", type: "text", required: true },
      { n: "email", l: "College email", type: "email", required: true },
      { n: "message", l: "What's going on?", area: true, required: true },
    ],
  },
  {
    I: Building2, k: "recruiter", role: "Recruiter", t: "I'm a recruiter",
    d: "Partnerships, or removing yourself from our contact pool.",
    fields: [
      { n: "name", l: "Your name", type: "text", required: true },
      { n: "email", l: "Work email", type: "email", required: true },
      { n: "company", l: "Company", type: "text" },
      { n: "message", l: "What do you need?", area: true, required: true },
    ],
  },
  {
    I: Users, k: "tpo", role: "Placement officer", t: "I'm a placement officer",
    d: "Campus plans, bulk access and reporting for your students.",
    fields: [
      { n: "name", l: "Your name", type: "text", required: true },
      { n: "institution", l: "Institution", type: "text" },
      { n: "email", l: "Work email", type: "email", required: true },
      { n: "message", l: "How many students, and what do you need?", area: true, required: true },
    ],
  },
];

const INPUT =
  "w-full bg-white/[0.04] border border-white/12 rounded-btn px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

export default function ContactRouter() {
  const [k, setK] = useState(0);
  const [form, setForm] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const reduce = useReducedMotion();
  const a = AUDIENCES[k];

  const pick = (i) => { setK(i); setForm({}); setSent(false); };
  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      // `company`/`institution` are folded into the message rather than sent as
      // unknown keys — the endpoint takes name/email/role/message.
      const extra = [form.company && `Company: ${form.company}`, form.institution && `Institution: ${form.institution}`]
        .filter(Boolean).join("\n");
      await api.post("/api/contact", {
        name: form.name || "",
        email: form.email || "",
        role: a.role,
        message: extra ? `${extra}\n\n${form.message || ""}` : form.message || "",
      }, { quiet: true });
      setSent(true);
    } catch (err) {
      // Never surface backend internals — the user only needs to know it failed
      // and what to do instead.
      toast.error("We couldn't send that. Please email support@outmail.in.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact-us" className="max-w-4xl mx-auto px-6 py-20 scroll-mt-24">
      <Reveal>
        <Kicker className="mb-4">Reach us</Kicker>
        <MaskLines lines={["Who's asking?"]} className="font-syne text-3xl md:text-4xl font-bold tracking-tight mb-3" />
        <p className="text-white/45 mb-8">So we can send it to the right person and skip the fields that do not apply.</p>
      </Reveal>

      <div className="grid sm:grid-cols-3 gap-3 mb-6" role="tablist" aria-label="Who is contacting us">
        {AUDIENCES.map((x, i) => (
          <button key={x.k} onClick={() => pick(i)} role="tab" aria-selected={k === i} type="button"
            className={`text-left rounded-2xl border p-5 transition-colors duration-200 ${
              k === i ? "border-primary/50 bg-primary/[0.08]" : "border-white/10 bg-white/[0.02] hover:border-white/25"}`}>
            <x.I size={17} className={k === i ? "text-primary" : "text-white/30"} />
            <p className="font-syne text-[15px] font-bold mt-3 mb-1">{x.t}</p>
            <p className="text-xs text-white/40 leading-relaxed">{x.d}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="sent"
            initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="rounded-3xl border border-emerald-500/30 bg-emerald-500/[0.07] p-10 text-center" role="status">
            <span className="inline-flex w-11 h-11 rounded-full bg-emerald-500/20 items-center justify-center mb-4">
              <Check size={20} className="text-emerald-300" />
            </span>
            <p className="font-syne text-xl font-bold mb-2">Message sent.</p>
            <p className="text-sm text-white/50">A person will reply within 24 hours, usually sooner.</p>
          </motion.div>
        ) : (
          <motion.form key={a.k} onSubmit={submit}
            initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            exit={reduce ? {} : { opacity: 0, y: -14 }} transition={{ duration: 0.28, ease: EASE_OUT }}
            className="rounded-3xl border border-white/12 bg-white/[0.03] p-8 space-y-5">
            {a.fields.map((f) => (
              <div key={f.n}>
                <label htmlFor={`c-${f.n}`} className="block text-[10px] uppercase tracking-[2px] text-white/35 mb-2">
                  {f.l}
                </label>
                {f.area ? (
                  <textarea id={`c-${f.n}`} name={f.n} rows={4} required={f.required}
                    value={form[f.n] || ""} onChange={change} className={INPUT} />
                ) : (
                  <input id={`c-${f.n}`} name={f.n} type={f.type} required={f.required}
                    value={form[f.n] || ""} onChange={change} className={INPUT} />
                )}
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button type="submit" disabled={sending} aria-busy={sending}
                className="font-syne font-semibold text-sm bg-primary hover:bg-primary-hover text-white rounded-btn px-6 py-3 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {sending ? "Sending…" : "Send message"} {!sending && <ArrowRight size={15} />}
              </button>
              <span className="text-xs text-white/30 inline-flex items-center gap-1.5">
                <Clock size={12} /> Replies within 24 hours
              </span>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </section>
  );
}
