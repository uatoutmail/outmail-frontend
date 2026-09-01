"use client";
import React, { useState, useEffect } from "react";
import Wordmark from "@/component/ui/wordmark";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, ChevronDown, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

/**
 * Site header, rebuilt on the new design system.
 *
 * WHAT CHANGED AND WHY
 *  · Type. Nav labels are Syne at the weight and tracking the page headings
 *    use, so the header reads as part of the page rather than as chrome
 *    bolted on top of it. The old Bricolage/Space-Grotesk stack is gone —
 *    those families are being cut.
 *  · Chrome on demand. The bar is transparent at the top of a page and only
 *    grows its blur and hairline border once you have scrolled past the hero.
 *    A permanent panel across the top competes with the hero headline.
 *  · Radii. Pills only where a pill is the affordance (the CTA, the account
 *    chip). Menus use --radius-card like every other surface on the site.
 *  · The active route is marked with a shared-layout underline instead of a
 *    colour change, which was invisible against the dark surface.
 *
 * `variant` is retained for the handful of pages still on the old light
 * treatment; both variants now share one type and radius system.
 */

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contactus", label: "Contact" },
  { href: "/partnership", label: "Partnership" },
];

function Navbar({ variant = "dark" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const isDark = variant !== "gradient";

  // Chrome appears only once the header is no longer sitting on the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    queueMicrotask(onScroll);   // catch a page loaded already scrolled
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A route change should never leave a menu hanging open over the new page.
  // Deferred out of the effect body: closing synchronously there is a cascading
  // render, and the menus are already unmounted visually by the navigation.
  useEffect(() => {
    queueMicrotask(() => {
      setIsOpen(false);
      setIsUserMenuOpen(false);
      setIsLoginDropdownOpen(false);
    });
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const dashboardHref = user?.role === "TPO_ADMIN" ? "/tpo/dashboard" : "/dashboard";

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        isDark
          ? scrolled
            ? "border-b border-white/10 bg-surface-page/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
          : "bg-gradient-to-l from-black via-primary to-black border-b border-white/10"
      }`}
    >
      <nav className="relative max-w-screen-xl mx-auto px-5 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <Image src="/logo-nav.png" alt="" width={32} height={32} aria-hidden className="shrink-0" />
          <Wordmark className="text-white text-[22px] leading-none" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href}
                className={`relative px-3.5 py-2 font-syne text-[14px] font-medium tracking-tight transition-colors duration-200 ${
                  active ? "text-white" : "text-white/55 hover:text-white"
                }`}>
                {l.label}
                {active && (
                  <motion.span layoutId="nav-active" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-primary" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Account / CTA */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-28 rounded-pill bg-white/8 animate-pulse" aria-hidden />
          ) : isAuthenticated && user ? (
            <div className="relative">
              <button onClick={() => setIsUserMenuOpen((v) => !v)}
                aria-expanded={isUserMenuOpen} aria-haspopup="menu"
                className="flex items-center gap-2 text-white/85 hover:text-white border border-white/12 hover:border-white/25 bg-white/[0.04] rounded-pill pl-2 pr-3 py-1.5 transition-colors duration-200">
                {user.profilePicture ? (
                  <Image src={user.profilePicture} alt="" width={24} height={24} className="rounded-full" />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-primary/25 flex items-center justify-center"><User size={13} /></span>
                )}
                <span className="text-sm max-w-[130px] truncate">{user.display_name || user.name || user.email}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduce ? {} : { opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    role="menu"
                    className="absolute right-0 mt-2.5 w-52 rounded-card border border-white/12 bg-surface-panel/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
                    <Link href={dashboardHref} role="menuitem"
                      className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/[0.06] transition-colors">
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} role="menuitem"
                      className="w-full text-left px-4 py-3 text-sm text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors flex items-center gap-2 border-t border-white/8">
                      <LogOut size={14} /> Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="relative">
              <button onClick={() => setIsLoginDropdownOpen((v) => !v)}
                aria-expanded={isLoginDropdownOpen} aria-haspopup="menu"
                className="group relative overflow-hidden bg-primary hover:bg-primary-hover text-white font-syne font-semibold text-sm rounded-pill pl-5 pr-4 py-2 flex items-center gap-1.5 transition-colors duration-200 shadow-lg shadow-primary/25 active:scale-[0.98]">
                {/* the same sweep the page CTAs use, so buttons behave alike everywhere */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <span className="relative">Get started</span>
                <ChevronDown size={15} className={`relative transition-transform duration-200 ${isLoginDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isLoginDropdownOpen && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduce ? {} : { opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    role="menu"
                    className="absolute right-0 mt-2.5 w-64 rounded-card border border-white/12 bg-surface-panel/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
                    <Link href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`} role="menuitem"
                      className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-white/[0.06] transition-colors group/i">
                      <span>
                        <span className="block font-syne font-semibold text-sm text-white">I&rsquo;m a student</span>
                        <span className="block text-[11px] text-white/40 mt-0.5">Continue with Google</span>
                      </span>
                      <ArrowRight size={15} className="text-white/25 group-hover/i:text-primary group-hover/i:translate-x-0.5 transition-all" />
                    </Link>
                    <Link href="/tpo/login" role="menuitem"
                      className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-white/[0.06] transition-colors border-t border-white/8 group/i">
                      <span>
                        <span className="block font-syne font-semibold text-sm text-white">I&rsquo;m a placement officer</span>
                        <span className="block text-[11px] text-white/40 mt-0.5">TPO console</span>
                      </span>
                      <ArrowRight size={15} className="text-white/25 group-hover/i:text-primary group-hover/i:translate-x-0.5 transition-all" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setIsOpen(true)} aria-label="Open menu" aria-expanded={isOpen}
          className="md:hidden text-white/70 hover:text-white transition-colors p-1">
          <Menu size={22} />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden fixed inset-0 bg-surface-page/97 backdrop-blur-2xl z-50 flex flex-col">
            <div className="h-[68px] px-5 flex items-center justify-between shrink-0">
              <Wordmark className="text-white text-[22px]" />
              <button onClick={() => setIsOpen(false)} aria-label="Close menu" className="text-white/70 hover:text-white p-1">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
              <div className="flex flex-col">
                {LINKS.map((l, i) => (
                  <motion.div key={l.href}
                    initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                    <Link href={l.href} onClick={() => setIsOpen(false)}
                      className={`block font-syne text-3xl font-bold tracking-tight py-3 border-b border-white/8 transition-colors ${
                        pathname === l.href ? "text-primary" : "text-white/85 hover:text-white"}`}>
                      {l.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div className="mt-8"
                initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                {loading ? (
                  <div className="h-14 rounded-card bg-white/8 animate-pulse" aria-hidden />
                ) : isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-card border border-white/10 bg-white/[0.03]">
                      {user.profilePicture ? (
                        <Image src={user.profilePicture} alt="" width={32} height={32} className="rounded-full" />
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-primary/25 flex items-center justify-center"><User size={15} className="text-white" /></span>
                      )}
                      <span className="text-sm text-white/80 truncate">{user.display_name || user.name || user.email}</span>
                    </div>
                    <Link href={dashboardHref} onClick={() => setIsOpen(false)}
                      className="block text-center font-syne font-semibold bg-primary hover:bg-primary-hover text-white rounded-btn px-6 py-3.5 transition-colors">
                      Dashboard
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full font-syne font-semibold text-red-300 hover:text-red-200 border border-red-500/25 hover:border-red-500/40 rounded-btn px-6 py-3.5 transition-colors flex items-center justify-center gap-2">
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase tracking-[3px] text-primary mb-3">Get started</p>
                    <Link href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`} onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between gap-3 rounded-card bg-primary hover:bg-primary-hover px-5 py-4 transition-colors">
                      <span>
                        <span className="block font-syne font-semibold text-white">I&rsquo;m a student</span>
                        <span className="block text-[11px] text-white/70 mt-0.5">Continue with Google</span>
                      </span>
                      <ArrowRight size={17} className="text-white/80 shrink-0" />
                    </Link>
                    <Link href="/tpo/login" onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between gap-3 rounded-card border border-white/12 bg-white/[0.03] hover:bg-white/[0.07] px-5 py-4 transition-colors">
                      <span>
                        <span className="block font-syne font-semibold text-white">I&rsquo;m a placement officer</span>
                        <span className="block text-[11px] text-white/40 mt-0.5">TPO console</span>
                      </span>
                      <ArrowRight size={17} className="text-white/40 shrink-0" />
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click-away for the desktop menus */}
      {(isUserMenuOpen || isLoginDropdownOpen) && (
        <div className="fixed inset-0 z-40" aria-hidden
          onClick={() => { setIsUserMenuOpen(false); setIsLoginDropdownOpen(false); }} />
      )}
    </header>
  );
}

export default Navbar;
