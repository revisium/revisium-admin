# Email Confirmation

Route: `/signup/confirm`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Processes an email confirmation code, signs the user in, and returns them to the main page.

## Context And Entry

- Parent context: signup email link callback.
- Query parameters: `code` is required for confirmation.
- Parent shell: utility callback page; no sidebar or manual controls.

## Functionality

- Reads a confirmation code.
- Authenticates the user from the returned access token.
- Navigates to `/`.

## Functional Blocks

| Block         | Shows                    | Visible when                      | UX note                                                             |
| ------------- | ------------------------ | --------------------------------- | ------------------------------------------------------------------- |
| Spinner       | Centered loading spinner | Confirmation request is in flight | No explanatory text is shown                                        |
| Callback body | No visible content       | Request is not loading            | Page either navigates away or remains blank on invalid/missing code |

## Primary Actions

| Action        | Trigger   | Available when                    | Result                                  | Failure/recovery                                     |
| ------------- | --------- | --------------------------------- | --------------------------------------- | ---------------------------------------------------- |
| Confirm email | Page load | `code` query parameter is present | User is authenticated and routed to `/` | Current UI logs failures and has no visible recovery |

## Optional Features And Gates

| Feature            | Gate                           | Visible/active when | Hidden/disabled when | Result                    |
| ------------------ | ------------------------------ | ------------------- | -------------------- | ------------------------- |
| Email confirmation | Signup email confirmation link | `code` query exists | `code` missing       | Confirmation request runs |

## States

| State               | Trigger/source            | UI behavior                            | User path forward                                    |
| ------------------- | ------------------------- | -------------------------------------- | ---------------------------------------------------- |
| Confirming          | Request in flight         | Spinner                                | Wait for redirect                                    |
| Missing code        | No `code` query parameter | No content; error logged               | User must use a valid email link                     |
| Failed confirmation | Request fails             | No content after loading; error logged | User must retry with a valid link or request support |
| Confirmed           | Request succeeds          | Redirects to `/`                       | Continue in app                                      |

## Transitions

| From          | Trigger                     | Condition                    | To         | Feedback                    |
| ------------- | --------------------------- | ---------------------------- | ---------- | --------------------------- |
| Callback page | Valid confirmation succeeds | Backend returns access token | `/`        | Auth session is established |
| Callback page | Code missing or invalid     | No access token              | Same route | No visible recovery today   |

## Permissions And Configuration

- Signup email confirmation must be enabled upstream to issue links.

## Copy And Messages

- No visible text is currently shown during or after the callback.

## Open Questions

- Should missing/invalid code render a visible error with a link back to login/signup?
- Should callback error handling be standardized across email confirmation and OAuth callback routes?
