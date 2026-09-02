import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// OUT-205. This predicate decides whether the entire app is replaced by a
// "we'll be back shortly" screen, so the boundary between "our fault" and
// "your request" has to be exact. Getting it wrong in one direction leaves a
// user staring at a broken page that says nothing; in the other it blanks the
// whole app because a file was too large.
//
// Tests the rule rather than the axios instance: importing lib/api.js pulls in
// Next's runtime config and a real axios client, and what actually needs
// pinning down is the classification.

const isOurFault = (error) => !error?.response || error.response.status >= 500;

describe('service-unavailable classification', () => {
  it('treats a 5xx as our fault — the server admitted it failed', () => {
    for (const status of [500, 502, 503, 504]) {
      expect(isOurFault({ response: { status } })).toBe(true);
    }
  });

  it('treats a missing response as our fault — backend down, DNS, or offline', () => {
    // This is the database-outage shape: axios rejects with no response at all.
    expect(isOurFault({ message: 'Network Error' })).toBe(true);
    expect(isOurFault({ code: 'ECONNABORTED', message: 'timeout of 20000ms exceeded' })).toBe(true);
    expect(isOurFault({})).toBe(true);
  });

  it('does NOT blank the app for a 4xx — those are about the user request', () => {
    // 401 means sign in, 404 means wrong URL, 400/413/429 describe what the
    // caller did. Our own copy already explains these, and replacing the whole
    // app for a validation error would be absurd.
    for (const status of [400, 401, 403, 404, 409, 413, 422, 429]) {
      expect(isOurFault({ response: { status } })).toBe(false);
    }
  });

  it('puts the boundary exactly at 500', () => {
    expect(isOurFault({ response: { status: 499 } })).toBe(false);
    expect(isOurFault({ response: { status: 500 } })).toBe(true);
  });
});

// The takeover blanks the page it is on. On the dashboard that is correct —
// nothing there works without a backend. On the marketing site it was actively
// harmful: every public page fires /api/user/me for anonymous visitors, so a
// single backend blip replaced the pricing, the policies and the sign-up with
// an error screen, on pages that are almost entirely static.
describe('where the takeover applies', () => {
  const APP_ROUTES = ['/dashboard', '/admin', '/student', '/tpo'];
  const takesOverOn = (pathname) =>
    APP_ROUTES.some((r) => pathname === r || pathname?.startsWith(`${r}/`));

  it('takes over signed-in surfaces, which cannot work without the backend', () => {
    for (const p of ['/dashboard', '/dashboard/jobs', '/admin', '/tpo/dashboard', '/student/x']) {
      expect(takesOverOn(p)).toBe(true);
    }
  });

  it('never blanks a marketing page', () => {
    for (const p of ['/', '/pricing', '/features', '/faq', '/aboutus', '/contactus',
                     '/partnership', '/privacy-policy', '/terms-and-conditions']) {
      expect(takesOverOn(p)).toBe(false);
    }
  });

  it('does not match a marketing route that merely starts with the same letters', () => {
    // /tpo must not swallow a future /tpo-partners marketing page.
    expect(takesOverOn('/tpo-partners')).toBe(false);
    expect(takesOverOn('/administrators')).toBe(false);
  });

  it('tolerates a null pathname rather than throwing during hydration', () => {
    expect(takesOverOn(null)).toBe(false);
    expect(takesOverOn(undefined)).toBe(false);
  });
});

// A request can opt out of the takeover entirely. Public reads use this so a
// backend blip degrades in place instead of replacing the page.
describe('the quiet opt-out', () => {
  const fires = (error) => {
    const ourFault = !error?.response || error.response.status >= 500;
    return ourFault && error?.config?.quiet !== true;
  };

  it('suppresses the takeover for a request marked quiet', () => {
    expect(fires({ message: 'Network Error', config: { quiet: true } })).toBe(false);
    expect(fires({ response: { status: 503 }, config: { quiet: true } })).toBe(false);
  });

  it('still fires for a request that did not opt out', () => {
    expect(fires({ message: 'Network Error', config: {} })).toBe(true);
    expect(fires({ response: { status: 503 } })).toBe(true);
  });

  it('requires the literal true, so a stray truthy value cannot silence it', () => {
    expect(fires({ message: 'Network Error', config: { quiet: 'yes' } })).toBe(true);
  });
});

describe('the interceptor and the provider agree on one event name', () => {
  it('uses the same literal string on both sides', async () => {
    // A typo on either side fails silently — the interceptor would fire into
    // nothing and the screen would never appear. Read both files and assert
    // they contain the same literal, rather than importing the provider (which
    // pulls in React and Next's runtime for no benefit here).
    const fs = await import('node:fs');
    const path = await import('node:path');
    const root = path.resolve(process.cwd(), 'src');
    const provider = fs.readFileSync(path.join(root, 'context/ServiceStatusContext.jsx'), 'utf8');
    const api = fs.readFileSync(path.join(root, 'lib/api.js'), 'utf8');
    const NAME = 'outmail:service-unavailable';
    expect(provider).toContain(NAME);
    expect(api).toContain(NAME);
  });
});
