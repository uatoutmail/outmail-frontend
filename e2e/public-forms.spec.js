import { test, expect } from '@playwright/test';

// Real E2E against the live UAT backend (see playwright.config.js). Both
// forms here are genuinely public — no auth wall, no OAuth, no Electron,
// none of the blockers that gate most of the rest of the product — so
// unlike the TPO flow, these are fully testable start to finish including
// the actual backend write.

function uniqueEmail(prefix) {
  return `e2e-${prefix}-${Date.now()}@outmail-e2e-test.dev`;
}

test.describe('Contact form', () => {
  test('submits successfully and shows a confirmation toast', async ({ page }) => {
    await page.goto('/contactus');
    await page.getByPlaceholder('Arjun Mehta').fill('E2E Test User');
    await page.getByPlaceholder('arjun@college.edu').fill(uniqueEmail('contact'));
    await page.locator('#role').selectOption('student');
    await page.getByPlaceholder(/tell us what's on your mind/i).fill('This is an automated E2E test message — safe to ignore/delete.');
    await page.getByRole('button', { name: /send message/i }).click();

    // sonner renders each toast twice (a visible one plus an ARIA live-region
    // duplicate for screen readers) — .first() is enough to prove it fired.
    await expect(page.getByText(/message sent successfully/i).first()).toBeVisible({ timeout: 10_000 });
  });

  test('required fields block submission — no request fires with the form empty', async ({ page }) => {
    await page.goto('/contactus');
    let requestFired = false;
    page.on('request', (req) => {
      if (req.url().includes('/api/contact')) requestFired = true;
    });

    await page.getByRole('button', { name: /send message/i }).click();
    await page.waitForTimeout(500); // let a request fire if the guard is missing, before asserting its absence
    expect(requestFired).toBe(false);
  });
});

test.describe('Newsletter subscribe', () => {
  test('subscribes successfully and the button reflects it', async ({ page }) => {
    await page.goto('/contactus'); // footer (with the newsletter box) renders on every page
    // getByLabel('Email address') is ambiguous here — the contact form's own
    // email field has an accessible name that collides case-insensitively.
    // The placeholder is unique to the footer's newsletter input.
    const emailInput = page.getByPlaceholder('Enter your email');
    await emailInput.fill(uniqueEmail('newsletter'));
    await page.getByRole('button', { name: /^subscribe$/i }).click();

    await expect(page.getByText(/subscribed successfully/i).first()).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('Subscribed!')).toBeVisible();
  });
});
