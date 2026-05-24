---
name: admin-self-review
description: >-
  Run pre-handoff admin self-review against source-of-truth docs, architecture,
  UX behavior, and verification checks.
metadata:
  short-description: Self-review for revisium-admin work
---

# Admin Self-Review

Use this before handing off admin work or opening/updating PRs.

## Required Inputs

- Current branch diff against target branch.
- `AGENTS.md`
- `REVIEW.md`
- `README.md`
- `docs/` for UX/route behavior.

## Review Steps

1. Identify changed route pages, UX behavior, and permissions surfaces.
2. Check source-of-truth alignment:
   - route/page behavior changes -> corresponding `docs/pages/...` changes exist;
   - validation/API behavior change -> `docs/page-functionality.md` and related docs updated;
   - review-policy or process changes -> `REVIEW.md` updated if needed.
3. Check generated file discipline:
   - `src/__generated__` is regenerated, not hand-edited.
4. Check verification:

```bash
npm run verify
```

For docs-only or contract-only work, run:

```bash
npm run agent:check
```

## Output

Return a short review summary:

```text
Self-review:
- Docs/source-of-truth:
- Architecture/behavior parity:
- Generated files:
- Verification:
- Risks:
```

Treat docs/code drift as a blocker unless fixed in the same change.
