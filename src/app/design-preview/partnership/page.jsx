"use client";
import React, { useState } from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import PageHeader from "@/component/ui/PageHeader";
import Story from "@/component/landing/Story";
import LayoutLab, { PAGE_LINKS } from "../_lab/LayoutLab";
import { GAP_LAYOUTS, OFFICE_LAYOUTS, CTA_LAYOUTS } from "./options";

export default function PartnershipPreview() {
  const [gap, setGap] = useState(0);
  const [office, setOffice] = useState(0);
  const [cta, setCta] = useState(0);
  const Gap = GAP_LAYOUTS[gap].C, Office = OFFICE_LAYOUTS[office].C, CtaBand = CTA_LAYOUTS[cta].C;
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <Navbar variant="dark" />
      <main>
        <PageHeader
          kicker="For universities & placement cells"
          lines={["Help more students", "get placed off campus."]}
          sub="Outmail extends your placement cell beyond campus drives — structured recruiter outreach, resume-matched openings and mentorship for every student, with full visibility for your team."
        />
        <Gap />
        <Story />
        <Office />
        <CtaBand onBook={() => {}} />
      </main>
      <Footer variant="dark" />
      <LayoutLab title="Partnership — layouts" links={PAGE_LINKS} groups={[
        { name: "The gap", opts: GAP_LAYOUTS, i: gap, set: setGap },
        { name: "Office gets", opts: OFFICE_LAYOUTS, i: office, set: setOffice },
        { name: "CTA band", opts: CTA_LAYOUTS, i: cta, set: setCta },
      ]} />
    </div>
  );
}
