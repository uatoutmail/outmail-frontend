"use client";

import React, { useState } from "react";
import Wordmark from "@/component/ui/wordmark";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Mail } from "lucide-react";
import { api } from "@/lib/api";

/**
 * Site footer, rebuilt on the new design system.
 *
 * WHAT CHANGED AND WHY
 *  · Structure. Eight links in one flat wrap became three named columns
 *    (Product / Company / Legal). A flat wrap makes a reader scan every link
 *    to find the one they want, and it buries the legal pages that a paid
 *    product is judged on.
 *  · Legal identity. The operating entity, its LLPIN and a contact route now
 *    appear in the footer. For a product taking money in India this is the
 *    first place a careful buyer — or a payment gateway reviewer — looks.
 *  · Type and colour. Column headings are Syne micro-caps in brand primary,
 *    matching every section kicker on the site. The hardcoded #a100ff in the
 *    old subscribe button is gone; it now uses the primary token like
 *    everything else.
 *  · The newsletter field uses --radius-btn rather than a full pill, so it
 *    matches form controls elsewhere instead of looking like a search bar.
 */

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/aboutus", label: "About us" },
      { href: "/partnership", label: "Partnership" },
      { href: "/contactus", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms-and-conditions", label: "Terms" },
      { href: "/privacy-policy", label: "Privacy" },
      { href: "/refund-and-cancellation", label: "Refunds" },
    ],
  },
];

export default function Footer({ variant = "dark" }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const reduce = useReducedMotion();
  const isDark = variant !== "gradient";
  const emailSchema = z.email();

  const subscribeNewsletter = async (value) => {
    // Let failures propagate so handleSubmit surfaces a real error instead of
    // always reporting success.
    await api.post(`/api/newsletter/subscribe`, { email: value });
    toast.success("Subscribed successfully.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailSchema.safeParse(email).success) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      await subscribeNewsletter(email);
      setError("");
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } catch {
      setError("Failed to subscribe. Please try again later.");
      toast.error("Couldn't subscribe. Please try again later.");
    }
  };

  return (
    <footer
      className={`relative text-white px-6 pt-20 pb-10 overflow-hidden ${
        isDark
          ? "border-t border-white/10 bg-surface-page"
          : "bg-gradient-to-l from-black via-primary to-black"
      }`}
    >
      {/* one soft brand bloom, echoing the closing CTA above it */}
      {isDark && (
        <div aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[380px] rounded-full bg-primary/10 blur-[130px]" />
      )}

      <div className="relative max-w-6xl mx-auto">
        <div className="grid gap-12 md:grid-cols-12">

          {/* Brand + positioning */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <Image src="/logo-nav.png" alt="" width={34} height={34} aria-hidden />
              <Wordmark className="text-white text-2xl leading-none" />
            </Link>
            <p className="text-white/45 text-sm leading-relaxed max-w-sm mb-7">
              Cold outreach, matched jobs, one-click autofill and mentorship — for students
              with no referrals and one placement season to spend.
            </p>
            <Link href="/pricing"
              className="group inline-flex items-center gap-2 font-syne text-sm font-semibold text-white border border-white/15 hover:border-primary hover:text-primary rounded-pill px-5 py-2.5 transition-colors duration-200">
              ₹999 for twelve months
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <nav key={col.title} className="md:col-span-2" aria-label={col.title}>
              <p className="text-[10px] uppercase tracking-[3px] text-primary mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Newsletter */}
          <div className="md:col-span-3">
            <p className="text-[10px] uppercase tracking-[3px] text-primary mb-4">Stay in the loop</p>
            <p className="text-sm text-white/45 leading-relaxed mb-4">
              Job-search tips and product updates. No more than twice a month.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "footer-email-error" : undefined}
                className="w-full px-4 py-3 rounded-btn text-sm text-white bg-white/[0.04] border border-white/12 placeholder:text-white/25 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <motion.button
                type="submit"
                disabled={subscribed}
                whileTap={reduce ? {} : { scale: 0.985 }}
                className={`w-full rounded-btn px-5 py-3 font-syne text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                  subscribed
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "bg-primary hover:bg-primary-hover text-white"
                }`}
              >
                {subscribed ? (<><Check size={15} /> Subscribed</>) : (<><Mail size={15} /> Subscribe</>)}
              </motion.button>
            </form>
            {error && (
              <p id="footer-email-error" role="alert" className="text-red-400 mt-2 text-xs">{error}</p>
            )}
          </div>
        </div>

        {/* Legal identity. A paid Indian product is judged on whether this is
            present and specific, so it says who is actually taking the money. */}
        <div className="mt-16 pt-7 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-xs text-white/35 leading-relaxed">
            <p>© {new Date().getFullYear()} Outmail. Operated by PrimeWork Labs LLP · LLPIN ADB-2168.</p>
            <p className="mt-1">1/400, UIT, Bhiwadi, Alwar, Rajasthan 301019, India</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/35">
            <a href="mailto:support@outmail.in" className="hover:text-primary transition-colors">support@outmail.in</a>
            <span className="hidden md:inline text-white/15">·</span>
            <span>Prices inclusive of all taxes</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
