# Admin Dashboard

Route: `/admin`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

System-admin landing page for high-level operational totals and navigation into admin tools.

## Context And Entry

- Parent context: system admin.
- Parent shell: admin layout with admin sidebar.
- Sidebar entry: `Dashboard`.
- Admin routes require authenticated system-admin access.

## Functionality

- Shows system-level stat cards.
- Loads and displays total users.
- Shows a total projects card that currently renders an empty value placeholder.
- Uses the admin breadcrumb/title area for orientation.

## Functional Blocks

| Block               | Shows                                                           | Visible when            | UX note                                                         |
| ------------------- | --------------------------------------------------------------- | ----------------------- | --------------------------------------------------------------- |
| Admin shell         | Sidebar with `Dashboard`, `Users`, `Organizations`, and `Cache` | Admin access granted    | Provides navigation across system-admin tools.                  |
| Breadcrumb/title    | `Admin` context                                                 | Page loaded             | Confirms system-admin mode.                                     |
| Total Users card    | User count with loading state                                   | Stats loading or loaded | Currently backed by user search total.                          |
| Total Projects card | `-` placeholder                                                 | Page loaded             | Present visually, but project count is not currently populated. |

## Primary Actions

| Action                  | Trigger            | Available when       | Result                           | Failure/recovery                                |
| ----------------------- | ------------------ | -------------------- | -------------------------------- | ----------------------------------------------- |
| Inspect system totals   | Page load          | Admin access granted | Stat cards show available totals | Loading state remains until user total resolves |
| Navigate admin sections | Admin sidebar item | Admin shell visible  | Opens selected admin section     | Route change only                               |

## Optional Features And Gates

- Page access requires authentication and system-admin permission.
- User count loading state is independent from the placeholder project count.

## States

| State              | UX                                                                        |
| ------------------ | ------------------------------------------------------------------------- |
| Loading user total | User count card shows loading.                                            |
| Loaded             | Shows total users and project placeholder.                                |
| Admin denied       | User should be blocked by the admin route guard before reaching the page. |

## Transitions

- Sidebar navigation opens users, organizations, or cache admin pages.

## Permissions And Configuration

- Requires auth plus system-admin permission.
- The current projects metric is not populated and should be treated as a known product gap.

## Copy And Messages

- Breadcrumb/title: `Admin`
- Stat card: `Total Users`
- Stat card: `Total Projects`
- Project placeholder: `-`

## Open Questions

- Should the dashboard hide incomplete metrics until the data source exists?
- Which operational totals should be first-class for admins beyond users and projects?
