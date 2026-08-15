import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import TpoClaimPage from './page';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: replaceMock }) }));
vi.mock('@/lib/api', () => ({ api: { post: vi.fn() } }));
vi.mock('@/context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('@/component/ui/wordmark', () => ({ default: () => <span>Outmail</span> }));

function setLocationSearch(search) {
  delete window.location;
  window.location = { search, href: 'http://localhost:3000/tpo/claim' + search };
}

beforeEach(() => {
  vi.resetAllMocks();
  process.env.NEXT_PUBLIC_BACKEND_URL = 'https://backend.outmail.in';
  setLocationSearch('?inviteToken=signed-token-abc');
});

describe('TpoClaimPage', () => {
  it('shows a loading state while auth is still resolving', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, loading: true, login: vi.fn() });
    render(<TpoClaimPage />);
    expect(screen.getByText(/setting up your tpo portal/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('shows an error when the link has no invite token at all', async () => {
    setLocationSearch('');
    useAuth.mockReturnValue({ isAuthenticated: false, loading: false, login: vi.fn() });
    render(<TpoClaimPage />);
    await waitFor(() => expect(screen.getByText(/couldn't claim this invite/i)).toBeInTheDocument());
    expect(screen.getByText(/missing its invite token/i)).toBeInTheDocument();
  });

  it('redirects into Google OAuth, carrying the invite token through, when not signed in', async () => {
    useAuth.mockReturnValue({ isAuthenticated: false, loading: false, login: vi.fn() });
    render(<TpoClaimPage />);
    await waitFor(() =>
      expect(window.location.href).toBe(
        'https://backend.outmail.in/api/auth/google?client=tpo-claim&inviteToken=signed-token-abc'
      )
    );
    expect(api.post).not.toHaveBeenCalled();
  });

  it('claims the invite, refreshes the session, and redirects to the dashboard on success', async () => {
    const loginMock = vi.fn().mockResolvedValue(undefined);
    api.post.mockResolvedValue({ data: { success: true, token: 'tok-1' } });
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false, login: loginMock });
    render(<TpoClaimPage />);

    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/auth/tpo/claim', { inviteToken: 'signed-token-abc' }));
    await waitFor(() => expect(loginMock).toHaveBeenCalled());
    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/tpo/dashboard'));
  });

  it('shows the backend error (e.g. wrong signed-in email) and does not redirect on failure', async () => {
    api.post.mockRejectedValue({ response: { data: { error: 'This invite was sent to real-tpo@institute.edu. Sign in with that exact Google account to claim it.' } } });
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false, login: vi.fn() });
    render(<TpoClaimPage />);

    await waitFor(() => expect(screen.getByText(/sign in with that exact google account/i)).toBeInTheDocument());
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('falls back to a generic message when the backend gives no error field', async () => {
    api.post.mockRejectedValue(new Error('network down'));
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false, login: vi.fn() });
    render(<TpoClaimPage />);
    await waitFor(() => expect(screen.getByText(/could not be claimed/i)).toBeInTheDocument());
  });

  it('does not submit the claim twice across re-renders', async () => {
    api.post.mockResolvedValue({ data: { success: true, token: 'tok-1' } });
    const loginMock = vi.fn().mockResolvedValue(undefined);
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false, login: loginMock });
    const { rerender } = render(<TpoClaimPage />);
    await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));

    rerender(<TpoClaimPage />);
    await waitFor(() => expect(loginMock).toHaveBeenCalled());
    expect(api.post).toHaveBeenCalledTimes(1);
  });
});
