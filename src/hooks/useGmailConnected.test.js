import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useGmailConnected } from './useGmailConnected';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// OUT-170: user.hasGmailConnected comes from the JWT (minted at login) and
// never updates until the token rotates — so this hook exists specifically
// to reflect a Gmail connection made in the desktop app AFTER sign-in.
vi.mock('@/lib/api', () => ({ api: { get: vi.fn() } }));
vi.mock('@/context/AuthContext', () => ({ useAuth: vi.fn() }));

beforeEach(() => {
  vi.resetAllMocks();
  useAuth.mockReturnValue({ user: { hasGmailConnected: false } });
  delete window.outmail;
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useGmailConnected — initial seed', () => {
  it('seeds connected:true from the JWT so there is no false-negative flash on mount', () => {
    useAuth.mockReturnValue({ user: { hasGmailConnected: true } });
    api.get.mockReturnValue(new Promise(() => {})); // never resolves during this assertion
    const { result } = renderHook(() => useGmailConnected());
    expect(result.current.gmailConnected).toBe(true);
  });

  it('seeds connected:false when the JWT had no Gmail connection', () => {
    api.get.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useGmailConnected());
    expect(result.current.gmailConnected).toBe(false);
  });
});

describe('useGmailConnected — live refresh', () => {
  it('flips to connected once /api/agent/status confirms it, even though the JWT said false', async () => {
    api.get.mockResolvedValue({ data: { credentialConnected: true } });
    const { result } = renderHook(() => useGmailConnected());
    await waitFor(() => expect(result.current.gmailConnected).toBe(true));
  });

  it('keeps the last known value (does not flip to false) when a poll fails', async () => {
    useAuth.mockReturnValue({ user: { hasGmailConnected: true } });
    api.get.mockRejectedValue(new Error('network down'));
    const { result } = renderHook(() => useGmailConnected());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.gmailConnected).toBe(true);
  });

  it('ignores a response with a non-boolean credentialConnected field', async () => {
    useAuth.mockReturnValue({ user: { hasGmailConnected: true } });
    api.get.mockResolvedValue({ data: { credentialConnected: 'yes' } });
    const { result } = renderHook(() => useGmailConnected());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.gmailConnected).toBe(true);
  });
});

describe('useGmailConnected — desktop app event source', () => {
  it('updates instantly from a window.outmail.onAgentEvent payload, without waiting on a poll', async () => {
    api.get.mockResolvedValue({ data: { credentialConnected: false } });
    let capturedHandler;
    window.outmail = {
      onAgentEvent: vi.fn((handler) => {
        capturedHandler = handler;
        return () => {};
      }),
    };
    const { result } = renderHook(() => useGmailConnected());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => capturedHandler({ credentialConnected: true }));

    expect(result.current.gmailConnected).toBe(true);
  });

  it('unsubscribes from the desktop event source on unmount', async () => {
    api.get.mockResolvedValue({ data: {} });
    const unsubscribe = vi.fn();
    window.outmail = { onAgentEvent: vi.fn(() => unsubscribe) };
    const { unmount } = renderHook(() => useGmailConnected());
    await waitFor(() => expect(window.outmail.onAgentEvent).toHaveBeenCalled());

    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});

describe('useGmailConnected — window focus refresh', () => {
  it('re-checks status when the window regains focus', async () => {
    api.get.mockResolvedValue({ data: { credentialConnected: false } });
    renderHook(() => useGmailConnected());
    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

    act(() => window.dispatchEvent(new Event('focus')));

    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
  });
});

describe('useGmailConnected — poll fallback', () => {
  it('keeps polling while disconnected', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    api.get.mockResolvedValue({ data: { credentialConnected: false } });
    renderHook(() => useGmailConnected());
    await vi.waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(15000);
    });
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('stops polling once connected', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    api.get.mockResolvedValue({ data: { credentialConnected: true } });
    const { result } = renderHook(() => useGmailConnected());
    // Wait for the hook's own state (not just the call count) to reflect
    // connected:true — the connectedRef-sync effect runs off this same
    // state update, so this guarantees the ref has caught up too before
    // any interval tick checks it.
    await vi.waitFor(() => expect(result.current.gmailConnected).toBe(true));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(45000);
    });
    // Only the initial call — the ref-guarded poll never fires once connected.
    expect(api.get).toHaveBeenCalledTimes(1);
  });
});
