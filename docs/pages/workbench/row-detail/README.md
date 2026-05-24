# Row Detail

Route suffix: `:tableId/:rowId`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Focused row workspace for viewing or editing a single row while preserving navigation back to the surrounding table context.

## Context And Entry

- Parent context: project plus branch/revision/table/row.
- Parent shell: database layout with project sidebar.
- Entry path: open a row from table rows or a linked row reference.
- Related page: table rows route for the full table list.

## Functionality

- Opens the row workspace focused on the selected row.
- Loads table schema and row data for the focused row.
- Shows and edits row fields when the revision and permissions allow it.
- Includes foreign-key row selection and foreign-key row creation flows.
- Clones the selected row into a create flow.
- Provides a path back to the row list/table context.

## Functional Blocks

| Block                 | Shows                                     | Visible when                                            | UX note                                                      |
| --------------------- | ----------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| Row header/context    | Table and row orientation                 | Row loaded                                              | Keeps focused editing tied to its table.                     |
| Row editor            | Field values for the selected row         | Row loaded                                              | Editable only in draft and with update permission.           |
| Clone/create flow     | New row editor populated from current row | User chooses clone and can create rows                  | Reduces repeated data entry.                                 |
| Foreign-key selection | Picker for referenced rows                | Editing a foreign-key field                             | Can load target table data and show load failures.           |
| Foreign-key creation  | Create flow for a referenced row          | Target relation allows creation and user has permission | Lets users fill references without leaving the row workflow. |

## Primary Actions

| Action                           | Trigger                          | Available when                                              | Result                                        | Failure/recovery                                   |
| -------------------------------- | -------------------------------- | ----------------------------------------------------------- | --------------------------------------------- | -------------------------------------------------- |
| Edit row                         | Field edit in row editor         | Draft revision and update-row permission                    | Field value enters editable state             | Read-only feedback appears when editing is blocked |
| Save row changes                 | Save/commit action in row editor | Row has valid edits and mutation is idle                    | Row data updates in place                     | Error keeps editor open for retry                  |
| Clone row                        | Clone action                     | Draft revision and create-row permission                    | Create flow opens prefilled from selected row | Cancel returns to prior row context                |
| Select or create referenced rows | Foreign-key field action         | Referenced table can load and user has required permissions | Referenced row value is selected or created   | Target load failure keeps current editor state     |
| Return to row list               | Back/list navigation             | Row detail open                                             | Opens selected table route                    | Route change only                                  |

## Optional Features And Gates

- Row update requires draft revision state and update-row permission.
- Row clone/create requires draft revision state and create-row permission.
- Foreign-key creation depends on target table context and create permission.
- Non-draft revisions are view-only through the surrounding layout.

## States

| State                    | UX                                                      |
| ------------------------ | ------------------------------------------------------- |
| Loading                  | Row/table context loads before focused editing.         |
| Error                    | Row or target foreign-key data can show a load failure. |
| Viewing row              | Shows row fields and context.                           |
| Editing row              | Shows editable field controls and save/revert behavior. |
| Cloning row              | Opens a create flow prefilled from the selected row.    |
| Selecting referenced row | Temporarily enters a foreign-key picker.                |
| Creating referenced row  | Opens a nested create flow for the referenced table.    |
| Read-only revision       | Editing controls are hidden or blocked.                 |

## Transitions

- Returning to row list opens the selected table route.
- Saving row changes keeps the user in the row context.
- Cloning enters create mode and can return to focused row/table context.
- Selecting or creating a referenced row fills the foreign-key field and returns to the row editor.

## Permissions And Configuration

- Requires project, branch, revision, table, and row context.
- All mutations are controlled by draft state and project permissions.
- Foreign-key flows depend on the referenced schema/table being loadable.

## Copy And Messages

- Upload progress: `Uploading...`
- Upload success: `Successfully uploaded!`
- Upload failure: `Upload failed`
- Read-only edit feedback: `This cell is read-only`

## Open Questions

- Should row detail have explicit breadcrumb copy standards for deep foreign-key stacks?
- Should failed foreign-key loads provide a retry action in the same panel?
