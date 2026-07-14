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
      <div className="relative z-10 min-h-[46vh] flex flex-col justify-center pt-16 pb-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-syne font-semibold tracking-tight leading-tight gradient-hero">
            Start landing the right interviews.
          </h1>
          <p className="mt-5 text-white/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Outmail helps students send AI-personalized cold emails from their own inbox,
            get resume-matched job openings, and learn from mentors who&apos;ve walked the path — all in one place.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
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
              className="relative z-10 w-full max-w-4xl rounded-2xl border border-purple-500/40 bg-gradient-to-b from-[#1a0040] to-black p-4 shadow-2xl shadow-purple-900/40"
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              <button
                onClick={() => setDemoOpen(false)}
                className="absolute -top-3 -right-3 z-20 bg-[#1a0040] border border-purple-500/40 rounded-full p-1 text-white/60 hover:text-white transition"
              >
                <X size={16} />
              </button>

              <iframe
                src="https://www.youtube.com/embed/LXtszHCWsgo?autoplay=1"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Hero;
