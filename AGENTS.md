# AGENTS.md — revisium-admin

Operational notes for AI coding agents working in this repository. The parent
`/Users/anton/projects/revisium/AGENTS.md` applies.

## Ground Rules

- **Docs first.** For route, page, and UX behavior changes, update or create the
  matching documentation in this repository first (or in the same PR) before code
  changes.
  - For admin behavior, this means `revisium-admin/docs/...` after the UX migration.
  - If a target doc file does not exist yet, create it in the same PR as the change.
- **Do not contradict local UX docs.** If behavior, navigation, states, permissions,
  or copy changes, the docs must be updated to match implementation in the same
  change.
- **Keep scope local.** This repo is for admin implementation and admin UX
  source-of-truth after migration; avoid shifting implementation-specific details
  into cross-repo UX design repos.
- **Use existing branch and PR hygiene.**
  - Do not commit directly to `master`.
  - Start branches from the requested base branch (default `origin/master` unless you
    are explicitly continuing existing work).
  - Do not push or create a PR unless the user explicitly asks.
  - Stage only files that belong to the requested change.
- **Do not revert unrelated user changes.** If files outside your task are dirty,
  leave them alone.

## Verification

Run the following before handoff (or before any PR update):

- `npm run verify`

For docs/agent-contract-only updates:

- `npm run agent:check`

For user-visible flow changes, run the relevant checks as appropriate:

- `npm run test:e2e`

If a required check is skipped, explain the reason and the concrete risk.

- **Use repo-local agent workflows and constraints.**
  - Reuse local rules from `.agents/rules/*.mdc` while implementing.
  - Before handoff or PR work, run the repo-local verification skill from
    `.agents/skills/admin-general-checks/SKILL.md`.

## PR Quality

- A PR is incomplete if route/page behavior, copy, navigation, permissions, or
  validation changes are not documented in `revisium-admin/docs/`.
- Keep implementation and docs changes in one PR when they share the same behavior
  surface.
- If Sonar/CI checks are red, address the blocking issue before merging.

## Repo tooling

- `npm run skills:lint` validates all local `SKILL.md` files and should be part of
  verification before handoff or PR updates.
