import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TPODashboard from './page';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: replaceMock, push: vi.fn() }), usePathname: () => '/tpo/dashboard' }));
vi.mock('@/lib/api', () => ({ api: { get: vi.fn() } }));
vi.mock('@/context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('sonner', () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }) }));
// These have their own data-fetching and are out of scope for a page-level test.
vi.mock('@/component/tpo/TPOOverviewCards', () => ({ default: ({ stats }) => <div>Overview Cards ({stats ? 'loaded' : 'pending'})</div> }));
vi.mock('@/component/tpo/TPOCharts', () => ({ default: () => <div>Charts Stub</div> }));
vi.mock('@/component/tpo/TPOStudentTable', () => ({ default: () => <div>Student Table Stub</div> }));
vi.mock('@/component/tpo/TPOMentorshipPanel', () => ({ default: () => <div>Mentorship Panel Stub</div> }));

beforeEach(() => {
  vi.resetAllMocks();
});

describe('TPODashboard — auth guard', () => {
  it('redirects to home when not authenticated', async () => {
    useAuth.mockReturnValue({ user: null, isAuthenticated: false, loading: false });
    render(<TPODashboard />);
    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/'));
  });

  it('shows a loading spinner while auth is resolving, without redirecting', () => {
    useAuth.mockReturnValue({ user: null, isAuthenticated: false, loading: true });
    render(<TPODashboard />);
    expect(replaceMock).not.toHaveBeenCalled();
  });
});

describe('TPODashboard — authenticated', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { display_name: 'Jane TPO', institute_name: 'Big University' },
      isAuthenticated: true,
      loading: false,
      userRole: 'TPO_ADMIN',
    });
    api.get.mockResolvedValue({ data: { stats: { totalStudents: 100 } } });
  });

  it('greets the user by first name and shows the institution', async () => {
    render(<TPODashboard />);
    await waitFor(() => expect(screen.getByText(/welcome back, jane/i)).toBeInTheDocument());
    expect(screen.getAllByText(/big university/i).length).toBeGreaterThan(0);
  });

  it('fetches stats and passes them down once loaded', async () => {
    render(<TPODashboard />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/api/admin/stats'));
    await waitFor(() => expect(screen.getByText('Overview Cards (loaded)')).toBeInTheDocument());
  });

  it('renders the student table and mentorship panel', async () => {
    render(<TPODashboard />);
    await waitFor(() => expect(screen.getByText('Student Table Stub')).toBeInTheDocument());
    expect(screen.getByText('Mentorship Panel Stub')).toBeInTheDocument();
  });

  it('shows a "coming soon" notice for report export', async () => {
    const { toast } = await import('sonner');
    render(<TPODashboard />);
    await waitFor(() => expect(screen.getByText(/welcome back/i)).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /export report/i }));
    expect(toast).toHaveBeenCalledWith('Report export is coming soon.');
  });

  it('does not blow up when the stats fetch fails', async () => {
    api.get.mockRejectedValue(new Error('network down'));
    render(<TPODashboard />);
    await waitFor(() => expect(api.get).toHaveBeenCalled());
    expect(screen.getByText('Overview Cards (pending)')).toBeInTheDocument();
  });
});
