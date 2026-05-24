# Login

Route: `/login`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Lets a guest sign in with password or configured OAuth providers, then returns the user to the requested safe destination.

## Context And Entry

- Parent context: guest-only utility route.
- Entry points: direct `/login`, sidebar `Sign in` from public organization/project pages, and redirects from protected routes.
- Query parameters: optional `redirect` target is preserved for password and OAuth login.
- Parent shell: full-page auth surface with hidden sidebar.

## Functionality

- Collects username or email plus password.
- Shows Google and GitHub OAuth options when each provider is configured.
- Shows a signup link when at least one signup method is available.
- Redirects to the `redirect` query target after successful password login; otherwise redirects to the main page.

## Functional Blocks

| Block         | Shows                                                            | Visible when                             | UX note                                                                                                                 |
| ------------- | ---------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Signup prompt | `New to Revisium?` and `Sign up` link                            | Signup is available                      | Keeps account creation discoverable from the auth surface                                                               |
| OAuth options | `Continue with GitHub`, `Continue with Google`, and `OR` divider | At least one OAuth provider is available | Current behavior shows the OAuth block when Google OAuth is available; GitHub is shown inside the block when configured |
| Password form | Username/email input, password input, `Login` button             | Always                                   | Submit button is hidden until the form is valid                                                                         |

## Primary Actions

| Action               | Trigger                     | Available when                                        | Result                                                                            | Failure/recovery                                              |
| -------------------- | --------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Log in with password | `Login` button or Enter key | Username/email and password are non-empty             | Auth session is created and the user is routed to the safe redirect target or `/` | Current UI logs failures and returns the button to idle state |
| Continue with Google | `Continue with Google`      | Google OAuth is configured                            | Browser leaves the page for Google OAuth                                          | Provider callback handles success/failure                     |
| Continue with GitHub | `Continue with GitHub`      | GitHub OAuth is configured and OAuth block is visible | Browser leaves the page for GitHub OAuth                                          | Provider callback handles success/failure                     |
| Go to signup         | `Sign up` link              | Signup is available                                   | Navigates to `/signup`                                                            | Redirect query is not added by this link today                |

## Optional Features And Gates

| Feature              | Gate                                                   | Visible/active when                              | Hidden/disabled when                                        | Result                      |
| -------------------- | ------------------------------------------------------ | ------------------------------------------------ | ----------------------------------------------------------- | --------------------------- |
| Email/password login | Guest route                                            | Always on the page                               | Authenticated users are redirected away by the route loader | Password login is available |
| Signup link          | Signup configuration has at least one enabled method   | Signup is available                              | All signup methods disabled                                 | Link to `/signup`           |
| Google OAuth         | Google OAuth configuration                             | Provider is available                            | Provider disabled                                           | OAuth redirect starts       |
| GitHub OAuth         | GitHub OAuth configuration plus OAuth block visibility | Provider is available and OAuth block is visible | Provider disabled or OAuth block hidden                     | OAuth redirect starts       |

## States

| State                  | Trigger/source                         | UI behavior                  | User path forward              |
| ---------------------- | -------------------------------------- | ---------------------------- | ------------------------------ |
| Guest ready            | Guest reaches `/login`                 | Auth form is visible         | Choose password or OAuth login |
| Invalid form           | Empty username/email or password       | `Login` button is hidden     | Complete both fields           |
| Submitting             | Password login request in flight       | `Login` button shows loading | Wait for navigation or failure |
| OAuth unavailable      | Provider configuration disabled        | Provider button is hidden    | Use another visible method     |
| Authenticated redirect | Authenticated user reaches guest route | Route loader redirects away  | Continue in the app            |

## Transitions

| From       | Trigger                 | Condition            | To                      | Feedback                                  |
| ---------- | ----------------------- | -------------------- | ----------------------- | ----------------------------------------- |
| Login page | Password login succeeds | Credentials accepted | Redirect target or `/`  | Button loading ends on navigation         |
| Login page | Password login fails    | Request errors       | Same page               | Error is logged; no inline error is shown |
| Login page | OAuth provider selected | Provider configured  | External OAuth provider | Browser navigation                        |
| Login page | Signup link clicked     | Signup available     | `/signup`               | Route change                              |

## Permissions And Configuration

- Guest only. Authenticated users are redirected away.
- Signup is controlled by signup configuration.
- OAuth buttons are controlled by provider configuration.

## Copy And Messages

- Signup prompt: `New to Revisium?`, `Sign up`.
- Inputs: `username or email`, `password`.
- Buttons: `Continue with GitHub`, `Continue with Google`, `Login`.
- Divider: `OR`.

## Open Questions

- Should password login failures show an inline message instead of only returning to idle state?
- Should the GitHub-only configuration still show the OAuth block when Google OAuth is disabled?
