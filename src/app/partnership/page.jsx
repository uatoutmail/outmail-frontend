"use client";

import { useState } from "react";
import Wordmark from "@/component/ui/wordmark";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Phone,
  ArrowRight,
  Mail,
  Building2,
  Send,
  Search,
  BarChart3,
  Shield,
  Headphones,
  Check,
  Globe,
  Users,
  FileText,
  Zap,
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
  whileInView: {
    transition: {
      staggerChildren: 0.08,
    },
  },
  viewport: { once: true, amount: 0.2 },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
};

const featureCards = [
  {
    icon: Send,
    title: "Student Outreach Infrastructure",
    points: [
      "Structured recruiter outreach campaigns using student Gmail accounts",
      "Smart company database for recruiter targeting",
      "Personalized email templates for cold outreach",
      "Campaign scheduling and safe sending limits",
      "Email campaign analytics and tracking",
    ],
  },
  {
    icon: Search,
    title: "Opportunity Discovery",
    points: [
      "Curated job opportunity discovery for students",
      "Company hiring signals (funding, hiring trends, growth stage)",
      "Industry and role-based opportunity filters",
      "Job bookmarking and tracking",
    ],
  },
  {
    icon: BarChart3,
    title: "Placement Visibility for Universities",
    points: [
      "Institutional dashboard for placement officers",
      "Visibility into student outreach activity",
      "Companies contacted vs untouched insights",
      "Student engagement analytics",
      "Interview and offer tracking (self-reported)",
    ],
  },
  {
    icon: Shield,
    title: "Governance and Controls",
    points: [
      "Outreach enable/disable controls for placement officers",
      "Sending limits and safe-sending compliance",
      "Activity monitoring for institutional transparency",
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
  { icon: Users, label: "Mentorship or placement preparation modules" },
  { icon: FileText, label: "Institution-specific reporting dashboards" },
];

const trustCards = [
  {
    icon: Eye,
    title: "Full Visibility",
    body: "Know what every student is doing — without micromanaging.",
  },
  {
    icon: Shield,
    title: "Safe & Compliant",
    body: "Sending limits, controls, and institutional governance built-in.",
  },
  {
    icon: BarChart3,
    title: "Outcome Focused",
    body: "Track interviews, offers, and real placement metrics.",
  },
];

function GradientWord({ children }) {
  return (
    <span className="bg-gradient-to-r from-[#ad46ff] via-[#c387ff] to-[#6c00ff] bg-clip-text text-transparent">
      {children}
    </span>
  );
}

function BookCallButton({ onClick, className = "", children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#6c00ff] to-[#ad46ff] text-white px-6 py-3 rounded-xl font-semibold shadow-[0_10px_30px_rgba(108,0,255,0.35)] hover:brightness-110 transition ${className}`}
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
    <div className="min-h-screen bg-[#0a0b14] text-white">
      <Navbar variant="dark" />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center relative z-10">
          <motion.div {...fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-sm text-white/80">
            <Sparkles size={14} className="text-[#ad46ff]" />
            Pricing
          </motion.div>

          <motion.h1 {...fadeUp} className="mt-6 font-syne text-4xl sm:text-5xl font-semibold leading-tight max-w-5xl mx-auto">
            Simple Pricing for Universities That Want{" "}
            <GradientWord>Better Placement Outcomes</GradientWord>
          </motion.h1>

          <motion.p {...fadeUp} className="mt-6 text-white/70 max-w-4xl mx-auto text-lg leading-relaxed">
            Outmail helps universities empower students to run structured recruiter outreach,
            discover high-quality opportunities, and give placement officers visibility into
            off-campus hiring activity.
          </motion.p>

          <motion.p {...fadeUp} className="mt-4 text-white/60 max-w-3xl mx-auto text-lg leading-relaxed">
            Instead of fixed pricing tiers, we offer a simple institutional plan designed
            specifically for universities.
          </motion.p>

          <motion.div {...fadeUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <BookCallButton onClick={() => setIsBookCallOpen(true)} />
            <a
              href="mailto:contact@outmail.in"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white/85 hover:bg-white/10 transition"
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
          className="absolute top-24 left-[10%] w-36 h-36 rounded-2xl border border-white/10 bg-[#6c00ff]/20 rotate-12 blur-[1px]"
        />
        <motion.div
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-[12%] w-20 h-20 rounded-full border border-white/15 bg-[#ad46ff]/20"
        />
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-[20%] w-24 h-24 rounded-lg border border-white/10 bg-[#2f1a7a]/40 -rotate-12"
        />
      </section>

      {/* Pricing Card */}
      <section className="px-6 pb-20">
        <motion.div {...fadeUp} className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-white/12 bg-white/5 backdrop-blur-xl shadow-[0_0_45px_rgba(108,0,255,0.20)]">
          <div className="h-1 w-full bg-gradient-to-r from-[#6c00ff] to-[#ad46ff]" />
          <div className="p-8 md:p-10 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-r from-[#6c00ff] to-[#ad46ff] flex items-center justify-center mb-5 shadow-[0_10px_25px_rgba(108,0,255,0.35)]">
              <Building2 size={24} />
            </div>
            <h2 className="font-syne text-2xl md:text-3xl font-bold"><Wordmark /> Institutional Platform</h2>
            <p className="text-white/65 mt-2">A complete placement intelligence and outreach platform for universities.</p>

            <div className="mt-8">
              <p className="font-syne text-5xl md:text-6xl font-bold leading-none">
                <GradientWord>₹499</GradientWord>
              </p>
              <p className="text-white/70 mt-2 text-lg">/ student / month</p>
              <p className="text-white/50 mt-2 text-sm">Billed institutionally based on active students.</p>
            </div>

            <BookCallButton onClick={() => setIsBookCallOpen(true)} className="w-full mt-8" />

            <p className="text-white/45 text-sm mt-4">Custom plans available for larger institutions</p>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24">
        <motion.div {...fadeUp} className="max-w-7xl mx-auto text-center">
          <h3 className="font-syne text-3xl md:text-5xl font-bold">
            Everything Your <GradientWord>Placement Office</GradientWord> Needs
          </h3>
          <p className="text-white/60 mt-3 text-lg">One plan. Full capabilities. Built for universities.</p>
        </motion.div>

        <motion.div
          variants={staggerParent}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-7xl mx-auto mt-12 grid md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {featureCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                variants={staggerItem}
                key={index}
                className="rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-6 hover:border-[#ad46ff]/40 hover:shadow-[0_0_30px_rgba(108,0,255,0.2)] transition"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#6c00ff] to-[#ad46ff] flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h4 className="font-syne text-xl font-semibold mb-4">{card.title}</h4>
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

      {/* Customization */}
      <section className="px-6 pb-24">
        <motion.div
          {...fadeUp}
          className="max-w-6xl mx-auto rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-8 md:p-10"
        >
          <h3 className="font-syne text-3xl md:text-4xl font-bold leading-tight">
            Need a <GradientWord>Custom Setup</GradientWord> for Your Institution?
          </h3>
          <p className="text-white/65 mt-4 max-w-3xl">
            Every university has different placement workflows. Outmail can be configured based on your placement structure,
            student size, and outreach strategy.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            {customOptions.map((opt, i) => {
              const Icon = opt.icon;
              return (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  initial="initial"
                  whileInView="whileInView"
                  viewport={{ once: true }}
                  className="rounded-xl border border-white/12 bg-[#0f1222] p-4 flex items-start gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#6c00ff]/25 border border-[#ad46ff]/30 flex items-center justify-center">
                    <Icon size={16} className="text-[#c387ff]" />
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">{opt.label}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <BookCallButton onClick={() => setIsBookCallOpen(true)}>
              Schedule a Call to Discuss
            </BookCallButton>
            <a href="mailto:contact@outmail.in" className="text-white/80 hover:text-white underline underline-offset-4">
              Or email us at contact@outmail.in
            </a>
          </div>
        </motion.div>
      </section>

      {/* Trust */}
      <section className="px-6 pb-24">
        <motion.div {...fadeUp} className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-sm text-white/80">
            <Zap size={14} className="text-[#ad46ff]" />
            Why Outmail
          </div>
          <h3 className="font-syne text-3xl md:text-5xl font-bold mt-5 leading-tight">
            Built for the Next Generation of <GradientWord>Placement Infrastructure</GradientWord>
          </h3>
          <p className="text-white/65 mt-4 max-w-4xl mx-auto">
            Outmail is designed to help universities bring structure and visibility to off-campus placements
            while empowering students to take proactive action.
          </p>
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
                <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#6c00ff] to-[#ad46ff] flex items-center justify-center mb-4">
                  <Icon size={20} />
                </div>
                <h4 className="font-syne text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-white/65 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-24">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto text-center rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-8 md:p-12">
          <h3 className="font-syne text-3xl md:text-5xl font-bold leading-tight">
            Bring <GradientWord>Structured Outreach</GradientWord> to Your Students
          </h3>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <BookCallButton onClick={() => setIsBookCallOpen(true)} />
            <a
              href="mailto:contact@outmail.in"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white/85 hover:bg-white/10 transition"
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

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#6c00ff] to-[#ad46ff] flex items-center justify-center mb-5 shadow-[0_10px_25px_rgba(108,0,255,0.35)]">
                <Phone size={24} />
              </div>

              <h4 className="font-syne text-2xl font-bold mb-3">Book a Call</h4>
              <p className="text-white/70 leading-relaxed mb-6">
                Please mail us at contact@outmail.in with your preferred timing for a call and we will get in touch with you.
              </p>

              <a
                href="mailto:contact@outmail.in"
                className="inline-flex w-full items-center justify-center gap-2 bg-gradient-to-r from-[#6c00ff] to-[#ad46ff] text-white px-5 py-3 rounded-xl font-semibold hover:brightness-110 transition"
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
