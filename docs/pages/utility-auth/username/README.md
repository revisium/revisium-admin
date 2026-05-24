# Username Completion

Route: `/username`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Collects the missing username required to complete an authenticated account profile.

## Context And Entry

- Parent context: authenticated utility route.
- Entry point: auth flow when the current account does not have a username.
- Parent shell: full-page auth-style surface with hidden sidebar.

## Functionality

- Collects a username for authenticated users whose account has no username yet.
- Refreshes the current user after success, then navigates to `/`.

## Functional Blocks

| Block         | Shows                                          | Visible when | UX note                                      |
| ------------- | ---------------------------------------------- | ------------ | -------------------------------------------- |
| Username form | `set username` input and `Set username` button | Always       | Submit button is hidden until input is valid |

## Primary Actions

| Action          | Trigger                            | Available when         | Result                                                                 | Failure/recovery                            |
| --------------- | ---------------------------------- | ---------------------- | ---------------------------------------------------------------------- | ------------------------------------------- |
| Submit username | `Set username` button or Enter key | Username form is valid | Username is saved, current user is refreshed, and app navigates to `/` | Failures are logged; button returns to idle |

## Optional Features And Gates

| Feature             | Gate                         | Visible/active when                        | Hidden/disabled when | Result                            |
| ------------------- | ---------------------------- | ------------------------------------------ | -------------------- | --------------------------------- |
| Username completion | Auth profile has no username | User is authenticated and missing username | Username already set | User can complete account profile |

## States

| State        | Trigger/source         | UI behavior                          | User path forward   |
| ------------ | ---------------------- | ------------------------------------ | ------------------- |
| Ready        | Page loaded            | Username input focused               | Enter username      |
| Invalid form | Username missing       | Submit button hidden                 | Enter username      |
| Submitting   | Save request in flight | Submit button loading                | Wait for completion |
| Success      | Username saved         | Redirects to `/`                     | Continue in app     |
| Failure      | Save request fails     | Button returns to idle; error logged | Retry               |

## Transitions

| From          | Trigger         | Condition         | To        | Feedback                  |
| ------------- | --------------- | ----------------- | --------- | ------------------------- |
| Username page | Submit succeeds | Username accepted | `/`       | Current user is refreshed |
| Username page | Submit fails    | Request errors    | Same page | No inline error today     |

## Permissions And Configuration

- Reached from auth loaders when `authService.user.username` is missing.

## Copy And Messages

- Input: `set username`.
- Button: `Set username`.

## Open Questions

- Should username validation errors be shown inline?
