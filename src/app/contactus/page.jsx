"use client";

import Navbar from '@/component/Navbar'
import React from 'react'
import Footer from '@/component/Footer'
import GetInTouch from '@/component/getintouch'
import Faq from '@/component/faq'
import { motion } from 'framer-motion'

function page() {
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <Navbar variant="dark"/>

      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="container mx-auto px-6 lg:px-16 text-center py-32 relative z-10">

          <p className="text-xs uppercase tracking-[4px] text-accent-light font-medium mb-5">
            Contact &amp; Support
          </p>

          <h1 className="text-4xl sm:text-5xl font-syne font-semibold text-white leading-tight mb-6">
            Have a Question?
            <br />
            <span className="gradient-hero">
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
          className="absolute top-24 left-[10%] w-36 h-36 rounded-2xl border border-white/10 bg-primary/20 rotate-12 blur-[1px]"
        />
        <motion.div
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-[12%] w-20 h-20 rounded-full border border-white/15 bg-accent-light/20"
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

      {/* Registered entity details (OUT-220). Razorpay verifies these against the
          LLP's incorporation record during merchant activation, and the DPDP Act
          requires a NAMED grievance officer with real contact details — not a
          role inbox. This block is also referenced from the Privacy Policy and
          Terms, so all three must stay in step. */}
      <section className="bg-surface-page py-16 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[4px] text-accent-light font-display font-medium mb-8">
            Company &amp; Legal
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div className="space-y-2">
              <h3 className="text-white font-semibold mb-3">Registered entity</h3>
              <p className="text-white/70">PrimeWork Labs LLP</p>
              <p className="text-white/50">LLPIN: ADB-2168</p>
              <p className="text-white/50 leading-relaxed">
                1/400, UIT, Bhiwadi,<br />
                Alwar, Rajasthan 301019,<br />
                India
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-semibold mb-3">Get in touch</h3>
              <p className="text-white/70">
                Support:{" "}
                <a href="mailto:support@outmail.in" className="text-accent-light hover:underline">
                  support@outmail.in
                </a>
              </p>
              <p className="text-white/70">
                Phone:{" "}
                <a href="tel:+916375119988" className="text-accent-light hover:underline">
                  +91 63751 19988
                </a>
              </p>
              <p className="text-white/40 text-xs pt-1">Monday to Friday, 10am – 6pm IST</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-semibold mb-3">Grievance Officer</h3>
              <p className="text-white/70">Vishu Tomer</p>
              <p className="text-white/50">Designated Partner</p>
              <p className="text-white/70">
                <a href="mailto:admin@outmail.in" className="text-accent-light hover:underline">
                  admin@outmail.in
                </a>
              </p>
              <p className="text-white/40 text-xs pt-1 leading-relaxed">
                Appointed under the Digital Personal Data Protection Act, 2023. Grievances
                acknowledged within 48 hours.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/40">
            <a href="/privacy-policy" className="hover:text-white/70">Privacy Policy</a>
            <a href="/terms-and-conditions" className="hover:text-white/70">Terms and Conditions</a>
            <a href="/refund-and-cancellation" className="hover:text-white/70">Refund and Cancellation</a>
            <span>Recruiter? See section 6 of the Privacy Policy to opt out.</span>
          </div>
        </div>
      </section>
      </div>

      {/* FAQ */}
      <Faq />

      <Footer variant="dark"/>
    </div>
  )
}

export default page
