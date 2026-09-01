"use client";

import React, { useState } from "react";
import Wordmark from "@/component/ui/wordmark";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { toast } from "sonner";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Mail } from "lucide-react";
import { api } from "@/lib/api";

/**
 * Site footer, rebuilt on the new design system.
 *
 * WHAT CHANGED AND WHY
 *  · Height. Kept close to the original. A three-column sitemap was tried and
 *    reverted: this site has nine pages, and a footer taller than some of them
 *    is a footer that outranks its own content. Links are one wrap again.
 *  · Legal identity. The operating entity, its LLPIN and a contact route now
 *    appear — compressed to a single line. For a product taking money in India
 *    this is the first place a careful buyer, or a gateway reviewer, looks.
 *  · Type and colour. Column headings are Syne micro-caps in brand primary,
 *    matching every section kicker on the site. The hardcoded #a100ff in the
 *    old subscribe button is gone; it now uses the primary token like
 *    everything else.
 *  · The newsletter field uses --radius-btn rather than a full pill, so it
 *    matches form controls elsewhere instead of looking like a search bar.
 */

const LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/aboutus", label: "About" },
  { href: "/partnership", label: "Partnership" },
  { href: "/contactus", label: "Contact" },
  { href: "/terms-and-conditions", label: "Terms" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/refund-and-cancellation", label: "Refunds" },
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
      className={`relative text-white px-6 pt-14 pb-8 overflow-hidden ${
        isDark
          ? "border-t border-white/10 bg-surface-page"
          : "bg-gradient-to-l from-black via-primary to-black"
      }`}
    >
      {/* one soft brand bloom, echoing the closing CTA above it */}
      {isDark && (
        <div aria-hidden
          className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
          style={{ background: "radial-gradient(ellipse at center, color-mix(in srgb, var(--brand-primary) 16%, transparent), transparent 70%)" }} />
      )}

      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
              <Image src="/logo-nav.png" alt="" width={30} height={30} aria-hidden />
              <Wordmark className="text-white text-xl leading-none" />
            </Link>
            <p className="text-white/40 text-sm leading-relaxed">
              Cold outreach, matched jobs, one-click autofill and mentorship — for students
              with no referrals and one placement season to spend.
            </p>
          </div>

          {/* Newsletter, inline so it costs one row rather than a column */}
          <div className="w-full md:w-[340px] shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Get updates — you@college.edu"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "footer-email-error" : undefined}
                className="flex-1 min-w-0 px-4 py-2.5 rounded-btn text-sm text-white bg-white/[0.04] border border-white/12 placeholder:text-white/25 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
              <motion.button
                type="submit"
                disabled={subscribed}
                whileTap={reduce ? {} : { scale: 0.985 }}
                aria-label="Subscribe"
                className={`shrink-0 rounded-btn px-4 py-2.5 font-syne text-sm font-semibold transition-colors duration-200 flex items-center gap-1.5 ${
                  subscribed
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "bg-primary hover:bg-primary-hover text-white"
                }`}
              >
                {subscribed ? <Check size={15} /> : <Mail size={15} />}
                <span className="hidden sm:inline">{subscribed ? "Done" : "Subscribe"}</span>
              </motion.button>
            </form>
            {error && (
              <p id="footer-email-error" role="alert" className="text-red-400 mt-1.5 text-xs">{error}</p>
            )}
          </div>
        </div>

        {/* Links — one wrap, as before */}
        <nav aria-label="Footer" className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className="text-sm text-white/50 hover:text-white transition-colors duration-200">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* One legal line */}
        <div className="mt-7 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-white/30">
          {/* Entity and LLPIN stay — they say who is taking the money. The
              registered address and phone live in the Terms and Privacy Policy
              rather than on every page. */}
          <p>
            © {new Date().getFullYear()} Outmail · PrimeWork Labs LLP · LLPIN ADB-2168
          </p>
          <a href="mailto:support@outmail.in" className="hover:text-primary transition-colors">support@outmail.in</a>
        </div>
      </div>
    </footer>
  );
}
