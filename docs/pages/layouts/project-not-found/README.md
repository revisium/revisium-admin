# Project Not Found

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Provides a safe fallback when a project route cannot resolve to an accessible project.

## Context And Entry

- Parent context: project shell error state.
- Entry condition: project lookup fails or no project context is available after loading.
- Used instead of rendering project child pages without valid context.

## Functionality

- Shows a centered warning state.
- Tells the user the project was not found.
- Offers a single recovery action back to the home page.

## Functional Blocks

| Block           | Shows                   | Visible when | UX note                                                        |
| --------------- | ----------------------- | ------------ | -------------------------------------------------------------- |
| Warning icon    | Visual not-found marker | Always       | Keeps the state recognizable without adding extra explanation. |
| Message         | `Project not found`     | Always       | Intentionally generic today.                                   |
| Recovery action | `Go to home`            | Always       | Avoids leaving the user stranded on an invalid route.          |

## Primary Actions

| Action     | Trigger             | Available when          | Result                      | Failure/recovery  |
| ---------- | ------------------- | ----------------------- | --------------------------- | ----------------- |
| Go to home | `Go to home` action | Not-found state visible | Opens the main project list | Route change only |

## Optional Features And Gates

- No page-local permission controls.
- The page may represent either a missing project or an inaccessible project; current copy does not distinguish them.

## States

| State     | UX                                            |
| --------- | --------------------------------------------- |
| Not found | Shows warning icon, message, and home action. |

## Transitions

- `Go to home` returns to the main project list.

## Permissions And Configuration

- Triggered after project-context resolution fails.
- Does not expose project metadata.

## Copy And Messages

- Message: `Project not found`
- Action: `Go to home`

## Open Questions

- Should inaccessible projects use distinct copy such as `You do not have access to this project`?
- Should the fallback preserve organization context when the organization is still known?
