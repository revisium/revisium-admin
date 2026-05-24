# Table Relations

Route suffix: `-/relations`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Graph view for understanding table relationships in the current revision through foreign-key references.

## Context And Entry

- Parent context: project plus branch/revision.
- Parent shell: branch page layout with project sidebar.
- Sidebar entry: `Table Relations`.
- Data source: table schemas and foreign-key references in the selected revision.

## Functionality

- Shows table relationships for the current revision.
- Displays a graph of table nodes and foreign-key edges.
- Shows counts for tables and relations in the header.
- Provides an info hovercard explaining relation behavior and known limitations.
- Supports pan, zoom, hover highlighting, click selection, and fullscreen viewing.
- Shows an empty state when the revision has no tables.

## Functional Blocks

| Block              | Shows                                                                                 | Visible when    | UX note                                                              |
| ------------------ | ------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------- |
| Header             | `Table Relations for {branchName} ({tablesCount} tables, {relationsCount} relations)` | Page loaded     | Counts summarize graph density.                                      |
| Info hovercard     | Explanation of foreign-key relationships and limitations                              | User opens help | Calls out unsupported self-references and empty optional references. |
| Relations graph    | Table nodes and relation edges                                                        | Tables exist    | Hover/click highlight related nodes and edges.                       |
| Fullscreen control | Fullscreen graph mode                                                                 | Graph visible   | Helps inspect larger schemas.                                        |
| Empty state        | `No tables found in this revision`                                                    | No tables exist | Keeps graph page meaningful for new revisions.                       |

## Primary Actions

| Action                      | Trigger                     | Available when                          | Result                                                         | Failure/recovery                                      |
| --------------------------- | --------------------------- | --------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------- |
| Inspect table relationships | Page load                   | Tables exist in the revision            | Graph renders table nodes and relation edges                   | Error or empty state appears when data is unavailable |
| Pan and zoom graph          | Drag or scroll on the graph | Graph is visible                        | Viewport changes to inspect different graph areas              | Local interaction only                                |
| Highlight related tables    | Hover or click a node/edge  | Graph is visible                        | Related nodes and edges are emphasized; unrelated elements dim | Click the graph background to clear                   |
| Clear selection             | Click graph background      | A graph item is highlighted or selected | Graph returns to default emphasis                              | Local interaction only                                |
| Enter fullscreen            | Fullscreen control          | Graph is visible                        | Graph expands to fullscreen mode                               | Exit fullscreen returns to the page                   |

## Optional Features And Gates

- The page is read-only; it does not expose schema mutation actions.
- Graph behavior depends on available table schema and foreign-key metadata.
- Self-references and empty optional references are documented as unsupported in the help copy.

## States

| State       | UX                                                                                |
| ----------- | --------------------------------------------------------------------------------- |
| Loading     | Shows relation loading state.                                                     |
| Error       | Shows relation load failure state.                                                |
| Empty       | Shows `No tables found in this revision`.                                         |
| Graph       | Shows table/relation graph with interaction controls.                             |
| Highlighted | Related nodes and edges are emphasized while unrelated graph elements are dimmed. |

## Transitions

- Hovering or selecting a table highlights related graph paths.
- Clicking the graph background clears the active selection.
- Fullscreen action expands graph inspection and can be exited back to the page.

## Permissions And Configuration

- Requires project, branch, and revision context.
- Inherits read-only banner behavior from the branch page layout, but the page itself is already inspection-only.

## Copy And Messages

- Header pattern: `Table Relations for {branchName} ({tablesCount} tables, {relationsCount} relations)`
- Help title: `About Table Relations`
- Empty: `No tables found in this revision`

## Open Questions

- Should clicking a table node navigate to the table rows or schema editor?
- Should unsupported relation cases be visually flagged in the graph instead of only explained in help?
