"use client";
import React, { useState } from "react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import PageHeader from "@/component/ui/PageHeader";
import { Cta } from "@/component/motion/kit";
import Faq from "@/component/landing/Faq";
import LayoutLab, { PAGE_LINKS } from "../_lab/LayoutLab";
import { CONTACT_LAYOUTS, LEGAL_LAYOUTS } from "./options";

export default function ContactPreview() {
  const [form, setForm] = useState(0);
  const [legal, setLegal] = useState(0);
  const Form = CONTACT_LAYOUTS[form].C, Legal = LEGAL_LAYOUTS[legal].C;
  return (
    <div className="min-h-screen bg-surface-page text-white">
      <Navbar variant="dark" />
      <main>
        <PageHeader
          kicker="Contact & support"
          lines={["Have a question?", "A person replies."]}
          sub="Whether you're a student with a question, a recruiter curious about partnerships, or a placement officer exploring campus plans — we reply within 24 hours."
        >
          <Cta label="Send us a message" href="#contact-us" />
        </PageHeader>
        <Form />
        <Legal />
        <Faq />
      </main>
      <Footer variant="dark" />
      <LayoutLab title="Contact — layouts" links={PAGE_LINKS} groups={[
        { name: "Contact form", opts: CONTACT_LAYOUTS, i: form, set: setForm },
        { name: "Company & legal", opts: LEGAL_LAYOUTS, i: legal, set: setLegal },
      ]} />
    </div>
  );
}
