import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import JobPreferences from './JobPreferences';
import { api } from '@/lib/api';

vi.mock('@/lib/api', () => ({ api: { get: vi.fn(), put: vi.fn() } }));

const profile = {
  intentText: 'Backend roles at startups',
  countries: ['IN'],
  remotePref: 'remote',
  minSalary: 1500000,
  targetRoles: ['Backend Engineer', 'ML Engineer'],
  statedYearsExperience: 2,
  yearsExperience: 1.5,
};

beforeEach(() => {
  vi.resetAllMocks();
  api.get.mockResolvedValue({ data: profile });
});

describe('JobPreferences — collapsed by default', () => {
  it('does not fetch-render the form until opened, but still loads the profile on mount', async () => {
    render(<JobPreferences />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/api/profile'));
    expect(screen.queryByPlaceholderText(/backend \/ ml engineer roles/i)).not.toBeInTheDocument();
  });

  it('opens to show the loaded preferences', async () => {
    render(<JobPreferences />);
    await userEvent.click(screen.getByRole('button', { name: /what are you looking for/i }));

    await waitFor(() => expect(screen.getByDisplayValue('Backend roles at startups')).toBeInTheDocument());
    expect(screen.getByDisplayValue('Backend Engineer, ML Engineer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1500000')).toBeInTheDocument();
  });
});

describe('JobPreferences — saving', () => {
  it('saves the form with normalized values and calls onSaved', async () => {
    api.put.mockResolvedValue({});
    const onSaved = vi.fn();
    render(<JobPreferences onSaved={onSaved} />);
    await userEvent.click(screen.getByRole('button', { name: /what are you looking for/i }));
    await waitFor(() => expect(screen.getByDisplayValue('Backend roles at startups')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /save & refresh matches/i }));

    await waitFor(() =>
      expect(api.put).toHaveBeenCalledWith('/api/profile', {
        intentText: 'Backend roles at startups',
        countries: ['IN'],
        remotePref: 'remote',
        minSalary: 1500000,
        targetRoles: ['Backend Engineer', 'ML Engineer'],
        statedYearsExperience: 2,
      })
    );
    expect(onSaved).toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText(/saved/i)).toBeInTheDocument());
  });

  it('sends nulls for blank numeric fields rather than empty strings', async () => {
    api.get.mockResolvedValue({ data: { ...profile, minSalary: null, statedYearsExperience: null } });
    api.put.mockResolvedValue({});
    render(<JobPreferences />);
    await userEvent.click(screen.getByRole('button', { name: /what are you looking for/i }));
    await waitFor(() => expect(screen.getByDisplayValue('Backend roles at startups')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /save & refresh matches/i }));

    await waitFor(() =>
      expect(api.put).toHaveBeenCalledWith(
        '/api/profile',
        expect.objectContaining({ minSalary: null, statedYearsExperience: null })
      )
    );
  });

  it('does not blow up when there is no onSaved callback', async () => {
    api.put.mockResolvedValue({});
    render(<JobPreferences />);
    await userEvent.click(screen.getByRole('button', { name: /what are you looking for/i }));
    await waitFor(() => expect(screen.getByDisplayValue('Backend roles at startups')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /save & refresh matches/i }));
    await waitFor(() => expect(api.put).toHaveBeenCalled());
  });
});
