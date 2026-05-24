# Organization Projects

Route: `/app/:organizationId`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Shows the projects in the active organization and gives permitted users a direct path to create a new project.

## Context And Entry

- Parent context: organization.
- Parent shell: organization sidebar.
- Sidebar entry: `Projects`, always visible in organization context.
- Route gate: organization root allows public/project loading at the parent level, but this overview page requires auth.

## Functionality

- Lists projects for the active organization.
- Shows a dirty marker when a project's root branch has uncommitted work.
- Opens project creation inline when permitted.
- Refreshes the project list after a project is created.
- Opens a project directly on its root branch draft database route.

## Functional Blocks

| Block                   | Shows                                                                               | Visible when                                                           | UX note                                                        |
| ----------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| Organization sidebar    | Projects, permission-gated org items, account control                               | Always in organization context                                         | Keeps organization-level navigation separate from project work |
| Create project launcher | `Project` create button                                                             | User can create projects in the organization and create mode is closed | Opens inline create card                                       |
| Create project card     | Project name, optional branch/from-revision fields, approve/close/settings controls | Create mode active                                                     | Optional settings appear only after a project name exists      |
| Project list            | Project names and dirty marker                                                      | Projects load and count is greater than zero                           | Each item opens the project draft                              |
| Empty state             | `No projects yet`                                                                   | Project list is empty                                                  | No create prompt is shown inside this org empty state today    |

## Primary Actions

| Action                 | Trigger                 | Available when            | Result                                                           | Failure/recovery                        |
| ---------------------- | ----------------------- | ------------------------- | ---------------------------------------------------------------- | --------------------------------------- |
| Start project creation | `Project` create button | User can create a project | Inline create card replaces list controls                        | Close button cancels local create state |
| Submit project         | Approve button or Enter | Project name is entered   | Project is created, card closes, list reloads                    | Button loading ends if create fails     |
| Toggle create settings | Settings icon           | Project name is entered   | Optional branch name and source revision fields appear/disappear | Local state only                        |
| Open project           | Project row/name        | Project exists            | Navigates to root branch draft database                          | Route change                            |
| Load more projects     | List end reached        | More pages exist          | Next page is appended                                            | Existing list remains visible           |

## Optional Features And Gates

| Feature                | Gate                                                          | Visible/active when                       | Hidden/disabled when               | Result                                         |
| ---------------------- | ------------------------------------------------------------- | ----------------------------------------- | ---------------------------------- | ---------------------------------------------- |
| Create project         | Organization-level create-project permission                  | Permission granted                        | Permission absent                  | Create launcher is visible                     |
| Create branch settings | User toggles create-card settings after entering project name | Project name exists and settings are open | No project name or settings closed | Optional branch/from-revision inputs are shown |
| Dirty marker           | Root branch has uncommitted changes                           | Project is touched                        | No uncommitted changes             | `*` marker appears after project name          |

## States

| State    | Trigger/source                 | UI behavior                                     | User path forward                      |
| -------- | ------------------------------ | ----------------------------------------------- | -------------------------------------- |
| Loading  | Project list request in flight | Centered spinner                                | Wait                                   |
| Error    | Project list fails             | `Could not load projects`, `Please retry later` | Refresh or retry later                 |
| Empty    | Project list returns no items  | `No projects yet`                               | Use create button if permission allows |
| List     | Projects returned              | Virtualized list of project rows                | Open project or scroll for more        |
| Creating | User starts create flow        | Inline create card                              | Submit or close                        |

## Transitions

| From        | Trigger            | Condition               | To                     | Feedback                               |
| ----------- | ------------------ | ----------------------- | ---------------------- | -------------------------------------- |
| List/empty  | Create clicked     | Permission granted      | Create card            | Create form appears                    |
| Create card | Close clicked      | Always                  | List/empty             | Local state resets                     |
| Create card | Create succeeds    | Backend accepts request | Reloaded list          | New project should appear after reload |
| Project row | Click project name | Project has root branch | Project draft database | Route change                           |

## Permissions And Configuration

- Auth required inside the auth-or-public organization root.
- Create project is shown only with organization-level create-project permission.

## Copy And Messages

- Create button title: `Project`.
- Create placeholders: `project name`, `branch name`, `from revisionId`.
- Empty state: `No projects yet`.
- Error state: `Could not load projects`, `Please retry later`.

## Open Questions

- Should the organization empty state include a create prompt like the main page empty state?
- Should project visibility be shown in organization project rows, since the item model already knows it?
