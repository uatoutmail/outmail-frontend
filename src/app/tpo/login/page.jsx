'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Wordmark from '@/component/ui/wordmark';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

// OUT-201: replaces the old password-based /tpo/login. There is no password
// form anymore — a TPO's access is granted only by claiming an emailed
// invite (see /tpo/claim), which requires Google OAuth as the exact
// invited address. This page just routes an already-decided outcome: a
// claimed TPO signing in normally lands on their dashboard; anyone else
// authenticated here hasn't been granted TPO access and is told so, rather
// than silently shown nothing (the OUT-199 lesson — a dead end with zero
// feedback is its own bug).
export default function TpoLoginPage() {
  const { isAuthenticated, loading, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && userRole === 'TPO_ADMIN') {
      router.replace('/tpo/dashboard');
    }
  }, [loading, isAuthenticated, userRole, router]);

  const googleLoginUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;

  return (
    <main className="min-h-screen bg-background text-white font-syne flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-64 h-64 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="mb-8 z-10 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
          <Image src="/logo-nav.png" alt="Outmail Logo" width={50} height={50} className="drop-shadow-[0_0_15px_rgba(108,0,255,0.5)]" />
          <Wordmark className="text-white text-3xl" />
        </Link>
        <div className="mt-4 flex items-center gap-2">
          <div className="h-px w-8 bg-purple-500/30" />
          <span className="text-sm font-medium tracking-widest text-purple-400 uppercase">TPO Portal</span>
          <div className="h-px w-8 bg-purple-500/30" />
        </div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="glass-card p-8 md:p-10 border border-white/10 bg-surface-panel/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

          {loading ? (
            <div className="py-8 flex flex-col items-center gap-3 text-white/60">
              <Loader2 className="animate-spin" size={28} />
              <p>Checking your session…</p>
            </div>
          ) : isAuthenticated && userRole !== 'TPO_ADMIN' ? (
            <>
              <h1 className="text-2xl font-bold mb-3">No TPO access on this account</h1>
              <p className="text-white/60 mb-6 text-sm">
                This Google account isn&apos;t linked to a TPO portal yet. If your institution has partnered with Outmail, check your inbox for an invite email — or ask your Outmail contact to send one.
              </p>
              <Link href="/dashboard" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                Go to my dashboard instead →
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                Welcome back
              </h1>
              <p className="text-white/50 mb-8 text-sm">Sign in with the Google account your institution registered with Outmail.</p>
              <a
                href={googleLoginUrl}
                className="w-full inline-flex items-center justify-center gap-3 bg-white text-surface-panel font-semibold rounded-xl py-3.5 hover:bg-white/90 transition-colors"
              >
                Continue with Google
              </a>
              <p className="text-white/40 text-xs mt-6">
                First time? You&apos;ll need an invite from your Outmail contact — check{' '}
                <Link href="/tpo/claim" className="text-purple-400 hover:text-purple-300">
                  your invite link
                </Link>{' '}
                instead of signing in here directly.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
