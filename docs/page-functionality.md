# Admin Page Functionality Reference

Source: `revisium-admin` pages, models, routes, sidebars, and layouts inspected on 2026-05-05.

Each page has its own folder. Keep [Page Inventory](./page-inventory.md) focused on route lookup; keep page folders focused on product behavior, user actions, states, and permission effects.

Use [Page Documentation Guidelines](./page-documentation-guidelines.md) when adding or updating page files.

## Utility And Auth Pages

| Page                                                           | Route               |
| -------------------------------------------------------------- | ------------------- |
| [Main Page](./pages/utility-auth/main/)                        | `/`                 |
| [Username Completion](./pages/utility-auth/username/)          | `/username`         |
| [Login](./pages/utility-auth/login/)                           | `/login`            |
| [Google OAuth Callback](./pages/utility-auth/login-google/)    | `/login/google`     |
| [GitHub OAuth Callback](./pages/utility-auth/login-github/)    | `/login/github`     |
| [Logout](./pages/utility-auth/logout/)                         | `/logout`           |
| [Sign Up](./pages/utility-auth/signup/)                        | `/signup`           |
| [Signup Completion](./pages/utility-auth/signup-completed/)    | `/signup/completed` |
| [Email Confirmation](./pages/utility-auth/confirm-email-code/) | `/signup/confirm`   |
| [OAuth Authorization Consent](./pages/utility-auth/authorize/) | `/authorize`        |
| [Access Token](./pages/utility-auth/get-token/)                | `/get-token`        |
| [MCP Token Redirect](./pages/utility-auth/get-mcp-token/)      | `/get-mcp-token`    |
| [Apollo Sandbox](./pages/utility-auth/sandbox/)                | `/sandbox/*`        |

## Organization Pages

| Page                                                     | Route                             |
| -------------------------------------------------------- | --------------------------------- |
| [Organization Projects](./pages/organization/projects/)  | `/app/:organizationId`            |
| [Organization API Keys](./pages/organization/api-keys/)  | `/app/:organizationId/-/settings` |
| [Organization Members](./pages/organization/members/)    | `/app/:organizationId/-/members`  |
| [Billing And Usage](./pages/organization/billing-usage/) | `/app/:organizationId/-/limits`   |

## Project Management Pages

| Page                                          | Route                                           |
| --------------------------------------------- | ----------------------------------------------- |
| [Project Settings](./pages/project/settings/) | `/app/:organizationId/:projectName/-/settings`  |
| [Endpoints](./pages/project/endpoints/)       | `/app/:organizationId/:projectName/-/endpoints` |
| [Branches](./pages/project/branches/)         | `/app/:organizationId/:projectName/-/branches`  |
| [MCP Server](./pages/project/mcp-server/)     | `/app/:organizationId/:projectName/-/mcp`       |
| [Project Users](./pages/project/users/)       | `/app/:organizationId/:projectName/-/users`     |
| [Project API Keys](./pages/project/api-keys/) | `/app/:organizationId/:projectName/-/api-keys`  |

## Branch And Revision Workbench Pages

Routes shown as suffixes are relative to `/app/:organizationId/:projectName/:branchName/:revisionIdOrTag`; full paths are absolute.

| Page                                                        | Route                                                            |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
| [Database / Revision](./pages/workbench/database-revision/) | `/app/:organizationId/:projectName/:branchName/:revisionIdOrTag` |
| [Table Rows](./pages/workbench/table-rows/)                 | `:tableId`                                                       |
| [Row Detail](./pages/workbench/row-detail/)                 | `:tableId/:rowId`                                                |
| [Table Changes](./pages/workbench/table-changes/)           | `-/changes`                                                      |
| [Row Changes](./pages/workbench/row-changes/)               | `-/changes/rows`                                                 |
| [Assets](./pages/workbench/assets/)                         | `-/assets`                                                       |
| [Migrations](./pages/workbench/migrations/)                 | `-/migrations`                                                   |
| [Table Relations](./pages/workbench/table-relations/)       | `-/relations`                                                    |
| [Branch Map](./pages/workbench/branch-map/)                 | `-/branch-map`                                                   |

## System Admin Pages

| Page                                                        | Route                  |
| ----------------------------------------------------------- | ---------------------- |
| [Admin Dashboard](./pages/system-admin/dashboard/)          | `/admin`               |
| [System Users](./pages/system-admin/users/)                 | `/admin/users`         |
| [System User Detail](./pages/system-admin/user-detail/)     | `/admin/users/:userId` |
| [System Organizations](./pages/system-admin/organizations/) | `/admin/organizations` |
| [System Cache](./pages/system-admin/cache/)                 | `/admin/cache`         |

## Layout And Error Surfaces

| Surface                                                   | Role                          |
| --------------------------------------------------------- | ----------------------------- |
| [Project Layout](./pages/layouts/project-layout/)         | Project route shell           |
| [Branch Page Layout](./pages/layouts/branch-page-layout/) | Branch-scoped page shell      |
| [Database Layout](./pages/layouts/database-layout/)       | Database/table/row page shell |
| [Project Not Found](./pages/layouts/project-not-found/)   | Project load failure page     |
