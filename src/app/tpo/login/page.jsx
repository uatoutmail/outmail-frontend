'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function TpoLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/api/auth/tpo/login', { email, password });
      
      if (response.data.success) {
        toast.success("Welcome back!");
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
      console.error('Login error:', error);
      toast.error(error.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white font-syne flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-64 h-64 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Logo Section */}
      <div className="mb-8 z-10 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
           <Image src="/logo-nav.png" alt="Outmail Logo" width={50} height={50} className="drop-shadow-[0_0_15px_rgba(108,0,255,0.5)]" />
           <span className="text-3xl font-satisfy text-white">Outmail</span>
        </Link>
        <div className="mt-4 flex items-center gap-2">
            <div className="h-px w-8 bg-purple-500/30" />
            <span className="text-sm font-medium tracking-widest text-purple-400 uppercase">TPO Portal</span>
            <div className="h-px w-8 bg-purple-500/30" />
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md z-10">
        <div className="glass-card p-8 md:p-10 border border-white/10 bg-[#0f172a]/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

          <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="text-center text-white/50 mb-8 text-sm">
            Access the TPO administrative dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-purple-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@institute.edu"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder:text-white/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-white/70">Password</label>
                <Link href="#" className="text-xs text-purple-400 hover:text-purple-300 transition">Forgot password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-purple-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all text-white placeholder:text-white/20"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-[#6c00ff] to-[#ad46ff] text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-900/20 hover:brightness-110 active:scale-[0.98] transition flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  Verifying <Loader2 size={18} className="animate-spin" />
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-white/50">
              Don&apos;t have an account?{' '}
              <Link href="/tpo/register" className="text-purple-400 font-bold hover:text-purple-300 transition">
                Register Institute
              </Link>
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 text-xs text-white/30 hover:text-white/50 transition cursor-default">
          &copy; 2026 Outmail. For Registered Educational Partners Only.
        </p>
      </div>

      {/* Decorative floating elements */}
      <div className="absolute top-[20%] right-[15%] opacity-20 animate-pulse delay-700 pointer-events-none">
          <div className="w-12 h-12 rounded-full border-2 border-purple-500/30" />
      </div>
      <div className="absolute bottom-[30%] left-[10%] opacity-20 animate-bounce pointer-events-none" style={{ animationDuration: '4s' }}>
          <div className="w-8 h-8 rotate-45 border-2 border-blue-500/30" />
      </div>
    </main>
  );
}
