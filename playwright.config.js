import { defineConfig, devices } from '@playwright/test';

// E2E tests run against a real backend, not mocks — this is the whole point
// of an E2E suite (unlike the Vitest unit tests, which mock everything).
// Default target is outmail-backend's UAT deployment: it has a real database
// but is deliberately safe to hit (OUT-188's hard send guard blocks all
// outbound mail there unless explicitly allowlisted). Override with
// E2E_API_BASE_URL to point at a locally-run backend instead.
const API_BASE_URL = process.env.E2E_API_BASE_URL || 'https://outmail-backend-uat.onrender.com';
const PORT = process.env.E2E_PORT || 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.js',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // One worker: both spec files register/log in against the same real UAT
  // backend, and running them concurrently doubles the chance of racing a
  // still-waking-up Render instance on a cold run.
  workers: 1,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  // Generous — this suite waits on a real (sometimes cold-starting) backend,
  // not a mock. See e2e/global-setup.js for the warm-up step that keeps this
  // from being needed on every single test, just the rare truly-cold run.
  timeout: 60_000,

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  // Boots the app itself against the target API — the "webServer" a real
  // user's browser would be pointed at, not something the tests fake.
  webServer: {
    command: `NEXT_PUBLIC_API_BASE_URL=${API_BASE_URL} PORT=${PORT} npm run dev`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
