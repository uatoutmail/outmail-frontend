import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import OutreachStatPills from './OutreachStatPills';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({ api: { get: vi.fn() } }));

beforeEach(() => {
  vi.resetAllMocks();
});

describe('OutreachStatPills — fetch failure', () => {
  it('stops the skeleton pulse and falls back to defaults on a rejected fetch, never stays loading forever', async () => {
    api.get.mockRejectedValue(new Error('network down'));
    render(<OutreachStatPills selectedPeriod="7" />);

    await waitFor(() => {
      expect(document.querySelectorAll('.animate-pulse')).toHaveLength(0);
    });
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('renders real values on a successful fetch', async () => {
    api.get.mockResolvedValue({
      data: { emailsSentPeriod: 12, totalEmailsSent: 340, companiesTargeted: 8, activeOutreach: '3 pending' },
    });
    render(<OutreachStatPills selectedPeriod="7" />);

    await waitFor(() => expect(screen.getByText('12')).toBeInTheDocument());
    expect(screen.getByText('340')).toBeInTheDocument();
    expect(screen.getByText('3 pending')).toBeInTheDocument();
  });

  it('re-fetches when selectedPeriod changes', async () => {
    api.get.mockResolvedValue({ data: { emailsSentPeriod: 1, totalEmailsSent: 1, companiesTargeted: 1, activeOutreach: '1' } });
    const { rerender } = render(<OutreachStatPills selectedPeriod="7" />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith(expect.stringContaining('period=7')));

    rerender(<OutreachStatPills selectedPeriod="30" />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith(expect.stringContaining('period=30')));
  });
});
