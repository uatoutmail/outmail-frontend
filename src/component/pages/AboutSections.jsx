"use client";
import { Target, Users, ShieldCheck, Compass } from "lucide-react";
import React from "react";
import { Reveal, MaskLines, Count, Kicker } from "@/component/motion/kit";

/**
 * The /about page sections: the problem stated once with the number behind it,
 * four commitments set as a numbered manifesto, and a short letter about who
 * runs the company.
 *
 * Each principle costs us something — a claim we cannot make, a price we
 * cannot charge — which is what makes them worth publishing rather than
 * describing ourselves with adjectives.
 */
export const PRINCIPLES = [
  {
    I: Target,
    n: "01",
    t: "We sell reach, not outcomes",
    d: "We will not promise you a job, and we say so on the pricing page. What Outmail changes is how many of the right people see you, and how much of your time goes into applications worth making.",
  },
  {
    I: ShieldCheck,
    n: "02",
    t: "Your inbox stays yours",
    d: "Outreach sends from your own Gmail, using an app password stored in your computer's keychain and never on our servers. Revoke it in your Google account and sending stops immediately.",
  },
  {
    I: Users,
    n: "03",
    t: "Built for students without referrals",
    d: "Everyone says referrals are how you get in. Almost nobody says what to do if you have none. That gap is the entire product.",
  },
  {
    I: Compass,
    n: "04",
    t: "One payment, then we get out of the way",
    d: "No subscription, no upsell ladder, no usage meter running while you think. You buy a placement year and you own it.",
  },
];

/** Four commitments, numbered and set large — signed statements, not blurbs. */
export function PrinciplesManifesto() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <Reveal>
        <Kicker className="mb-10">What we hold to</Kicker>
      </Reveal>
      <div className="border-t border-white/10">
        {PRINCIPLES.map((p, i) => (
          <Reveal key={p.t} delay={i * 0.06}>
            <div className="grid md:grid-cols-12 gap-5 py-9 border-b border-white/10">
              <span className="md:col-span-2 font-syne text-4xl font-bold text-primary/25 leading-none">
                {p.n}
              </span>
              <div className="md:col-span-10">
                <h3 className="font-syne text-2xl md:text-3xl font-bold tracking-tight mb-3">
                  {p.t}
                </h3>
                <p className="text-white/50 leading-relaxed max-w-2xl">{p.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** The problem, stated once, with the number that makes it real. */
export function ProblemSplit() {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-8 pb-16">
      <div className="grid md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-7">
          <MaskLines
            lines={["Hiring stopped", "being a numbers game.", "Nobody told students."]}
            accentIdx={2}
            className="font-syne text-3xl md:text-4xl font-bold leading-[1.08] tracking-tight"
          />
        </div>
        <Reveal delay={0.25} className="md:col-span-5 md:border-l border-white/15 md:pl-8 md:pt-2">
          <p className="font-syne text-5xl font-bold text-primary/30 leading-none mb-2">
            <Count to={250} suffix="+" />
          </p>
          <p className="text-sm text-white/50 leading-relaxed">
            applications per opening. A recruiter reads perhaps twelve of them. Applying harder does
            not move you into the twelve — being reachable does.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function EntityLetter() {
  return (
    <section className="max-w-2xl mx-auto px-6 pb-16">
      <Reveal>
        <Kicker className="mb-5">Who runs Outmail</Kicker>
        <div className="space-y-4 text-[15px] text-white/60 leading-relaxed">
          <p>We are a small team at PrimeWork Labs LLP.</p>
          <p>
            Small is why support is a person and not a ticket queue, and why mentorship is capped at
            twenty-five seats instead of sold to everyone who asks. It is also why we would rather
            tell you plainly that we cannot guarantee you a job than write a sentence we would have
            to defend later.
          </p>
          <p>
            If something about Outmail is wrong, unclear or unfair, write to us and a human will
            answer.
          </p>
        </div>
        {/* Entity and LLPIN only. The registered address and phone are
            published in the Terms and the Privacy Policy rather than repeated
            across the site. */}
        <p className="mt-7 text-sm text-white/35">
          PrimeWork Labs LLP · LLPIN ADB-2168
          <br />
          <a href="mailto:support@outmail.in" className="text-primary hover:underline">
            support@outmail.in
          </a>
          {" · "}
          <a href="/privacy-policy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </Reveal>
    </section>
  );
}
