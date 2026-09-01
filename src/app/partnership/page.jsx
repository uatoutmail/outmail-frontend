"use client";

import { useState } from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  ArrowRight,
  Mail,
  Send,
  Search,
  BarChart3,
  Shield,
  Headphones,
  Check,
  Globe,
  Users,
  FileText,
  GraduationCap,
  TrendingDown,
  Eye,
  X,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55 },
};

const staggerParent = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true, amount: 0.2 },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
};

const problems = [
  "On-campus drives reach only a fraction of the roles your students actually qualify for.",
  "The best-fit companies often never visit campus — and reaching them is manual and unstructured.",
  "Off-campus effort is invisible to your placement cell, so you can't support, guide, or measure it.",
];

const howItHelps = [
  {
    icon: Send,
    title: "Extend your reach beyond campus",
    body: "Every student runs structured recruiter outreach to companies that never visit — at scale, from their own inbox, with safe sending limits.",
  },
  {
    icon: Search,
    title: "Point them at the right roles",
    body: "Resume-matched opportunities ranked by an explainable Outmail Score, so students focus where they genuinely fit.",
  },
  {
    icon: BarChart3,
    title: "See off-campus activity",
    body: "A placement-cell dashboard surfaces outreach sent, companies contacted, and engagement — visibility your team never had before.",
  },
  {
    icon: GraduationCap,
    title: "Prepare every student",
    body: "Mentorship, resume reviews, and hiring-trend sessions get students ready for the exact roles and companies they're targeting.",
  },
];

const featureCards = [
  {
    icon: Send,
    title: "Student Outreach Infrastructure",
    points: [
      "Structured recruiter outreach from student inboxes",
      "Smart company database for recruiter targeting",
      "Personalized templates + safe sending limits",
      "Campaign scheduling, analytics, and tracking",
    ],
  },
  {
    icon: Search,
    title: "Opportunity Discovery",
    points: [
      "Curated, resume-matched opportunities",
      "Company hiring signals (funding, growth, momentum)",
      "Role- and industry-based filtering",
      "Explainable Outmail Score prioritization",
    ],
  },
  {
    icon: BarChart3,
    title: "Placement Visibility & Analytics",
    points: [
      "Institutional dashboard for placement officers",
      "Visibility into off-campus outreach activity",
      "Companies contacted vs untouched insights",
      "Student engagement + outcome tracking",
    ],
  },
  {
    icon: Shield,
    title: "Governance & Controls",
    points: [
      "Outreach enable/disable controls for the cell",
      "Sending limits and safe-sending compliance",
      "Activity monitoring for full transparency",
    ],
  },
  {
    icon: GraduationCap,
    title: "Mentorship & Preparation",
    points: [
      "Live mentorship with industry professionals",
      "Resume reviews and profile workshops",
      "Hiring-trend and interview-prep sessions",
    ],
  },
  {
    icon: Headphones,
    title: "Institution Support",
    points: [
      "Dedicated onboarding assistance",
      "Account support for placement teams",
      "Institutional reporting and insights",
    ],
  },
];

const customOptions = [
  { icon: Send, label: "Outreach-only deployments" },
  { icon: Globe, label: "Opportunity discovery integrations" },
  { icon: Users, label: "Mentorship or placement-prep modules" },
  { icon: FileText, label: "Institution-specific reporting dashboards" },
];

const trustCards = [
  { icon: Eye, title: "Full Visibility", body: "Know what every student is doing off campus — without micromanaging." },
  { icon: Shield, title: "Safe & Compliant", body: "Sending limits, controls, and institutional governance are built in." },
  { icon: BarChart3, title: "Outcome Focused", body: "Track outreach, engagement, and real off-campus placement progress." },
];

function GradientWord({ children }) {
  return <span className="gradient-hero">{children}</span>;
}

function Eyebrow({ children }) {
  return (
    <p className="text-xs uppercase tracking-[4px] text-accent-light font-display font-medium mb-4">
      {children}
    </p>
  );
}

