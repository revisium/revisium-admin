# OAuth Authorization Consent

Route: `/authorize`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Asks an authenticated user to approve or deny an external OAuth client request.

## Context And Entry

- Parent context: authenticated OAuth consent route.
- Query parameters: `client_id`, `client_name`, `redirect_uri`, `code_challenge`, and `state` are required; `scope` is optional.
- Parent shell: full-page authorization surface with hidden sidebar.
- Redirect behavior: approval and denial leave Revisium and return to the client redirect URI.

## Functionality

- Parses OAuth consent parameters: client id, client name, redirect URI, code challenge, state, and optional scope.
- Lets the user approve or deny the client request.
- Posts approval to `/oauth/authorize`.
- Redirects after success, with an immediate redirect action available.
- Redirects denial with `access_denied`.

## Functional Blocks

| Block                     | Shows                                                        | Visible when                                    | UX note                                       |
| ------------------------- | ------------------------------------------------------------ | ----------------------------------------------- | --------------------------------------------- |
| Missing-parameter message | `Missing OAuth parameters.`                                  | Required params missing or redirect URI invalid | No retry action                               |
| Consent card              | Client name, approve/deny buttons, explanatory copy          | Required params are valid and not yet approved  | Client name is interpolated into consent copy |
| Error block               | Authorization error text                                     | Approval request fails                          | Error stays inline in the consent card        |
| Success view              | `Authorization Successful`, redirecting copy, `Continue now` | Approval succeeds                               | Auto-redirect runs after a short delay        |

## Primary Actions

| Action       | Trigger               | Available when                                             | Result                                                                  | Failure/recovery                         |
| ------------ | --------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| Authorize    | `Authorize` button    | OAuth params valid and no authorization request is running | Posts consent, then redirects to client callback URL                    | Inline error appears when approval fails |
| Deny         | `Deny` button         | OAuth params valid                                         | Redirects to client callback URL with `error=access_denied` and `state` | No confirmation                          |
| Continue now | `Continue now` button | Approval already succeeded                                 | Immediately redirects to client callback URL                            | Auto-redirect would also run             |

## Optional Features And Gates

| Feature        | Gate                                                   | Visible/active when                                     | Hidden/disabled when      | Result                                |
| -------------- | ------------------------------------------------------ | ------------------------------------------------------- | ------------------------- | ------------------------------------- |
| OAuth consent  | Required OAuth query parameters and valid redirect URI | All required params are present and redirect URI parses | Missing or invalid params | Consent card appears                  |
| Optional scope | `scope` query parameter                                | Scope is provided                                       | Scope absent              | Scope is included in approval request |
| Auto-redirect  | Approval success                                       | Redirect URI returned                                   | Approval not completed    | User leaves consent page after delay  |

## States

| State               | Trigger/source                                       | UI behavior                                 | User path forward            |
| ------------------- | ---------------------------------------------------- | ------------------------------------------- | ---------------------------- |
| Missing params      | Required query param missing or redirect URI invalid | `Missing OAuth parameters.`                 | Restart OAuth flow           |
| Ready               | OAuth params valid                                   | Consent card with client name               | Approve or deny              |
| Authorizing         | Approval request in flight                           | `Authorize` button loading; `Deny` disabled | Wait                         |
| Authorization error | Approval request fails                               | Inline red error message                    | Retry or deny                |
| Approved            | Approval request succeeds                            | Success view and redirecting copy           | Wait or click `Continue now` |

## Transitions

| From         | Trigger                | Condition           | To                      | Feedback                                   |
| ------------ | ---------------------- | ------------------- | ----------------------- | ------------------------------------------ |
| Consent card | `Authorize` clicked    | Request succeeds    | Client redirect URI     | Success view appears before redirect       |
| Consent card | `Authorize` clicked    | Request fails       | Consent card with error | Inline error message                       |
| Consent card | `Deny` clicked         | Always              | Client redirect URI     | Adds `access_denied` and preserves `state` |
| Success view | Timer fires            | Redirect URI exists | Client redirect URI     | Browser navigation                         |
| Success view | `Continue now` clicked | Redirect URI exists | Client redirect URI     | Immediate browser navigation               |

## Permissions And Configuration

- Auth required.
- Requires a valid OAuth client flow to supply query parameters.

## Copy And Messages

- Missing params: `Missing OAuth parameters.`
- Title: `Authorize Application`.
- Consent copy: `<client name> wants to access your Revisium account.`
- Buttons: `Deny`, `Authorize`, `Continue now`.
- Success title: `Authorization Successful`.
- Success body: `Redirecting back to the application...`
- Footer copy: `This will allow the application to access Revisium on your behalf.`

## Open Questions

- Should requested scopes be displayed to the user when `scope` is present?
- Should denial require confirmation for high-trust integrations?
