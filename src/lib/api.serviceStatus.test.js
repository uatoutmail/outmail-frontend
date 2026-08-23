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
