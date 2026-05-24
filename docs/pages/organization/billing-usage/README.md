# Billing And Usage

Route: `/app/:organizationId/-/limits`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Shows organization resource usage and, when billing is enabled, plan/payment management.

## Context And Entry

- Parent context: organization.
- Parent shell: `Page` with `OrganizationSidebar`.
- Sidebar entry: `Billing`, shown when billing is enabled for the organization shell.
- Route can still render directly when billing is disabled; in that case the page title becomes `Usage`.

## Functionality

- Shows usage metrics for row versions, projects, members, and storage.
- Shows current billing status and plan state when billing is enabled.
- Shows public plans and billing interval toggle.
- Supports early access activation, checkout, and subscription cancellation.
- Shows payment management for active or past-due subscriptions.

## Functional Blocks

| Block         | Shows                                                           | Visible when                                              | UX note                                                                              |
| ------------- | --------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Header        | Page title and subtitle                                         | Always after data loads                                   | Title becomes `Billing` when billing is enabled and `Usage` when billing is disabled |
| Status banner | Free, early adopter, active, past due, or cancelled plan status | Always after data loads                                   | Summarizes the current plan state                                                    |
| Usage         | Row versions, projects, members, storage                        | Always after data loads when usage data exists            | Usage remains visible even when billing controls are hidden                          |
| Plans         | Public plan cards and billing interval toggle                   | Billing is enabled and at least one public plan exists    | Lets users compare available paid/free plans                                         |
| Payment       | Provider and cancel-subscription action                         | Billing is enabled and subscription is active or past due | Payment management is scoped to subscriptions that can still be managed              |

## Primary Actions

| Action                  | Trigger                                  | Available when                                             | Result                                                                        | Failure/recovery                                                                              |
| ----------------------- | ---------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Toggle billing interval | Monthly/yearly segmented buttons         | Billing enabled and plans are visible                      | Reprices plan cards between monthly and yearly                                | No backend call; state stays local                                                            |
| Activate early access   | `Get Early Access` on a plan card        | Upgradeable paid plan has early-access feature flag        | Early access is activated, then billing and plan data reload                  | Action button is disabled while any billing action is loading                                 |
| Upgrade                 | `Upgrade` on a paid plan card            | Paid plan is not current and early access is not available | Checkout is created, then browser redirects to checkout URL                   | Action button is disabled while any billing action is loading                                 |
| Downgrade               | `Downgrade` on a free plan card          | Free plan is not current and current status is not free    | Subscription cancellation/downgrade request runs                              | Same backend path as cancellation; current UI has no separate confirmation from the plan card |
| Cancel subscription     | `Cancel Subscription` in payment section | Subscription is active or past due                         | Opens confirmation dialog; on confirm, cancels at period end and reloads data | Dialog can be cancelled with `Keep Subscription`                                              |

## Optional Features And Gates

| Feature                 | Gate                                                                         | Visible/active when                                    | Hidden/disabled when                                                          | Result                                            |
| ----------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------- |
| Billing management      | `configuration.billing.enabled` from limits-page data                        | Billing is enabled                                     | Billing is disabled; page becomes usage-only if reached directly              | Shows plans and payment section                   |
| Plan cards              | Public plans exist in page data                                              | Billing is enabled and at least one public plan exists | No public plans or billing disabled                                           | Shows plan limits and plan action buttons         |
| Early access activation | Plan data marks early access as available; plan is paid; plan is not current | Button label becomes `Get Early Access`                | Current plan, free downgrade plan, missing feature flag, or action loading    | Activates early access, then reloads billing data |
| Checkout upgrade        | Paid plan is not current and early access is not available                   | Button label becomes `Upgrade`                         | Current plan, free downgrade plan, action loading, or missing checkout result | Redirects browser to checkout URL                 |
| Payment management      | Subscription status is active or past due                                    | Payment section is visible                             | Free, early adopter, cancelled, or missing subscription state                 | Shows provider when present and cancel action     |

## States

| State            | Trigger/source                                            | UI behavior                                                                            | User path forward                           |
| ---------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------- |
| Loading          | Initial data request in flight                            | Full-page centered spinner                                                             | Wait for usage/billing data                 |
| Error            | Data request fails and no previous data exists            | `Could not load usage data` and `Please retry later`                                   | Retry by refreshing or returning later      |
| Usage-only       | Billing disabled                                          | Header says `Usage`; usage metrics show; plans/payment are hidden                      | Review usage; no billing actions available  |
| Free plan        | Current billing status is free                            | Status banner says `Free Plan`; paid plans can be upgrade targets                      | Choose upgrade or early access if available |
| Early adopter    | Current billing status is early adopter                   | Status banner says `Pro Plan - Early Access`; subtitle says free while in Early Access | Review usage and plan                       |
| Active paid plan | Current billing status is active                          | Status banner says `Pro Plan`; renewal date may show; payment management visible       | Manage or cancel subscription               |
| Past due         | Current billing status is past due                        | Status banner says `Payment failed`; payment management visible                        | Update externally when supported or cancel  |
| Cancelled        | Current billing status is cancelled                       | Status banner says `Plan cancelled`; downgrade date may show                           | Review upcoming downgrade                   |
| Action loading   | Early access, checkout, or cancellation request in flight | Plan/payment buttons are disabled                                                      | Wait for request result                     |

## Transitions

| From                         | Trigger                     | Condition                                       | To                                 | Feedback                                |
| ---------------------------- | --------------------------- | ----------------------------------------------- | ---------------------------------- | --------------------------------------- |
| Loaded page                  | Toggle interval             | Plans visible                                   | Same page with updated plan prices | No route change                         |
| Free/other plan              | Click `Get Early Access`    | Upgradeable paid plan has early-access flag     | Reloaded billing data              | Button disabled while request runs      |
| Free/other plan              | Click `Upgrade`             | Upgradeable paid plan without early-access flag | External checkout URL              | Browser redirects to checkout           |
| Active/past-due subscription | Click `Cancel Subscription` | Payment section visible                         | Confirmation dialog                | Dialog explains cancellation timing     |
| Confirmation dialog          | Click `Keep Subscription`   | Dialog open                                     | Dialog closed                      | No data change                          |
| Confirmation dialog          | Confirm cancellation        | Dialog open                                     | Reloaded billing data              | Subscription is cancelled at period end |

## Permissions And Configuration

- Auth: organization pages require authenticated user.
- Sidebar visibility: billing is enabled in organization shell configuration.
- Page behavior: billing configuration from page data controls billing blocks.
- Early access: available only when the selected paid plan exposes the early-access feature.
- Action locking: plan and payment actions are disabled while a billing action is running.

## Copy And Messages

- Loading: spinner only.
- Error title: `Could not load usage data`.
- Error body: `Please retry later`.
- Cancellation dialog title: `Cancel Subscription`.
- Cancellation dialog body: subscription remains active until the current billing period ends, then downgrades to Free.
- Cancellation actions: `Keep Subscription`, `Cancel Subscription`.

## Open Questions

- Should downgrade from a plan card open the same confirmation dialog as `Cancel Subscription`?
- Should past-due state include a direct `Update payment method` action when the provider supports it?
- Should billing-disabled direct access explain why only usage is visible?
