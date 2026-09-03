# ADR 0001 — Stay on JavaScript, validate at runtime instead

**Status:** Accepted (2026-09-03)

## Context

The codebase is ~17,000 lines of JavaScript with no type checking. The most
expensive bug in its history — advertising a free plan the backend charged for
— was a shape mismatch between what the API returned and what the page assumed.

## Decision

Remain on JavaScript for now. Instead of static types, validate API responses
at the boundary with zod (`lib/contracts.js`).

## Why

Runtime validation is *stronger* than types for this particular failure. A
TypeScript interface describing an API response is hand-written and can be
wrong; it asserts a shape rather than checking one. Zod checks the actual bytes
that arrived, in production, on real data.

It is *weaker* everywhere else: it cannot catch a mistyped prop, a renamed
function, or a null dereference inside a component.

## Consequences

- Accepted risk: no compile-time safety in components.
- Mitigated by: `jsx-a11y` and `no-unused-vars` as errors, 290 tests, and
  validation on the money path.
- This decision is reversible and cheap to reverse. The zod schemas would
  become the source of the types on day one via `z.infer`.
