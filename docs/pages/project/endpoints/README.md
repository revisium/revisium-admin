# Endpoints

Route: `/app/:organizationId/:projectName/-/endpoints`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Manages generated and custom API endpoints for the project across GraphQL, REST API, and system API surfaces.

## Context And Entry

- Parent context: project.
- Parent shell: project sidebar under `Management`.
- Sidebar entry: `Endpoints`.
- Related pages: project settings controls public/private access; sandbox/swagger links open endpoint tooling.

## Functionality

- Shows generated GraphQL and REST API endpoints for branch Draft and Head revisions.
- Shows custom endpoints for specific revisions.
- Shows System API documentation/links.
- Displays project public/private access badge with link to settings when the user can update the project.
- Shows endpoint usage and endpoint limit.
- Supports creating custom endpoints for selected branch/revision.
- Supports deleting custom endpoints and toggling generated endpoints where permitted.

## Functional Blocks

| Block                  | Shows                                            | Visible when                             | UX note                                                     |
| ---------------------- | ------------------------------------------------ | ---------------------------------------- | ----------------------------------------------------------- |
| Header                 | `Endpoints`, access badge, optional `Add custom` | Page ready                               | Access badge explains public/private API behavior           |
| Endpoint usage         | Limit badge, usage text, optional limit warning  | Page ready                               | Blocks creation when current usage reaches plan limit       |
| Help text              | Draft/Head/revision explanation                  | Page ready                               | Explains stable Head versus mutable Draft endpoint behavior |
| Tabs                   | `GraphQL`, `REST API`, `System API`              | Page ready                               | GraphQL and REST share branch/custom endpoint layout        |
| Branch endpoint cards  | Draft and Head endpoint cards per branch         | GraphQL or REST tab                      | Switch toggles enable/disable generated endpoints           |
| Custom revisions       | Custom endpoint cards                            | Custom endpoints exist for selected type | Cards are read-only revision endpoints                      |
| System API cards       | System REST and GraphQL URL actions              | System API tab                           | Links/copy actions for management APIs                      |
| Create endpoint dialog | Type, branch, revision, duplicate/limit warnings | `Add custom` clicked                     | Only committed non-Draft/Head revisions are selectable      |

## Primary Actions

| Action                      | Trigger                      | Available when                                                                | Result                                                                | Failure/recovery                                 |
| --------------------------- | ---------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------ |
| Switch endpoint tab         | Tab click                    | Page ready                                                                    | Selected endpoint type/view changes                                   | Local state only                                 |
| Open custom endpoint dialog | `Add custom`                 | User can create endpoints and limit not reached                               | Dialog opens                                                          | Button disabled with limit reason when locked    |
| Create custom endpoint      | `Create` in dialog           | Type and selectable revision chosen, no duplicate endpoint, limit not reached | Endpoint created, dialog closes, endpoint list reloads                | Button disabled for duplicates/invalid selection |
| Enable generated endpoint   | Draft/Head switch turned on  | User can create endpoint and limit not reached                                | Endpoint is created for that revision/type                            | Switch disabled while loading                    |
| Disable generated endpoint  | Draft/Head switch turned off | User can delete endpoint                                                      | Confirmation popover opens; confirm disables endpoint                 | Cancel keeps endpoint enabled                    |
| Delete custom endpoint      | Trash action                 | User can delete endpoint                                                      | Confirmation popover opens; confirm deletes endpoint and reloads list | Cancel keeps endpoint                            |
| Copy URL                    | Copy action                  | Endpoint enabled/card visible                                                 | URL copied and toast appears                                          | Clipboard failure is not separately surfaced     |
| Open tooling                | Sandbox/Swagger action       | URL available                                                                 | Opens external tool route in new tab                                  | Browser handles new tab                          |
| Change visibility           | Access badge settings link   | User can update project                                                       | Navigates to project settings                                         | Route change                                     |

## Optional Features And Gates

