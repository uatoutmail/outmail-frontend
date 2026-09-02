"use client";

import { useState } from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import PageHeader from "@/component/ui/PageHeader";
import Story from "@/component/landing/Story";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, ArrowRight, X, Mail } from "lucide-react";
import GapFlip from "@/component/pages/GapFlip";
import { OfficeLedger, CtaBandCentred } from "@/component/pages/PartnershipSections";

export default function PartnershipPage() {
  const [isBookCallOpen, setIsBookCallOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-page text-white">
      <Navbar variant="dark" />
      <main>
        <PageHeader
          kicker="For universities & placement cells"
          lines={["Help more students", "get placed off campus."]}
          sub="Outmail extends your placement cell beyond campus drives — structured recruiter outreach, resume-matched openings and mentorship for every student, with full visibility for your team."
        >
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <button onClick={() => setIsBookCallOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 font-syne font-semibold rounded-btn transition-colors">
              <Phone size={16} /> Book a call <ArrowRight size={16} />
            </button>
            <a href="mailto:contact@outmail.in"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-btn border border-white/20 font-syne text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors">
              <Mail size={16} /> Contact us
            </a>
          </div>
        </PageHeader>

        <GapFlip />
        {/* The student-side story: what an office is actually being asked to fund. */}
        <Story />
        <OfficeLedger />
        <CtaBandCentred onBook={() => setIsBookCallOpen(true)} />
      </main>
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

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-primary to-accent-light flex items-center justify-center mb-5 shadow-[0_10px_25px_-6px_var(--brand-primary)]">
                <Phone size={24} />
              </div>

              <h3 className="font-syne text-2xl font-bold mb-3">Book a Call</h3>
              <p className="text-white/70 leading-relaxed mb-6">
                Email us at contact@outmail.in with your institution and a preferred time, and we&apos;ll get in touch to set up a call.
              </p>

              <a
                href="mailto:contact@outmail.in?subject=Outmail%20for%20our%20institution"
                className="inline-flex w-full items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent-light text-white px-5 py-3 rounded-xl font-syne font-semibold hover:brightness-110 transition"
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
