# Sign Up

Route: `/signup`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Lets a guest create an account through enabled signup methods and keeps the login path available for existing users.

## Context And Entry

- Parent context: guest signup flow.
- Route gate: signup route is available only when signup is enabled.
- Query parameters: optional `redirect` target is preserved on the `Log in` link and OAuth redirects.
- Parent shell: full-page auth surface with hidden sidebar.

## Functionality

- Supports email, username, and password signup when email signup is enabled.
- Supports Google and GitHub OAuth signup/login when configured.
- Preserves redirect target for the following login path.
- Navigates to `/signup/completed` after email signup.

## Functional Blocks

| Block             | Shows                                                                     | Visible when                             | UX note                                                      |
| ----------------- | ------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------ |
| Login prompt      | `Already have an account?` and `Log in` link                              | Always                                   | Carries the redirect query to `/login` when present          |
| OAuth options     | `Continue with GitHub`, `Continue with Google`, and optional `OR` divider | At least one OAuth provider is available | The divider appears only when email signup is also available |
| Email signup form | Username, email, password, and `Sign up`                                  | Email signup is enabled                  | Submit is hidden until the form is valid                     |

## Primary Actions

| Action               | Trigger                                         | Available when                                     | Result                                                  | Failure/recovery                          |
| -------------------- | ----------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------- |
| Sign up with email   | `Sign up` button or Enter key in password field | Email signup enabled and form is valid             | Account is created and user goes to `/signup/completed` | Button loading ends if request fails      |
| Continue with Google | `Continue with Google`                          | Google OAuth configured                            | Browser leaves the page for Google OAuth                | Provider callback handles success/failure |
| Continue with GitHub | `Continue with GitHub`                          | GitHub OAuth configured and OAuth block is visible | Browser leaves the page for GitHub OAuth                | Provider callback handles success/failure |
| Go to login          | `Log in` link                                   | Always                                             | Navigates to `/login`, preserving redirect when present | Route change                              |

## Optional Features And Gates

| Feature      | Gate                                                   | Visible/active when                      | Hidden/disabled when                    | Result                |
| ------------ | ------------------------------------------------------ | ---------------------------------------- | --------------------------------------- | --------------------- |
| Signup route | Signup configuration                                   | Signup is enabled                        | Signup disabled                         | Route is available    |
| Email signup | Email signup configuration                             | Email signup enabled                     | Email signup disabled                   | Email form appears    |
| Google OAuth | Google OAuth configuration                             | Provider enabled                         | Provider disabled                       | OAuth redirect starts |
| GitHub OAuth | GitHub OAuth configuration plus OAuth block visibility | Provider enabled and OAuth block visible | Provider disabled or OAuth block hidden | OAuth redirect starts |

## States

| State                 | Trigger/source                       | UI behavior                         | User path forward                  |
| --------------------- | ------------------------------------ | ----------------------------------- | ---------------------------------- |
| Ready                 | Guest reaches enabled signup route   | Enabled signup methods are shown    | Choose email or OAuth signup       |
| Invalid form          | Username, email, or password missing | `Sign up` button is hidden/disabled | Complete required fields           |
| Submitting            | Email signup request in flight       | `Sign up` button shows loading      | Wait for completion                |
| Email signup disabled | Configuration disables email signup  | Email form is hidden                | Use OAuth if available             |
| Signup disabled       | Signup configuration blocks route    | Route loader prevents access        | Use login or configured entry path |

## Transitions

| From        | Trigger                 | Condition           | To                      | Feedback                                      |
| ----------- | ----------------------- | ------------------- | ----------------------- | --------------------------------------------- |
| Signup page | Email signup succeeds   | Request accepted    | `/signup/completed`     | Route change                                  |
| Signup page | Email signup fails      | Request errors      | Same page               | Button loading ends; no inline error is shown |
| Signup page | OAuth provider selected | Provider configured | External OAuth provider | Browser navigation                            |
| Signup page | `Log in` clicked        | Any state           | `/login`                | Redirect query is preserved when present      |

## Permissions And Configuration

- Guest only and only available when signup is enabled.
- Email signup and OAuth providers are independently configuration-gated.

## Copy And Messages

- Login prompt: `Already have an account?`, `Log in`.
- Inputs: `enter your username`, `enter your email`, `create a password`.
- Buttons: `Continue with GitHub`, `Continue with Google`, `Sign up`.
- Divider: `OR`.

## Open Questions

- Should signup failures surface inline validation/error text?
- Should the page explain why no signup methods are visible if the route remains reachable with all methods disabled?
