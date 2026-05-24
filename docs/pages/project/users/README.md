# Project Users

Route: `/app/:organizationId/:projectName/-/users`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Lets project administrators review project users, add users, update roles, and remove users from the current project.

## Context And Entry

- Parent context: project.
- Parent shell: project sidebar under `Management`.
- Sidebar entry: `Users`, shown when the user can manage project users.
- Route gate: project context must load first.

## Functionality

- Lists project users with pagination.
- Opens an add-user modal.
- Adds an existing user or creates and adds a user when system permissions allow it.
- Allows inline role changes when the user can update project users.
- Removes project users when the user can delete project users.

## Functional Blocks

| Block          | Shows                                                                  | Visible when     | UX note                                                    |
| -------------- | ---------------------------------------------------------------------- | ---------------- | ---------------------------------------------------------- |
| Header         | `Users (count)`, subtitle, optional `Add`                              | List state       | `Add` follows project add-user permission                  |
| Empty state    | `No users in this project`, subtitle, optional `Add`                   | No users         | Same add gate as list header                               |
| User cards     | Display name, email, role select or role label, optional remove action | Users returned   | Role select appears only with update-user permission       |
| Add user modal | Search/create tabs, role select, submit buttons                        | Add clicked      | Create tab appears only with system create-user permission |
| Load more      | `Load more`                                                            | More pages exist | Appends next page                                          |

## Primary Actions

| Action               | Trigger                  | Available when                                                    | Result                                                                       | Failure/recovery                     |
| -------------------- | ------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------ |
| Open add modal       | `Add` button             | User can add project users                                        | Modal opens on search tab                                                    | Cancel/close resets modal            |
| Search existing user | Search input             | Modal search tab open and query non-empty                         | Debounced results appear                                                     | Empty result shows `No users found`  |
| Add selected user    | `Add User`               | Search result selected and not adding                             | User is added with selected project role; modal closes; list reloads         | Button loading ends if request fails |
| Create and add user  | `Create & Add`           | Create tab visible, username non-empty, password at least 6 chars | New system user is created, added to project, modal closes, list reloads     | Button loading ends if request fails |
| Change role          | Role select on user card | User can update project users                                     | Role updates in place                                                        | Spinner appears while updating       |
| Remove user          | Trash action             | User can delete project users                                     | User is removed immediately and list reloads; no confirmation is shown today | Button loading ends if request fails |
| Load more            | `Load more`              | More pages exist                                                  | Next page appends                                                            | Existing list remains visible        |

## Optional Features And Gates

| Feature             | Gate                               | Visible/active when            | Hidden/disabled when | Result                                   |
| ------------------- | ---------------------------------- | ------------------------------ | -------------------- | ---------------------------------------- |
| Sidebar entry       | Project user-management permission | User can add/read/manage users | Permission absent    | `Users` appears in management nav        |
| Add user            | Project add-user permission        | Permission granted             | Permission absent    | `Add` appears                            |
| Create new user tab | System create-user permission      | Permission granted             | Permission absent    | Modal can create a user and add them     |
| Role edit           | Project update-user permission     | Permission granted             | Permission absent    | Role select appears instead of role text |
| Remove user         | Project delete-user permission     | Permission granted             | Permission absent    | Trash action appears                     |

## States

| State               | Trigger/source                      | UI behavior                               | User path forward                        |
| ------------------- | ----------------------------------- | ----------------------------------------- | ---------------------------------------- |
| Initial loading     | First users request                 | Centered spinner                          | Wait                                     |
| Error               | Users request fails                 | `Error loading users`                     | Refresh or retry later                   |
| Empty               | Total count is zero                 | Empty project users message               | Add user if permitted                    |
| List                | Users returned                      | Header count, cards, optional load more   | Review, add, update roles, remove        |
| Searching           | Modal search request in flight      | Spinner in modal result area              | Wait                                     |
| No search results   | Search returns empty                | `No users found`                          | Refine query or create user if permitted |
| Updating role       | Role request in flight              | Spinner near role select; remove disabled | Wait                                     |
| Mutating membership | Add/create/remove request in flight | Relevant button loading                   | Wait                                     |

## Transitions

| From       | Trigger                    | Condition          | To            | Feedback                   |
| ---------- | -------------------------- | ------------------ | ------------- | -------------------------- |
| List/empty | Add clicked                | Permission granted | Add modal     | Modal reset to search tab  |
| Add modal  | Existing user added        | User selected      | Reloaded list | Modal closes               |
| Add modal  | New user created and added | Create tab valid   | Reloaded list | Modal closes               |
| User card  | Role changed               | Permission granted | Updated card  | Spinner while request runs |
| User card  | Remove clicked             | Permission granted | Reloaded list | Card/action loading        |

## Permissions And Configuration

- Sidebar item is shown when the user can manage users.
- Add user depends on project add-user permission.
- Create-and-add depends on system create-user permission.

## Copy And Messages

- Header: `Users`.
- Empty title: `No users in this project`.
- Empty subtitle: `Add team members to collaborate on this project`.
- Subtitle: `Manage team members and their access levels for this project.`
- Modal title: `Add User to Project`.
- Role labels: `Developer`, `Editor`, `Reader`.

## Open Questions

- Should remove-user require a confirmation before the user loses project access?
