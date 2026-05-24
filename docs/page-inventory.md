# Admin Page Inventory

Source: `revisium-admin` routes inspected on 2026-05-05.

For behavior-level detail, see [Page Functionality Reference](./page-functionality.md).

## Utility And Auth Pages

| Route               | UX responsibility                                          | Current gate/state                         |
| ------------------- | ---------------------------------------------------------- | ------------------------------------------ |
| `/`                 | Entry page after auth, organization/project starting point | `checkAuth` plus main-page loader          |
| `/username`         | Complete missing username                                  | Reached after auth when username is absent |
| `/login`            | Email/password sign in                                     | Guest only                                 |
| `/login/google`     | Google OAuth callback/login                                | Guest plus provider check                  |
| `/login/github`     | GitHub OAuth callback/login                                | Guest plus provider check                  |
| `/logout`           | End session                                                | Auth required                              |
| `/signup`           | Account creation                                           | Signup enabled and guest only              |
| `/signup/completed` | Post-signup completion                                     | Signup flow                                |
| `/signup/confirm`   | Email code confirmation                                    | Signup flow                                |
| `/authorize`        | Auth handoff/authorization                                 | Auth required                              |
| `/get-token`        | Access-token retrieval                                     | Auth required                              |
| `/get-mcp-token`    | Backward-compatible MCP token entry                        | Redirect to `/get-token`                   |
| `/sandbox/*`        | Apollo Sandbox surface                                     | Separate sandbox route                     |

## Organization Pages

| Route                             | Route id               | UX responsibility              | Current gate/state                                    |
| --------------------------------- | ---------------------- | ------------------------------ | ----------------------------------------------------- |
| `/app/:organizationId`            | `organizationOverview` | Organization project list      | Auth required inside auth-or-public organization root |
| `/app/:organizationId/-/settings` | `organizationSettings` | Organization service API keys  | Auth required; sidebar label is `API Keys`            |
| `/app/:organizationId/-/members`  | `organizationMembers`  | Organization member management | Auth required; navigation permission-gated            |
| `/app/:organizationId/-/limits`   | `organizationLimits`   | Billing, plan, usage, limits   | Auth required; shown when billing is enabled          |

## Project Management Pages

These pages live under `/app/:organizationId/:projectName`.

| Route suffix  | Route id          | UX responsibility                                                      | Current gate/state                      |
| ------------- | ----------------- | ---------------------------------------------------------------------- | --------------------------------------- |
| `-/settings`  | `projectSettings` | Project name, visibility, project API keys, file usage, delete project | Shown when the user can access settings |
| `-/endpoints` | `endpoints`       | System and custom endpoint discovery/configuration                     | Project context                         |
| `-/branches`  | `branches`        | Branch list and branch creation                                        | Project context                         |
| `-/mcp`       | `projectMcp`      | MCP server entry/configuration                                         | Authenticated users only in sidebar     |
| `-/users`     | `projectUsers`    | Project user access                                                    | Shown when the user can manage users    |
| `-/api-keys`  | `projectApiKeys`  | Project-scoped service API keys                                        | Shown when the user can manage API keys |

## Branch And Revision Workbench Pages

These pages live under `/app/:organizationId/:projectName/:branchName/:revisionIdOrTag`.

| Route suffix      | Route id     | UX responsibility                                 | Current gate/state                        |
| ----------------- | ------------ | ------------------------------------------------- | ----------------------------------------- |
| index             | `revision`   | Schema/table overview and table stack editor      | Revision error widget handles load errors |
| `:tableId`        | `table`      | Table rows and table-level work                   | Database layout                           |
| `:tableId/:rowId` | `row`        | Row stack and row editor                          | Database layout                           |
| `-/changes`       | `changes`    | Revision/table changes, commit, revert            | Branch page layout                        |
| `-/changes/rows`  | none         | All row-level changes                             | Nested under changes                      |
| `-/assets`        | `assets`     | File asset overview, filters, asset detail drawer | Branch page layout                        |
| `-/migrations`    | `migrations` | Migration list, preview, apply flows              | Branch page layout                        |
| `-/relations`     | `relations`  | Table relation view                               | Branch page layout                        |
| `-/branch-map`    | `branchMap`  | Branch graph/map                                  | Branch page layout                        |

## System Admin Pages

| Route                  | Route id             | UX responsibility                     | Current gate/state                |
| ---------------------- | -------------------- | ------------------------------------- | --------------------------------- |
| `/admin`               | `admin`              | System totals: users, projects        | Auth plus system admin permission |
| `/admin/users`         | `adminUsers`         | Search, paginate, create system users | System admin shell                |
| `/admin/users/:userId` | `adminUserDetail`    | User info and password reset          | System admin shell                |
| `/admin/organizations` | `adminOrganizations` | Future organization administration    | Currently `Coming soon`           |
| `/admin/cache`         | `adminCache`         | Cache metrics and reset all cache     | Confirmation dialog for reset     |

## Inventory Maintenance Rules

- Add every new route here in the same PR that adds the frontend route.
- Include route id when one exists. If a route has no id, leave it as `none` rather than inventing one.
- Keep route ids and UX responsibilities stable enough for designers, PMs, QA, and engineers to share the same page vocabulary.
- When navigation hides a page behind permissions, document the permission behavior in the state column.
- Move obsolete pages to a `Legacy / Migration` section instead of deleting context silently.
