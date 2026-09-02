"use client";
import { Mail, Briefcase, Zap, Users } from "lucide-react";
import { Reveal, MaskLines, Count, Kicker } from "@/component/motion/kit";

/**
 * The four offerings, set as a magazine spread rather than a card grid.
 *
 * The asymmetric 7/5 column split is the point: an even grid reads as four
 * equal features, and these are not equal — outreach and jobs are what most
 * people buy this for.
 */
export const OFFERINGS = [
  {
    t: "Cold outreach",
    d: "Personalised emails to verified recruiters, sent from your own Gmail — never from us.",
    I: Mail,
  },
  {
    t: "Matched jobs",
    d: "Openings scored against your resume, with the reasoning shown so you know why.",
    I: Briefcase,
  },
  {
    t: "One-click autofill",
    d: "Applications completed from answers you saved once, by a browser extension.",
    I: Zap,
  },
  {
    t: "Mentorship",
    d: "Bi-weekly sessions with people who have navigated the path you are on. 25 seats.",
    I: Users,
  },
];

export default function Editorial() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-28">
      <Reveal>
        <Kicker className="mb-10">The four things</Kicker>
      </Reveal>
      <div className="grid grid-cols-12 gap-x-10 gap-y-16">
        <div className="col-span-12 md:col-span-7">
          <MaskLines
            lines={["Most resumes are", "never read by a", "human being."]}
            accentIdx={2}
            className="font-syne text-4xl md:text-5xl font-bold leading-[1.03] tracking-tight"
          />
        </div>
        <Reveal
          delay={0.3}
          className="col-span-12 md:col-span-5 md:border-l border-white/15 md:pl-8 md:pt-3"
        >
          <p className="font-syne text-5xl font-bold text-primary/30 leading-none mb-2">
            <Count to={250} suffix="+" />
          </p>
          <p className="text-sm text-white/50 leading-relaxed">
            applications per opening. A recruiter reads perhaps twelve. Outmail is how you become
            one of the twelve — and how you find the openings worth that effort.
          </p>
        </Reveal>
        {OFFERINGS.map((o, i) => (
          <Reveal
            key={o.t}
            delay={i * 0.06}
            className={i % 2 === 0 ? "col-span-12 md:col-span-7" : "col-span-12 md:col-span-5"}
          >
            <div className="border-t border-white/12 pt-5">
              <div className="flex items-baseline gap-3 mb-2">
                <o.I size={17} className="text-primary translate-y-0.5" />
                <h3 className="font-syne text-2xl md:text-3xl font-bold">{o.t}</h3>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">{o.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
