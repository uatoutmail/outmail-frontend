"use client";
import React, { useState } from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import PageHeader from "@/component/ui/PageHeader";
import { Cta } from "@/component/motion/kit";
import LayoutLab, { PAGE_LINKS } from "../_lab/LayoutLab";
import { WHAT_YOU_GET } from "./options";

export default function WhatYouGetPreview() {
  const [i, setI] = useState(0);
  const C = WHAT_YOU_GET[i].C;
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <Navbar variant="dark" />
      <main>
        <PageHeader kicker="Pricing" lines={["One payment.", "Twelve months."]}
          sub="Outmail emails real recruiters from your own inbox and puts matched openings in front of you. Pay once — no subscription, nothing renews.">
          <Cta label="See the plans" href="#pricing" />
        </PageHeader>
        <C />
      </main>
      <Footer variant="dark" />
      <LayoutLab title="Pricing — what you get" links={PAGE_LINKS}
        groups={[{ name: "Layout", opts: WHAT_YOU_GET, i, set: setI }]} />
    </div>
  );
}
