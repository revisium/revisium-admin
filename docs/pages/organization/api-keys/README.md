# Organization API Keys

Route: `/app/:organizationId/-/settings`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Manages organization-scoped service API keys for automated integrations.

## Context And Entry

- Parent context: organization.
- Parent shell: organization sidebar.
- Sidebar entry: `API Keys`, shown when the user can manage organization API keys.
- Route note: the route suffix is `-/settings`, but the current UX label is `API Keys`.

## Functionality

- Manages service API keys at organization scope.
- Lists active, expired, and revoked service keys.
- Creates service keys with expiration and permission presets.
- Reveals the generated secret once after create/rotate.
- Supports rotate and revoke confirmations for active keys.

## Functional Blocks

| Block               | Shows                                                                              | Visible when                                             | UX note                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Page header         | `API Keys` and service-key description                                             | Always                                                   | Explains organization automation use                                                     |
| API key list        | Key count, rows, status, permission, project scope, last used, created, expiration | User can manage organization API keys and list is loaded | System-generated internal keys are filtered out so only user-created service keys appear |
| Empty state         | Empty message and `Create your first key`                                          | No visible service keys                                  | Provides first-key creation action                                                       |
| Create dialog       | Name, expiration options, service permission preset                                | User opens create                                        | Permission presets are read-only, read-write, or full-access                             |
| Secret dialog       | Generated key secret and copy action                                               | Key created or rotated                                   | Secret cannot be viewed again after closing                                              |
| Rotate confirmation | `Rotate API Key`                                                                   | Active key rotate clicked                                | Warns current secret will be invalidated                                                 |
| Revoke confirmation | `Revoke API Key`                                                                   | Active key revoke clicked                                | Warns access is immediately lost                                                         |

## Primary Actions

| Action      | Trigger                                 | Available when                                   | Result                                                                                | Failure/recovery                                                 |
| ----------- | --------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Create key  | `Create key` or `Create your first key` | User can manage organization API keys            | Create dialog opens                                                                   | Cancel closes dialog                                             |
| Submit key  | `Create key` in dialog                  | Key name is non-empty and no mutation is running | Key is created, list reloads, secret dialog opens                                     | Dialog stays if request fails                                    |
| Copy secret | `Copy` in secret dialog                 | Secret dialog open                               | Secret copied and toast appears                                                       | Browser clipboard failure is not separately documented in dialog |
| Rotate key  | Rotate action on active key             | Key is active                                    | Confirmation opens; confirm creates new secret, reloads list, and opens secret dialog | Cancel closes confirmation                                       |
| Revoke key  | Revoke action on active key             | Key is active                                    | Confirmation opens; confirm revokes key and reloads list                              | Cancel closes confirmation                                       |

## Optional Features And Gates

| Feature                    | Gate                                   | Visible/active when               | Hidden/disabled when   | Result                                                    |
| -------------------------- | -------------------------------------- | --------------------------------- | ---------------------- | --------------------------------------------------------- |
| Sidebar entry              | Organization API-key manage permission | Permission granted                | Permission absent      | `API Keys` appears in org navigation                      |
| API key manager            | Organization API-key manage permission | Permission granted                | Permission absent      | Key list and actions render                               |
| Service permission presets | Service key mode                       | Creating organization service key | Personal key mode      | User chooses read-only, read-write, or full-access preset |
| Project scope display      | Key has project scope                  | Key is scoped to projects         | Organization-wide key  | Project scope appears in row                              |
| Rotate/revoke actions      | Key active                             | Status is active                  | Key expired or revoked | Active-key actions appear                                 |

## States

| State           | Trigger/source                      | UI behavior                          | User path forward             |
| --------------- | ----------------------------------- | ------------------------------------ | ----------------------------- |
| Loading         | Keys request in flight              | Centered spinner                     | Wait                          |
| Error           | Keys request fails                  | Red error box with message           | Refresh or retry later        |
| Empty           | No visible keys                     | Empty state and create action        | Create first key              |
| List            | Keys returned                       | Key count and sorted rows            | Create, rotate, or revoke     |
| Mutating        | Create, rotate, or revoke in flight | Relevant dialog/action shows loading | Wait                          |
| Secret revealed | Create or rotate succeeds           | Secret dialog blocks outside close   | Copy secret, then acknowledge |

## Transitions

| From                | Trigger         | Condition          | To                              | Feedback                |
| ------------------- | --------------- | ------------------ | ------------------------------- | ----------------------- |
| List/empty          | Create clicked  | Permission granted | Create dialog                   | Form is reset           |
| Create dialog       | Create succeeds | Valid key name     | Secret dialog and reloaded list | Secret shown once       |
| List                | Rotate clicked  | Key active         | Rotate confirmation             | Confirmation copy shown |
| Rotate confirmation | Confirm         | Request succeeds   | Secret dialog and reloaded list | New secret shown once   |
| List                | Revoke clicked  | Key active         | Revoke confirmation             | Confirmation copy shown |
| Revoke confirmation | Confirm         | Request succeeds   | Reloaded list                   | Key no longer active    |

## Permissions And Configuration

- Auth required.
- API key list is shown when the user can manage organization API keys.
- Current sidebar label is `API Keys` even though the route suffix is `-/settings`.

## Copy And Messages

- Header: `API Keys`.
- Description: `Service keys for automated integrations with this organization.`
- Empty: `No integration keys for this organization.`
- Create dialog: `Create Service API Key`, `Name`, `Expiration`, `Permissions`.
- Secret warning: `Make sure to copy your API key now. You won't be able to see it again.`
- Revoke warning: applications using the key immediately lose access.
- Rotate warning: applications using the current key need to be updated.

## Open Questions

- Should users without API-key permission see an explanatory permission-limited state if they reach the route directly?
