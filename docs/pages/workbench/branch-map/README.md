# Branch Map

Route suffix: `-/branch-map`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Project-level graph for understanding branch, revision, collapsed-history, and endpoint topology.

## Context And Entry

- Parent context: project.
- Parent shell: branch page layout with project sidebar.
- Sidebar entry: `Branch Map`.
- Related pages: `Branches`, `Endpoints`, and revision/database pages.

## Functionality

- Shows the project branch graph/map.
- Displays branch, revision, collapsed-history, and endpoint nodes.
- Shows branch and endpoint counts in the header.
- Provides an info hovercard for graph interpretation and interactions.
- Supports pan, zoom, drag, hover highlighting, click selection, and fullscreen viewing.
- Lets branch/revision nodes open their related revision context.
- Lets endpoint nodes open the project endpoints page.

## Functional Blocks

| Block              | Shows                                                                                 | Visible when      | UX note                                           |
| ------------------ | ------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------- |
| Header             | `Branch Map for {projectName} ({branchesCount} branches, {endpointsCount} endpoints)` | Page loaded       | Counts summarize the project topology.            |
| Info hovercard     | Graph explanation and interaction hints                                               | User opens help   | Helps users understand node types and navigation. |
| Project graph      | Branch, revision, collapsed, and endpoint nodes                                       | Graph data loaded | Primary topology visualization.                   |
| Fullscreen control | Fullscreen graph mode                                                                 | Graph visible     | Supports larger branch histories.                 |
| Empty state        | `No branches found`                                                                   | No branches exist | Keeps the page clear for empty projects.          |

## Primary Actions

| Action                    | Trigger                       | Available when          | Result                                                        | Failure/recovery                                      |
| ------------------------- | ----------------------------- | ----------------------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| Inspect branch topology   | Page load                     | Branch-map data loads   | Graph renders branch, revision, collapsed, and endpoint nodes | Error or empty state appears when data is unavailable |
| Pan, zoom, and drag graph | Mouse/touch graph interaction | Graph visible           | Viewport changes for graph inspection                         | Local interaction only                                |
| Highlight graph paths     | Hover or click node           | Graph visible           | Related paths are emphasized and unrelated items dim          | Click graph background to clear                       |
| Open branch or revision   | Branch/revision node click    | Node has a route target | Opens related revision/database route                         | Route change only                                     |
| Open endpoints            | Endpoint node click           | Endpoint node exists    | Opens project `Endpoints` page                                | Route change only                                     |
| Enter fullscreen          | Fullscreen control            | Graph visible           | Graph expands to fullscreen mode                              | Exit fullscreen returns to page                       |

## Optional Features And Gates

- The graph includes endpoint nodes when project endpoints exist.
- Branch and revision navigation depends on each node having a valid target route.
- The page is read-only; creation and deletion stay in `Branches` and `Endpoints`.

## States

| State       | UX                                                                   |
| ----------- | -------------------------------------------------------------------- |
| Loading     | Shows branch-map loading state.                                      |
| Error       | Shows `Failed to load project graph`.                                |
| Empty       | Shows `No branches found`.                                           |
| Graph       | Shows project topology with interaction controls.                    |
| Highlighted | Related graph paths are emphasized while unrelated items are dimmed. |

## Transitions

- Clicking a branch or revision node opens the related revision/database route.
- Clicking an endpoint node opens the `Endpoints` page.
- Clicking the graph background clears active selection.
- Fullscreen action expands graph inspection and can be exited back to the page.

## Permissions And Configuration

- Requires project context and branch-map graph data.
- Inherits the surrounding project/branch shell but does not mutate project data.

## Copy And Messages

- Header pattern: `Branch Map for {projectName} ({branchesCount} branches, {endpointsCount} endpoints)`
- Help title: `About Branch Map`
- Empty: `No branches found`
- Error: `Failed to load project graph`

## Open Questions

- Should branch-map links preserve the currently selected revision tag or always open canonical node routes?
- Should collapsed-history nodes expose a detail popover for hidden revisions?
