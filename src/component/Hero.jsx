'use client';
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import StackingCards from './stackcards';
import WrapButton from './ui/wrap-button';

const oauthUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;

function Hero() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="relative overflow-x-clip bg-[#0a0b14]">
      {/* Hero text block — reduced height so first stacked card is more visible */}
      <div className="h-[46vh] flex flex-col justify-center pt-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-syne font-semibold tracking-tight leading-snug bg-gradient-to-r from-[#b06cff] via-white to-[#b06cff] bg-clip-text text-transparent">
            Where Smart Outreach Meets Real Opportunities and Expert Mentorship.
          </h1>

          <div className="mt-8 flex items-center justify-center gap-6">
            <WrapButton href={oauthUrl} />
            <button
              onClick={() => setDemoOpen(true)}
              className="text-white/80 font-medium text-sm hover:text-[#b06cff] transition-colors duration-200"
            >
              Watch Demo →
            </button>
          </div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 left-[8%] w-32 h-32 rounded-2xl border border-white/10 bg-[#6c00ff]/20 rotate-12 blur-[1px]"
      />
      <motion.div
        animate={{ y: [0, 16, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-28 right-[10%] w-20 h-20 rounded-full border border-white/15 bg-[#ad46ff]/20"
      />
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[28%] left-[6%] w-16 h-16 rounded-lg border border-white/10 bg-[#6c00ff]/10 -rotate-12"
      />

      {/* Stacking cards — first card visible on initial load */}
      <div className="-mt-12 sm:-mt-16">
        <StackingCards />
      </div>

      {/* Demo coming-soon modal */}
      <AnimatePresence>
        {demoOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setDemoOpen(false)}
            />

            {/* Dialog */}
            <motion.div
              className="relative z-10 w-full max-w-md rounded-2xl border border-purple-500/40 bg-gradient-to-b from-[#1a0040] to-black p-10 text-center shadow-2xl shadow-purple-900/40"
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              <button
                onClick={() => setDemoOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition"
              >
                <X size={18} />
              </button>

              {/* Glow dot */}
              <div className="mx-auto mb-6 h-14 w-14 rounded-full bg-[#6c00ff]/30 border border-purple-500/50 flex items-center justify-center">
                <span className="text-2xl">🎬</span>
              </div>

              <h2 className="text-xl font-bold text-white mb-3">Demo Coming Soon</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                We&apos;re putting the finishing touches on the demo experience.<br />
                <span className="text-purple-300 font-medium">Thanks for your patience!</span>
              </p>

              <button
                onClick={() => setDemoOpen(false)}
                className="mt-8 bg-[#6c00ff] hover:bg-[#8a00ff] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Hero;
