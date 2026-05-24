# Admin Navigation And Context Model

Source: `revisium-admin` route and sidebar behavior inspected on 2026-05-05.

## Route Layers

`revisium-admin` has four route layers with different UX jobs.

| Layer             | Route base                                                         | UX job                                                                          | Current gate                                               |
| ----------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Utility and auth  | `/`, `/login`, `/signup`, `/authorize`, `/get-token`, `/sandbox/*` | Entry, authentication, token handoff, sandbox access                            | Mixed guest/auth loaders                                   |
| Organization      | `/app/:organizationId`                                             | Organization project list, organization members, organization API keys, billing | Public gate at org root, auth for protected child pages    |
| Project workbench | `/app/:organizationId/:projectName`                                | Project, branch, revision, schema, data, endpoint, user, and asset work         | Auth-or-public project loader, then page-level permissions |
| System admin      | `/admin`                                                           | Installation/system administration                                              | Auth plus system admin permission                          |

## Context Hierarchy

The admin app should preserve this mental model everywhere:

```text
Organization -> Project -> Branch -> Revision -> Table -> Row
```

Use this hierarchy for navigation, breadcrumbs, empty states, and copy. Avoid introducing parallel names for the same context.

## Organization Navigation

The organization sidebar currently exposes:

| Item     | Route                             | Visibility                                     |
| -------- | --------------------------------- | ---------------------------------------------- |
| Projects | `/app/:organizationId`            | Always in organization context                 |
| Members  | `/app/:organizationId/-/members`  | When the user can manage members               |
| API Keys | `/app/:organizationId/-/settings` | When the user can manage organization API keys |
| Billing  | `/app/:organizationId/-/limits`   | When billing is enabled                        |

UX rule: organization navigation should stay about organization-level resources only. Project-level controls should stay inside the project sidebar.

## Project Navigation

The project sidebar is the main workbench navigation. It has three groups.

| Group                   | Items                                                  | UX role                                                      |
| ----------------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| Current branch/revision | Database, Changes, Assets, Table Relations, Migrations | Work inside the selected branch/revision                     |
| Branches                | All Branches, Branch Map                               | Manage and compare project branch structure                  |
| Management              | Endpoints, MCP Server, Users, API Keys, Settings       | Configure project access, integrations, and project metadata |

The current branch/revision selector is part of the navigation label, not a secondary toolbar. It opens branch and revision lists and exposes branch actions where permitted:

- create branch
- commit changes into a revision
- revert draft changes

UX rules:

- Always keep the branch/revision selector visible on branch-scoped pages.
- Use `draft` as the editable default. Treat non-draft revisions as read-only.
- When the user is in a read-only revision, show the read-only banner and link to the draft revision.
- Keep branch actions close to the branch selector because they change the current branch/revision state.

## System Admin Navigation

The system admin area is separate from product/project work:

| Item          | Route                  | UX role                                  |
| ------------- | ---------------------- | ---------------------------------------- |
| Dashboard     | `/admin`               | System-level totals and health summaries |
| Users         | `/admin/users`         | System user list and creation            |
| User detail   | `/admin/users/:userId` | System user details and password reset   |
| Organizations | `/admin/organizations` | Future organization administration       |
| Cache         | `/admin/cache`         | Cache metrics and reset action           |

UX rules:

- Keep `/admin` visually distinct from project work. It should not inherit organization/project/branch controls.
- Use breadcrumbs inside system admin pages because the sidebar only gives the section, not the record context.
- Destructive system actions must use confirmation dialogs with plain consequence copy.

## Public And Auth Behavior

Current loader behavior:

| Route family                     | Behavior                                                                  |
| -------------------------------- | ------------------------------------------------------------------------- |
| Auth-required utility pages      | Redirect unauthenticated users to login or signup with redirect parameter |
| Guest pages                      | Redirect authenticated users back to `/`                                  |
| Organization/project public gate | Allow unauthenticated entry, then project loading determines access       |
| System admin                     | Require authenticated user and system read-user permission                |
| Sign up                          | Available only when signup is enabled                                     |

UX rules:

- Public project pages must make guest status clear without blocking read-only exploration.
- Auth-required actions on public pages should explain the missing permission and offer sign-in, not fail silently.
- Permission-hidden actions are acceptable for navigation, but page-level empty or denied states should explain why the expected action is absent.

## Known Follow-Ups

- Decide whether system admin dashboard and cache pages should use `AdminPageLayout` like users and organizations.
- Keep the organization `API Keys` sidebar label only while `/app/:organizationId/-/settings` remains an API-key page. Rename the route or label if organization settings expand beyond keys.
- Document mobile sidebar behavior after the target responsive rules are confirmed.
