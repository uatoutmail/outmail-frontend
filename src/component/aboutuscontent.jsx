"use client";
import React from "react";
import { Target, Users, ShieldCheck, Compass } from "lucide-react";
import { Reveal, MaskLines, Count, Cta, Kicker } from "@/component/motion/kit";

/**
 * About page content, rebuilt on the site's design language.
 *
 * The old version was three centred paragraphs of mission language. This one
 * makes the same argument through the thing that actually distinguishes us —
 * who we built it for and what we refuse to claim — because "we are passionate
 * about careers" is what every competitor's about page also says.
 */

const PRINCIPLES = [
  {
    I: Target, t: "We sell reach, not outcomes",
    d: "We will not promise you a job, and we say so on the pricing page. What Outmail changes is how many of the right people see you, and how much of your time goes into applications worth making.",
  },
  {
    I: ShieldCheck, t: "Your inbox stays yours",
    d: "Outreach sends from your own Gmail, using an app password stored in your computer's keychain and never on our servers. Revoke it in your Google account and sending stops immediately.",
  },
  {
    I: Users, t: "Built for students without referrals",
    d: "Everyone says referrals are how you get in. Almost nobody says what to do if you have none. That gap is the entire product.",
  },
  {
    I: Compass, t: "One payment, then we get out of the way",
    d: "No subscription, no upsell ladder, no usage meter running while you think. You buy a placement year and you own it.",
  },
];

export default function AboutUs() {
  return (
    <section className="max-w-5xl mx-auto px-6 pb-28">
      {/* the problem, stated once */}
      <div className="grid md:grid-cols-12 gap-10 items-start mb-24">
        <div className="md:col-span-7">
          <MaskLines lines={["Hiring stopped", "being a numbers game.", "Nobody told students."]} accentIdx={2}
            className="font-syne text-3xl md:text-4xl font-bold leading-[1.08] tracking-tight" />
        </div>
        <Reveal delay={0.25} className="md:col-span-5 md:border-l border-white/15 md:pl-8 md:pt-2">
          <p className="font-syne text-5xl font-bold text-primary/30 leading-none mb-2"><Count to={250} suffix="+" /></p>
          <p className="text-sm text-white/50 leading-relaxed">
            applications per opening. A recruiter reads perhaps twelve of them. Applying harder
            does not move you into the twelve — being reachable does.
          </p>
        </Reveal>
      </div>

      {/* what we believe, as commitments rather than adjectives */}
      <Reveal><Kicker className="mb-10">What we hold to</Kicker></Reveal>
      <div className="grid md:grid-cols-2 gap-4 mb-24">
        {PRINCIPLES.map((p, i) => (
          <Reveal key={p.t} delay={i * 0.07}>
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7 hover:border-primary/40 transition-colors duration-200">
              <p.I size={18} className="text-primary mb-4" />
              <h3 className="font-syne text-xl font-bold mb-2.5">{p.t}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{p.d}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* who is behind it — a real entity, named */}
      <Reveal>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:flex items-start gap-10">
          <div className="md:w-1/3 mb-5 md:mb-0">
            <Kicker className="mb-3">Who runs Outmail</Kicker>
            <p className="font-syne text-2xl font-bold leading-snug">PrimeWork Labs LLP</p>
          </div>
          <div className="md:w-2/3 text-sm text-white/50 leading-relaxed space-y-3">
            <p>
              Outmail is built and operated by PrimeWork Labs LLP (LLPIN ADB-2168), registered at
              1/400, UIT, Bhiwadi, Alwar, Rajasthan 301019, India.
            </p>
            <p>
              We are a small team, which is why support is a person and not a queue, and why the
              mentorship tier is capped at 25 seats rather than sold to everyone who asks.
            </p>
            <p>
              Questions, complaints or anything to do with your data:{" "}
              <a href="mailto:support@outmail.in" className="text-primary hover:underline">support@outmail.in</a>.
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="text-center mt-16">
          <Cta label="Start your placement year" />
        </div>
      </Reveal>
    </section>
  );
}
