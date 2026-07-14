"use client";
import React, { useState } from "react";
import Wordmark from "@/component/ui/wordmark";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

function Navbar({ variant = "gradient" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();

  const isDark = variant === "dark";

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header
      className={`w-full ${
        isDark
          ? "sticky top-0 z-50 border-b border-white/10 bg-[#0a0b14]/70 backdrop-blur-xl"
          : "bg-gradient-to-l from-black via-[#6c00ff] to-black"
      }`}
    >
      <nav className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold">
          <Image src="/logo-nav.png" alt="Logo" width={40} height={40} />
          <Wordmark className="text-white text-2xl" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-7 text-white text-[15px] font-medium font-display tracking-wide">
          <Link href="/" className="hover:text-[#AD46FF] transition">Home</Link>
          <Link href="/features" className="hover:text-[#AD46FF] transition">Features</Link>
          <Link href="/pricing" className="hover:text-[#AD46FF] transition">Pricing</Link>
          <Link href="/contactus" className="hover:text-[#AD46FF] transition">Contact Us</Link>
          <Link href="/partnership" className="hover:text-[#AD46FF] transition">Partnership</Link>
        </div>

        {/* User Section - Desktop */}
        <div className="hidden md:flex items-center">
          {loading ? (
            <div className="animate-pulse bg-white/20 rounded-full px-4 py-2 text-white">
              Loading...
            </div>
          ) : isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-colors"
              >
                {user.profilePicture ? (
                  <Image 
                    src={user.profilePicture} 
                    alt="Profile" 
                    width={24} 
                    height={24} 
                    className="rounded-full"
                  />
                ) : (
                  <User size={20} />
                )}
                <span className="font-medium">{user.display_name || user.name || user.email}</span>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  <Link
                    href={user?.role === "TPO_ADMIN" ? "/tpo/dashboard" : "/dashboard"}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                className="text-white bg-[#AD46FF] font-semibold rounded-full px-5 py-2 hover:bg-[#c289f0] transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95"
              >
                <span>Login</span>
                <ChevronDown 
                  size={18} 
                  className={`transition-transform duration-300 ${isLoginDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              <AnimatePresence>
                {isLoginDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 bg-[#0a0b14]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-2 z-50 overflow-hidden ring-1 ring-white/5"
                  >
                    <Link
                      href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`}
                      className="flex items-center gap-3 px-6 py-4 text-white hover:bg-white/10 transition-colors group"
                      onClick={() => setIsLoginDropdownOpen(false)}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">Login as Student</span>
                      </div>
                    </Link>
                    <Link
                      href="/tpo/login"
                      className="flex items-center gap-3 px-6 py-4 text-white hover:bg-white/10 transition-colors group"
                      onClick={() => setIsLoginDropdownOpen(false)}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">Login as TPO Admin</span>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu with Framer Motion for animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed top-0 left-0 w-full h-screen bg-black/90 backdrop-blur-sm z-50 flex flex-col justify-center items-center"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col space-y-8 text-white text-xl font-medium font-display tracking-wide">
              <Link href="/" className="hover:text-[#AD46FF] transition text-center">Home</Link>
              <Link href="/features" className="hover:text-[#AD46FF] transition text-center">Features</Link>
              <Link href="/pricing" className="hover:text-[#AD46FF] transition text-center">Pricing</Link>
              <Link href="/contactus" className="hover:text-[#AD46FF] transition text-center">Contact Us</Link>
              <Link href="/partnership" className="hover:text-[#AD46FF] transition text-center">Partnership</Link>
              
              {/* Mobile Auth Section */}
              {loading ? (
                <div className="animate-pulse bg-white/20 rounded-full px-8 py-3 text-center text-white">
                  Loading...
                </div>
              ) : isAuthenticated && user ? (
                <div className="flex flex-col space-y-4 items-center">
                  <div className="flex items-center gap-2 text-white">
                    {user.profilePicture ? (
                      <Image 
                        src={user.profilePicture} 
                        alt="Profile" 
                        width={32} 
                        height={32} 
                        className="rounded-full"
                      />
                    ) : (
                      <User size={24} />
                    )}
                      <div className="text-center">
                        <span>{user.display_name || user.name || user.email}</span>
                      </div>
                  </div>
                  
                  {/* Dashboard Link */}
                  <Link
                    href={user?.role === "TPO_ADMIN" ? "/tpo/dashboard" : "/dashboard"}
                    className="text-center text-white bg-[#AD46FF] font-semibold rounded-full px-8 py-3 hover:bg-[#c289f0] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="text-center text-white bg-red-600 font-semibold rounded-full px-8 py-3 hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-4 w-full px-6">
                  <div className="text-white/50 text-xs font-bold uppercase tracking-widest text-center mb-1">Login Options</div>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`}
                    className="flex flex-col items-center justify-center w-full bg-white/10 border border-white/5 backdrop-blur-md text-white font-semibold rounded-2xl p-4 hover:bg-white/20 transition-all active:scale-[0.98]"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-lg">Login as Student</span>
                    <span className="text-[10px] text-white/40 font-medium">For students pursuing careers</span>
                  </Link>
                  <Link
                    href="/tpo/login"
                    className="flex flex-col items-center justify-center w-full bg-[#AD46FF] text-white font-semibold rounded-2xl p-4 hover:bg-[#c289f0] transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98]"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-lg">Login as TPO Admin</span>
                    <span className="text-[10px] text-white/70 font-medium">For training & placement officers</span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for open menus */}
      {(isUserMenuOpen || isLoginDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsLoginDropdownOpen(false);
          }}
        />
      )}
    </header>
  );
}

export default Navbar;