# System Organizations

Route: `/admin/organizations`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Reserved system-admin area for future organization administration.

## Context And Entry

- Parent context: system admin.
- Parent shell: admin layout with admin sidebar.
- Sidebar entry: `Organizations`.
- Current state: placeholder only.

## Functionality

- Shows the admin page layout for organizations.
- Displays a centered placeholder: `Coming soon`.
- Does not currently list, search, create, edit, or inspect organizations.

## Functional Blocks

| Block            | Shows                               | Visible when | UX note                                                          |
| ---------------- | ----------------------------------- | ------------ | ---------------------------------------------------------------- |
| Breadcrumb/title | `Organizations` under admin context | Page loaded  | Establishes the future destination.                              |
| Placeholder      | `Coming soon`                       | Always       | Communicates that the page is intentionally not implemented yet. |

## Primary Actions

| Action               | Trigger   | Available when | Result                      | Failure/recovery                        |
| -------------------- | --------- | -------------- | --------------------------- | --------------------------------------- |
| No page-local action | Page load | Always         | Placeholder remains visible | Use admin sidebar to navigate elsewhere |

## Optional Features And Gates

- No page-local actions or feature gates exist yet.
- Page access still requires system-admin access through the admin route.

## States

| State       | UX                   |
| ----------- | -------------------- |
| Placeholder | Shows `Coming soon`. |

## Transitions

- Sidebar navigation can move to other admin pages.

## Permissions And Configuration

- Requires auth plus system admin permission.

## Copy And Messages

- Breadcrumb/title: `Organizations`
- Placeholder: `Coming soon`

## Open Questions

- What is the first admin organization workflow: search/list, organization detail, owner transfer, billing support, or suspension?
- Should this page stay visible while it is a placeholder, or be hidden until an action exists?
