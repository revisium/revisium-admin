# Project Layout

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Provides the shared project shell, project context loading, and sidebar frame for every project-scoped page.

## Context And Entry

- Parent context: organization plus project route parameters.
- Used by project management pages, branch/revision pages, and workbench pages.
- The shell owns project lookup before child pages render.
- Public projects may be loaded before the layout decides whether the selected project is available.

## Functionality

- Loads and stores the current project context.
- Wraps project-scoped pages with the project sidebar.
- Delays the loading skeleton briefly so fast project loads do not flash.
- Shows a project-not-found fallback when the project cannot be loaded.
- Provides the outlet where nested project pages render.

## Functional Blocks

| Block            | Shows                                                             | Visible when                                    | UX note                                                  |
| ---------------- | ----------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------- |
| Project sidebar  | Project identity, branch/revision navigation, management links    | Project context loaded                          | Sidebar links are permission and authentication aware.   |
| Loading skeleton | Sidebar-shaped loading state with route-derived project/org names | Loading exceeds the short delay                 | Keeps layout stable while project data loads.            |
| Error fallback   | Project not found page                                            | Project lookup fails or no project is available | Gives users a way back to the home page.                 |
| Nested outlet    | Current project child page                                        | Project context loaded                          | Child pages should not duplicate shell responsibilities. |

## Primary Actions

| Action                    | Trigger                                 | Available when                              | Result                         | Failure/recovery  |
| ------------------------- | --------------------------------------- | ------------------------------------------- | ------------------------------ | ----------------- |
| Navigate project sections | Project sidebar item                    | Project context loaded and item gate passes | Opens selected project section | Route change only |
| Return home from fallback | `Go to home` on project-not-found state | Project load fails                          | Opens the main project list    | Route change only |

## Optional Features And Gates

- Management links in the sidebar are gated by project permissions.
- MCP navigation is available only for authenticated users.
- Project users, API keys, and settings entries depend on their own permission checks.

## States

| State           | UX                                                     |
| --------------- | ------------------------------------------------------ |
| Fast loading    | Renders no interim UI before project context resolves. |
| Delayed loading | Shows a project sidebar skeleton.                      |
| Loaded          | Shows sidebar plus nested page content.                |
| Missing project | Shows `Project not found` with a home action.          |

## Transitions

- Successful project load enters the selected nested route.
- Failed project load transfers to the project-not-found fallback.
- Sidebar navigation keeps the same project context and changes only the nested page.

## Permissions And Configuration

- Requires a valid organization/project route pair.
- Authenticated users and public-project visitors can reach the loader; child page behavior still depends on project access and permissions.
- Sidebar entries inherit permission decisions from project and system ability checks.

## Copy And Messages

- Not-found fallback: `Project not found`
- Not-found action: `Go to home`

## Open Questions

- Should project load failures distinguish permission denial from a missing project?
- Should the delayed skeleton threshold be documented as a design token for all async shells?
