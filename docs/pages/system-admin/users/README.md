# System Users

Route: `/admin/users`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

System-admin user directory for searching users, creating new users, and opening individual user detail pages.

## Context And Entry

- Parent context: system admin.
- Parent shell: admin layout with admin sidebar.
- Sidebar entry: `Users`.
- Related page: user detail route at `/admin/users/:userId`.

## Functionality

- Lists system users with pagination/load-more behavior.
- Supports debounced search.
- Opens a create-user modal when permitted.
- Create-user modal collects username, password, optional email, and system role.
- Opens user detail when a user row is selected.

## Functional Blocks

| Block              | Shows                                           | Visible when                 | UX note                                                            |
| ------------------ | ----------------------------------------------- | ---------------------------- | ------------------------------------------------------------------ |
| Breadcrumb/title   | `Users` under admin context                     | Page loaded                  | Keeps the admin section clear.                                     |
| Search             | User search input                               | Page loaded                  | Debounced to reduce request noise.                                 |
| Create user action | Add/create button                               | User can create system users | Opens modal instead of navigating away.                            |
| User list          | User rows and load-more behavior                | Users loaded                 | Selecting a row opens detail.                                      |
| Create user modal  | Username, password, optional email, role select | Create action opened         | Submit is valid only with username and password length at least 6. |

## Primary Actions

| Action                    | Trigger                 | Available when                  | Result                                               | Failure/recovery                               |
| ------------------------- | ----------------------- | ------------------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| Search users              | `Search...` input       | Page loaded                     | User list reloads after debounce with matching users | Empty state appears when no users match        |
| Create user               | `Add` action            | User has create-user permission | Create-user modal opens                              | Cancel closes modal without changes            |
| Open user detail          | User row click          | User appears in list            | Opens `/admin/users/:userId`                         | Route change only                              |
| Scroll to load more users | End of virtualized list | More pages exist                | Next page of users appends                           | Existing list remains visible if request fails |

## Optional Features And Gates

- Create user action requires system user creation permission.
- Create submit requires username and a password of at least 6 characters.
- System role is selected during creation.

## States

| State          | UX                                                 |
| -------------- | -------------------------------------------------- |
| Loading        | Shows user list loading state.                     |
| Error          | Shows user list load error.                        |
| Empty          | Shows no users for the current search/list state.  |
| List           | Shows user rows and pagination/load-more controls. |
| Creating user  | Shows create-user modal with form validation.      |
| Create success | Modal closes and the list reloads.                 |

## Transitions

- Search input updates the user list after a 300 ms debounce.
- Selecting a user opens `/admin/users/:userId`.
- Creating a user closes the modal and refreshes the list.
- Reaching the end of the virtualized list loads the next page of users when available.

## Permissions And Configuration

- Requires auth plus system admin permission.
- Create user is shown only when the user has create-user permission.

## Copy And Messages

- Breadcrumb/title: `Users`
- Search placeholder: `Search...`
- Create action: `Add`
- Modal title: `Create User`
- Modal fields: `Username *`, `Password *`, `Email (optional)`, `System Role`
- Modal actions: `Cancel`, `Create`
- Password validation: minimum 6 characters

## Open Questions

- Should create-user validation show inline password requirements before submit?
- Should search support email and role filters as separate controls?
