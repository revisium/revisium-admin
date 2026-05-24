# Row Changes

Route suffix: `-/changes/rows`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Revision change review page focused on row-level changes, including table filtering, search, type filtering, and field-level detail review.

## Context And Entry

- Parent context: project plus branch/revision.
- Parent shell: branch page layout through the shared changes shell.
- Entry path: `Row Changes` tab from the table changes page or row-change drilldown.
- Query parameter: `table` stores the selected table filter.

## Functionality

- Shows row-level changes for the active revision.
- Supports debounced text search.
- Supports table filtering and keeps the selected table in the URL query.
- Supports row-change type filtering.
- Lists row changes in a virtualized list.
- Opens row-change detail in a modal.
- Inherits commit and revert controls from the shared changes shell.

## Functional Blocks

| Block            | Shows                                         | Visible when                | UX note                                                   |
| ---------------- | --------------------------------------------- | --------------------------- | --------------------------------------------------------- |
| Search           | Text input for row-change search              | Row changes loaded          | Search is debounced to avoid noisy reloads.               |
| Table filter     | Table selection filter                        | Tables available for filter | Selected table is reflected in `table` query parameter.   |
| Type filter      | Row change type filter                        | Row changes loaded          | Helps separate created, updated, deleted, and moved data. |
| Row changes list | Row change items                              | Row changes exist           | Supports large change sets through virtualized rendering. |
| Row detail modal | Table/row links, change type, and field diffs | User opens a row change     | Shows added, removed, moved, and edited values.           |

## Primary Actions

| Action                 | Trigger                                         | Available when                     | Result                                               | Failure/recovery                                     |
| ---------------------- | ----------------------------------------------- | ---------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| Filter row changes     | Type filter control                             | Row changes loaded                 | List narrows to matching change types                | No-match state appears when filters exclude all rows |
| Filter by table        | Table filter control or `table` query parameter | Tables are available for filtering | List narrows to selected table and URL query updates | Clear table filter to return to all rows             |
| Search row changes     | Search input                                    | Row changes loaded                 | Debounced search narrows the list                    | No-match state appears when nothing matches          |
| Open row-change detail | Row change item click                           | Row change appears in list         | Detail modal opens with field-level diffs            | Close modal returns to list                          |

## Optional Features And Gates

- Commit/revert actions follow the same draft, touched, and permission gates as the table changes page.
- Table filter can be opened directly through `table` query navigation.
- Non-draft revisions remain review-only.

## States

| State          | UX                                                            |
| -------------- | ------------------------------------------------------------- |
| Loading        | Shows row-change loading state.                               |
| No row changes | Shows an empty row-change list.                               |
| No matches     | Shows an empty state when search or filters exclude all rows. |
| List           | Shows row changes with filters.                               |
| Detail modal   | Shows field-level row change detail.                          |

## Transitions

- Table Changes tab returns to the table changes route.
- Selecting a table updates the `table` query parameter.
- Opening a row change opens the detail modal in place.
- Row and table links inside the detail modal navigate to the related database context.

## Permissions And Configuration

- Requires project, branch, and revision context.
- Commit/revert behavior is inherited from the shared changes shell.
- Query-backed table filtering should be preserved when users copy or refresh the URL.

## Copy And Messages

- Inherited empty draft title: `No changes in working copy`
- Inherited empty non-draft title: `No changes in this revision`
- Error inherited from changes shell: `Error loading changes`

## Open Questions

- Should row-change search also search field names and changed values, or only row metadata?
- Should the row detail modal expose a permalink for review handoff?
