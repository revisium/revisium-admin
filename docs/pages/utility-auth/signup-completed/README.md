# Signup Completion

Route: `/signup/completed`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Confirms that email signup has been submitted and tells the user to verify the account by email.

## Context And Entry

- Parent context: signup flow.
- Entry point: successful email signup.
- Parent shell: full-page auth surface with hidden sidebar.

## Functionality

- Shows a post-signup email confirmation prompt.
- Provides a login link.

## Functional Blocks

| Block                | Shows                                      | Visible when | UX note                                |
| -------------------- | ------------------------------------------ | ------------ | -------------------------------------- |
| Confirmation message | `Check your email to confirm your account` | Always       | No email address is shown              |
| Login link           | `Log in`                                   | Always       | Lets the user return to the login page |

## Primary Actions

| Action      | Trigger       | Available when | Result                | Failure/recovery |
| ----------- | ------------- | -------------- | --------------------- | ---------------- |
| Go to login | `Log in` link | Always         | Navigates to `/login` | Route change     |

## Optional Features And Gates

| Feature                   | Gate              | Visible/active when           | Hidden/disabled when                  | Result                              |
| ------------------------- | ----------------- | ----------------------------- | ------------------------------------- | ----------------------------------- |
| Email confirmation prompt | Email signup flow | User lands after email signup | OAuth signup/login bypasses this page | User is instructed to confirm email |

## States

| State | Trigger/source | UI behavior                               | User path forward         |
| ----- | -------------- | ----------------------------------------- | ------------------------- |
| Ready | Page loaded    | Centered confirmation copy and login link | Confirm email, then login |

## Transitions

| From            | Trigger          | Condition | To       | Feedback     |
| --------------- | ---------------- | --------- | -------- | ------------ |
| Completion page | `Log in` clicked | Always    | `/login` | Route change |

## Permissions And Configuration

- Signup flow page.
- No authenticated state is required by the page itself.

## Copy And Messages

- Message: `Check your email to confirm your account`.
- Link: `Log in`.

## Open Questions

- Should the page show the submitted email address when available?
- Should it include resend-confirmation support when that backend flow exists?
