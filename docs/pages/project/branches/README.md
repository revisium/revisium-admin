# Branches

Route: `/app/:organizationId/:projectName/-/branches`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Lists project branches, explains branch/revision concepts, and lets permitted users create or delete branches.

## Context And Entry

- Parent context: project.
- Parent shell: project sidebar under `Branches`.
- Sidebar entry: `All Branches`.
- Related surface: branch map visualizes the same branch/revision graph.

## Functionality

- Lists project branches with virtualized pagination.
- Explains default branch, child branches, draft, head, and revision history in hover help.
- Creates a new branch from a selected branch and committed revision.
- Refreshes the list after branch create/delete.
- Opens a branch to its draft revision.
- Shows default and uncommitted badges on branch cards.

## Functional Blocks

| Block                | Shows                                                  | Visible when                   | UX note                                                                              |
| -------------------- | ------------------------------------------------------ | ------------------------------ | ------------------------------------------------------------------------------------ |
| Header               | `Branches`, optional `New branch`, branch concept help | List state                     | Help explains default, child branches, Draft, Head, and commit history               |
| Branch list          | Branch card rows                                       | Branches returned              | Root branch is labeled `default`; touched branches show `uncommitted`                |
| Create branch dialog | Source branch, source revision, new branch name        | User opens create              | Source revision list excludes draft-only selection and requires a committed revision |
| Delete popover       | Confirmation copy and cancel/delete actions            | Deletable branch trash clicked | Warns associated endpoints will be disabled                                          |
| Empty state          | `No branches found`                                    | No branches returned           | No create action in empty state today                                                |

## Primary Actions

| Action                 | Trigger                  | Available when                                         | Result                                         | Failure/recovery                     |
| ---------------------- | ------------------------ | ------------------------------------------------------ | ---------------------------------------------- | ------------------------------------ |
| Open create dialog     | `New branch`             | User can create branches                               | Create dialog opens and branch options load    | Cancel closes dialog                 |
| Select source branch   | Source branch select     | Dialog open and branches loaded                        | Source revisions load                          | Spinner appears while revisions load |
| Select source revision | Revision item            | Source branch selected and revisions exist             | New branch name field appears                  | `No revisions available` if none     |
| Create branch          | `Create branch` or Enter | Source revision selected, name non-empty, not creating | Branch is created, dialog closes, list reloads | Button loading ends if request fails |
| Open branch            | Branch name/card link    | Branch exists                                          | Navigates to branch draft                      | Route change                         |
| Delete branch          | Delete confirmation      | Branch can be deleted                                  | Branch is deleted and list reloads             | Cancel closes popover                |
| Load more branches     | List end reached         | More pages exist                                       | Next page appended                             | Existing list remains visible        |

## Optional Features And Gates

| Feature                   | Gate                                                          | Visible/active when   | Hidden/disabled when                | Result                      |
| ------------------------- | ------------------------------------------------------------- | --------------------- | ----------------------------------- | --------------------------- |
| Create branch             | Project create-branch permission                              | Permission granted    | Permission absent                   | `New branch` button appears |
| Delete branch             | Project delete-branch permission plus branch deletable status | Branch can be deleted | Default branch or permission absent | Delete action appears       |
| Default badge             | Branch is root/default                                        | Root branch card      | Child branches                      | `default` marker appears    |
| Uncommitted badge         | Branch has draft changes                                      | Branch touched        | No draft changes                    | `uncommitted` badge appears |
| Source revision selection | Source branch has committed revisions                         | Revisions loaded      | No committed revisions              | Revision list appears       |

## States

| State                    | Trigger/source                            | UI behavior                     | User path forward                                     |
| ------------------------ | ----------------------------------------- | ------------------------------- | ----------------------------------------------------- |
| Loading                  | Branch list request in flight             | Centered spinner                | Wait                                                  |
| Error                    | Branch list fails                         | `Error loading branches`        | Refresh or retry later                                |
| Empty                    | Branch list empty                         | `No branches found`             | Create branch if header action is available elsewhere |
| List                     | Branches returned                         | Header, help, virtualized cards | Open/create/delete                                    |
| Loading source branches  | Create dialog opens                       | Source select disabled/loading  | Wait                                                  |
| Loading source revisions | Source branch selected                    | Spinner in revision area        | Wait                                                  |
| No source revisions      | Source branch has no selectable revisions | `No revisions available`        | Choose another branch                                 |
| Creating                 | Create request in flight                  | `Create branch` loading         | Wait                                                  |

## Transitions

| From          | Trigger                  | Condition          | To                    | Feedback                         |
| ------------- | ------------------------ | ------------------ | --------------------- | -------------------------------- |
| List          | `New branch` clicked     | Permission granted | Create dialog         | Source branches load             |
| Create dialog | Source branch selected   | Branch exists      | Revision selection    | Revisions load                   |
| Create dialog | Source revision selected | Revision exists    | Name input            | New branch name becomes editable |
| Create dialog | Create succeeds          | Valid input        | Reloaded list         | Dialog closes                    |
| Branch card   | Branch opened            | Branch exists      | Branch draft database | Route change                     |
| Branch card   | Delete confirmed         | Branch deletable   | Reloaded list         | Popover closes                   |

## Permissions And Configuration

- Supports loading, error, empty, and list states.
- Create branch is shown when the user can create branches.
- Default branch behavior is called out as non-deletable in the UI copy.

## Copy And Messages

- Header: `Branches`.
- Button: `New branch`.
- Help copy covers `Default branch`, `Child branches`, `Draft`, `Head`.
- Create dialog: `Create new branch`, `Source branch`, `Source revision`, `New branch name`.
- Empty: `No branches found`.
- Delete copy: deleting a branch also disables endpoints associated with the branch.

## Open Questions

- Should empty state include `New branch` when the user can create branches?
- Should branch deletion require a stronger confirmation for branches with endpoints?