function BookCallButton({ onClick, className = "", children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent-light text-white px-6 py-3 rounded-xl font-display font-semibold shadow-[0_10px_30px_rgba(108,0,255,0.35)] hover:brightness-110 transition ${className}`}
    >
      <Phone size={16} />
      <span>{children || "Book a Call"}</span>
      <ArrowRight size={16} />
    </button>
  );
}

export default function PartnershipPage() {
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-page text-white">
      <Navbar variant="dark" />

      {/* Hero — value-first, matches site hero typography */}
      <section className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 pt-28 pb-16 text-center relative z-10">
          <motion.div {...fadeUp}>
            <Eyebrow>For Universities &amp; Placement Cells</Eyebrow>
          </motion.div>

          <motion.h1 {...fadeUp} className="font-syne text-4xl sm:text-5xl font-semibold leading-tight">
            Help more of your students get placed —{" "}
            <GradientWord>off campus.</GradientWord>
          </motion.h1>

          <motion.p {...fadeUp} className="mt-6 text-white/60 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Outmail extends your placement cell beyond campus drives — giving every student
            structured recruiter outreach, resume-matched opportunities, and mentorship,
            with full visibility for your team.
          </motion.p>

          <motion.div {...fadeUp} className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <BookCallButton onClick={() => setIsBookCallOpen(true)} />
            <a
              href="mailto:contact@outmail.in"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 font-display text-white/85 hover:bg-white/10 transition"
            >
              <Mail size={16} />
              Contact Us
            </a>
          </motion.div>
        </div>

        {/* Floating shapes */}
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-[10%] w-36 h-36 rounded-2xl border border-white/10 bg-primary/20 rotate-12 blur-[1px]"
        />
        <motion.div
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-[12%] w-20 h-20 rounded-full border border-white/15 bg-accent-light/20"
        />
      </section>

      {/* The gap (problem) */}
      <section className="px-6 pb-20">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
          <Eyebrow>The off-campus gap</Eyebrow>
          <h2 className="font-syne text-3xl md:text-4xl font-semibold leading-tight">
            On-campus drives reach a <GradientWord>fraction</GradientWord> of the opportunities.
          </h2>
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-5xl mx-auto mt-10 grid md:grid-cols-3 gap-6"
        >
          {problems.map((p, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center mb-4">
                <TrendingDown size={18} className="text-red-300" />
              </div>
              <p className="text-white/75 text-sm leading-relaxed">{p}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How Outmail helps (solution) */}
      <section className="px-6 pb-24">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
          <Eyebrow>How Outmail helps</Eyebrow>
          <h2 className="font-syne text-3xl md:text-4xl font-semibold leading-tight">
            A proactive placement engine for{" "}
            <GradientWord>every student.</GradientWord>
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            Not another job board — an outreach and intelligence layer that helps your students
            reach opportunities campus drives never touch.
          </p>
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-5xl mx-auto mt-12 grid md:grid-cols-2 gap-6"
        >
          {howItHelps.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                variants={staggerItem}
                className="rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-6 flex gap-4 hover:border-accent-light/40 transition"
              >
                <div className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-r from-primary to-accent-light flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-syne text-lg font-semibold mb-1.5">{item.title}</h3>
                  <p className="text-white/65 text-sm leading-relaxed">{item.body}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* What your placement office gets */}
      <section className="px-6 pb-24">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
          <Eyebrow>The institutional platform</Eyebrow>
          <h2 className="font-syne text-3xl md:text-4xl font-semibold leading-tight">
            Everything your <GradientWord>placement office</GradientWord> gets.
          </h2>
          <p className="text-white/60 mt-4">One plan. Full capabilities. Built for universities.</p>
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-6xl mx-auto mt-12 grid md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                variants={staggerItem}
                key={index}
                className="rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-6 hover:border-accent-light/40 hover:shadow-[0_0_30px_rgba(108,0,255,0.2)] transition"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-primary to-accent-light flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-syne text-lg font-semibold mb-4">{card.title}</h3>
                <ul className="space-y-2.5 text-sm text-white/70 text-left">
                  {card.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check size={14} className="text-emerald-400 mt-1 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Why Outmail (outcomes) */}
      <section className="px-6 pb-24">
        <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center">
          <Eyebrow>Why Outmail</Eyebrow>
          <h2 className="font-syne text-3xl md:text-4xl font-semibold leading-tight">
            The next generation of <GradientWord>placement infrastructure.</GradientWord>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mt-10 grid md:grid-cols-3 gap-6"
        >
          {trustCards.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={i} variants={staggerItem} className="rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-6 text-left">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-primary to-accent-light flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h3 className="font-syne text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-white/65 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Custom setup */}
      <section className="px-6 pb-24">
        <motion.div {...fadeUp} className="max-w-6xl mx-auto rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-8 md:p-10">
          <h2 className="font-syne text-2xl md:text-3xl font-semibold leading-tight">
            Need a <GradientWord>custom setup</GradientWord> for your institution?
          </h2>
          <p className="text-white/65 mt-4 max-w-3xl">
            Every university has different placement workflows. Outmail can be configured around your
            placement structure, student cohort size, and outreach strategy.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {customOptions.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <div key={i} className="rounded-xl border border-white/12 bg-[#0f1222] p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/25 border border-accent-light/30 flex items-center justify-center">
                    <Icon size={16} className="text-[#c387ff]" />
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{opt.label}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Institutional plan CTA band (pricing = talk to us, no discount framing) */}
      <section className="px-6 pb-24">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto text-center rounded-2xl border border-white/12 bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-xl p-8 md:p-12">
          <Eyebrow>Institutional plan</Eyebrow>
          <h2 className="font-syne text-3xl md:text-4xl font-semibold leading-tight">
            Simple per-student pricing that scales with your cohort.
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            One institutional plan, tailored to your student count and the modules you need.
            Book a call and we&apos;ll put together a quote for your placement cell.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <BookCallButton onClick={() => setIsBookCallOpen(true)}>
              Book a Call for Pricing
            </BookCallButton>
            <a
              href="mailto:contact@outmail.in"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 font-display text-white/85 hover:bg-white/10 transition"
            >
              <Mail size={16} />
              Contact Us
            </a>
          </div>
        </motion.div>
      </section>

      <Footer variant="dark" />

      {/* Book a Call modal */}
      <AnimatePresence>
        {isBookCallOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center"
            onClick={() => setIsBookCallOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md rounded-2xl border border-white/15 bg-[#121625] p-7 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsBookCallOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-primary to-accent-light flex items-center justify-center mb-5 shadow-[0_10px_25px_rgba(108,0,255,0.35)]">
                <Phone size={24} />
              </div>

              <h3 className="font-syne text-2xl font-bold mb-3">Book a Call</h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Email us at contact@outmail.in with your institution and a preferred time, and we&apos;ll get in touch to set up a call.
              </p>

              <a
                href="mailto:contact@outmail.in?subject=Outmail%20for%20our%20institution"
                className="inline-flex w-full items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent-light text-white px-5 py-3 rounded-xl font-display font-semibold hover:brightness-110 transition"
              >
                <Mail size={16} />
                Send Email
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
