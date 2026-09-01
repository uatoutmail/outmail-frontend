"use client";
import React, { useState } from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import PageHeader from "@/component/ui/PageHeader";
import { Cta } from "@/component/motion/kit";
import Faq from "@/component/landing/Faq";
import LayoutLab, { PAGE_LINKS } from "../_lab/LayoutLab";
import { GLANCE, FEATURE_LAYOUTS, PROOF } from "./options";

export default function FeaturesPreview() {
  const [glance, setGlance] = useState(0);
  const [feat, setFeat] = useState(0);
  const [proof, setProof] = useState(0);
  const Glance = GLANCE[glance].C, Features = FEATURE_LAYOUTS[feat].C, Proof = PROOF[proof].C;

  return (
    <div className="min-h-screen bg-surface-page text-white">
      <Navbar variant="dark" />
      <main>
        <PageHeader
          kicker="Core features"
          lines={["What Outmail does", "for students."]}
          sub="Recruiter outreach, resume-matched openings, one-click applications and mentorship — the four things that decide whether effort turns into interviews."
        >
          <Cta label="Start your year" href="/pricing" />
        </PageHeader>
        <Glance />
        <Features />
        <Proof />
        <Faq />
      </main>
      <Footer variant="dark" />
      <LayoutLab title="Features — layouts" links={PAGE_LINKS} groups={[
        { name: "At a glance", opts: GLANCE, i: glance, set: setGlance },
        { name: "The features", opts: FEATURE_LAYOUTS, i: feat, set: setFeat },
        { name: "Closing proof", opts: PROOF, i: proof, set: setProof },
      ]} />
    </div>
  );
}
