"use client";
import React from "react";
import { Mail, Building2, Send, GraduationCap, User, Star, Sparkles, Zap } from "lucide-react";

/**
 * On-brand animated scenes that replace the AI "screenshot" imagery.
 * Pure CSS/SVG motion (keyframes live in globals.css, disabled under
 * prefers-reduced-motion). Brand elements use the --brand-* tokens, so a
 * palette change in globals.css recolors these too.
 *
 * variant: "outreach" | "jobs" | "mentorship"
 */

// Faint twinkling constellation behind every scene.
function Constellation() {
  const dots = [
    [12, 18], [26, 62], [40, 30], [58, 72], [72, 22], [84, 54], [18, 82], [66, 44], [92, 34], [48, 12],
  ];
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute -inset-10 opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 35%, color-mix(in srgb, var(--brand-primary) 30%, transparent), transparent 70%)",
        }}
      />
      {dots.map(([x, y], i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white anim-twinkle"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: i % 3 === 0 ? 3 : 2,
            height: i % 3 === 0 ? 3 : 2,
            animationDelay: `${(i % 5) * 0.6}s`,
          }}
        />
      ))}
    </div>
  );
}

const sceneBase =
  "absolute inset-0 flex items-center justify-center p-6 sm:p-8 select-none";

function OutreachScene() {
  const companies = [
    { label: "Series B · Fintech", top: "14%", left: "8%", delay: "0s" },
    { label: "Hiring · 12 roles", top: "20%", left: "62%", delay: "0.8s" },
    { label: "Just raised · AI", top: "70%", left: "68%", delay: "1.6s" },
  ];
  return (
    <div className={sceneBase}>
      <Constellation />

      {/* Floating company chips with a "hiring" pulse */}
      {companies.map((c, i) => (
        <div
          key={i}
          className="absolute anim-float-y"
          style={{ top: c.top, left: c.left, animationDelay: c.delay }}
        >
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-md">
            <Building2 size={13} className="text-white/70" />
            <span className="text-[11px] font-medium text-white/80 whitespace-nowrap">{c.label}</span>
            <span className="relative flex h-2 w-2">
              <span className="anim-pulse-ring absolute inline-flex h-full w-full rounded-full bg-green-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
          </div>
        </div>
      ))}

      {/* Center: a personalized compose card */}
      <div className="relative z-10 w-[min(340px,80%)] anim-float-y-lg">
        <div className="rounded-2xl border border-white/15 bg-[#0d0f1e]/80 p-4 shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: "var(--brand-primary)" }}
            >
              <Mail size={14} className="text-white" />
            </span>
            <div className="h-2 w-24 rounded-full bg-white/25" />
            <div className="ml-auto h-2 w-8 rounded-full bg-white/10" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-[85%] rounded-full bg-white/15" />
            <div className="h-2 w-[70%] rounded-full bg-white/15" />
            <div
              className="h-2 w-[55%] rounded-full anim-soft-pulse"
              style={{ background: "var(--brand-primary-soft)" }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/40">
              <Sparkles size={11} /> AI-personalized
            </div>
            <span
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white anim-soft-pulse"
              style={{ background: "var(--brand-primary)" }}
            >
              <Send size={12} /> Send
            </span>
          </div>
        </div>
      </div>

      {/* Envelope particles traveling across, suggesting outreach at scale */}
      {[28, 50, 78].map((top, i) => (
        <span
          key={i}
          className="absolute anim-travel-x"
          style={{ top: `${top}%`, animationDelay: `${i * 1.2}s` }}
        >
          <Mail size={14} className="text-white/50" />
        </span>
      ))}
    </div>
  );
}

function JobsScene() {
  const jobs = [
    { title: "w-[70%]", score: 92, tag: "Strong Match", tone: "green", fill: "88%", delay: "0.1s" },
    { title: "w-[55%]", score: 74, tag: "Good Match", tone: "yellow", fill: "62%", delay: "0.35s" },
    { title: "w-[62%]", score: 58, tag: "Possible", tone: "blue", fill: "44%", delay: "0.6s" },
  ];
  const toneMap = {
    green: { text: "text-green-400", dot: "bg-green-400", bar: "#4ade80" },
    yellow: { text: "text-yellow-400", dot: "bg-yellow-400", bar: "#facc15" },
    blue: { text: "text-blue-300", dot: "bg-blue-300", bar: "#93c5fd" },
  };
  return (
    <div className={sceneBase}>
      <Constellation />
      <div className="relative z-10 w-[min(380px,88%)] space-y-3 anim-float-y-lg">
        {jobs.map((j, i) => {
          const t = toneMap[j.tone];
          return (
            <div
              key={i}
              className="rounded-xl border border-white/12 bg-[#0d0f1e]/80 p-3.5 backdrop-blur-xl shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                  <div className={`h-2.5 ${j.title} rounded-full bg-white/25`} />
                  <div className="h-2 w-[40%] rounded-full bg-white/12" />
                </div>
                <div className="flex flex-col items-center">
                  <span className={`text-lg font-bold ${t.text} anim-count-up`} style={{ animationDelay: j.delay }}>
                    {j.score}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-white/40">Score</span>
                </div>
              </div>
              {/* Match bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full anim-fill-bar"
                  style={{ width: j.fill, background: t.bar, animationDelay: j.delay }}
                />
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
                <span className={`text-[10px] font-semibold ${t.text}`}>{j.tag}</span>
                {i === 0 && (
                  <span className="ml-auto flex items-center gap-1 text-[9px] uppercase tracking-widest text-white/40">
                    <Zap size={9} /> Auto-apply
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MentorshipScene() {
  // Orbiting mentor avatars around a central node.
  const orbit = [
    { icon: User, angle: 0 },
    { icon: GraduationCap, angle: 90 },
    { icon: User, angle: 180 },
    { icon: Star, angle: 270 },
  ];
  return (
    <div className={sceneBase}>
      <Constellation />
      <div className="relative z-10 flex h-[240px] w-[240px] items-center justify-center">
        {/* Pulse rings */}
        <span className="anim-pulse-ring absolute h-24 w-24 rounded-full border border-white/20" />
        <span
          className="anim-pulse-ring absolute h-24 w-24 rounded-full border border-white/20"
          style={{ animationDelay: "1.4s" }}
        />

        {/* Static orbit guide ring */}
        <div className="absolute h-[220px] w-[220px] rounded-full border border-dashed border-white/12" />

        {/* Central mentor */}
        <div
          className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full shadow-2xl anim-float-y"
          style={{ background: "linear-gradient(135deg, var(--brand-accent), var(--brand-primary))" }}
        >
          <GraduationCap size={26} className="text-white" />
        </div>

        {/* Orbiting avatars (container rotates, avatar counter-rotates to stay upright) */}
        <div className="anim-orbit absolute h-[220px] w-[220px]">
          {orbit.map(({ icon: Icon, angle }, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{ transform: `rotate(${angle}deg) translateX(110px) rotate(-${angle}deg)` }}
            >
              <div className="anim-orbit-rev -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#0d0f1e]/85 backdrop-blur-md">
                <Icon size={16} className="text-white/80" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live session pill */}
      <div className="absolute bottom-[12%] left-1/2 z-10 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="anim-pulse-ring absolute inline-flex h-full w-full rounded-full bg-green-400" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          <span className="text-[11px] font-medium text-white/80">Live session · Q&amp;A</span>
        </div>
      </div>
    </div>
  );
}

export default function PillarVisual({ variant = "outreach", className = "" }) {
  return (
    <div
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ background: "linear-gradient(160deg, #12132a 0%, #0a0b16 55%, #08060f 100%)" }}
    >
      {variant === "outreach" && <OutreachScene />}
      {variant === "jobs" && <JobsScene />}
      {variant === "mentorship" && <MentorshipScene />}
    </div>
  );
}
