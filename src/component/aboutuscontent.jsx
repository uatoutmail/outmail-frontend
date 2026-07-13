'use client';
import React from 'react';
import PillarVisual from '@/component/animations/PillarVisual';

export default function AboutUs() {
  return (
    <section className="w-full px-4 sm:px-8 md:px-16 py-20 bg-[#0a0b14] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* LEFT: TEXT CONTENT */}
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-indigo-300 uppercase tracking-wider mb-2">
            About Outmail
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Helping You Get Noticed,
            <br />
            <span className="gradient-hero">
              Not Ignored.
            </span>
          </h2>
          <p className="text-white/75 max-w-xl text-base md:text-lg leading-relaxed mb-10">
            The job market is not a meritocracy — it&apos;s a visibility game. Most qualified candidates never even get a reply, not because they lack skill, but because their application never reached a human. Outmail was built to fix exactly that.
          </p>

          <div className="flex flex-col gap-7">
            <div className="flex items-start gap-4">
              <span className="mt-1 flex-shrink-0 w-9 h-9 rounded-full bg-[#6c00ff]/40 border border-purple-500/40 flex items-center justify-center text-base">📡</span>
              <div>
                <h4 className="text-white font-semibold text-base mb-1">Direct Recruiter Outreach</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Skip the ATS filter. Outmail surfaces real recruiter email addresses tied to live hiring signals — funding rounds, headcount growth, job postings — and sends a personalised cold email on your behalf.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-1 flex-shrink-0 w-9 h-9 rounded-full bg-[#6c00ff]/40 border border-purple-500/40 flex items-center justify-center text-base">🧠</span>
              <div>
                <h4 className="text-white font-semibold text-base mb-1">Built for the Hidden Job Market</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  Over 70% of roles are filled before they&apos;re ever posted. Outmail gives you access to this hidden market by tracking company momentum — so you reach out when a team is actively growing, not after 300 others have already applied.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="mt-1 flex-shrink-0 w-9 h-9 rounded-full bg-[#6c00ff]/40 border border-purple-500/40 flex items-center justify-center text-base">🎓</span>
              <div>
                <h4 className="text-white font-semibold text-base mb-1">Made for Students &amp; Early Careers</h4>
                <p className="text-white/60 text-sm leading-relaxed">
                  From campus placements to your first tech role, Outmail is designed around the constraints of a student — no experience required to use it, no network needed to start. Just connect your Gmail and go.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: IMAGE — dissolved into background via gradient mask */}
        <div
          className="flex-1 w-full max-w-lg relative"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 28%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 28%, black 85%, transparent 100%)',
          }}
        >
          <div className="relative w-full aspect-[5/4] overflow-hidden rounded-2xl border border-white/10">
            <PillarVisual variant="outreach" />
          </div>
        </div>
      </div>
    </section>
  );
}
