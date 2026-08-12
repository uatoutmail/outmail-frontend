import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomOutreach from './CustomOutreach';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({ api: { post: vi.fn() } }));
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const resumes = [
  { id: 'r1', name: 'Resume A', uploaded_at: '2026-01-01' },
  { id: 'r2', name: 'Resume B', uploaded_at: '2026-02-01' },
];

beforeEach(() => {
  vi.resetAllMocks();
});

describe('CustomOutreach', () => {
  it('defaults to the first resume once resumes load', () => {
    render(<CustomOutreach resumes={resumes} hasResumes gmailConnected />);
    expect(screen.getByRole('combobox')).toHaveValue('r1');
  });

  it('disables the submit button and blocks sending when Gmail is not connected', async () => {
    render(<CustomOutreach resumes={resumes} hasResumes gmailConnected={false} />);
    expect(screen.getByRole('button', { name: /send custom outreach/i })).toBeDisabled();
  });

  it('disables submission when there is no resume', () => {
    render(<CustomOutreach resumes={[]} hasResumes={false} gmailConnected />);
    expect(screen.getByRole('button', { name: /send custom outreach/i })).toBeDisabled();
  });

  it('sends the custom outreach and clears the form on success', async () => {
    api.post.mockResolvedValue({});
    render(<CustomOutreach resumes={resumes} hasResumes gmailConnected />);

    await userEvent.type(screen.getByPlaceholderText(/recruiter@company.com/i), 'hr@company.com');
    await userEvent.type(screen.getByPlaceholderText(/paste the full job description/i), 'We need a backend engineer.');
    await userEvent.click(screen.getByRole('button', { name: /send custom outreach/i }));

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith('/api/outreach/custom', {
        targetMail: 'hr@company.com',
        resumeId: 'r1',
        jobDescription: 'We need a backend engineer.',
      })
    );
    await waitFor(() => expect(screen.getByPlaceholderText(/recruiter@company.com/i)).toHaveValue(''));
  });

  it('shows the backend error message on failure and does not clear the form', async () => {
    const { toast } = await import('sonner');
    api.post.mockRejectedValue({ response: { data: { error: 'Rate limit exceeded' } } });
    render(<CustomOutreach resumes={resumes} hasResumes gmailConnected />);

    await userEvent.type(screen.getByPlaceholderText(/recruiter@company.com/i), 'hr@company.com');
    await userEvent.type(screen.getByPlaceholderText(/paste the full job description/i), 'JD text');
    await userEvent.click(screen.getByRole('button', { name: /send custom outreach/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Rate limit exceeded'));
    expect(screen.getByPlaceholderText(/recruiter@company.com/i)).toHaveValue('hr@company.com');
  });
});
