import { test, expect } from '@playwright/test';

// Real E2E coverage of the TPO invite-claim flow (OUT-201) against a real
// backend (see playwright.config.js). Scoped to what's genuinely
// browser/routing behavior — not re-testing the claim LOGIC, which is
// already covered against a real database in outmail-backend's
// authController.claimTpoInvite.integration.test.js (real HTTP, real
// Postgres, real signed tokens/JWTs, no mocks). That's a stronger test of
// "does a claim actually work" than anything achievable here, since a true
// success path needs a real Google-authenticated session, and there's no
// way to script an actual Google consent screen without maintained test
// credentials this suite doesn't have — nor should the backend grow a
// bypass just to make browser testing easier.

test.describe('TPO claim page', () => {
  test('shows a clear error when the invite link has no token, before any auth check', async ({ page }) => {
    await page.goto('/tpo/claim');
    await expect(page.getByText(/couldn't claim this invite/i)).toBeVisible();
    await expect(page.getByText(/missing its invite token/i)).toBeVisible();
  });
});

test.describe('TPO login page', () => {
  test('offers a working Google sign-in link when signed out', async ({ page }) => {
    await page.goto('/tpo/login');
    const link = page.getByRole('link', { name: /continue with google/i });
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toContain('/api/auth/google');
  });
});

test.describe('TPO dashboard access control', () => {
  test('an unauthenticated visitor navigating straight to /tpo/dashboard is redirected to /tpo/login, not shown a broken shell', async ({ page }) => {
    await page.goto('/tpo/dashboard');
    await page.waitForURL(/\/tpo\/login/, { timeout: 15_000 });
  });
});
