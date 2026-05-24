# Repo-Local Agent Workflows

This directory contains agent-facing workflows and rules for `revisium-admin`.
They enforce the same contract as [../AGENTS.md](../AGENTS.md), [../REVIEW.md](../REVIEW.md),
and the admin `README`/`ENV` docs.

They are not a separate architecture source of truth. When implementation behavior,
UX, architecture, or review policy changes, update canonical docs and root
contracts first.

## Skills

- [`admin-general-checks`](./skills/admin-general-checks/SKILL.md)
  - baseline verification workflow before handoff and implementation handoff.
- [`admin-self-review`](./skills/admin-self-review/SKILL.md)
  - pre-handoff checks against docs and source-of-truth.
- [`admin-pr-review-iteration`](./skills/admin-pr-review-iteration/SKILL.md)
  - GitHub review-thread and failed-check iteration workflow.
- [`admin-pr-publish`](./skills/admin-pr-publish/SKILL.md)
  - verified branch, commit, push, and PR creation workflow.

Every `SKILL.md` in this directory must include YAML frontmatter with `name`
and `description`.

`npm run verify` includes `npm run skills:lint`, so skill format regressions are
part of the local verification gate.

## Rules

Rules under [rules/](./rules/) are short reusable constraints for agents and
reviewers. If behavior in a rule changes, update the corresponding canonical
contract in `AGENTS.md`, `REVIEW.md`, or implementation docs in the same PR.
