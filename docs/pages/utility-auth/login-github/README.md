# GitHub OAuth Callback

Route: `/login/github`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Completes the GitHub OAuth callback and establishes the Revisium session.

## Context And Entry

- Parent context: guest/provider callback under `/login`.
- Entry point: GitHub OAuth provider redirect.
- Query parameters: `code` is required.
- Route gate: provider availability is checked before callback page renders.

## Functionality

- Reads the GitHub OAuth callback code.
- Exchanges the code for an access token.
- Redirects to the safe redirect target or `/`.

## Functional Blocks

| Block              | Shows        | Visible when | UX note                                                       |
| ------------------ | ------------ | ------------ | ------------------------------------------------------------- |
| Callback processor | No manual UI | Always       | Current page has no explicit visible success or error content |

## Primary Actions

| Action               | Trigger   | Available when                    | Result                                          | Failure/recovery                        |
| -------------------- | --------- | --------------------------------- | ----------------------------------------------- | --------------------------------------- |
| Complete OAuth login | Page load | `code` query parameter is present | Access token is accepted and session is updated | Failures are logged; no inline recovery |

## Optional Features And Gates

| Feature               | Gate                       | Visible/active when | Hidden/disabled when | Result                            |
| --------------------- | -------------------------- | ------------------- | -------------------- | --------------------------------- |
| GitHub OAuth callback | GitHub OAuth configuration | Provider enabled    | Provider disabled    | Callback route can complete login |

## States

| State           | Trigger/source                 | UI behavior                     | User path forward |
| --------------- | ------------------------------ | ------------------------------- | ----------------- |
| Processing      | Callback loaded with `code`    | No manual controls              | Wait for redirect |
| Missing code    | Provider callback lacks `code` | Error logged                    | Retry login       |
| Failed exchange | Backend exchange fails         | Error logged                    | Retry login       |
| Success         | Access token accepted          | Redirects to safe target or `/` | Continue in app   |

## Transitions

| From           | Trigger                 | Condition               | To                     | Feedback                  |
| -------------- | ----------------------- | ----------------------- | ---------------------- | ------------------------- |
| Callback route | OAuth exchange succeeds | Code valid              | Redirect target or `/` | Session is created        |
| Callback route | Missing/invalid code    | Code absent or rejected | Same route             | No visible recovery today |

## Permissions And Configuration

- Guest/provider-check route.
- Requires GitHub OAuth provider configuration.

## Copy And Messages

- No visible copy is currently rendered by the callback page.

## Open Questions

- Should callback failures route back to `/login` with an error message?
- Should callback error handling be standardized across OAuth callbacks and email confirmation routes?
