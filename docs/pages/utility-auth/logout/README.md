# Logout

Route: `/logout`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Ends the current session and sends the user back to login.

## Context And Entry

- Parent context: authenticated utility route.
- Entry points: account/logout navigation.
- Parent shell: no visible page content.

## Functionality

- Clears project context.
- Calls auth logout.
- Navigates the user back to login.

## Functional Blocks

| Block            | Shows              | Visible when | UX note                             |
| ---------------- | ------------------ | ------------ | ----------------------------------- |
| Logout processor | No visible content | Always       | Page performs side effects on entry |

## Primary Actions

| Action  | Trigger    | Available when              | Result                                                                   | Failure/recovery                                      |
| ------- | ---------- | --------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------- |
| Log out | Page entry | Authenticated route reached | Project context is cleared, auth logout runs, user navigates to `/login` | Navigation to login still happens after logout errors |

## Optional Features And Gates

| Feature      | Gate            | Visible/active when   | Hidden/disabled when                   | Result                |
| ------------ | --------------- | --------------------- | -------------------------------------- | --------------------- |
| Logout route | Auth route gate | User is authenticated | Guest users are blocked by auth loader | Session end flow runs |

## States

| State      | Trigger/source           | UI behavior           | User path forward       |
| ---------- | ------------------------ | --------------------- | ----------------------- |
| Processing | Page entered             | No visible UI         | Wait for redirect       |
| Completed  | Logout finishes or fails | Redirects to `/login` | Sign in again if needed |

## Transitions

| From         | Trigger                      | Condition          | To       | Feedback                |
| ------------ | ---------------------------- | ------------------ | -------- | ----------------------- |
| Logout route | Logout side effect completes | Success or failure | `/login` | No visible confirmation |

## Permissions And Configuration

- Auth required.
- The page navigates to login in a `finally` handler; logout errors are swallowed in the current UI.

## Copy And Messages

- No visible copy is currently rendered.

## Open Questions

- Should logout show a short `Signing out...` state for slow network conditions?
