# System Cache

Route: `/admin/cache`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

System-admin cache diagnostics and reset page for inspecting cache health and flushing all configured cache categories.

## Context And Entry

- Parent context: system admin.
- Parent shell: admin layout with admin sidebar.
- Sidebar entry: `Cache`.
- Behavior depends on whether cache is enabled in runtime configuration.

## Functionality

- Shows cache enabled/disabled state.
- When cache is enabled, shows hit rate, hits, misses, writes, deletes, clears, and metrics by cache type.
- Supports reset all cache with confirmation.
- Refreshes cache stats after successful reset.

## Functional Blocks

| Block            | Shows                                                                          | Visible when             | UX note                                                |
| ---------------- | ------------------------------------------------------------------------------ | ------------------------ | ------------------------------------------------------ |
| Disabled state   | `Caching is disabled` and configuration hint                                   | Cache disabled           | Avoids empty metrics when cache is off.                |
| Summary stats    | Hit rate, hits, misses, writes, deletes, clears                                | Cache enabled            | Provides top-level health snapshot.                    |
| Category metrics | Key, hits, misses, writes, deletes, hit rate by cache type                     | Cache enabled            | Helps identify which cache area is effective or noisy. |
| Reset action     | Reset all cache button                                                         | Cache enabled            | Opens destructive confirmation.                        |
| Reset dialog     | Warning that rows, revisions, auth, and billing caches are flushed and rebuilt | Reset action opened      | Requires explicit confirmation before flushing.        |
| Feedback         | Reset success or reset error                                                   | Reset completes or fails | Keeps the admin on the diagnostics page.               |

## Primary Actions

| Action                | Trigger                              | Available when                     | Result                               | Failure/recovery                                      |
| --------------------- | ------------------------------------ | ---------------------------------- | ------------------------------------ | ----------------------------------------------------- |
| Inspect cache metrics | Page load                            | Cache is enabled                   | Summary and category metrics render  | Loading or error feedback remains on failed load      |
| Reset all cache       | `Reset All Cache` button             | Cache is enabled and reset is idle | Confirmation dialog opens            | Cancel closes dialog without changes                  |
| Confirm reset         | `Reset Cache` in confirmation dialog | Confirmation dialog open           | Cache is flushed and metrics refresh | Error feedback appears and current page stays visible |

## Optional Features And Gates

- Metrics and reset are available only when caching is enabled.
- Disabled state is controlled by `CACHE_ENABLED`.
- Reset all cache is an admin-only operational action.

## States

| State              | UX                                                               |
| ------------------ | ---------------------------------------------------------------- |
| Disabled           | Shows disabled card and `Set CACHE_ENABLED=1 to enable caching.` |
| Loading            | Shows stat loading while metrics load.                           |
| Enabled            | Shows summary and category metrics.                              |
| Reset confirmation | Shows warning dialog before flush.                               |
| Reset success      | Shows success feedback and refreshes stats.                      |
| Reset error        | Shows error feedback and leaves current stats visible.           |

## Transitions

- Reset action opens confirmation dialog.
- Confirming reset flushes caches, closes/updates the dialog flow, and refreshes metrics on success.
- Cancelling reset returns to the metrics page unchanged.

## Permissions And Configuration

- Requires auth plus system admin permission.
- `CACHE_ENABLED=1` is required for enabled metrics/reset behavior.

## Copy And Messages

- Disabled title: `Caching is disabled`
- Disabled hint: `Set CACHE_ENABLED=1 to enable caching.`
- Summary cards: `Hit Rate`, `Hits`, `Misses`, `Writes`, `Deletes`, `Clears`
- Category title: `By Cache Type`
- Reset action: `Reset All Cache`
- Reset confirmation title: `Reset All Cache`
- Reset confirmation question: `Are you sure you want to clear the entire cache?`
- Reset confirm button: `Reset Cache`
- Reset cancel button: `Cancel`
- Reset success: `Cache has been cleared successfully`
- Reset warning mentions rows, revisions, auth, and billing caches.

## Open Questions

- Should reset all cache require typing a confirmation phrase for production environments?
- Should category metrics link to cache-specific diagnostics or recent invalidation events?