| Feature                    | Gate                                                              | Visible/active when                      | Hidden/disabled when               | Result                               |
| -------------------------- | ----------------------------------------------------------------- | ---------------------------------------- | ---------------------------------- | ------------------------------------ |
| Custom endpoint creation   | Project create-endpoint permission and endpoint usage below limit | Permission granted and limit not reached | Permission absent or limit reached | `Add custom` appears/enables         |
| Endpoint limit warning     | Endpoint usage at or above limit                                  | Limit reached                            | Limit not reached or unlimited     | Warning explains upgrade/remove path |
| Generated endpoint enable  | Create-endpoint permission and endpoint disabled                  | Permission granted, not locked           | Permission absent or limit reached | Switch can enable endpoint           |
| Endpoint disable/delete    | Delete-endpoint permission and endpoint exists                    | Permission granted                       | Permission absent                  | Confirmation controls available      |
| Access badge settings link | Project update permission                                         | User can update project                  | Permission absent                  | Badge shows read-only explanation    |
| Public/private access      | Project visibility                                                | Project public or private                | N/A                                | Badge explains auth requirement      |
| Custom revision list       | Custom endpoints exist for selected type                          | At least one custom endpoint             | None exist                         | Custom section hidden                |

## States

| State                     | Trigger/source                                                | UI behavior                             | User path forward               |
| ------------------------- | ------------------------------------------------------------- | --------------------------------------- | ------------------------------- |
| Loading                   | Branch/endpoints requests in flight                           | Centered spinner                        | Wait                            |
| Error                     | Branches or endpoints fail                                    | `Error loading endpoints`               | Refresh or retry later          |
| Ready                     | Data loaded                                                   | Header, tabs, endpoint sections         | Manage endpoints                |
| Limit reached             | Usage current >= limit                                        | Orange warning; create actions disabled | Remove endpoint or upgrade plan |
| Duplicate custom endpoint | Selected revision already has selected endpoint type          | Revision option disabled/message shown  | Pick another type/revision      |
| No custom revisions       | Selected branch has no committed revisions outside Draft/Head | Warning in dialog                       | Make a commit first             |
| Mutating                  | Create/delete request in flight                               | Card/dialog control loading             | Wait                            |

## Transitions

| From          | Trigger              | Condition           | To                          | Feedback                                        |
| ------------- | -------------------- | ------------------- | --------------------------- | ----------------------------------------------- |
| Ready         | Tab selected         | Any tab             | Same page with selected tab | Branch/custom sections rebuild for GraphQL/REST |
| Ready         | `Add custom` clicked | Creation allowed    | Create dialog               | Dialog starts with GraphQL type                 |
| Create dialog | Branch selected      | Branch exists       | Revision list               | Revisions load                                  |
| Create dialog | Create succeeds      | Valid type/revision | Reloaded endpoint list      | Dialog closes                                   |
| Endpoint card | Enable switch        | Creation allowed    | Enabled endpoint            | Card/action loading                             |
| Endpoint card | Disable confirmed    | Delete allowed      | Disabled endpoint           | Confirmation closes                             |
| Custom card   | Delete confirmed     | Delete allowed      | Reloaded custom list        | Confirmation closes                             |

## Permissions And Configuration

- Supports loading and error states.
- Create custom endpoint is shown when the user can create endpoints and endpoint limit is not reached.
- Delete endpoint depends on delete-endpoint permission.
- Project access badge edit path depends on update-project permission.

## Copy And Messages

- Header: `Endpoints`.
- Tabs: `GraphQL`, `REST API`, `System API`.
- Button: `Add custom`.
- Limit warning: `Endpoint limit reached for this project. Upgrade your plan or remove an endpoint to create another one.`
- Create dialog: `Create Endpoint`, `Type`, `Branch`, `Revision`.
- No revisions warning: `No revisions available besides Draft/Head. Make a commit to create additional versions.`
- Disable/delete warnings: endpoint will be disabled/deleted and API consumers will lose access.

## Open Questions

- Should limit warning link directly to Billing when available?
- Should endpoint disable/delete confirmations include the endpoint URL/type for safer review?
