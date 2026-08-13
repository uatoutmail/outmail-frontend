import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobsPage from './page';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn(), push: vi.fn() }), usePathname: () => '/tpo/jobs' }));
vi.mock('@/lib/api', () => ({ api: { get: vi.fn() } }));
vi.mock('@/context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('recharts', () => ({
  BarChart: ({ children }) => <div>{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}));

const payload = {
  sectorBreakdown: [{ sector: 'FinTech', openings: 12 }],
  ALL_JOBS: [
    { company: 'Acme Corp', role: 'Backend Engineer', sector: 'FinTech', score: 92, students: 5, urgency: 'Hot', posted: '2d ago' },
    { company: 'Beta Inc', role: 'PM', sector: 'SaaS', score: 60, students: 2, urgency: 'Normal', posted: '5d ago' },
  ],
  stats: { totalOpenings: 120, avgPerStudent: 4, uniqueCompanies: 30, hotOpportunities: 8 },
};

beforeEach(() => {
  vi.resetAllMocks();
  useAuth.mockReturnValue({ user: { display_name: 'Jane TPO' }, logout: vi.fn() });
});

describe('JobsPage', () => {
  it('shows a loading message before data arrives', () => {
    api.get.mockImplementation(() => new Promise(() => {}));
    render(<JobsPage />);
    expect(screen.getByText(/loading jobs data/i)).toBeInTheDocument();
  });

  it('renders KPIs and the job table once loaded', async () => {
    api.get.mockResolvedValue({ data: payload });
    render(<JobsPage />);

    await waitFor(() => expect(screen.getByText('Acme Corp')).toBeInTheDocument());
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('Beta Inc')).toBeInTheDocument();
    expect(screen.getByText(/showing 2 of 2 tracked openings/i)).toBeInTheDocument();
  });

  it('filters the job table by search text', async () => {
    api.get.mockResolvedValue({ data: payload });
    render(<JobsPage />);
    await waitFor(() => expect(screen.getByText('Acme Corp')).toBeInTheDocument());

    await userEvent.type(screen.getByPlaceholderText(/search company or role/i), 'acme');

    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.queryByText('Beta Inc')).not.toBeInTheDocument();
    expect(screen.getByText(/showing 1 of 2 tracked openings/i)).toBeInTheDocument();
  });

  it('filters the job table by sector', async () => {
    api.get.mockResolvedValue({ data: payload });
    render(<JobsPage />);
    await waitFor(() => expect(screen.getByText('Acme Corp')).toBeInTheDocument());

    await userEvent.selectOptions(screen.getByDisplayValue(/all sectors/i), 'SaaS');

    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument();
    expect(screen.getByText('Beta Inc')).toBeInTheDocument();
  });

  it('shows "No jobs found" when the filters exclude everything', async () => {
    api.get.mockResolvedValue({ data: payload });
    render(<JobsPage />);
    await waitFor(() => expect(screen.getByText('Acme Corp')).toBeInTheDocument());

    await userEvent.type(screen.getByPlaceholderText(/search company or role/i), 'nonexistent-company-xyz');

    expect(screen.getByText(/no jobs found/i)).toBeInTheDocument();
  });

  it('renders an empty sector chart placeholder when there is no breakdown data', async () => {
    api.get.mockResolvedValue({ data: { ...payload, sectorBreakdown: [] } });
    render(<JobsPage />);
    await waitFor(() => expect(screen.getByText('Acme Corp')).toBeInTheDocument());
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });

  it('does not crash and shows zeroed KPIs when the fetch fails', async () => {
    api.get.mockRejectedValue(new Error('network down'));
    render(<JobsPage />);
    await waitFor(() => expect(screen.getByText(/no jobs found/i)).toBeInTheDocument());
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });
});
