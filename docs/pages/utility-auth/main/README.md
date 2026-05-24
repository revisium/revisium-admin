# Main Page

Route: `/`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Provides the authenticated starting point for opening projects, creating a project, or entering system administration.

## Context And Entry

- Parent context: authenticated root route.
- Route gate: auth check plus main-page loader.
- Parent shell: product page with main sidebar and account control.

## Functionality

- Shows the authenticated user's project starting point.
- Lists projects available to the current user.
- Lets the user open inline project creation.
- Shows the main sidebar, account control, and an admin entry when the user has system user-read permission.

## Functional Blocks

| Block                   | Shows                                                                            | Visible when                                       | UX note                                                     |
| ----------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------- |
| Main sidebar            | Revisium title, external website/GitHub links, optional `Admin`, account control | Always after auth                                  | Admin link appears only for users who can read system users |
| Project create launcher | `Project` create button                                                          | Not currently creating                             | Opens inline project card                                   |
| Project create card     | Project name, optional branch/revision settings, approve/close controls          | Create mode active                                 | Optional settings appear only after project name is entered |
| Project list            | Current user's projects                                                          | Projects load successfully and at least one exists | Infinite list loads more as needed                          |
| Empty state             | `No projects yet` and create prompt                                              | No projects exist                                  | Create prompt opens the same inline create card             |

## Primary Actions

| Action                  | Trigger                                            | Available when             | Result                                                  | Failure/recovery                         |
| ----------------------- | -------------------------------------------------- | -------------------------- | ------------------------------------------------------- | ---------------------------------------- |
| Create project          | `Project` create button or empty-state create link | User is on main page       | Inline create card opens                                | Close button returns to list             |
| Submit project          | Approve button or Enter                            | Project name is entered    | Project is created; create card closes                  | Button loading ends if request fails     |
| Toggle project settings | Settings icon in create card                       | Project name is entered    | Branch name and source revision fields appear/disappear | Local state only                         |
| Open project            | Project list item                                  | Project exists             | Navigates to the project draft database route           | Route change                             |
| Open admin              | `Admin` sidebar item                               | User can read system users | Navigates to `/admin`                                   | Route is still protected by admin loader |

## Optional Features And Gates

| Feature                 | Gate                                      | Visible/active when                | Hidden/disabled when                      | Result                                        |
| ----------------------- | ----------------------------------------- | ---------------------------------- | ----------------------------------------- | --------------------------------------------- |
| Admin entry             | System user-read permission               | User has system admin-style access | Permission absent                         | Sidebar shows `/admin` entry                  |
| Inline create settings  | Project name entered and settings toggled | User opens settings on create card | No project name or settings closed        | Optional branch/from-revision inputs appear   |
| Empty-state create link | Create callback provided to project list  | No projects exist                  | Project list used without create callback | User can start first project from empty state |

## States

| State            | Trigger/source                 | UI behavior                                     | User path forward         |
| ---------------- | ------------------------------ | ----------------------------------------------- | ------------------------- |
| Loading projects | Project list request in flight | Centered spinner                                | Wait                      |
| Project list     | Projects returned              | Virtualized project list                        | Open project or load more |
| Empty            | No projects returned           | `No projects yet` and create prompt             | Create first project      |
| Error            | Project list fails             | `Could not load projects`, `Please retry later` | Refresh or retry later    |
| Creating         | User opens create card         | Create form replaces launcher/list              | Submit or close           |

## Transitions

| From         | Trigger         | Condition                   | To                     | Feedback                                   |
| ------------ | --------------- | --------------------------- | ---------------------- | ------------------------------------------ |
| Project list | Create clicked  | Always                      | Create card            | Inline form appears                        |
| Create card  | Close clicked   | Always                      | Project list           | Local state resets                         |
| Create card  | Project created | Request succeeds            | Project list           | Card closes; list can refresh on next load |
| Project list | Project clicked | Project has branch/revision | Project draft database | Route change                               |

## Permissions And Configuration

- Requires auth through the root route loader.
- Admin navigation is visible only with system user-read permission.

## Copy And Messages

- Sidebar title: `Revisium`.
- Empty state: `No projects yet`, `Create your first project to get started`.
- Error state: `Could not load projects`, `Please retry later`.
- Create placeholders: `project name`, `branch name`, `from revisionId`.

## Open Questions

- Should project creation errors be shown inline on the create card?
- Should the main page refresh the project list immediately after successful creation in all contexts?
