---
name: admin-general-checks
description: >-
  Run core admin validation checks before handoff, PR updates, or review-thread
  responses, and report concrete command output and risks.
metadata:
  short-description: Run core verification commands
---

# revisium-admin General Checks Skill

Use this skill before handoff, before opening a PR, and after implementing
requested fixes.

## Preflight

1. Confirm clean context:

   ```bash
   git status --short --branch
   git diff --check
   ```

2. Confirm the target area:

   - docs-only changes,
   - route/page/behavior changes,
   - permissions/UX copies,
   - or validation/code changes.

3. Read local contract files:
   - `AGENTS.md`
   - `REVIEW.md`
   - `README.md`
   - `ENV.md`

## Required Commands

For docs-only changes:

```bash
git diff --check
npm run agent:check
```

For implementation or behavior changes:

```bash
npm run verify
```

For package-scoped validation run:

```bash
npm run verify
```

For user-visible flow changes, add:

```bash
npm run test:e2e
```

## Output

Return a compact result:

- branch/worktree:
- changed areas:
- commands run:
- command outputs:
- risks:

If a required command could not run, state why and the exact residual risk.
