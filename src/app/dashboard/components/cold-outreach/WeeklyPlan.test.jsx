import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WeeklyPlan from './WeeklyPlan';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({ api: { get: vi.fn(), post: vi.fn() } }));
vi.mock('sonner', () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }) }));

const row = {
  id: 'row1',
  recipient_name: 'Jane Doe',
  recipient_email: 'jane@acme.com',
  job_role: 'SWE Intern',
  reason: 'Strong match on skills',
  resume_name: 'resume_v2.pdf',
  confidence_score: 0.82,
  validation_status: 'valid',
  status: 'pending',
};

const planPayload = (overrides = {}) => ({
  mode: 'weekly',
  plan: {
    weekOf: '2026-08-10T00:00:00Z',
    totalEmails: 1,
    status: 'pending',
    days: { '2026-08-11': [row] },
    approvedDays: {},
    ...overrides,
  },
});

beforeEach(() => {
  vi.resetAllMocks();
});

describe('WeeklyPlan — no plan yet', () => {
  it('shows the empty state when there is no plan for the week', async () => {
    api.get.mockResolvedValue({ data: { mode: 'weekly', plan: null } });
    render(<WeeklyPlan />);
    await waitFor(() => expect(screen.getByText(/no plan yet/i)).toBeInTheDocument());
  });

  it('stops loading and shows the empty state even when the fetch fails', async () => {
    api.get.mockRejectedValue(new Error('network down'));
    render(<WeeklyPlan />);
    await waitFor(() => expect(screen.getByText(/no plan yet/i)).toBeInTheDocument());
  });
});

describe('WeeklyPlan — rendering a plan', () => {
  it('renders the week summary and each day\'s rows', async () => {
    api.get.mockResolvedValue({ data: planPayload() });
    render(<WeeklyPlan />);
    await waitFor(() => expect(screen.getByText('Jane Doe')).toBeInTheDocument());

    expect(screen.getByText('SWE Intern')).toBeInTheDocument();
    expect(screen.getByText('Strong match on skills')).toBeInTheDocument();
    expect(screen.getByText(/sending resume_v2.pdf/i)).toBeInTheDocument();
    expect(screen.getByText('82% match')).toBeInTheDocument();
    expect(screen.getByText('Verified')).toBeInTheDocument();
  });

  it('shows "Approve week" and hides it once approved', async () => {
    api.get.mockResolvedValue({ data: planPayload() });
    render(<WeeklyPlan />);
    await waitFor(() => expect(screen.getByRole('button', { name: /approve week/i })).toBeInTheDocument());

    api.post.mockResolvedValue({ data: { message: 'Approved' } });
    api.get.mockResolvedValue({ data: planPayload({ status: 'approved' }) });
    await userEvent.click(screen.getByRole('button', { name: /approve week/i }));

    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/outreach/week-plan/approve', { scope: 'week', date: undefined }));
    await waitFor(() => expect(screen.getByText(/week approved/i)).toBeInTheDocument());
  });

  it('shows the auto-mode badge instead of an approve button when the plan is in auto mode', async () => {
    api.get.mockResolvedValue({ data: planPayload({ status: 'auto' }) });
    render(<WeeklyPlan />);
    await waitFor(() => expect(screen.getByText(/sends automatically/i)).toBeInTheDocument());
    expect(screen.queryByRole('button', { name: /approve week/i })).not.toBeInTheDocument();
  });

  it('shows a per-day "Approve day" button in daily mode, not a week-level one', async () => {
    api.get.mockResolvedValue({ data: { ...planPayload(), mode: 'daily' } });
    render(<WeeklyPlan />);
    await waitFor(() => expect(screen.getByRole('button', { name: /approve day/i })).toBeInTheDocument());
    expect(screen.queryByRole('button', { name: /approve week/i })).not.toBeInTheDocument();

    api.post.mockResolvedValue({ data: {} });
    await userEvent.click(screen.getByRole('button', { name: /approve day/i }));
    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith('/api/outreach/week-plan/approve', { scope: 'day', date: '2026-08-11' })
    );
  });
});

describe('WeeklyPlan — approval mode switcher', () => {
  it('sets a new approval mode and shows a success toast', async () => {
    api.get.mockResolvedValue({ data: planPayload() });
    api.post.mockResolvedValue({});
    const { toast } = await import('sonner');
    render(<WeeklyPlan />);
    await waitFor(() => expect(screen.getByText('Jane Doe')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /automatic/i }));

    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/outreach/approval-mode', { mode: 'auto' }));
    expect(toast.success).toHaveBeenCalledWith('Approval mode set to auto');
  });

  it('shows the backend error message when changing mode fails', async () => {
    api.get.mockResolvedValue({ data: planPayload() });
    api.post.mockRejectedValue({ response: { data: { error: 'Mode locked by admin' } } });
    const { toast } = await import('sonner');
    render(<WeeklyPlan />);
    await waitFor(() => expect(screen.getByText('Jane Doe')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /daily approval/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Mode locked by admin'));
  });
});
