// outmail-backend's UAT deployment (Render free tier) spins down when idle
// and can take 30-60s to wake on the first request — long enough that the
// very first test in a cold run can time out waiting on a register/login
// button that's really just waiting on Render, not broken. Pinging
// /api/readyz once before the suite starts (with its own generous retry
// window) means every actual test runs against an already-warm backend.
export default async function globalSetup() {
  const apiBaseUrl = process.env.E2E_API_BASE_URL || 'https://outmail-backend-uat.onrender.com';
  const deadline = Date.now() + 90_000;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${apiBaseUrl}/api/readyz`, { signal: AbortSignal.timeout(20_000) });
      if (res.ok || res.status === 503) {
        // 503 still means the process answered (just "degraded", e.g. stubbed
        // Redis/QStash on UAT) — that's a warm backend, not a cold one.
        return;
      }
    } catch {
      // Still waking up — retry until the deadline.
    }
    await new Promise((resolve) => setTimeout(resolve, 3_000));
  }

  console.warn(`[global-setup] ${apiBaseUrl} did not respond within 90s — tests will likely time out.`);
}
