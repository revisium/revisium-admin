# revisium-admin Review Contract

This file is the review entry point for humans and AI agents.

If an enforceable review rule changes, update this file and any affected docs in
the same PR.

## Required Reading

Before review, check:

1. `README.md` for product scope and public behavior
2. `ENV.md` for runtime contract and environment assumptions
3. `src/**/*` for touched implementation paths
4. The matching page docs in `docs/` (create these first if docs migration is in progress)

## Source of Truth

Implementation must match docs for:

- routes and route hierarchy,
- page-level functionality,
- primary/secondary states,
- permissions and gating,
- copy and transition behavior.

Reviewers should block drift in either direction:

- implementation diverges from docs → request either code correction or docs updates,
- docs become stale relative to implementation → request doc updates.

## Priority Blockers

Block a PR when any of these are true:

- route/page behavior changes are not documented or docs were only partially updated,
- auth/public-guest behavior changes are not reflected in docs,
- permissions or feature gates changed without documented and test-visible coverage,
- copy/empty/error/loading states changed without docs and expected behavior updates,
- required checks (`npm run lint`, `npm run ts:check`, `npm run build`) are skipped
  without explicit risk explanation,
- CI or Sonar findings are ignored when they are valid and blocking.

## Expected Author Self-Review

- changed files summary,
- docs sync summary,
- validation command output,
- notes on risks and follow-up when validation is incomplete.

## Review Comment Style

- include file path and line,
- name the violated rule from this file,
- explain user-visible or maintenance risk,
- propose the smallest fix.
