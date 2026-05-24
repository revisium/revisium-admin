# Revisium Admin

UX/UI source of truth for `revisium-admin`.

Status: first source-backed admin pass.

Source snapshot:

- repository: `revisium-admin`
- branch inspected: `chore/update-logo`
- commit inspected: `a89b6e6`

Refresh this section after meaningful route, sidebar, layout, or permission changes in `revisium-admin`.

## Start Here

- [Admin UX/UI Guidelines](./guidelines.md)
- [Page Documentation Guidelines](./page-documentation-guidelines.md)
- [Navigation And Context Model](./navigation-and-context.md)
- [Page Inventory](./page-inventory.md)
- [Page Functionality Reference](./page-functionality.md)

## Planned Guideline Scope

- product navigation
- global project and branch/revision context
- schema editing
- row/data editing
- branch and revision workflows
- API key management
- organization and user management
- billing and limits surfaces
- assets and file usage
- empty, loading, error, and permission states

## First Guideline Pass

The first admin UX/UI guideline pass should document:

- page inventory
- current logic
- user goals
- primary actions
- critical states
- source-backed behavior
- open UX questions

## Current Admin Direction

`revisium-admin` should feel like an operational workbench for structured data, not a marketing surface. Keep pages calm, compact, source-faithful, and explicit about context:

- Which organization and project am I in?
- Which branch and revision am I viewing?
- Is this editable draft data or a read-only revision?
- Which action is primary now?
- What changed, and what can be safely undone?

## Page Documentation

Use [Page Documentation Guidelines](./page-documentation-guidelines.md) for every page folder under `docs/pages`.
