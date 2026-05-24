# Migrations

Route suffix: `-/migrations`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Revision migration review and application page for inspecting schema operations and applying migration sets from JSON or another branch.

## Context And Entry

- Parent context: project plus branch/revision.
- Parent shell: branch page layout with project sidebar.
- Sidebar entry: `Migrations`.
- Related pages: database revision for schema editing and branch map for branch topology.

## Functionality

- Loads migrations for the current revision.
- Parses migration patches into table-view rows.
- Table and JSON view modes are available.
- Applies migrations from JSON.
- Migrations can also be applied from another branch.
- Shows apply result summaries.

## Functional Blocks

| Block                    | Shows                                                                                      | Visible when               | UX note                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------ | -------------------------- | --------------------------------------------------------------- |
| Header                   | `Migrations for {branchName} ({totalCount} operations)` and info hovercard                 | Page loaded                | Info explains migration use, workflows, and conflicts.          |
| Apply menu               | `From JSON` and `From Branch` options                                                      | User can create tables     | Keeps import/apply flows grouped.                               |
| View switcher            | Table and JSON modes                                                                       | Migrations loaded          | Table mode is scan-friendly; JSON mode is copy/export-friendly. |
| Table view               | Virtualized migration operations and JSON popovers                                         | Table mode                 | Best for review of many operations.                             |
| JSON view                | Read-only migration JSON                                                                   | JSON mode                  | Best for copying or comparing payloads.                         |
| Apply JSON dialog        | Paste area, parse/validation errors, preview, conflict warning, result summary             | User chooses `From JSON`   | Validates that input is an array of migrations.                 |
| Apply from branch dialog | Source branch/revision selection, migration diff preview, conflict warning, result summary | User chooses `From Branch` | Excludes the current branch from source branch choices.         |

## Primary Actions

| Action                       | Trigger                           | Available when                                   | Result                                                          | Failure/recovery                                                        |
| ---------------------------- | --------------------------------- | ------------------------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Switch table/JSON view       | View switcher                     | Migrations loaded                                | Page switches between operation table and JSON view             | Local state only                                                        |
| Copy migrations JSON         | Copy action in JSON-oriented view | Migration JSON is available                      | JSON is copied for reuse                                        | Browser copy failure leaves data visible                                |
| Apply migrations from JSON   | `From JSON` apply option          | User can create tables                           | JSON apply dialog opens with paste, preview, and apply flow     | Parse/shape/conflict errors appear before apply                         |
| Apply migrations from branch | `From Branch` apply option        | User can create tables and another branch exists | Branch apply dialog opens with source revision and diff preview | No-branch/no-migration/conflict states explain why apply cannot proceed |

## Optional Features And Gates

- Apply actions are shown when the user can create tables.
- Source branch apply supports Draft and Head revisions from other branches.
- Conflict warnings appear before apply when detected.
- JSON apply requires valid JSON array input.

## States

| State            | UX                                                       |
| ---------------- | -------------------------------------------------------- |
| Loading          | Shows migration loading state.                           |
| Error            | Shows migration load failure state.                      |
| Empty            | Shows `No migrations found`.                             |
| Table view       | Shows parsed operations with optional JSON details.      |
| JSON view        | Shows readonly migration JSON.                           |
| JSON parse error | Shows `Invalid JSON format`.                             |
| JSON shape error | Shows `Input must be an array of migrations`.            |
| Conflict         | Shows `Conflict detected` before applying.               |
| Applying         | Apply button shows loading while migrations are applied. |
| Result           | Shows apply summary after completion.                    |

## Transitions

- Switching view mode changes between table review and JSON review without changing route.
- `From JSON` opens the paste/preview/apply dialog.
- `From Branch` opens branch and revision selection before preview/apply.
- Applying migrations updates branch touched state and reloads migration data.

## Permissions And Configuration

- Requires project, branch, and revision context.
- Apply is treated as schema mutation and follows table creation permission.
- Revision changes should reload migrations for the selected context.

## Copy And Messages

- Header pattern: `Migrations for {branchName} ({totalCount} operations)`
- Empty: `No migrations found`
- JSON parse error: `Invalid JSON format`
- JSON shape error: `Input must be an array of migrations`
- Conflict warning: `Conflict detected`
- Apply menu options: `From JSON`, `From Branch`

## Open Questions

- Should apply permissions map to a dedicated migration permission instead of table creation?
- Should conflict detail copy be standardized across JSON and branch apply flows?
