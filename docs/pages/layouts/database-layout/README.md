# Database Layout

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Provides the database workbench frame for revision, table, and row routes.

## Context And Entry

- Parent context: project plus branch/revision.
- Used by database, table rows, and row detail pages.
- Sits inside the project shell and reuses the project sidebar.

## Functionality

- Wraps database workbench pages with the project sidebar.
- Shows a read-only banner when the current revision is not the draft revision.
- Provides the nested outlet for database, table, and row content.
- Uses compact spacing suitable for dense table editing.

## Functional Blocks

| Block            | Shows                                         | Visible when                        | UX note                                                |
| ---------------- | --------------------------------------------- | ----------------------------------- | ------------------------------------------------------ |
| Project sidebar  | Project navigation and management links       | Always inside valid project context | Keeps project navigation available while editing data. |
| Read-only banner | Non-draft revision warning and draft shortcut | Current revision is not `draft`     | Explains why editing controls are unavailable.         |
| Workbench outlet | Database, table, or row page                  | Always                              | Child pages own content and actions.                   |

## Primary Actions

| Action               | Trigger                 | Available when                  | Result                                           | Failure/recovery  |
| -------------------- | ----------------------- | ------------------------------- | ------------------------------------------------ | ----------------- |
| Go to draft revision | Read-only banner action | Current revision is not `draft` | Opens draft revision for the same branch context | Route change only |

## Optional Features And Gates

- Editing is effectively draft-only through child page permissions and the read-only revision state.
- The banner is a state cue, not a permission override.

## States

| State                    | UX                                                  |
| ------------------------ | --------------------------------------------------- |
| Draft revision           | Shows workbench content without read-only banner.   |
| Historical/head revision | Shows the read-only banner above workbench content. |

## Transitions

- Banner action opens the draft revision for the same project/branch context.
- Workbench child navigation changes the nested table or row while staying in the same layout.

## Permissions And Configuration

- Depends on loaded project, branch, and revision context.
- Child pages own create/update/delete permission checks for tables and rows.

## Copy And Messages

- Banner: `You are viewing a read-only revision`
- Banner action: `Go to draft revision`

## Open Questions

- Should the banner explain which revision is being viewed when the label is not obvious?
- Should draft navigation preserve the current table/row focus where possible?
