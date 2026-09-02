"use client";
import React, { useState } from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import PageHeader from "@/component/ui/PageHeader";
import LayoutLab, { PAGE_LINKS } from "../_lab/LayoutLab";
import { GAP_OPTIONS } from "./options";

export default function GapPreview() {
  const [i, setI] = useState(0);
  const C = GAP_OPTIONS[i].C;
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <Navbar variant="dark" />
      <main>
        <PageHeader kicker="For universities & placement cells"
          lines={["Help more students", "get placed off campus."]}
          sub="Outmail extends your placement cell beyond campus drives — structured recruiter outreach, resume-matched openings and mentorship for every student." />
        <C />
      </main>
      <Footer variant="dark" />
      <LayoutLab title="Partnership — the gap" links={PAGE_LINKS}
        groups={[{ name: "Layout", opts: GAP_OPTIONS, i, set: setI }]} />
    </div>
  );
}
