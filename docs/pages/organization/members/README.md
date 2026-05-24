# Organization Members

Route: `/app/:organizationId/-/members`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Lets organization administrators review members, add users, and remove members from the active organization.

## Context And Entry

- Parent context: organization.
- Parent shell: organization sidebar.
- Sidebar entry: `Members`, shown when the user can manage organization members.
- Route gate: auth required.

## Functionality

- Lists organization members with pagination.
- Opens an add-member modal.
- Adds an existing user or creates and adds a user when system permissions allow it.
- Shows organization role per member.
- Removes members when the current user has removal permission for that member.

## Functional Blocks

| Block            | Shows                                                       | Visible when       | UX note                                                    |
| ---------------- | ----------------------------------------------------------- | ------------------ | ---------------------------------------------------------- |
| Header           | `Members (count)`, subtitle, `Add` button                   | List state         | `Add` appears only with add-user permission                |
| Empty state      | `No members in this organization`, subtitle, optional `Add` | No members         | Empty add action follows same permission gate              |
| Member cards     | Display name, email, role, optional remove action           | Members returned   | Role is display-only today on organization cards           |
| Add member modal | Search/create tabs, role select, submit buttons             | Add action clicked | Create tab appears only with system create-user permission |
| Load more        | `Load more`                                                 | More pages exist   | Appends next page                                          |

## Primary Actions

| Action               | Trigger        | Available when                                                    | Result                                                               | Failure/recovery                     |
| -------------------- | -------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------ |
| Open add modal       | `Add` button   | User can add organization users                                   | Modal opens on `Search User` tab                                     | Cancel/close resets modal            |
| Search existing user | Search input   | Modal search tab open and query non-empty                         | Debounced search results appear                                      | Empty result shows `No users found`  |
| Add selected user    | `Add User`     | Search result selected and not adding                             | User is added with selected role; modal closes; list reloads         | Button loading ends if request fails |
| Create and add user  | `Create & Add` | Create tab visible, username non-empty, password at least 6 chars | New system user is created, added to org, modal closes, list reloads | Button loading ends if request fails |
| Remove member        | Trash action   | Member can be removed                                             | Member is removed and list reloads                                   | Button loading ends if request fails |
| Load more            | `Load more`    | More pages exist                                                  | Next page of members appends                                         | Existing list remains visible        |

## Optional Features And Gates

| Feature             | Gate                             | Visible/active when           | Hidden/disabled when | Result                                              |
| ------------------- | -------------------------------- | ----------------------------- | -------------------- | --------------------------------------------------- |
| Sidebar entry       | Organization add-user permission | Permission granted            | Permission absent    | `Members` appears in organization nav               |
| Add member          | Organization add-user permission | Permission granted            | Permission absent    | `Add` button appears                                |
| Create new user tab | System create-user permission    | Permission granted            | Permission absent    | Modal can create a user and add them                |
| Role choices        | Organization role set            | Add modal open                | Modal closed         | User can choose Admin, Developer, Editor, or Reader |
| Remove member       | Member removal permission        | Permission granted for member | Permission absent    | Trash action appears                                |

## States

| State             | Trigger/source                      | UI behavior                             | User path forward                        |
| ----------------- | ----------------------------------- | --------------------------------------- | ---------------------------------------- |
| Initial loading   | First members request               | Centered spinner                        | Wait                                     |
| Error             | Members request fails               | `Error loading members`                 | Refresh or retry later                   |
| Empty             | Total count is zero                 | Empty organization members message      | Add member if permitted                  |
| List              | Members returned                    | Header count, cards, optional load more | Review, add, remove, or load more        |
| Searching         | Modal search request in flight      | Spinner in modal result area            | Wait                                     |
| No search results | Search returns empty                | `No users found`                        | Refine query or create user if permitted |
| Mutating          | Add/create/remove request in flight | Relevant button loading                 | Wait                                     |

## Transitions

| From        | Trigger                    | Condition          | To            | Feedback                           |
| ----------- | -------------------------- | ------------------ | ------------- | ---------------------------------- |
| List/empty  | Add clicked                | Permission granted | Add modal     | Modal reset to search tab          |
| Add modal   | Existing user added        | User selected      | Reloaded list | Modal closes                       |
| Add modal   | New user created and added | Create tab valid   | Reloaded list | Modal closes                       |
| Member card | Remove clicked             | Permission granted | Reloaded list | Card/action loading during request |
| List        | Load more clicked          | More pages exist   | Longer list   | Button loading                     |

## Permissions And Configuration

- Auth required.
- Add member is shown when the user can add users to the organization.
- Create-and-add depends on system create-user permission.

## Copy And Messages

- Header: `Members`.
- Empty title: `No members in this organization`.
- Empty subtitle: `Add team members to collaborate in this organization`.
- Subtitle: `Manage team members and their access levels for this organization.`
- Modal title: `Add Member to Organization`.
- Modal tabs: `Search User`, `Create New`.
- Role labels: `Admin`, `Developer`, `Editor`, `Reader`.

## Open Questions

- Should organization member roles be editable inline like project user roles?
- Should remove-member use a confirmation dialog before the destructive action?
