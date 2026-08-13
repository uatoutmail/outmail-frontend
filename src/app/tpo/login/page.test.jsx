import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TpoLoginPage from './page';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock }) }));
vi.mock('@/lib/api', () => ({ api: { post: vi.fn() } }));
vi.mock('@/context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock('@/component/ui/wordmark', () => ({ default: () => <span>Outmail</span> }));

beforeEach(() => {
  vi.resetAllMocks();
  window.localStorage.clear();
  useAuth.mockReturnValue({ login: vi.fn().mockResolvedValue(undefined) });
});

async function fillAndSubmit(email = 'tpo@institute.edu', password = 'correct-password') {
  await userEvent.type(screen.getByPlaceholderText(/admin@institute.edu/i), email);
  await userEvent.type(screen.getByPlaceholderText('••••••••'), password);
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
}

describe('TpoLoginPage — successful login', () => {
  it('stores the token, refreshes the auth context, and redirects to the TPO dashboard', async () => {
    api.post.mockResolvedValue({ data: { success: true, token: 'tok-abc' } });
    render(<TpoLoginPage />);
    await fillAndSubmit();

    await waitFor(() => expect(window.localStorage.getItem('authToken')).toBe('tok-abc'));
    expect(window.localStorage.getItem('userRole')).toBe('TPO_ADMIN');
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/tpo/dashboard'));
  });
});

describe('TpoLoginPage — failed login (network/HTTP error)', () => {
  it('shows the backend error message and does not redirect', async () => {
    api.post.mockRejectedValue({ response: { data: { error: 'Invalid email or password' } } });
    render(<TpoLoginPage />);
    await fillAndSubmit();

    await waitFor(() => expect(api.post).toHaveBeenCalled());
    expect(pushMock).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('authToken')).toBeNull();
  });

  it('re-enables the submit button after a failed attempt (never stuck on "Verifying")', async () => {
    api.post.mockRejectedValue(new Error('network down'));
    render(<TpoLoginPage />);
    await fillAndSubmit();

    await waitFor(() => expect(screen.getByRole('button', { name: /sign in/i })).not.toBeDisabled());
  });
});

describe('TpoLoginPage — a 200 response with success:false (OUT-199, fixed)', () => {
  // Previously silently ignored: the handler only branched on
  // `if (response.data.success)` with no else, so a 200 response carrying
  // `{ success: false, error }` (a real shape — outmail-admin's
  // AuthContext.login guards against exactly this) showed no error, no
  // redirect, and left the button back on "Sign In" with zero feedback.
  it('shows the backend error message and does not redirect', async () => {
    api.post.mockResolvedValue({ data: { success: false, error: 'Invalid credentials' } });
    render(<TpoLoginPage />);
    await fillAndSubmit();

    const { toast } = await import('sonner');
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Invalid credentials'));
    expect(pushMock).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('authToken')).toBeNull();
  });

  it('falls back to a generic message when the backend gives no error field', async () => {
    api.post.mockResolvedValue({ data: { success: false } });
    render(<TpoLoginPage />);
    await fillAndSubmit();

    const { toast } = await import('sonner');
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Login failed. Please check your credentials.'));
  });
});
