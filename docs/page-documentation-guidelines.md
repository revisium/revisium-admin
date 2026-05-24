# Page Documentation Guidelines

UX-facing rules for describing `revisium-admin` pages.

References used to shape this standard:

- [Carbon Design System: Empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- [Atlassian Design: Empty state messages](https://atlassian.design/foundations/content/designing-messages/empty-state)
- [Atlassian Design: Error messages](https://atlassian.design/foundations/content/designing-messages/error-messages)
- [Wikimedia Codex: Designing new components](https://doc.wikimedia.org/codex/v1.9.0/contributing/designing-new-components.html)
- [GOV.UK Service Manual: Making prototypes](https://www.gov.uk/service-manual/design/making-prototypes)
- [UI-Router: Transitions](https://ui-router.github.io/guide/transitions)

## Current Rule

Every page folder must contain a `README.md` and may later contain screenshots, flows, state diagrams, prototype notes, or open-question files:

```text
docs/pages/<area>/<page>/
  README.md
  screenshots/
  flows/
  states/
```

Use folder paths even when the page currently has only one file.

## Required Page Shape

Each page `README.md` should use this order.

```md
# Page Name

Route:
Status:

## Purpose

## Context And Entry

## Functionality

## Functional Blocks

## Primary Actions

## Optional Features And Gates

## States

## Transitions

## Permissions And Configuration

## Copy And Messages

## Open Questions
```

Small utility pages can omit sections that genuinely do not apply, but stateful product pages should include all sections.

## Section Rules

### Purpose

Describe the page job in one or two sentences. Do not repeat the route name.

Good:

- "Shows organization usage, billing status, available plans, and payment management."

Weak:

- "Billing page."

### Context And Entry

Document how the user reaches the page and which app context must already exist:

- auth state
- organization/project/branch/revision context
- route params
- query params
- parent layout
- sidebar entry
- redirect behavior

### Functional Blocks

Break the page into visible UI blocks. For each block, describe what it shows and when it appears.

Use this table when the page has multiple sections:

| Block | Shows | Visible when | UX note |
| ----- | ----- | ------------ | ------- |

### Primary Actions

Document actions as behavior, not only button labels.

| Action | Trigger | Available when | Result | Failure/recovery |
| ------ | ------- | -------------- | ------ | ---------------- |

Rules:

- Name where the action is triggered.
- Describe availability and disabled conditions.
- Describe route changes, reloads, data refreshes, and success/error feedback.
- Put destructive actions in this table even when they also have a confirmation section.

### Optional Features And Gates

Optional features must be documented explicitly. Do not write only "supports early access" or "supports billing".

Use this table:

| Feature | Gate | Visible/active when | Hidden/disabled when | Result |
| ------- | ---- | ------------------- | -------------------- | ------ |

Document all relevant gates:

- feature flag or environment configuration
- permission
- plan data
- current resource status
- backend availability
- route/query state
- data presence

### States

Every page should document the user-visible states that apply.

| State | Trigger/source | UI behavior | User path forward |
| ----- | -------------- | ----------- | ----------------- |

Use these names where possible:

- Loading
- Ready / populated
- Empty / no data
- Empty / no matches
- Read-only
- Permission limited
- Configuration disabled
- Error
- Success
- Not found
- Redirecting

Rules:

- Empty states should explain why the area is empty and the next useful action.
- Error states should name what failed and how the user can recover.
- Loading states should say whether the whole page, a section, or a small control is loading.
- If an action is unavailable because of permissions or configuration, document whether the UI hides it, disables it, or shows an explanation.

### Transitions

Use transitions for flows that change route, modal, data state, or plan/account status.

| From | Trigger | Condition | To  | Feedback |
| ---- | ------- | --------- | --- | -------- |

Rules:

- Document modal open/close flows.
- Document redirects.
- Include data refreshes after mutations.
- Include confirmation dialogs for destructive or billing actions.
- Cover automatic transitions such as OAuth callback, token issue, and logout.

### Permissions And Configuration

List the exact gates used by the current product behavior when known.

Examples:

- `SystemPermissions.canReadUser`
- `ProjectPermissions.canCreateEndpoint`
- `configurationService.billingEnabled`
- `features.earlyAccessAvailable`

If the behavior is inferred through a shared system rule, name the visible effect rather than the implementation class.

### Copy And Messages

Document important messages that the UI currently shows or must show:

- empty-state title/body/action
- error title/body/action
- loading text
- confirmation dialog title/body/actions
- success message
- warning or read-only banner

Rules:

- Keep messages short and scannable.
- Use direct next steps.
- Do not invent a reason for an error if the implementation does not know one.
- Do not over-explain secondary states.

## Optional Feature Example

For early access on billing:

| Feature                 | Gate                                                                                 | Visible/active when                                             | Hidden/disabled when                                                       | Result                                                 |
| ----------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------ |
| Early access activation | Plan has `features.earlyAccessAvailable === true`; plan is paid; plan is not current | Button label becomes `Get Early Access` for an upgradeable plan | Current plan, free downgrade plan, missing feature flag, or action loading | Calls `activateEarlyAccess`, then reloads billing data |

This is better than "Supports early access activation" because it captures when the user actually sees the action and what happens after it.

## Maintenance Rule

When `revisium-admin` changes page behavior, update the page folder in the same PR if the change affects:

- route or entry behavior
- visible functional blocks
- optional feature gates
- permissions or configuration
- empty, loading, error, success, disabled, read-only, or not-found states
- modal, redirect, or mutation transitions
- destructive or billing action confirmation
