# Branch Page Layout

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Provides the shared shell for branch/revision-scoped pages that are not the main database editor.

## Context And Entry

- Parent context: project plus branch/revision.
- Used by changes, assets, migrations, table relations, and branch-map style pages.
- Can render an optional branch page title before the child page content.

## Functionality

- Wraps branch-scoped pages with the project sidebar.
- Optionally shows the branch/revision title area.
- Shows a read-only banner when the current revision is not the draft revision.
- Provides the outlet for branch-related child pages.

## Functional Blocks

| Block            | Shows                                         | Visible when                        | UX note                                                          |
| ---------------- | --------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------- |
| Project sidebar  | Project navigation and management links       | Always inside valid project context | Keeps project navigation consistent outside the database editor. |
| Branch title     | Current branch/revision context               | When enabled by the child route     | Helps orient pages such as changes and assets.                   |
| Read-only banner | Non-draft revision warning and draft shortcut | Current revision is not `draft`     | Explains why mutation actions may be hidden.                     |
| Nested outlet    | Current branch child page                     | Always                              | Child pages own their page-specific content.                     |

## Primary Actions

| Action               | Trigger                 | Available when                  | Result                                           | Failure/recovery  |
| -------------------- | ----------------------- | ------------------------------- | ------------------------------------------------ | ----------------- |
| Go to draft revision | Read-only banner action | Current revision is not `draft` | Opens draft revision for the same branch context | Route change only |

## Optional Features And Gates

- Read-only banner depends only on revision state.
- Child pages own permissions for commits, reverts, migrations, asset edits, and other branch actions.

## States

| State                    | UX                                                    |
| ------------------------ | ----------------------------------------------------- |
| Draft revision           | Shows branch child content without read-only warning. |
| Historical/head revision | Shows read-only banner and keeps the page browsable.  |

## Transitions

- Banner action opens the draft revision for the same branch context.
- Child route navigation keeps the branch/revision context and swaps page content.

## Permissions And Configuration

- Requires project, branch, and revision context from the surrounding route.
- Mutation controls remain the responsibility of child pages.

## Copy And Messages

- Banner: `You are viewing a read-only revision`
- Banner action: `Go to draft revision`

## Open Questions

- Should every branch-scoped page show the branch title consistently, or should dense tools keep it hidden?
- Should the draft shortcut preserve the current child page route when jumping from a read-only revision?
