# Working in this repo

## Before you push: `npm run ci`

It runs **exactly** what GitHub CI runs, in the same order, with the same
environment. If it is green, CI is green. If it is red, CI will be red.

This exists because it has already gone wrong. Running a subset of the checks
and assuming the rest were fine put a red pipeline on `main` for a day and,
worse, took production's payments endpoint down.

## Traps that have actually caught people here

**`npm test` is not the whole suite.** CI also runs lint (frontend) and a
blocking integration suite against real Postgres (backend). `npm run ci` covers
all of them.

**Use `npm test`, never `npx vitest`.** The npm script sets flags the config
depends on — `--localstorage-file` in the frontend, an integration exclude in
the backend. Running vitest directly produces failures that have nothing to do
with your change, and they are easy to misread as pre-existing.

**Never trust `.env` for tests.** This repo's local `.env` points `DATABASE_URL`
at a real database. The integration suite TRUNCATEs tables and refuses to run
against a non-throwaway host, which is a safety feature — not a reason to skip
it. `npm run ci` provisions its own database.

**A schema change needs a MIGRATION, not just `db push`.** `db push` updates
your local database and writes nothing. CI builds from `prisma migrate deploy`
and so does any fresh environment, so a db-pushed column exists nowhere but your
machine. This is precisely how production broke: three columns were pushed
locally, never migrated, and the deployed code queried columns that did not
exist. `npm run ci` catches it, because it rebuilds from migrations every run.

## Branch and release flow

Branch → PR → merge to `main`. Promote `main` → `release` with a **merge
commit**, never squash or rebase (that breaks the ancestry gate in CI).
Production deploys only when a `v*.*.*` tag is pushed against `release`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
