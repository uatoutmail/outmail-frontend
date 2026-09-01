'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Wordmark from '@/component/ui/wordmark';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// OUT-201: the landing page for a TPO invite link
// (outmail.in/tpo/claim?inviteToken=...). Reads inviteToken from
// window.location directly (not the useSearchParams hook — same pattern
// AuthContext's captureTokenFromURL already uses, which also sidesteps
// needing a Suspense boundary for a value only ever read once on mount).
//
// Not authenticated yet -> full-page redirect into Google OAuth, carrying
// the invite token through the OAuth `state` param so the backend can hand
// back here afterwards (see routes/auth.js's /google?client=tpo-claim).
// Already authenticated -> call the claim endpoint directly; the backend is
// what actually verifies the signed-in email matches the invite, this page
// just relays the outcome.
export default function TpoClaimPage() {
  const { isAuthenticated, loading, login } = useAuth();
  const router = useRouter();
  const [inviteToken, setInviteToken] = useState(undefined); // undefined = not read yet
  const [status, setStatus] = useState('idle'); // idle | claiming | success | error
  const [errorMessage, setErrorMessage] = useState('');
  const claimAttempted = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // window is only available client-side, so this can't happen outside an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInviteToken(params.get('inviteToken') || null);
  }, []);

  useEffect(() => {
    if (loading || inviteToken === undefined || claimAttempted.current) return;

    if (!inviteToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('error');
      setErrorMessage('This link is missing its invite token. Use the link from your invite email directly.');
      return;
    }

    if (!isAuthenticated) {
      claimAttempted.current = true;
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google?client=tpo-claim&inviteToken=${encodeURIComponent(inviteToken)}`;
      return;
    }

    claimAttempted.current = true;
    setStatus('claiming');
    (async () => {
      try {
        await api.post('/api/auth/tpo/claim', { inviteToken });
        await login(); // refresh AuthContext's user/role before navigating
        setStatus('success');
        router.replace('/tpo/dashboard');
      } catch (err) {
        setStatus('error');
        setErrorMessage(err.response?.data?.error || 'This invite link could not be claimed.');
      }
    })();
  }, [loading, isAuthenticated, inviteToken, login, router]);

  return (
    <main className="min-h-screen bg-background text-white font-syne flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-64 h-64 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="mb-8 z-10 flex flex-col items-center">
        <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105">
          <Image src="/logo-nav.png" alt="Outmail Logo" width={50} height={50} className="drop-shadow-[0_0_15px_rgba(108,0,255,0.5)]" />
          <Wordmark className="text-white text-3xl" />
        </Link>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="glass-card p-8 md:p-10 border border-white/10 bg-surface-panel/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

          {(status === 'idle' || status === 'claiming' || loading) && status !== 'error' ? (
            <div className="py-8 flex flex-col items-center gap-3 text-white/60">
              <Loader2 className="animate-spin" size={28} />
              <p>Setting up your TPO Portal…</p>
            </div>
          ) : status === 'success' ? (
            <div className="py-8 flex flex-col items-center gap-3">
              <CheckCircle2 className="text-emerald-400" size={32} />
              <p className="text-white/80">Taking you to your dashboard…</p>
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center gap-3">
              <XCircle className="text-red-400" size={32} />
              <h1 className="text-xl font-bold">Couldn&apos;t claim this invite</h1>
              <p className="text-white/60 text-sm">{errorMessage}</p>
              <Link href="/tpo/login" className="text-purple-400 hover:text-purple-300 text-sm font-medium mt-2">
                Go to TPO sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
