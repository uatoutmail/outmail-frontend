import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResourcesPage from './page';
import { useAuth } from '@/context/AuthContext';

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn(), push: vi.fn() }), usePathname: () => '/tpo/resources' }));
vi.mock('@/context/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('sonner', () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }) }));

beforeEach(() => {
  vi.resetAllMocks();
  useAuth.mockReturnValue({ user: { display_name: 'Jane TPO' }, logout: vi.fn() });
});

describe('ResourcesPage', () => {
  it('renders every resource category and its items', () => {
    render(<ResourcesPage />);
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('Understanding the Data')).toBeInTheDocument();
    expect(screen.getByText('Improving Outcomes')).toBeInTheDocument();
    expect(screen.getByText('Compliance & Privacy')).toBeInTheDocument();
    expect(screen.getByText('TPO Onboarding Guide')).toBeInTheDocument();
    expect(screen.getByText('Data Privacy Policy')).toBeInTheDocument();
  });

  it('shows a "coming soon" toast for a PDF/video resource download', async () => {
    const { toast } = await import('sonner');
    render(<ResourcesPage />);
    await userEvent.click(screen.getAllByText(/download →/i)[0]);
    expect(toast).toHaveBeenCalledWith('This resource is coming soon.');
  });

  it('labels link-type resources as "Open link" rather than "Download"', () => {
    render(<ResourcesPage />);
    const privacyCard = screen.getByText('Data Privacy Policy').closest('div');
    expect(privacyCard.textContent).toMatch(/open link →/i);
  });

  it('shows "coming soon" toasts for the onboarding PDF and demo video quick links', async () => {
    const { toast } = await import('sonner');
    render(<ResourcesPage />);
    await userEvent.click(screen.getByText(/download onboarding pdf/i));
    expect(toast).toHaveBeenCalledWith('Onboarding guide is coming soon.');

    await userEvent.click(screen.getByText(/watch platform demo/i));
    expect(toast).toHaveBeenCalledWith('The demo video is coming soon.');
  });

  it('opens the success-team mailto link when "Talk to Our Success Team" is clicked', async () => {
    // Replacing window.location wholesale (rather than just its `href`)
    // breaks next/image's internal URL resolution for the layout's logo —
    // it needs a location with a real origin as a base URL.
    const originalLocation = window.location;
    delete window.location;
    window.location = {
      protocol: 'http:', host: 'localhost:3000', hostname: 'localhost', port: '',
      pathname: '/', search: '', hash: '', href: 'http://localhost:3000/', origin: 'http://localhost:3000',
    };
    render(<ResourcesPage />);

    await userEvent.click(screen.getByText(/talk to our success team/i));

    expect(window.location.href).toContain('mailto:contact@outmail.in');
    window.location = originalLocation;
  });

  it('renders a "Book a Call" mailto link in the support block', () => {
    render(<ResourcesPage />);
    const bookACall = screen.getByRole('link', { name: /book a call/i });
    expect(bookACall).toHaveAttribute('href', expect.stringContaining('mailto:contact@outmail.in'));
  });
});
