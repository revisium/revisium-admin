---
name: admin-pr-publish
description: >-
  Publish verified revisium-admin work by creating or reusing a non-master branch,
  committing, pushing, and creating/updating PR.
metadata:
  short-description: Publish verified admin work
---

# Admin PR Publish

Use this when the user asks to publish `revisium-admin` work (branch, commit, push,
or PR update).

## Required Inputs

- Branch intent and allowed prefix (`feat/`, `fix/`, `docs/`, `chore/`, etc.).
- Commit title.
- Target base branch (default `master` unless user requests otherwise).

## Hard constraints

- Do not push from `master`.
- Do not create PRs until required checks pass.
- Do not create a PR without clean verified checks.

## Verification Gate

Run before staging, commit, push, or PR update:

```bash
npm run verify
```

If verification fails, stop and fix before publishing.

## Workflow (short)

1. Confirm base state and publishing context:

   ```bash
   git status --short --branch
   git remote -v
   gh auth status
   ```

2. Fetch fresh base and make sure publishing is not from `master`:

   ```bash
   git fetch origin
   git fetch origin <base-branch>
   ```

3. Ensure branch name is one allowed prefix and not `master`.

4. If currently on `master` with local changes, create a publish branch from
   `origin/<base-branch>` first, then re-check status:

   ```bash
   git switch -c <prefix>/<slug> origin/<base-branch>
   ```

5. Check whether a PR already exists for the current branch:

   ```bash
   gh pr view --json url,state,baseRefName,headRefName
   ```

6. Stage only intended files, then commit with the requested summary:

   ```bash
   git add <intended-files...>
   git diff --cached --check
   git commit -m "<type>: <summary>"
   ```

7. Push:

   ```bash
   git push
   ```

8. Create PR only when one does not exist (or keep updating existing PR) using:

   ```bash
   gh pr create --base <base-branch> --head <prefix>/<slug> --title "<type>: <summary>" --body ""
   ```

9. Return a compact publish note with PR link, checks run, and remaining risk.

## Output

```text
Publish:
- Branch:
- PR:
- Validation:
- Commit:
- Push:
- Remaining risks:
```

If branch naming, verification, or PR preconditions fail, stop and report the
blocking issue before proceeding.
