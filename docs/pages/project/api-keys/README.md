# Project API Keys

Route: `/app/:organizationId/:projectName/-/api-keys`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Shows organization service keys filtered to the current project and lets permitted users create/manage project-scoped keys.

## Context And Entry

- Parent context: project.
- Parent shell: project sidebar under `Management`.
- Sidebar entry: `API Keys`, shown when the user can manage project API keys.
- Related route: organization API keys at `/app/:organizationId/-/settings`.

## Functionality

- Manages service API keys scoped to the current project.
- Filters organization service keys by the current project.
- Creates service keys pre-scoped to the current project.
- Reveals generated secrets once after create/rotate.
- Supports rotate/revoke confirmations for active keys.
- Links to organization-level API key management.

## Functional Blocks

| Block                               | Shows                                                      | Visible when                         | UX note                                                                                         |
| ----------------------------------- | ---------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Header                              | `API Keys` and project service-key description             | Always                               | Frames keys as project automation credentials                                                   |
| Project key list                    | Key count, rows, status, permissions, project scope, dates | User can manage project service keys | List is filtered to current project                                                             |
| Permission-limited state            | No-key message and organization-admin link                 | User cannot manage project keys      | Current copy says no keys scoped to this project even though this is a permission-limited state |
| Organization link                   | `Manage all organization keys`                             | User can manage project keys         | Gives escape hatch to org-level key view                                                        |
| Create/secret/rotate/revoke dialogs | Same service-key key management flow as organization keys  | User opens corresponding action      | Secret is shown once                                                                            |

## Primary Actions

| Action                    | Trigger                                 | Available when                                | Result                                                  | Failure/recovery                |
| ------------------------- | --------------------------------------- | --------------------------------------------- | ------------------------------------------------------- | ------------------------------- |
| Create project-scoped key | `Create key` or `Create your first key` | User can manage service keys for this project | Create dialog opens with current project scope          | Cancel closes dialog            |
| Submit key                | `Create key` in dialog                  | Name is non-empty and no mutation is running  | Key is created, list reloads, secret dialog opens       | Dialog remains if request fails |
| Rotate key                | Rotate action on active key             | Key is active and user can manage             | New secret generated, list reloads, secret dialog opens | Cancel closes confirmation      |
| Revoke key                | Revoke action on active key             | Key is active and user can manage             | Key revoked and list reloads                            | Cancel closes confirmation      |
| Open organization keys    | Organization key link                   | Link visible                                  | Navigates to org API keys                               | Route change                    |

## Optional Features And Gates

| Feature                  | Gate                                                                          | Visible/active when             | Hidden/disabled when | Result                               |
| ------------------------ | ----------------------------------------------------------------------------- | ------------------------------- | -------------------- | ------------------------------------ |
| Sidebar entry            | Project API-key manage permission                                             | Permission granted              | Permission absent    | `API Keys` appears in management nav |
| Key manager              | Project or organization API-key manage permission for current project context | Permission granted              | Permission absent    | Key list and actions appear          |
| Permission-limited state | Permission absent                                                             | User cannot manage project keys | Permission granted   | Explanatory state and org-admin link |
| Project scoping          | Current project id exists                                                     | Creating key from this page     | Project id missing   | New service key is scoped to project |
| Active-key actions       | Key status is active                                                          | Active keys listed              | Expired/revoked keys | Rotate/revoke actions appear         |

## States

| State              | Trigger/source            | UI behavior                         | User path forward          |
| ------------------ | ------------------------- | ----------------------------------- | -------------------------- |
| Loading            | Key request in flight     | Centered spinner                    | Wait                       |
| Error              | Key request fails         | Error box with message              | Refresh or retry later     |
| Empty              | No keys scoped to project | Empty key state with create action  | Create first key           |
| List               | Keys returned             | Sorted key rows                     | Create, rotate, revoke     |
| Permission limited | User cannot manage keys   | Message and organization-admin link | Contact org admin          |
| Secret revealed    | Create or rotate succeeds | Secret dialog                       | Copy secret before closing |

## Transitions

| From          | Trigger                   | Condition          | To                              | Feedback              |
| ------------- | ------------------------- | ------------------ | ------------------------------- | --------------------- |
| List/empty    | Create clicked            | Permission granted | Create dialog                   | Form reset            |
| Create dialog | Create succeeds           | Valid input        | Secret dialog and reloaded list | Secret shown once     |
| List          | Rotate confirmed          | Active key         | Secret dialog and reloaded list | New secret shown once |
| List          | Revoke confirmed          | Active key         | Reloaded list                   | Key status changes    |
| Project keys  | Organization link clicked | Always             | Organization API keys           | Route change          |

## Permissions And Configuration

- Sidebar item is shown when the user can manage API keys.
- When the user cannot manage project keys, the page shows an explanation and link to organization settings.

## Copy And Messages

- Header: `API Keys`.
- Description: `Service keys scoped to this project for automated integrations.`
- Permission-limited message: `No API keys scoped to this project.` (current UI copy; ambiguous for a permission-limited state).
- Link: `Contact an organization admin to manage API keys`.
- Organization link: `Manage all organization keys`.

## Open Questions

- Should the permission-limited message say "You do not have permission" instead of "No API keys scoped" to avoid implying there are no keys?
