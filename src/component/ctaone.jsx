'use client';
import React from 'react';
import Wordmark from '@/component/ui/wordmark';
import CountUp, { useCountUp } from 'react-countup';

export default function CtaOne() {
  return (
    <div className="relative overflow-hidden bg-[#0a0b14] text-white py-20 px-4">
      <div className="absolute top-10 left-[10%] w-16 h-16 rounded-full border border-white/10 bg-[#6c00ff]/12" />
      <div className="absolute bottom-16 right-[8%] w-20 h-20 rounded-xl border border-white/10 bg-[#ad46ff]/10 -rotate-12" />

      {/* Insights Section */}
      <div className="max-w-6xl mx-auto text-center mt-30">
        <p className="text-sm font-medium text-indigo-300 uppercase tracking-wider mb-2">Why Visibility Matters</p>
        <h2 className="text-3xl text-white md:text-4xl font-bold mb-4">Most Resumes Never Get Seen. <Wordmark variant="gradient" /> Changes That.</h2>
        <p className="text-white mb-8 max-w-2xl mx-auto">
          Outmail doesn’t just send emails — it gets you seen. Start today and maximize your chances of landing interviews faster.
        </p>

        {/* Stats */}
        <div className="flex flex-col md:flex-row justify-center gap-12 text-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-[#ffff]">
              <CountUp end={5} duration={2.5} suffix="x" enableScrollSpy/>
            </h3>
            <p className="text-white">More Visibility</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#ffff]">
              <CountUp end={500} duration={2.5} suffix="+" enableScrollSpy/>
            </h3>
            <p className="text-white">Hiring Signals Tracked Daily</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#ffff]">
              <CountUp end={10000} duration={2.5} suffix="+" enableScrollSpy/>
            </h3>
            <p className="text-white">Companies in Our Database</p>
          </div>
        </div>

        {/* CTA Box */}
        <div className="rounded-2xl p-20 flex border border-white/12 bg-white/5 backdrop-blur-xl flex-col md:flex-row justify-between items-center shadow-[0_0_45px_rgba(108,0,255,0.20)]">
          <div className="text-white max-w-md">
            <h3 className="text-2xl font-semibold mb-4">Start Your Outmail Journey Today</h3>
            <p className="mb-6 text-white/80">
              Don’t let your application get lost. Outmail gives you the tools to get noticed, connect directly, and land more interviews.
            </p>
            <a
              href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`}
              className="inline-block bg-gradient-to-r from-[#6c00ff] to-[#ad46ff] text-white px-6 py-2 rounded-full font-medium hover:brightness-110 transition"
            >
              Get Started Now
            </a>
          </div>
          <img
            src="/Logo_Outmail.png"
            alt="Outmail Job Visibility"
            className="w-44 h-44 mt-10 md:mt-0 md:ml-8 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
