# System User Detail

Route: `/admin/users/:userId`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

System-admin detail page for inspecting a user identity and resetting that user's password.

## Context And Entry

- Parent context: system admin.
- Parent shell: admin layout with admin sidebar.
- Entry path: selecting a user from the system users page.
- Breadcrumb path: Admin -> Users -> selected user.

## Functionality

- Shows user info: ID, username, email, and role.
- Provides reset-password section.
- Uses breadcrumbs back to Admin / Users.

## Functional Blocks

| Block          | Shows                                    | Visible when             | UX note                                 |
| -------------- | ---------------------------------------- | ------------------------ | --------------------------------------- |
| Breadcrumbs    | Users path and selected username/user ID | Page loaded              | Provides return path to the user list.  |
| User Info      | ID, username, email, and role            | User loaded              | Read-only identity summary.             |
| Reset Password | New password input and reset action      | User loaded              | Requires password length of at least 6. |
| Feedback       | Success or error message                 | Reset completes or fails | Keeps the admin in context after reset. |

## Primary Actions

| Action                 | Trigger                                      | Available when                                                                      | Result                                                           | Failure/recovery                                      |
| ---------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| Reset user password    | `Reset` button in the reset-password section | User detail is loaded, password is at least 6 characters, and reset request is idle | Password reset runs and success message appears on the same page | Error feedback appears and the admin can adjust/retry |
| Navigate back to users | `Users` breadcrumb                           | Breadcrumb is visible                                                               | Opens `/admin/users`                                             | Route change only                                     |

## Optional Features And Gates

- Reset password is available in the loaded user detail state.
- Reset submit requires a new password of at least 6 characters.
- Page access requires system-admin access.

## States

| State         | UX                                            |
| ------------- | --------------------------------------------- |
| Loading       | Shows user detail loading state.              |
| Load error    | Shows `Could not load user`.                  |
| Not found     | Shows user-not-found state.                   |
| Loaded        | Shows user info and reset-password section.   |
| Reset success | Shows `Password has been reset successfully`. |
| Reset error   | Shows reset error feedback.                   |

## Transitions

- Breadcrumb `Users` returns to `/admin/users`.
- Successful password reset keeps the admin on the same user detail page.

## Permissions And Configuration

- Requires auth plus system admin permission.

## Copy And Messages

- Section: `User Info`
- Section: `Reset Password`
- Error: `Could not load user`
- Success: `Password has been reset successfully`

## Open Questions

- Should password reset require confirmation or show generated-password guidance?
- Should user detail expose account status, last login, or organization membership in the same page?
