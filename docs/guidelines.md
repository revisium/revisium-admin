# Admin UX/UI Guidelines

Source-backed first pass for `revisium-admin`.

## Product Posture

`revisium-admin` is an operational product surface for structured data work. It should feel quiet, precise, and repeatable:

- dense enough for repeated daily work
- clear about organization, project, branch, and revision context
- conservative with decoration
- explicit about permissions and read-only states
- optimized for scanning, editing, comparing, committing, and reverting data changes

Do not turn admin screens into landing pages. The first screen should be the usable product experience.

## Shell And Layout

Use the existing app shells as the baseline.

| Shell                | Surface                          | Usage                                                      |
| -------------------- | -------------------------------- | ---------------------------------------------------------- |
| Product shell        | Main admin page frame            | Organization, project, branch, revision, and utility pages |
| Organization sidebar | Organization-level navigation    | Organization pages                                         |
| Project sidebar      | Project and workbench navigation | Project and branch/revision pages                          |
| System admin shell   | System administration frame      | `/admin` pages                                             |

Layout rules:

- Keep the left sidebar as the primary navigation surface.
- Keep content within the current `Page` max width unless the page is a workbench that genuinely needs more space.
- Use sticky headers for breadcrumbs, title, search, filters, or primary actions when the page scrolls.
- Do not put page sections inside decorative outer cards. Use full-page content with local cards only for repeated records, stat cards, dialogs, and framed tools.
- Prefer compact section headings around `20px` for settings and management pages. Reserve larger type for true entry pages only.

## Navigation

The route hierarchy is:

```text
Organization -> Project -> Branch -> Revision -> Table -> Row
```

Navigation rules:

- Organization pages must stay focused on organization-level resources: projects, members, organization API keys, and billing.
- Project pages must keep project management separate from branch/revision work.
- Branch-scoped pages must keep the branch/revision selector visible.
- Keep `Database` as the default branch/revision workbench entry.
- Keep destructive or history-changing branch actions near the branch selector: create branch, commit changes, revert changes.
- Do not expose system admin pages inside organization or project navigation.

## Context And State

Every workbench page should answer:

- Which organization and project is active?
- Which branch and revision is active?
- Is the user editing `draft` or viewing a read-only revision?
- What changed locally in this draft?
- What action can the user safely take next?

Rules:

- Treat `draft` as mutable and non-draft revisions as read-only.
- On read-only revisions, show a persistent banner with a link back to the draft revision.
- Use a visible dirty marker for uncommitted branch/revision changes.
- Use branch/revision terms consistently. Do not replace them with generic words like "version" inside the app unless the surrounding copy explains the mapping.

## Page Types

Use these page patterns before inventing a new layout.

| Page type  | Examples                                               | Pattern                                                           |
| ---------- | ------------------------------------------------------ | ----------------------------------------------------------------- |
| Overview   | Organization projects, admin dashboard                 | Sparse summary plus clear entry points                            |
| Workbench  | Database, table, row, revision, assets, migrations     | Sidebar context, dense content, visible state, reversible actions |
| Management | Project settings, users, API keys, endpoints, branches | Sectioned form/list layout with one primary action per section    |
| Detail     | Admin user detail, asset detail drawer, row editor     | Stable identity header, facts first, dangerous actions separated  |
| Utility    | Login, signup, token, sandbox                          | Single-purpose flow with minimal navigation noise                 |

## Actions

Action rules:

- Use text buttons for clear commands such as `Add`, `Create`, `Save`, `Delete`, `Reset Cache`, and `Commit`.
- Use icon buttons for compact secondary tools when the icon is familiar and has a tooltip.
- Put the primary action in the sticky header or the relevant section header, not in a distant footer.
- Keep create actions close to the list they affect.
- Keep destructive actions in a visually separated danger area or confirmation dialog.
- For irreversible actions, require explicit confirmation copy and name the affected resource.

Current destructive examples to preserve:

- project delete asks the user to type the project name
- reset all cache uses a confirmation dialog and explains which cache groups are affected

## Permissions And Public Access

Rules:

- Hide navigation items for actions the user cannot access when the absence is not surprising.
- On a page the user can open but cannot modify, show the data and explain the missing permission near the disabled or absent action.
- For public projects, let guests read where allowed and offer sign-in only when the action requires authentication.
- System admin routes must stay gated by authenticated admin permission.
- Do not present API keys, member management, cache reset, or delete actions without the matching permission.

## Loading, Empty, Error, And Not Found States

State rules:

- Use skeletons for structural app loading, especially project context and sidebars.
- Use spinners for localized stat cards, lists, dialogs, and small panels.
- Empty states should say what is empty and, when useful, the next available action.
- Error states should say what failed and whether retrying is reasonable.
- Not-found states should avoid exposing private resource details.
- Avoid replacing the whole app shell with a spinner unless the shell context is unknown.

Current source patterns:

- `ProjectLayout` delays the project sidebar skeleton briefly to avoid flicker.
- admin users show loading, error, empty, and list states.
- branch/revision popovers show loading, error, empty, and list states.
- project load failure uses `NotFoundProjectPage`.

## Visual UI Rules

Use the existing Revisium admin visual language:

- light-first interface
- white page background
- mostly grayscale
- `newGray`/`gray` tokens before adding new colors
- 8px radius for cards, stat cards, and navigation items
- subtle borders over heavy shadows
- `react-icons/pi` icon family for existing admin icons unless the app moves to a shared icon standard later
- blue only for selection/link emphasis where already established
- red only for destructive or error states

Do not add decorative gradients, decorative orbs, oversized hero sections, or purely atmospheric imagery to the admin app.

## Copy Rules

- Use domain nouns in navigation: `Database`, `Changes`, `Assets`, `Migrations`, `Branches`, `Endpoints`, `API Keys`.
- Keep helper copy short and operational.
- Explain consequences, not implementation details, in confirmation dialogs.
- Use "read-only revision" when the user cannot edit the selected revision.
- Use "draft revision" when linking back to the editable state.
- Avoid generic CTA copy like "Learn more" on operational pages unless it opens product documentation.

## Current Open UX Decisions

| Decision                                                          | Why it matters                                                                                                                        |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Normalize system admin headers on `AdminPageLayout`               | Dashboard and cache currently duplicate breadcrumb/header layout instead of using the shared admin page layout.                       |
| Confirm organization settings naming                              | The route is `-/settings`, but the visible sidebar/page intent is organization API keys.                                              |
| Define mobile admin behavior                                      | The shared `Page` shell supports collapsed/hover sidebar behavior, but admin-specific responsive expectations are not yet documented. |
| Decide how public project permissions are shown                   | Public project loading is allowed before auth, but action-level guest messaging needs a consistent pattern.                           |
| Replace `Coming soon` admin organization page when scope is known | The system admin organization surface currently has no product behavior to guide.                                                     |

## Change Rule

When changing `revisium-admin` UX, update this source-of-truth area in the same PR if the change affects:

- route structure
- navigation grouping
- organization/project/branch/revision context
- permissions and public access
- loading, empty, error, or not-found behavior
- page-level primary actions
- destructive action confirmation
- shared visual language
