# Working in outmail-frontend

## Before you push

```bash
npm run ci
```

It runs exactly what GitHub CI runs, in the same order: lint, build, tests.
Green here means green there.

A pre-commit hook runs ESLint and Prettier on staged files, so formatting is
never something to argue about in review.

## The conventions, and why they exist

Each of these is here because the alternative already caused a problem.

### Errors

**Never render a server-supplied message.** Backend errors can carry hostnames,
stack frames and query fragments. During a database outage this site displayed
a raw Prisma error including the production database host. Pass copy we wrote;
send the detail to Sentry.

**Never swallow an error.** `catch {}` is banned by lint. If a failure is
genuinely not worth surfacing — a best-effort background refresh, say — log it
through `lib/logger` and write down in a comment why the user does not need to
know.

**`lib/logger`, not `console`.** `console.*` ships to production, leaks
internals into a user's devtools, and is invisible to us because nobody reads a
customer's console. The logger forwards to the console in development and to
Sentry in production. `console.error`/`warn` remain allowed for the rare case
where the logger itself cannot be used.

### Data from the API

**Validate at the boundary.** Responses on the money path are parsed with a zod
schema in `lib/contracts.js`. This site once advertised "$0 free forever" for a
plan the backend charged for, because the assumed shape and the real shape had
drifted with nothing checking. Validation reports to Sentry and returns the raw
data — an out-of-date schema must never take pricing down.

**Never hardcode a price.** Every number on `/pricing` and in the landing
ledger comes from `/api/payments/plans`. Copy that carries numbers is how they
drift.

### Rendering

**Default to server components.** Add `"use client"` at the LEAF that needs
state, not at the page. A client page cannot export `metadata`, which is how
four public pages ended up with no title, description or canonical.

**A constant shared with a server component does not live in a `"use client"`
file.** The server receives a client reference, not the value, and the failure
message ("a.map is not a function") points nowhere near the cause. Put shared
data in `lib/`.

### Auth

**Guards live in `layout.jsx`, not in pages.** A page-level check is one that a
new route silently ships without.

**Middleware is a fast negative check, not the boundary.** The API is the
boundary. Middleware exists so protected UI is never rendered to someone with
no session.

**Role strings come from `lib/roles.js`.** A typo in a `!==` role check fails
open, which is the worst direction for a guard.

### Accessibility

`jsx-a11y` runs as `error`, not `warning`. A label needs `htmlFor` or must wrap
its control; a clickable element is a `button`. These are lint failures, not
review comments.

### Tests

Test the behaviour that costs something when it breaks, and say in the test
name what that is. `it("locks every buy button while a checkout is in flight")`
tells the next reader why the test exists; `it("works")` does not.

`npm test`, never `npx vitest` — the npm script sets flags the config depends
on.

## Branch and release flow

Branch → PR → merge to `main`. Promote `main` → `release` with a **merge
commit**, never squash or rebase (that breaks CI's ancestry gate). Production
deploys only when a `v*.*.*` tag is pushed against `release`.
