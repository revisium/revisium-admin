# Table Rows

Route suffix: `:tableId`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Table-level data workspace for browsing, creating, editing, duplicating, deleting, and uploading file data in rows.

## Context And Entry

- Parent context: project plus branch/revision/table.
- Parent shell: database layout with project sidebar.
- Entry path: open a table from the database revision page.
- Related page: row detail route for focused editing of one row.

## Functionality

- Opens the selected table as a row workspace.
- Shows row list browsing and table view controls.
- Supports row creation when the revision is editable and the user can create rows.
- Supports row duplication and editing when allowed.
- Supports deleting one or more rows when allowed.
- Supports file upload into file fields.
- Opens foreign-key selection flows from editable row cells.

## Functional Blocks

| Block               | Shows                                     | Visible when                         | UX note                                                        |
| ------------------- | ----------------------------------------- | ------------------------------------ | -------------------------------------------------------------- |
| Row list            | Rows for the selected table               | Table loaded                         | Main scanning and selection area.                              |
| Table view controls | Filtering/sorting/view behavior           | Table loaded                         | Keeps dense row work inside the table context.                 |
| Create row          | Draft row editor                          | Draft revision and create permission | Can be reached from the table rows workspace.                  |
| Row actions         | Open, duplicate, delete, and edit actions | Based on row permissions             | Actions are hidden/disabled by permission and read-only state. |
| File field upload   | Upload/replace flow for file fields       | Editable file field                  | Upload progress and result are communicated with toasts.       |
| Foreign-key picker  | Selection flow for referenced rows        | Editing a foreign-key field          | Allows picking existing referenced data from target tables.    |

## Primary Actions

| Action                       | Trigger                          | Available when                           | Result                                          | Failure/recovery                                   |
| ---------------------------- | -------------------------------- | ---------------------------------------- | ----------------------------------------------- | -------------------------------------------------- |
| Create row                   | Create action in table workspace | Draft revision and create-row permission | Row creation editor opens                       | Cancel returns to row list                         |
| Open row                     | Row click                        | Row appears in list                      | Row detail route opens                          | Route change only                                  |
| Duplicate row                | Duplicate action                 | Draft revision and create-row permission | Create editor opens prefilled from source row   | Cancel returns to previous context                 |
| Edit row cells               | Cell edit                        | Draft revision and update-row permission | Cell value updates through row mutation         | Read-only feedback appears when editing is blocked |
| Delete row or rows           | Delete action                    | Draft revision and delete-row permission | Selected row data is removed and list refreshes | Error keeps current list visible                   |
| Upload file into file fields | File field upload control        | Editable file field in draft revision    | Upload progress appears and file field updates  | Toast shows upload failure                         |

## Optional Features And Gates

- Create/update/delete row actions require draft revision state and matching project permissions.
- File upload requires an editable file field in an editable row.
- Foreign-key selection depends on target table schema/data loading successfully.
- Non-draft revisions stay browsable but row editing is blocked.

## States

| State                 | UX                                                          |
| --------------------- | ----------------------------------------------------------- |
| Loading               | Row/table widgets show their loading state.                 |
| Error                 | Row/table widgets surface data-load failures.               |
| Row list              | Shows the selected table rows.                              |
| Creating row          | Opens a row creation editor.                                |
| Editing row           | Allows cell-level changes when editable.                    |
| Selecting foreign key | Temporarily focuses the target table/row picker.            |
| Uploading file        | Shows upload progress and then success/failure toast.       |
| Read-only revision    | Editing attempts are blocked; the page remains inspectable. |

## Transitions

- Opening a row moves to the row detail route.
- Creating or duplicating a row enters a row editor state.
- Selecting a foreign key returns the chosen row value to the current cell.
- Upload completion updates the file field state and shows a toast.

## Permissions And Configuration

- Requires project, branch, revision, and table context.
- Row mutations are draft-only and permission-gated.
- Non-draft behavior is coordinated by the database layout read-only banner.

## Copy And Messages

- Upload progress: `Uploading...`
- Upload success: `Successfully uploaded!`
- Upload failure: `Upload failed`
- Read-only edit feedback: `This cell is read-only`

## Open Questions

- Should bulk delete expose a stronger confirmation pattern for large selections?
- Should upload failure messages include storage/accounting context when available?
