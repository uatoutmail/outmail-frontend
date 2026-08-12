import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MailingAgentPanel from './MailingAgentPanel';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({ api: { get: vi.fn(), post: vi.fn() } }));

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('MailingAgentPanel — offline, no activity', () => {
  it('shows offline status and the "no sends yet" empty state', async () => {
    api.get.mockResolvedValue({ data: { online: false, today: { sent: 0, waiting: 0, queued: 0, failed: 0 }, logs: [] } });
    render(<MailingAgentPanel />);
    await waitFor(() => expect(screen.getByText('Offline')).toBeInTheDocument());
    expect(screen.getByText(/open the outmail desktop app to start sending/i)).toBeInTheDocument();
  });

  it('generates a link code when offline and displays it', async () => {
    api.get.mockResolvedValue({ data: { online: false, today: {}, logs: [] } });
    api.post.mockResolvedValue({ data: { code: 'LINK99', expiresInSeconds: 300 } });
    render(<MailingAgentPanel />);
    await waitFor(() => expect(screen.getByRole('button', { name: /link desktop agent/i })).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /link desktop agent/i }));

    await waitFor(() => expect(screen.getByText('LINK99')).toBeInTheDocument());
    expect(api.post).toHaveBeenCalledWith('/api/agent/link/code');
  });
});

describe('MailingAgentPanel — online with activity', () => {
  it('shows online status, today\'s send progress, and pending/failed counts', async () => {
    api.get.mockResolvedValue({
      data: {
        online: true,
        today: { sent: 3, waiting: 1, queued: 2, failed: 1 },
        usage: { dailyUsed: 3, dailyLimit: 20 },
        logs: [],
      },
    });
    render(<MailingAgentPanel />);
    await waitFor(() => expect(screen.getByText('Online')).toBeInTheDocument());
    expect(screen.getByText('3 / 7 sent')).toBeInTheDocument();
    expect(screen.getByText('3 pending')).toBeInTheDocument();
    expect(screen.getByText('1 failed')).toBeInTheDocument();
    expect(screen.getByText(/3\/20/)).toBeInTheDocument();
    // No link-code prompt while online.
    expect(screen.queryByRole('button', { name: /link desktop agent/i })).not.toBeInTheDocument();
  });

  it('renders success and failure log entries', async () => {
    api.get.mockResolvedValue({
      data: {
        online: true,
        today: { sent: 1, waiting: 0, queued: 0, failed: 1 },
        logs: [
          { id: 'l1', status: 'success', recipient: 'hr@acme.com', createdAt: new Date().toISOString() },
          { id: 'l2', status: 'failed', recipient: 'hr@beta.com', error: 'Bounced', createdAt: new Date().toISOString() },
        ],
      },
    });
    render(<MailingAgentPanel />);
    await waitFor(() => expect(screen.getByText('Sent to hr@acme.com')).toBeInTheDocument());
    expect(screen.getByText('Failed: hr@beta.com')).toBeInTheDocument();
    expect(screen.getByText('Bounced')).toBeInTheDocument();
  });

  it('shows "—" for the daily limit when there is none configured', async () => {
    api.get.mockResolvedValue({ data: { online: true, today: {}, usage: { dailyUsed: 0, dailyLimit: null }, logs: [] } });
    render(<MailingAgentPanel />);
    await waitFor(() => expect(screen.getByText('Online')).toBeInTheDocument());
    expect(screen.getByText(/daily limit: —/i)).toBeInTheDocument();
  });
});
