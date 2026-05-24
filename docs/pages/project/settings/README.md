# Project Settings

Route: `/app/:organizationId/:projectName/-/settings`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Central project administration page for visibility, project-scoped service access, file-usage accounting, and project deletion.

## Context And Entry

- Parent context: project.
- Parent shell: project sidebar under `Management`.
- Sidebar entry: `Settings`, shown when the user can update or delete the project.
- Related pages: `Endpoints` for public/private API behavior and `API Keys` for dedicated project key management.

## Functionality

- Shows the current project name.
- Manages project visibility between private and public.
- Explains how visibility affects UI and API access.
- Shows project-scoped service API keys and links to organization-level key management.
- Shows file-usage validation and restore controls when permitted.
- Shows destructive project deletion behind explicit confirmation.

## Functional Blocks

| Block             | Shows                                                      | Visible when                            | UX note                                                                                      |
| ----------------- | ---------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------- |
| Project summary   | `Project Name`                                             | Always                                  | Read-only identity block for the current project.                                            |
| Visibility        | `Private` and `Public` choice cards                        | Always                                  | Controls are disabled unless the user can update the project.                                |
| API behavior note | Public/private API explanation and `Manage endpoints` link | Always                                  | Public projects allow unauthenticated UI and API reads; writes still require authentication. |
| Project API Keys  | Project-scoped service key list or permission fallback     | Always                                  | Direct management is shown only to users who can manage service keys.                        |
| File Usage        | Current, expected, drift, blob, and reference counters     | Users who can manage project file usage | Supports validation and accounting restore.                                                  |
| Danger Zone       | Delete project action and confirmation dialog              | Users who can delete the project        | Requires typing the exact project name.                                                      |

## Primary Actions

| Action                           | Trigger                                     | Available when                                        | Result                                                 | Failure/recovery                                              |
| -------------------------------- | ------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------- |
| Switch project visibility        | Private/public choice card                  | User can update the project                           | Project visibility is saved                            | Control stays available for retry if save fails               |
| Open project endpoint management | `Manage endpoints` link                     | Settings page loaded                                  | Opens project `Endpoints` page                         | Route change only                                             |
| Manage project-scoped keys       | Create, rotate, or revoke key actions       | User can manage project service keys                  | Key list reloads and secret dialog appears when needed | Dialog remains or confirmation closes based on request result |
| Validate project file usage      | Refresh/validate action in File Usage       | User can manage file usage                            | File usage metrics refresh                             | Existing metrics remain visible on failure                    |
| Restore file byte accounting     | `Restore File Bytes` confirmation           | File usage panel is visible and drift can be restored | Accounting is restored and metrics refresh             | Confirmation can be cancelled or retried                      |
| Delete project                   | Delete confirmation with exact project name | User can delete the project and typed name matches    | Project is deleted and user returns to main page       | Confirmation stays blocked until name matches                 |

## Optional Features And Gates

- Visibility switching requires project update permission.
- Service key management requires project API-key management permission.
- File usage controls require file-usage management permission.
- Project deletion requires project delete permission.
- The Settings sidebar item itself is available only when update or delete access exists.

## States

| State               | UX                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| Normal              | Shows project summary, visibility, API-key area, and any permission-gated panels.                 |
| Visibility updating | Selected visibility control reflects the requested change after save completes.                   |
| API-key restricted  | Shows `You don't have permission to manage API keys for this project.` plus a contact-admin path. |
| File usage loading  | File-usage metrics are pending while validation data loads.                                       |
| File usage drift    | Restore action becomes meaningful when tracked bytes differ from expected bytes.                  |
| Restore preview     | Confirmation dialog shows before file byte accounting is restored.                                |
| Delete confirmation | Dialog requires exact project name input before the destructive action is enabled.                |
| Deleted             | Navigates away from the deleted project.                                                          |

## Transitions

- Switching visibility persists the selected access mode on the current project.
- `Manage endpoints` opens the project `Endpoints` page.
- `Manage all organization keys` opens organization-level API-key management.
- `Restore File Bytes` opens a preview confirmation before applying the restore.
- Confirming deletion removes the project and returns the user to the main project list.

## Permissions And Configuration

- Public project visibility changes read access semantics for UI and API consumers.
- API writes remain authenticated even when the project is public.
- File-usage restore is operational/admin behavior and should not be shown to ordinary project users.
- Deletion is scoped to the current project and must not be available through accidental clicks.

## Copy And Messages

- Header: `Settings`
- Subtitle: `Project configuration and access controls.`
- Visibility cards: `Private`, `Public`
- API-key restricted copy: `You don't have permission to manage API keys for this project.`
- File usage action: `Restore File Bytes`
- Restore dialog title: `Restore Project File Bytes`
- Destructive section: `Danger Zone`

## Open Questions

- Should visibility changes require a confirmation when switching from private to public?
- Should deletion surface dependent endpoints, keys, and storage impact before confirmation?
- Should the API-key restricted state link directly to an owner/admin contact pattern instead of generic organization settings?
