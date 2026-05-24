# Assets

Route suffix: `-/assets`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

File asset workspace for finding file fields in the current revision, browsing extracted files, and managing editable file metadata/content.

## Context And Entry

- Parent context: project plus branch/revision.
- Parent shell: branch page layout with project sidebar.
- Sidebar entry: `Assets`.
- Works from schema file fields and row data in the selected revision.

## Functionality

- Finds file fields in the current revision.
- Shows tables with file fields.
- Shows file count, filters, and grid/list content for extracted files.
- Supports table selection and file filters.
- Opens an asset detail drawer with file metadata and row context.
- Supports file-name editing, file upload/replacement, JSON preview, and opening the file.

## Functional Blocks

| Block           | Shows                                                                          | Visible when                    | UX note                                                |
| --------------- | ------------------------------------------------------------------------------ | ------------------------------- | ------------------------------------------------------ |
| Assets header   | Branch name, file count, table count, and organization note                    | Page loaded                     | Confirms what revision the asset inventory represents. |
| Tables overview | Tables that contain file fields                                                | File-field tables exist         | Acts as a table-level asset filter.                    |
| Filters         | Search, type, status, and size filters                                         | Files available                 | `Clear filters` resets the filtered state.             |
| Asset grid      | File cards with preview/icon, status, filename, table badge, and size          | Files available                 | Cards open a detail drawer.                            |
| Detail drawer   | Preview/upload area, editable name, metadata, JSON preview, and location links | Asset selected                  | Central place for file inspection and update.          |
| Skeletons       | Page and file-grid placeholders                                                | Loading exceeds the short delay | Prevents flashing on fast loads.                       |

## Primary Actions

| Action                 | Trigger                                | Available when                           | Result                                                         | Failure/recovery                                |
| ---------------------- | -------------------------------------- | ---------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| Select table           | Table item in the overview             | Tables with file fields exist            | Asset grid filters to the selected table                       | Current data remains visible if reload fails    |
| Filter assets          | Search, type, status, or size controls | Files are available                      | Asset grid narrows to matching files                           | No-match state appears when nothing matches     |
| Clear filters          | `Clear filters` action                 | Active filters produce no matches        | Filters reset and the grid reloads                             | Local state reset only                          |
| Open asset detail      | Asset card click                       | File appears in the grid                 | Detail drawer opens with metadata, preview, and location links | Drawer can be closed if the asset is not useful |
| Rename file            | File name editor in the detail drawer  | Draft revision and row update permission | File name updates in the asset data                            | Save failure leaves the drawer open             |
| Upload or replace file | Upload control in the detail drawer    | Draft revision and row update permission | Upload progress appears, then asset data refreshes             | Toast shows upload failure                      |
| Preview JSON           | JSON preview action in the drawer      | Asset selected                           | JSON data opens for inspection                                 | Read-only view; close returns to drawer         |
| Open file URL          | Open action in the drawer              | Uploaded file URL exists                 | File opens in browser context                                  | Browser handles unavailable URL                 |

## Optional Features And Gates

- Rename and upload/replace require draft revision state and row update capability.
- File opening depends on an uploaded file URL being available.
- JSON preview is available from the detail drawer for asset data inspection.
- Non-draft revisions allow browsing but not editing.

## States

| State               | UX                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------- |
| Initial loading     | Shows a delayed page skeleton if loading is not immediate.                            |
| File reload loading | Shows a delayed file-grid skeleton during table/filter reloads.                       |
| Error               | Shows `Error loading assets`.                                                         |
| No file fields      | Shows `No tables with file fields in this revision` and guidance to add a file field. |
| No files            | Shows `No files found` for a selected table with no extracted files.                  |
| No matches          | Shows `No files match your filters` and `Clear filters`.                              |
| Grid                | Shows asset cards.                                                                    |
| Detail drawer       | Shows selected asset details and actions.                                             |
| Uploading           | Shows upload progress and then success/failure toast.                                 |

## Transitions

- Selecting a table updates the asset grid to that table's files.
- Applying filters narrows the asset grid.
- `Clear filters` resets active filters.
- Opening a card opens the detail drawer.
- Location links in the drawer navigate to the related table, row, or field context.
- Successful upload/replace refreshes the asset data shown for that file.

## Permissions And Configuration

- Requires project, branch, and revision context.
- File edit capability follows row update permission and draft revision state.
- Asset inventory depends on file-field schema definitions and row data in the selected revision.

## Copy And Messages

- Header pattern: `Assets for {branchName}`
- No file fields: `No tables with file fields in this revision`
- No file fields guidance: `Add a File field to any table to start managing assets.`
- No matches: `No files match your filters`
- Clear action: `Clear filters`
- No files: `No files found`
- Upload progress: `Uploading...`
- Upload success: `Successfully uploaded!`
- Upload failure: `Upload failed`

## Open Questions

- Should asset filters be reflected in the URL for shareable filtered views?
- Should pending upload status have a dedicated recovery action when storage upload fails?
