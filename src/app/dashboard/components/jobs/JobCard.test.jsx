import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobCard from './JobCard';

const getPriorityTier = (score) => (score >= 70 ? { label: 'Strong Match', border: 'border-green-500/30' } : { label: 'Possible Match', border: 'border-blue-500/20' });
const getPriorityScoreColor = () => 'text-green-400';
const getStatusColor = () => 'text-blue-400';
const getStatusText = (action) => (action === 'applied' ? 'Applied' : 'New');

function makeHandlers() {
  return {
    getPriorityTier,
    getPriorityScoreColor,
    getStatusColor,
    getStatusText,
    handleOpenJob: vi.fn(),
    handleDiscard: vi.fn(),
    handleResetStatus: vi.fn(),
    handleApply: vi.fn(),
    handleAutoApply: vi.fn(),
  };
}

const newJob = {
  id: 'j1',
  title: 'Backend Engineer',
  company: 'Acme Corp',
  location: 'Bangalore',
  workType: 'Hybrid',
  compensation: '₹15L–20L',
  matchScore: 82,
  seniority: 'mid',
  reasons: [{ detail: 'Matches your Python skills' }],
  signals: ['Python', 'Django'],
  applyLink: 'https://apply.example.com/j1',
  url: 'https://source.example.com/j1',
  details: '<p>Build backend services.</p>',
  qualifications: '<p>3+ years experience.</p>',
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('JobCard — a new (no userAction) job', () => {
  it('renders job facts and the priority score', () => {
    render(<JobCard job={newJob} {...makeHandlers()} />);
    expect(screen.getByText('Backend Engineer')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Bangalore')).toBeInTheDocument();
    expect(screen.getByText('Hybrid')).toBeInTheDocument();
    expect(screen.getByText('₹15L–20L')).toBeInTheDocument();
    expect(screen.getByText('82')).toBeInTheDocument();
    expect(screen.getByText('Matches your Python skills')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('shows Apply, Auto-Apply, and Discard for a new job, and calls handlers with the right args', async () => {
    const handlers = makeHandlers();
    render(<JobCard job={newJob} {...handlers} />);

    await userEvent.click(screen.getByRole('button', { name: /apply now/i }));
    expect(handlers.handleOpenJob).toHaveBeenCalledWith('https://apply.example.com/j1');
    expect(handlers.handleApply).toHaveBeenCalledWith('j1');

    await userEvent.click(screen.getByRole('button', { name: /auto-apply/i }));
    expect(handlers.handleAutoApply).toHaveBeenCalledWith(newJob);

    await userEvent.click(screen.getByRole('button', { name: /discard/i }));
    expect(handlers.handleDiscard).toHaveBeenCalledWith('j1');

    expect(screen.queryByRole('button', { name: /reset status/i })).not.toBeInTheDocument();
  });

  it('expands to show sanitized job details and qualifications', async () => {
    render(<JobCard job={newJob} {...makeHandlers()} />);
    expect(screen.queryByText('Build backend services.')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /show job details/i }));
    expect(screen.getByText('Build backend services.')).toBeInTheDocument();
    expect(screen.getByText('3+ years experience.')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /hide details/i }));
    expect(screen.queryByText('Build backend services.')).not.toBeInTheDocument();
  });

  it('strips a script tag out of admin-authored job details before rendering', async () => {
    const jobWithScript = { ...newJob, details: '<p>Safe text</p><script>window.pwned = true;</script>' };
    render(<JobCard job={jobWithScript} {...makeHandlers()} />);
    await userEvent.click(screen.getByRole('button', { name: /show job details/i }));

    expect(screen.getByText('Safe text')).toBeInTheDocument();
    expect(document.querySelector('script')).not.toBeInTheDocument();
  });
});

describe('JobCard — a job with an existing userAction (not new)', () => {
  const appliedJob = { ...newJob, userAction: 'applied' };

  it('hides Apply/Discard/Auto-Apply and shows Reset Status instead', async () => {
    const handlers = makeHandlers();
    render(<JobCard job={appliedJob} {...handlers} />);

    expect(screen.queryByRole('button', { name: /^apply now$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /auto-apply/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /discard/i })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /reset status/i }));
    expect(handlers.handleResetStatus).toHaveBeenCalledWith('j1');
  });

  it('still opens the source link via the Source Link button', async () => {
    const handlers = makeHandlers();
    render(<JobCard job={appliedJob} {...handlers} />);
    await userEvent.click(screen.getByRole('button', { name: /source link/i }));
    expect(handlers.handleOpenJob).toHaveBeenCalledWith('https://source.example.com/j1');
  });
});
