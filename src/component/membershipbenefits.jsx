import React from 'react';
import Image from 'next/image';

const benefits = [
  {
    icon: '📡',
    title: 'Direct Recruiter Outreach',
    desc: "Bypass ATS filters and land straight in a recruiter's inbox — powered by live hiring signals and smart company targeting.",
  },
  {
    icon: '🔍',
    title: 'Curated Job Intelligence',
    desc: 'Browse roles ranked by hiring urgency, funding momentum, and company growth — not just whatever was posted publicly.',
  },
  {
    icon: '🎓',
    title: 'Expert Mentorship Sessions',
    desc: "Book live sessions with professionals and alumni who've navigated the exact path you're on. Real advice, not generic tips.",
  },
  {
    icon: '📊',
    title: 'Campaign Analytics',
    desc: "Track opens, replies, and outreach performance in real time — so you know what's working and where to double down.",
  },
];

const MembershipBenefits = () => {
  return (
    <section className="bg-[#0a0b14] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — Text Content */}
        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[4px] text-purple-400 font-medium mb-4">
            What You Get
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
            Every Edge You Need,
            <br />
            <span className="gradient-hero">
              All in One Place.
            </span>
          </h2>
          <p className="text-white/60 text-base mb-10 max-w-lg leading-relaxed">
            Outmail combines proactive outreach, hiring intelligence, and expert guidance — so you&apos;re not just applying, you&apos;re strategically positioning yourself ahead of the crowd.
          </p>

          <div className="flex flex-col gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="mt-1 flex-shrink-0 w-9 h-9 rounded-full bg-[#6c00ff]/40 border border-purple-500/40 flex items-center justify-center text-base">
                  {b.icon}
                </span>
                <div>
                  <h4 className="text-white font-semibold text-base mb-1">{b.title}</h4>
                  <p className="text-white/55 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </div>
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
          <Image
            src="/OutmailOfferings.png"
            alt="Outmail platform features"
            width={640}
            height={520}
            className="w-full h-auto object-cover object-center opacity-90"
          />
        </div>

      </div>
    </section>
  );
};

export default MembershipBenefits;