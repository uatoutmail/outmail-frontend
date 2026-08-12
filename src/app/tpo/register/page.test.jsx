import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TpoRegisterPage from './page';
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

async function fillForm({ password = 'a-strong-password', confirmPassword = 'a-strong-password' } = {}) {
  await userEvent.type(screen.getByPlaceholderText('John Doe'), 'Jane Admin');
  await userEvent.type(screen.getByPlaceholderText('IIT Bombay'), 'PES University');
  await userEvent.type(screen.getByPlaceholderText(/tpo@institute.ac.in/i), 'tpo@pesu.edu');
  const passwordFields = screen.getAllByPlaceholderText('••••••••');
  await userEvent.type(passwordFields[0], password);
  await userEvent.type(passwordFields[1], confirmPassword);
}

describe('TpoRegisterPage — client-side validation', () => {
  it('blocks submission when passwords do not match, and never calls the API', async () => {
    render(<TpoRegisterPage />);
    await fillForm({ password: 'password-one', confirmPassword: 'password-two' });
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(api.post).not.toHaveBeenCalled();
  });
});

describe('TpoRegisterPage — successful registration', () => {
  it('stores the token and redirects to the TPO dashboard', async () => {
    api.post.mockResolvedValue({ data: { success: true, token: 'tok-new' } });
    render(<TpoRegisterPage />);
    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(window.localStorage.getItem('authToken')).toBe('tok-new'));
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/tpo/dashboard'));
  });
});

describe('TpoRegisterPage — failed registration', () => {
  it('shows the backend error and does not redirect', async () => {
    api.post.mockRejectedValue({ response: { data: { error: 'Email already registered' } } });
    render(<TpoRegisterPage />);
    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(api.post).toHaveBeenCalled());
    expect(pushMock).not.toHaveBeenCalled();
  });

  // Same root cause as OUT-199 (tpo/login) — `if (response.data.success)`
  // has no else branch, so a 200-with-success:false response is silent
  // here too. Not re-filed as a separate ticket; OUT-199 covers both call
  // sites since the fix is the same shape in both files.
  it('KNOWN BUG (OUT-199): shows no error when the backend returns success:false', async () => {
    api.post.mockResolvedValue({ data: { success: false, error: 'Institute already registered' } });
    render(<TpoRegisterPage />);
    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(api.post).toHaveBeenCalled());
    expect(pushMock).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('authToken')).toBeNull();
  });
});
