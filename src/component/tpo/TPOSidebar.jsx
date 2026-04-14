"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Mail,
  BriefcaseBusiness,
  GraduationCap,
  BarChart3,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/tpo/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/tpo/students", icon: Users },
  { label: "Cold Outreach", href: "/tpo/outreach", icon: Mail },
  { label: "Job Intelligence", href: "/tpo/jobs", icon: BriefcaseBusiness },
  { label: "Mentorship", href: "/tpo/mentorship", icon: GraduationCap },
  { label: "Analytics", href: "/tpo/analytics", icon: BarChart3 },
  { label: "Resources", href: "/tpo/resources", icon: BookOpen },
  { label: "Settings", href: "/tpo/settings", icon: Settings },
];

export default function TPOSidebar({ isOpen, onToggle, user }) {
  const { logout } = useAuth();
  return (
    <>
      {/* Overlay Backdrop - only show on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 transition-opacity"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200 transition-all duration-300 flex flex-col 
          ${isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:w-20 lg:translate-x-0"}`}
      >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0">
            <img src="/logo-nav.png" alt="Outmail Logo" className="w-8 h-8 object-contain" />
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <p className="font-bold text-gray-900 text-sm leading-none">Outmail</p>
              <p className="text-xs text-purple-600 font-medium mt-0.5">TPO Portal</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        >
          {isOpen ? <X size={18} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-colors group"
          >
            <Icon size={18} className="flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">{label}</span>}
          </Link>
        ))}
      </nav>

      {/* College Badge */}
      {isOpen && (
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="bg-purple-50 rounded-lg px-3 py-2.5 flex justify-between items-center group">
            <div>
              <p className="text-xs font-semibold text-purple-700">{user?.college || "Institute"}</p>
              <button onClick={logout} className="text-xs text-purple-500 mt-0.5 hover:text-purple-800 transition flex items-center gap-1 font-medium">
                <LogOut size={12} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      </aside>
    </>
  );
}
