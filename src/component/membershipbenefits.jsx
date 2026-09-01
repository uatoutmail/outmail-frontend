"use client";
import React from 'react';
import { Radio, Search, GraduationCap, BarChart3 } from 'lucide-react';
import { Reveal, MaskLines, Kicker } from '@/component/motion/kit';
import PillarVisual from '@/component/animations/PillarVisual';

const benefits = [
  {
    Icon: Radio,
    title: 'Direct Recruiter Outreach',
    desc: "Bypass ATS filters and land straight in a recruiter's inbox — powered by live hiring signals and smart company targeting.",
  },
  {
    Icon: Search,
    title: 'Curated Job Intelligence',
    desc: 'Browse roles ranked by hiring urgency, funding momentum, and company growth — not just whatever was posted publicly.',
  },
  {
    Icon: GraduationCap,
    title: 'Expert Mentorship Sessions',
    desc: "Book live sessions with professionals and alumni who've navigated the exact path you're on. Real advice, not generic tips.",
  },
  {
    Icon: BarChart3,
    title: 'Campaign Analytics',
    desc: "Track opens, replies, and outreach performance in real time — so you know what's working and where to double down.",
  },
];

const MembershipBenefits = () => {
  return (
    <section className="bg-surface-page py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — Text Content */}
        <div className="flex flex-col justify-center">
          <Reveal><Kicker className="mb-5">What you get</Kicker></Reveal>
          <MaskLines lines={["Every edge you need,", "in one place."]} accentIdx={1}
            className="font-syne text-4xl sm:text-5xl font-bold tracking-tight leading-[1.05] mb-6" />
          <p className="text-white/60 text-base mb-10 max-w-lg leading-relaxed">
            Outmail combines proactive outreach, hiring intelligence, and expert guidance — so you&apos;re not just applying, you&apos;re strategically positioning yourself ahead of the crowd.
          </p>

          <div className="flex flex-col gap-6">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.06}>
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 shrink-0 w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <b.Icon size={16} className="text-primary" />
                  </span>
                  <div>
                    <h3 className="font-syne text-white font-bold text-base mb-1">{b.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right — Product visual dissolved into background */}
        <div
          className="w-full"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 28%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 28%, black 85%, transparent 100%)',
          }}
        >
          <div className="relative w-full aspect-[5/4] overflow-hidden rounded-2xl border border-white/10">
            <PillarVisual variant="jobs" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default MembershipBenefits;