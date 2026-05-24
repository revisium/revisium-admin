# Table Changes

Route suffix: `-/changes`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Revision change review page focused on table-level changes, with commit and revert controls for touched draft revisions.

## Context And Entry

- Parent context: project plus branch/revision.
- Parent shell: branch page layout with project sidebar.
- Sidebar entry: `Changes`.
- Sibling route: row changes at `-/changes/rows`.

## Functionality

- Loads the revision-level change summary.
- Shows tabs for table changes and row changes, including counts.
- Shows type filters for table-level changes.
- Lists table changes in a virtualized list.
- Opens a detail modal for a selected table change.
- Links from table details to row changes for the selected table.
- Shows commit and revert controls for touched draft revisions when allowed.

## Functional Blocks

| Block              | Shows                                                                             | Visible when                                 | UX note                                             |
| ------------------ | --------------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------- |
| Changes header     | Tabs and optional commit/revert actions                                           | Change summary loaded                        | Keeps table and row changes in one review surface.  |
| Table changes list | Table change items                                                                | Table changes exist                          | Optimized for large change sets.                    |
| Type filter        | Table change type filter                                                          | Change list loaded                           | Empty state changes when filters hide all matches.  |
| Table detail modal | Table link, change type, renamed-from data, row summary, schema migration patches | User opens a table change                    | Provides drilldown without leaving the review page. |
| Commit popover     | Optional comment and `Commit` action                                              | Touched draft and create-revision permission | Saves draft changes as a revision.                  |
| Revert popover     | `Revert all changes?` confirmation                                                | Touched draft and revert permission          | Discards all draft changes.                         |

## Primary Actions

| Action                   | Trigger                       | Available when                                 | Result                                                      | Failure/recovery                                 |
| ------------------------ | ----------------------------- | ---------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------ |
| Switch change tabs       | `Tables` or `Row Changes` tab | Change summary loaded                          | Opens the selected changes view                             | Route/query state drives the active view         |
| Filter table changes     | Type filter control           | Table changes loaded                           | Table change list narrows to selected types                 | Filtered empty state appears when no items match |
| Open table-change detail | Table change item click       | Table change appears in list                   | Detail modal opens with schema and row summary              | Close modal returns to list                      |
| Commit draft changes     | `Commit` popover action       | Draft is touched and user can create revisions | Optional comment is submitted and page reloads after commit | Button loading ends if request fails             |
| Revert draft changes     | `Revert` confirmation action  | Draft is touched and user can revert revisions | Draft changes are discarded and page reloads                | Button loading ends if request fails             |

## Optional Features And Gates

- Commit is shown only for touched draft revisions when the user can create revisions.
- Revert is shown only for touched draft revisions when the user can revert revisions.
- Row-change drilldown is available from a table detail when row changes exist for that table.
- Non-draft revisions can be reviewed but cannot be committed or reverted.

## States

| State              | UX                                                                      |
| ------------------ | ----------------------------------------------------------------------- |
| Loading            | Shows change-summary loading state.                                     |
| Error              | Shows `Error loading changes`.                                          |
| Empty draft        | Shows `No changes in working copy` and guidance to edit tables or rows. |
| Empty non-draft    | Shows `No changes in this revision` and revision-specific empty copy.   |
| List               | Shows tabs, filters, table changes, and optional draft actions.         |
| Filtered empty     | Shows no-match state for current filters.                               |
| Detail modal       | Shows table-change detail and row-change navigation.                    |
| Commit in progress | Commit action shows loading while the revision is being created.        |
| Revert in progress | Revert action shows loading while changes are discarded.                |

## Transitions

- Row Changes tab opens the row changes route.
- Opening a table change opens the detail modal in place.
- `View all row changes` opens the row changes route with the table filter applied.
- Successful commit reloads the page with the new revision context.
- Successful revert marks the draft as untouched and reloads the page.

## Permissions And Configuration

- Requires project, branch, and revision context.
- Draft state and branch `touched` state determine whether commit/revert can appear.
- Commit/revert permissions are separate and should be documented independently in permission matrices.

## Copy And Messages

- Empty draft title: `No changes in working copy`
- Empty draft body: `Make edits to tables or rows to see changes here`
- Empty non-draft title: `No changes in this revision`
- Empty non-draft body: `This revision has no recorded changes`
- Error: `Error loading changes`
- Commit action: `Commit`
- Commit field: `Comment (optional)`
- Revert confirmation: `Revert all changes?`
- Revert action: `Revert`

## Open Questions

- Should commit/revert controls be duplicated in the sidebar and changes page, or should one location become primary?
- Should table detail deep links be reflected in the URL for shareable review context?
