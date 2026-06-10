'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Building, UserPlus, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function TpoRegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    institute: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/auth/tpo/register', {
        name: formData.name,
        institute: formData.institute,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        toast.success("Account created successfully!");
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', 'TPO_ADMIN');
        
        // Set cookie for middleware
        document.cookie = `outmail_auth=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`;
        
        // Refresh session in context
        await login();
        
        router.push('/tpo/dashboard');
      }
    } catch (error) {
      console.error('Register attempt failed:', error);
      toast.error(error.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white font-syne flex flex-col items-center justify-center p-6 py-12 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-[15%] right-[10%] w-80 h-80 bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[15%] left-[10%] w-80 h-80 bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Logo Section */}
      <div className="mb-10 z-10 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
           <Image src="/logo-nav.png" alt="Outmail Logo" width={48} height={48} className="drop-shadow-[0_0_12px_rgba(108,0,255,0.4)]" />
           <span className="text-3xl font-satisfy text-white">Outmail</span>
        </Link>
        <div className="mt-4 flex items-center gap-3">
            <div className="h-[1px] w-10 bg-gradient-to-r from-transparent to-purple-500/40" />
            <span className="text-xs font-semibold tracking-[0.2em] text-purple-400 uppercase">Institute Registration</span>
            <div className="h-[1px] w-10 bg-gradient-to-l from-transparent to-purple-500/40" />
        </div>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-xl z-10">
        <div className="glass-card p-8 md:p-12 border border-white/10 bg-[#0f172a]/40 backdrop-blur-3xl shadow-2xl relative">
          
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <UserPlus size={100} className="rotate-12" />
          </div>

          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Partner with us
          </h1>
          <p className="text-white/50 mb-10 text-sm max-w-sm">
            Empower your students with AI-driven career outreach and institutional insights.
          </p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Admin Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-purple-400 transition-colors">
                  <User size={18} />
                </div>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder:text-white/20"
                  required
                />
              </div>
            </div>

            {/* Institute Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Institute Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-purple-400 transition-colors">
                  <Building size={18} />
                </div>
                <input
                  name="institute"
                  type="text"
                  value={formData.institute}
                  onChange={handleChange}
                  placeholder="IIT Bombay"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder:text-white/20"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-white/70 ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-purple-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tpo@institute.ac.in"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder:text-white/20"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-purple-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder:text-white/20"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-purple-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder:text-white/20"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 mt-4 bg-gradient-to-r from-[#6c00ff] to-[#ad46ff] text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/30 hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  Processing <Loader2 size={20} className="animate-spin" />
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-white/50">
              Already have an institutional account?{' '}
              <Link href="/tpo/login" className="text-purple-400 font-bold hover:text-purple-300 transition underline underline-offset-4">
                Sign In here
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-xs text-white/20 max-w-sm mx-auto leading-relaxed">
          By registering, you agree to our <span className="hover:text-white/40 cursor-pointer">Terms of Service</span> and <span className="hover:text-white/40 cursor-pointer">Privacy Policy</span> regarding data handling.
        </p>
      </div>
    </main>
  );
}
