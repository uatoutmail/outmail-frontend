# ADR 0002 — JWTs remain in localStorage

**Status:** Accepted with known risk (2026-09-03)

## Context

The session token is stored in `localStorage` and attached by an axios
interceptor. `localStorage` is readable by any JavaScript running on the page,
so a single XSS makes session theft trivial. The standard mitigation is an
httpOnly cookie, which JavaScript cannot read.

## Decision

Keep `localStorage` for now. Revisit before we hold anything more sensitive
than outreach history.

## Why

The change is not frontend-only: it requires the backend to set and validate
cookies, CORS credentials handling, and CSRF protection — which an httpOnly
cookie *introduces* and a bearer token does not have. That is a coordinated
change across two repositories, and doing it badly is worse than not doing it.

## What reduces the risk today

- A strict CSP is already set in `next.config.mjs`.
- The OAuth token is stripped from the URL immediately via `replaceState`, so
  it never reaches browser history or a `Referer` header.
- A rejected token now signs the user out immediately rather than failing
  silently, shortening the window a stale token stays in storage.
- There is no user-generated HTML rendered anywhere on the site; the five
  `dangerouslySetInnerHTML` uses are all JSON-LD built from our own data.

## Consequences

Accepted: an XSS on any page is a session compromise. This is written down so
it reads as a decision with a reason, not an oversight.
