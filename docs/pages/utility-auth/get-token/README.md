# Access Token

Route: `/get-token`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Issues a short-lived access token for API, MCP, or external tooling use by the current authenticated user.

## Context And Entry

- Parent context: authenticated utility route.
- Entry points: direct route, compatibility redirects from `/get-mcp-token`, and external setup flows.
- Parent shell: full-page utility surface with hidden sidebar.

## Functionality

- Issues an access token for the current user.
- Shows a truncated token display.
- Lets the user copy the full token.
- Lets the user return to the main page.

## Functional Blocks

| Block          | Shows                                                           | Visible when                            | UX note                                      |
| -------------- | --------------------------------------------------------------- | --------------------------------------- | -------------------------------------------- |
| Loading state  | `Loading access token...`                                       | Token request is in flight              | No spinner, text-only loading                |
| No-token state | `No access token available. Please login first.`                | Token request completes without a token | No inline retry action                       |
| Token card     | Title, truncated token, copy button, guidance, main-page button | Token exists                            | Full token is copied but not fully displayed |

## Primary Actions

| Action          | Trigger           | Available when      | Result                                                        | Failure/recovery                                |
| --------------- | ----------------- | ------------------- | ------------------------------------------------------------- | ----------------------------------------------- |
| Copy token      | Copy icon button  | Token exists        | Full token is copied to clipboard and a success toast appears | Failure toast appears when clipboard copy fails |
| Go to main page | `Go to Main Page` | Token page is ready | Navigates to `/`                                              | Route change                                    |

## Optional Features And Gates

| Feature            | Gate                                       | Visible/active when   | Hidden/disabled when             | Result                 |
| ------------------ | ------------------------------------------ | --------------------- | -------------------------------- | ---------------------- |
| Access token issue | Auth route gate                            | User is authenticated | Guest users cannot reach route   | Token request runs     |
| Clipboard copy     | Browser clipboard support and token exists | Copy succeeds         | Clipboard fails or token missing | Success or error toast |

## States

| State        | Trigger/source                    | UI behavior                               | User path forward                        |
| ------------ | --------------------------------- | ----------------------------------------- | ---------------------------------------- |
| Loading      | Token request in flight           | `Loading access token...`                 | Wait                                     |
| Token ready  | Token request succeeds            | Truncated token card and copy action      | Copy token or return home                |
| No token     | Request fails or returns no token | No-token message                          | Login again or refresh                   |
| Copy success | Clipboard copy succeeds           | Toast: `Access token copied to clipboard` | Use token externally                     |
| Copy failure | Clipboard copy fails              | Toast: `Failed to copy token`             | Retry or use browser permission controls |

## Transitions

| From        | Trigger                | Condition          | To             | Feedback                |
| ----------- | ---------------------- | ------------------ | -------------- | ----------------------- |
| Loading     | Token request succeeds | Token returned     | Token ready    | Token appears truncated |
| Loading     | Token request fails    | No token           | No-token state | Message shown           |
| Token ready | Copy clicked           | Clipboard succeeds | Same page      | Success toast           |
| Token ready | Main button clicked    | Always             | `/`            | Route change            |

## Permissions And Configuration

- Auth required.

## Copy And Messages

- Title: `Access Token`.
- Instruction: `Copy this token to use with Revisium API or MCP tools:`.
- Guidance: `You can now close this page and paste the token in your application.`
- No-token state: `No access token available. Please login first.`
- Toasts: `Access token copied to clipboard`, `Failed to copy token`.

## Open Questions

- Should the no-token state include a login link or retry action?
