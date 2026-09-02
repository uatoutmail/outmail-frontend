"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Smooth scrolling for the marketing site.
 *
 * WHY THIS WAS REWRITTEN
 *   It ran `new LocomotiveScroll({ el, smooth: true, lerp: 0.08 })` — the v4
 *   API against the v5 package. In v5 those options do not exist, so every one
 *   of them was silently dropped and the library ran on defaults. locomotive
 *   v5 is a thin wrapper over Lenis anyway, so this now uses Lenis directly:
 *   one dependency fewer and options that actually apply.
 *
 * WHY THESE SETTINGS
 *   · `lerp: 0.09` — enough glide to feel designed, short enough that the page
 *     stops when the wheel stops. Heavier smoothing reads as input lag, which
 *     is what "not smooth" usually means in practice.
 *   · `syncTouch: false` — touch scrolling stays native. Smoothing a finger
 *     drag fights the OS momentum curve and is the single most common way a
 *     smooth-scroll library makes a phone feel worse than no library at all.
 *   · Lenis drives the real window scroll, so `scroll` events still fire and
 *     Framer's useScroll/useInView stay correct. A transform-based smoother
 *     would break both, plus every `position: sticky` on the site.
 *
 * REDUCED MOTION
 *   Skipped entirely. Someone who has asked the OS to stop animating things
 *   has asked for this too.
 */
export default function SmoothScrollWrapper({ children }) {
  const pathname = usePathname();

  // App routes manage their own scroll containers.
  const isAppRoute =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/student") ||
    pathname?.startsWith("/tpo") ||
    pathname?.startsWith("/auth");

  const raf = useRef(null);

  useEffect(() => {
    if (isAppRoute) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    });

    const loop = (time) => {
      lenis.raf(time);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    // In-page anchors (#pricing, #contact-us) must go through Lenis, or the
    // browser's own jump fights the smoother and lands in the wrong place.
    const onAnchorClick = (e) => {
      const link = e.target.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -80 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      if (raf.current) cancelAnimationFrame(raf.current);
      lenis.destroy();
    };
  }, [isAppRoute]);

  return children;
}
