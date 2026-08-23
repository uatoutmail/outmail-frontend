import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import TpoLoginPage from './page';
import { useAuth } from '@/context/AuthContext';

const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: replaceMock }) }));
vi.mock('@/context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('@/component/ui/wordmark', () => ({ default: () => <span>Outmail</span> }));

beforeEach(() => {
  vi.resetAllMocks();
  process.env.NEXT_PUBLIC_BACKEND_URL = 'https://backend.outmail.in';
});

describe('TpoLoginPage', () => {
  it('shows a loading state while auth is still resolving', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, loading: true, userRole: null });
    render(<TpoLoginPage />);
    expect(screen.getByText(/checking your session/i)).toBeInTheDocument();
  });

  it('offers a Google sign-in link when not authenticated', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, loading: false, userRole: null });
    render(<TpoLoginPage />);
    const link = screen.getByRole('link', { name: /continue with google/i });
    expect(link).toHaveAttribute('href', 'https://backend.outmail.in/api/auth/google');
  });

  it('redirects an already-claimed TPO_ADMIN straight to the dashboard', async () => {
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false, userRole: 'TPO_ADMIN' });
    render(<TpoLoginPage />);
    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/tpo/dashboard'));
  });

  it('tells a signed-in non-TPO account it has no access, rather than a silent dead end (OUT-199 lesson)', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false, userRole: 'STUDENT' });
    render(<TpoLoginPage />);
    expect(screen.getByText(/no tpo access on this account/i)).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
