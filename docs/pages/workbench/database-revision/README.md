# Database / Revision

Route: `/app/:organizationId/:projectName/:branchName/:revisionIdOrTag`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Main database workbench entry for a branch revision, focused on table discovery, table schema editing, and choosing tables for data work.

## Context And Entry

- Parent context: project plus branch/revision.
- Parent shell: database layout with project sidebar.
- Sidebar entry: `Database`.
- Related child pages: table rows and row detail routes.

## Functionality

- Shows branch/revision title context.
- Shows a stack-style table workspace that can move between table list, create, clone, and edit states.
- Lists tables in the selected revision.
- Creates tables when the revision is editable and the user has permission.
- Edits or clones table schema when allowed.
- Lets foreign-key flows temporarily select a table and then return to the previous editor state.
- Navigates newly created tables to their draft table route.

## Functional Blocks

| Block                      | Shows                                  | Visible when                             | UX note                                                     |
| -------------------------- | -------------------------------------- | ---------------------------------------- | ----------------------------------------------------------- |
| Branch title               | Current branch/revision identity       | Page loaded                              | Confirms the active revision context before editing.        |
| Table list                 | Existing tables and table actions      | Table data loaded                        | Primary entry into data and schema work.                    |
| Create table               | Schema editor for a new table          | Draft revision and create permission     | Routes to the new table after successful creation.          |
| Table schema editor        | Editable schema for clone/update flows | Draft revision and update permission     | Reuses the same foreign-key selection flow.                 |
| Foreign-key table selector | Table list in selection mode           | A schema editor needs a referenced table | Selecting or cancelling returns to the prior schema editor. |
| Revision error             | Load error state                       | Revision/table load fails                | Prevents partial editing without valid revision data.       |

## Primary Actions

| Action                             | Trigger                             | Available when                               | Result                                         | Failure/recovery                              |
| ---------------------------------- | ----------------------------------- | -------------------------------------------- | ---------------------------------------------- | --------------------------------------------- |
| Create table                       | Create table action                 | Draft revision and create-table permission   | Schema editor opens for a new table            | Cancel returns to table list                  |
| Open table                         | Table item click                    | Table appears in list                        | Table rows route opens                         | Route change only                             |
| Clone table                        | Clone action on table               | Draft revision and create-table permission   | Schema editor opens from existing table schema | Cancel returns to table list                  |
| Edit table schema                  | Edit/settings action on table       | Draft revision and update-table permission   | Schema editor opens for the selected table     | Validation or save errors keep editor visible |
| Select table as foreign-key target | Table selection in foreign-key flow | Schema editor is choosing a referenced table | Selected table returns to the editor           | Cancel restores previous editor state         |

## Optional Features And Gates

- Table create/update/delete actions require draft revision state and matching project permissions.
- Foreign-key table selection is available as part of schema editing flows.
- Non-draft revisions remain browsable but editing is blocked by the surrounding read-only state.

## States

| State                       | UX                                                                                  |
| --------------------------- | ----------------------------------------------------------------------------------- |
| Loading                     | Workbench waits for revision/table data.                                            |
| Error                       | Shows a revision error state instead of the table workspace.                        |
| Empty table list            | Table list has no tables yet; create action is the primary next step when allowed.  |
| Table list                  | Shows existing tables and per-table actions.                                        |
| Creating                    | Shows a schema editor for a new table.                                              |
| Updating/cloning            | Shows schema editor populated from an existing table.                               |
| Selecting foreign key table | Table list switches to selection mode and can cancel back to the editor.            |
| Read-only revision          | Surrounding layout shows the read-only banner and mutation actions are unavailable. |

## Transitions

- Creating a table opens the draft route for the new table.
- Opening a table moves to the table rows route.
- Opening a row from table rows moves to the row detail route.
- Starting foreign-key selection pushes a temporary table-selector state; selecting or cancelling restores the editor.

## Permissions And Configuration

- Requires valid project, branch, and revision context.
- Mutation actions depend on project table permissions and draft revision state.
- The read-only banner is provided by the database layout rather than the page itself.

## Copy And Messages

- Sidebar label: `Database`
- Read-only banner: `You are viewing a read-only revision`
- Read-only action: `Go to draft revision`

## Open Questions

- Should the empty table state recommend table import or migration flows when available?
- Should schema-editor errors be documented as field-level patterns separate from this page?
