"use client";
import React, { useState } from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import PageHeader from "@/component/ui/PageHeader";
import Validation from "@/component/landing/Validation";
import LayoutLab, { PAGE_LINKS } from "../_lab/LayoutLab";
import { PROBLEM, PRINCIPLES_LAYOUTS, ENTITY } from "./options";

export default function AboutPreview() {
  const [prob, setProb] = useState(0);
  const [prin, setPrin] = useState(0);
  const [ent, setEnt] = useState(0);
  const Problem = PROBLEM[prob].C, Principles = PRINCIPLES_LAYOUTS[prin].C, Entity = ENTITY[ent].C;
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <Navbar variant="dark" />
      <main>
        <PageHeader
          kicker="About"
          lines={["We built the thing", "we needed at 21."]}
          sub="Outmail exists for students with no referrals and one placement season to spend. Everything below is what that means in practice."
        />
        <Problem />
        <Principles />
        <Entity />
        <Validation />
      </main>
      <Footer variant="dark" />
      <LayoutLab title="About — layouts" links={PAGE_LINKS} groups={[
        { name: "The problem", opts: PROBLEM, i: prob, set: setProb },
        { name: "Principles", opts: PRINCIPLES_LAYOUTS, i: prin, set: setPrin },
        { name: "Who runs it", opts: ENTITY, i: ent, set: setEnt },
      ]} />
    </div>
  );
}
