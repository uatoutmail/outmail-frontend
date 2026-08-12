import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import { api } from './api';

// Unlike outmail-admin's services/api.ts, this repo's response interceptor
// is a pure pass-through with no 401/403 handling — the only real behavior
// to verify is the request interceptor's token injection.
const mock = new MockAdapter(api);

beforeEach(() => {
  mock.reset();
  window.localStorage.clear();
});

describe('api — request interceptor', () => {
  it('attaches a Bearer token from localStorage when present', async () => {
    window.localStorage.setItem('authToken', 'tok-abc');
    mock.onGet('/api/user/me').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer tok-abc');
      return [200, { user: { id: 'u1' } }];
    });
    await api.get('/api/user/me');
  });

  it('sends no Authorization header when no token is stored', async () => {
    mock.onGet('/api/user/me').reply((config) => {
      expect(config.headers?.Authorization).toBeUndefined();
      return [200, {}];
    });
    await api.get('/api/user/me');
  });
});
