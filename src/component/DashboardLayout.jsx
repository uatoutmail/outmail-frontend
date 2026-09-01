"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, LogOut, CircleUserRound } from "lucide-react";

export default function DashboardLayout({
  theme = "light",
  user,
  logoSrc = "/logo-nav.png",
  portalName = "",
  navItems = [],
  activeSection,
  setActiveSection,
  logout,
  title,
  subtitle,
  children
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Handle auto-collapse on small screens
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      // window.innerWidth is only reachable client-side - no async boundary
      // to move this viewport check past.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarOpen(false);
    }
  }, []);

  const isLight = theme === "light";

  // Sidebar container styles
  const sidebarClass = isLight
    ? `bg-white border-r border-gray-200 text-gray-700`
    : `bg-surface-deep/90 backdrop-blur-xl border-r border-white/10 text-white`;

  // Main container styles
  const mainContainerClass = isLight
    ? `bg-gray-50 text-gray-900`
    : `text-white min-h-screen font-syne overflow-x-hidden`;

  const containerStyle = isLight
    ? {}
    : {
        background: "radial-gradient(ellipse at center, var(--brand-primary) 0%, var(--surface-deep) 60%, #000 100%)",
      };

  // Topbar styles
  const topbarClass = isLight
    ? `bg-white border-b border-gray-200 text-gray-900`
    : `bg-surface-deep/50 backdrop-blur-md border-b border-white/5 text-white`;

  return (
    <div
      className={`min-h-screen flex ${mainContainerClass}`}
      style={containerStyle}
    >
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full transition-all duration-300 flex flex-col ${sidebarClass} ${
          sidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:w-20 lg:translate-x-0"
        }`}
      >
        {/* Logo and Header */}
        <div className={`flex items-center justify-between px-4 py-5 border-b ${isLight ? "border-gray-100" : "border-white/10"}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0">
              <Image src={logoSrc} alt="Logo" width={32} height={32} className="w-8 h-8 object-contain" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className={`font-bold text-sm leading-none ${isLight ? "text-gray-900" : "text-white"}`}>Outmail</p>
                {portalName && (
                  <p className="text-xs text-purple-500 font-medium mt-0.5">{portalName}</p>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`lg:hidden p-1.5 rounded-md transition ${
              isLight ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100" : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            {sidebarOpen ? <X size={18} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* User Info Card */}
        {sidebarOpen && user && (
          <div
            className={`mx-3 mt-4 p-3 rounded-xl flex items-center gap-3 cursor-pointer transition ${
              isLight ? "hover:bg-gray-50" : "hover:bg-white/5"
            }`}
            onClick={() => {
              if (setActiveSection) {
                setActiveSection("settings");
              }
            }}
          >
            {user?.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full flex-shrink-0"
              />
            ) : (
              <CircleUserRound className={`w-9 h-9 flex-shrink-0 ${isLight ? "text-gray-400" : "text-white/70"}`} />
            )}
            <div className="overflow-hidden">
              <p className={`font-semibold text-sm truncate ${isLight ? "text-gray-800" : "text-white"}`}>
                {user?.name || user?.display_name || "User"}
              </p>
              {user?.currentPlan ? (
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-medium uppercase mt-0.5 inline-block">
                  {user.currentPlan?.name || "Free"}
                </span>
              ) : user?.college ? (
                <p className={`text-xs truncate ${isLight ? "text-gray-400" : "text-white/50"}`}>{user.college}</p>
              ) : null}
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, href, action, icon: Icon }) => {
            const isActive = action
              ? activeSection === action
              : pathname === href || pathname?.startsWith(href + "/");

            const itemClass = `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium cursor-pointer ${
              isActive
                ? isLight
                  ? "bg-purple-50 text-purple-700 font-semibold"
                  : "bg-purple-600/20 text-primary border-l-2 border-purple-500 font-semibold"
                : isLight
                  ? "text-gray-600 hover:bg-gray-50 hover:text-purple-700"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
            }`;

            const content = (
              <>
                <Icon size={18} className="flex-shrink-0" />
                {sidebarOpen && <span>{label}</span>}
              </>
            );

            if (href) {
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => {
                    if (typeof window !== "undefined" && window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={itemClass}
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={label}
                onClick={() => {
                  if (setActiveSection) {
                    setActiveSection(action);
                  }
                  if (typeof window !== "undefined" && window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full ${itemClass}`}
              >
                {content}
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile / Logout */}
        <div className={`p-4 border-t ${isLight ? "border-gray-100" : "border-white/10"}`}>
          {sidebarOpen ? (
            <div className="flex items-center justify-between gap-2">
              {!user && (
                <span className="text-xs text-gray-400">Not logged in</span>
              )}
              {logout && (
                <button
                  onClick={logout}
                  className={`flex items-center gap-2 text-xs font-semibold hover:text-red-500 transition ${
                    isLight ? "text-gray-500" : "text-white/60"
                  }`}
                >
                  <LogOut size={14} /> Logout
                </button>
              )}
            </div>
          ) : (
            logout && (
              <button
                onClick={logout}
                className={`flex items-center justify-center p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition w-full ${
                  isLight ? "text-gray-400" : "text-white/40"
                }`}
              >
                <LogOut size={16} />
              </button>
            )
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-h-screen ${
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        {/* Top Header */}
        <header className={`sticky top-0 z-30 px-6 py-4 flex items-center justify-between ${topbarClass}`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-2 rounded-md transition ${
                isLight ? "text-gray-400 hover:text-gray-600 hover:bg-gray-100" : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Menu size={20} />
            </button>
            <div>
              {title && <h1 className="text-sm font-semibold leading-tight">{title}</h1>}
              {subtitle && <p className={`text-xs mt-0.5 ${isLight ? "text-gray-400" : "text-white/50"}`}>{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLight ? "bg-purple-100 text-purple-600" : "bg-purple-600/20 text-primary"}`}>
                  <CircleUserRound size={16} />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold leading-none">{user.name || user.display_name}</p>
                  <p className={`text-[10px] mt-0.5 ${isLight ? "text-gray-400" : "text-white/40"}`}>
                    {user.role === "TPO" ? "Placement Officer" : "Candidate"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content Page Body */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
