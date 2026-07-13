'use client';
import React from 'react';
import Wordmark from '@/component/ui/wordmark';

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

        {/* What Outmail does (honest value, no invented metrics) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-left">
          {[
            { title: "AI-personalized outreach", desc: "Emails tailored to each recruiter, sent from your own inbox — not spray-and-pray." },
            { title: "Résumé-matched jobs", desc: "A ranked, explainable feed of openings that actually fit your profile and goals." },
            { title: "Mentorship on tap", desc: "Bi-weekly sessions with people who've navigated the path you're on." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/12 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
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
