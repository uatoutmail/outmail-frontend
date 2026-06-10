"use client";

import Navbar from '@/component/Navbar'
import React from 'react'
import Footer from '@/component/Footer'
import GetInTouch from '@/component/getintouch'
import Faq from '@/component/faq'
import { motion } from 'framer-motion'

function page() {
  return (
    <div className="min-h-screen bg-[#0a0b14] text-white">
      <Navbar variant="dark"/>

      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16 text-center py-32 relative z-10">

          <p className="text-xs uppercase tracking-[4px] text-[#AD46FF] font-medium mb-5">
            Contact &amp; Support
          </p>

          <h1 className="text-4xl sm:text-5xl font-syne font-semibold text-white leading-tight mb-6">
            Have a Question?
            <br />
            <span className="bg-gradient-to-r from-[#b06cff] via-white to-[#b06cff] bg-clip-text text-transparent">
              We&apos;re Here for You.
            </span>
          </h1>

          <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Whether you&apos;re a student with a question, a recruiter curious about partnerships,
            or a placement officer exploring campus plans &mdash; our team replies within 24 hours.
          </p>

          <button
            onClick={() => {
              document.getElementById('contact-us')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="rounded-full border border-white/20 bg-white/5 text-white px-5 py-3 hover:bg-white/10 transition duration-300"
          >
            &#8595;
          </button>

        </div>

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
      </div>

      {/* Form */}
      <div id="contact-us">
        <GetInTouch/>
      </div>

      {/* FAQ */}
      <Faq />

      <Footer variant="dark"/>
    </div>
  )
}

export default page
