"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import PlanLedger, { LaunchBanner } from "./PlanLedger";
import { Reveal, MaskLines, Cta, Kicker } from "@/component/motion/kit";
import { getPlans } from "@/lib/payments";

/**
 * The landing page's pricing section.
 *
 * Shows the same ledger the pricing page does, but its CTAs navigate rather
 * than open checkout — the landing page is not where money changes hands, and
 * duplicating the Razorpay flow in two places is how the two drift apart.
 */
export default function PricingLedger() {
  const [plans, setPlans] = useState(null); // null = still loading
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    getPlans()
      .then((data) => {
        if (alive) setPlans(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const a = plans?.find((p) => p.code === "PLAN_A");
  const b = plans?.find((p) => p.code === "PLAN_B");

  return (
    <section id="pricing" className="max-w-4xl mx-auto px-6 py-28">
      <Reveal>
        <Kicker className="mb-4">Pricing</Kicker>
        <MaskLines
          lines={["What each plan", "actually includes."]}
          className="font-syne text-4xl md:text-5xl font-bold tracking-tight leading-[1.05]"
        />
        <p className="text-white/45 mt-4 max-w-lg">
          The only difference is mentorship. Rather than dress that up, here it is as a list. One
          payment either way — nothing renews.
        </p>
      </Reveal>

      <div className="mt-12">
        {/* If prices cannot be fetched we say so and send people to the pricing
            page, rather than render a plausible-looking wrong number. */}
        {failed || (plans && !a) ? (
          <Reveal>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
              <p className="text-white/55 mb-5">We couldn&rsquo;t load live pricing just now.</p>
              <Cta label="See pricing" href="/pricing" />
            </div>
          </Reveal>
        ) : (
          <>
            <LaunchBanner plan={a} />
            <PlanLedger
              a={a}
              b={b}
              renderCtaA={() => <Cta label="Get it" href="/pricing" />}
              renderCtaB={() => (
                <Link
                  href="/pricing"
                  className="font-syne font-semibold text-sm border border-white/20 hover:border-accent-light hover:text-accent-light rounded-btn px-5 py-2.5 transition-colors whitespace-nowrap"
                >
                  Take a seat
                </Link>
              )}
            />
          </>
        )}
      </div>
    </section>
  );
}
