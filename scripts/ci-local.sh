#!/usr/bin/env bash
#
# Runs everything the GitHub CI runs, locally, in the same order.
#
#   npm run ci
#
# WHY: CI has three blocking jobs here — lint, build and test. Running only
# `npm test` and calling the branch green is how three lint errors reached main
# and sat red for a day. The lint job is not optional and this script does not
# let you forget it.
#
# NOTE `npm test`, never `npx vitest`. The npm script sets
# --localstorage-file; without it jsdom silently omits localStorage and ten
# unrelated tests fail for a reason that has nothing to do with your change.
#
set -euo pipefail

step() { printf '\n\033[1;36m==> %s\033[0m\n' "$1"; }

step "1/3  lint (blocking in CI)"
npm run lint

step "2/3  build"
NODE_ENV=production NEXT_PUBLIC_API_BASE_URL=https://ci-placeholder.example.com npm run build

step "3/3  unit + component tests (blocking in CI)"
npm test

printf '\n\033[1;32mAll CI checks passed locally. Safe to push.\033[0m\n'
