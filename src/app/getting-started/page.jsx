import Link from "next/link";
import React from "react";
import Footer from "@/component/Footer";
import { Cta } from "@/component/motion/kit";
import Navbar from "@/component/Navbar";
import {
  StepChips,
  SetupChapters,
  AfterSetup,
  Troubleshooting,
} from "@/component/pages/GettingStartedSections";
import PageHeader from "@/component/ui/PageHeader";
import { STEPS, TROUBLESHOOTING } from "@/lib/gettingStarted";
import { JsonLd, breadcrumbSchema, faqSchema, howToSchema } from "@/lib/structuredData";

/**
 * Customer document #3 — the only one of the nine that is a web page rather
 * than something we send.
 *
 * Two emails link here by URL, one of them straight to the #connect-gmail
 * anchor, so this route and that anchor are part of mail already delivered and
 * cannot be renamed without breaking it.
 */
export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <JsonLd
        schema={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Getting started", path: "/getting-started" },
        ])}
      />
      <JsonLd
        schema={howToSchema({
          name: "Set up Outmail",
          description:
            "Upload your resume, connect Gmail with a Google app password, install the desktop app, add the browser extension and set your job preferences.",
          steps: STEPS,
        })}
      />
      {/* Every question and answer below is rendered on the page, which is what
          Google requires before it will credit FAQ markup. */}
      <JsonLd schema={faqSchema(TROUBLESHOOTING)} />

      <Navbar variant="dark" />
      <main>
        <PageHeader
          kicker="Setup"
          lines={["Five steps,", "about ten minutes."]}
          sub="Do them in order — each one depends on the last. Step two is the only genuinely fiddly part, and it is worth understanding why before you start: Outmail sends from your Gmail, not from ours, so Google has to grant permission through an app password rather than a normal login."
        >
          <Cta label="Start at step one" href="#resume" />
        </PageHeader>

        <StepChips />
        <SetupChapters />
        <AfterSetup />
        <Troubleshooting />

        <section className="px-6 pb-24 pt-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
              Stuck somewhere in the middle?
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto mb-8">
              Reply to any Outmail email, or write to us directly. A person reads it, usually the
              same day.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Cta label="Open your dashboard" href="/dashboard" />
              <Link
                href="/contactus"
                className="inline-flex items-center justify-center rounded-pill border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-syne font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                Contact support
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer variant="dark" />
    </div>
  );
}
