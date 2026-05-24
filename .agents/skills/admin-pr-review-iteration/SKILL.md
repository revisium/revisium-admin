---
name: admin-pr-review-iteration
description: >-
  Iterate on revisium-admin PR review threads and failed checks using required
  thread and check inspection before replying or resolving.
metadata:
  short-description: Address admin review threads
---

# Admin PR Review Iteration

Use this for GitHub review-thread fixes, failed checks, or Sonar/CI follow-ups in
`revisium-admin`.

## Workflow

1. Fetch unresolved review threads for the PR and check thread visibility.

   ```bash
   gh pr view --json number,title,url,reviewDecision,headRefName,baseRefName
   gh api graphql -f query='
   query($owner: String!, $name: String!, $number: Int!) {
     repository(owner: $owner, name: $name) {
       pullRequest(number: $number) {
         reviewThreads(first: 100) {
           nodes {
             isResolved
             comments(first: 100) { nodes { body author { login } } }
           }
         }
       }
     }
   }' -F owner=<owner> -F name=<repo> -F number=<pr-number>
   ```

2. Fetch required PR checks:

```bash
gh pr checks --json name,bucket,state,workflow,link,description
```

3. Triage unresolved threads:
   - valid and actionable;
   - already fixed;
   - needs clarification;

For actionable threads, map each one to:

- exact doc/code location changed,
- minimal fix,
- validation command/results.

4. For required failed checks, inspect the failing job output first and fix
   minimal behavior/docs drift:

```bash
gh run list --json databaseId,name,status,conclusion,headSha -L 5
gh run view <run-id> --json jobs,checks
```

5. Make the smallest fix in docs + implementation together when behavior or UX
   changed.

6. Run verification:

```bash
npm run verify
```

For docs-only follow-up, run:

```bash
npm run agent:check
```

7. Re-run checks and PR check state after fixes:

```bash
gh pr checks --json name,bucket,state,workflow,link
```

Resolve a thread only after:

- the fix is committed/pushed,
- validation passed,
- thread context is addressed in code/docs.

## Output

```text
Review iteration:
- Branch/PR:
- Threads handled:
- Fixes:
- Commands:
- Check status:
- Risks:
```

Do not reply "fixed" without naming the specific files changed and verification
that covers the change.
