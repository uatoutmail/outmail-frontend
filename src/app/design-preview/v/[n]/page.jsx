"use client";
import React, { use } from "react";
import { RENDERERS } from "../concepts";
import Switcher from "../switcher";

export default function ConceptPage({ params }) {
  const { n } = use(params);
  const id = Math.min(Math.max(parseInt(n, 10) || 1, 1), 10);
  const Concept = RENDERERS[id];
  return (
    <>
      <Concept />
      <Switcher current={id} />
    </>
  );
}
