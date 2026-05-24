# MCP Token Redirect

Route: `/get-mcp-token`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Keeps older MCP setup links working by redirecting to the current access-token page.

## Context And Entry

- Parent context: utility compatibility route.
- Entry points: older MCP/token links.
- Destination: `/get-token`.

## Functionality

- Redirects to `/get-token`.

## Functional Blocks

| Block    | Shows         | Visible when | UX note                                                                       |
| -------- | ------------- | ------------ | ----------------------------------------------------------------------------- |
| Redirect | No visible UI | Always       | Uses replace navigation so the compatibility route does not remain in history |

## Primary Actions

| Action                 | Trigger    | Available when | Result                    | Failure/recovery                                |
| ---------------------- | ---------- | -------------- | ------------------------- | ----------------------------------------------- |
| Redirect to token page | Page entry | Always         | Navigates to `/get-token` | Access-token page handles auth and token states |

## Optional Features And Gates

| Feature                | Gate                | Visible/active when           | Hidden/disabled when    | Result                     |
| ---------------------- | ------------------- | ----------------------------- | ----------------------- | -------------------------- |
| Compatibility redirect | Legacy route exists | Any visit to `/get-mcp-token` | Route removed in future | User lands on `/get-token` |

## States

| State       | Trigger/source | UI behavior        | User path forward     |
| ----------- | -------------- | ------------------ | --------------------- |
| Redirecting | Page entry     | No visible content | Wait for `/get-token` |

## Transitions

| From             | Trigger     | Condition | To           | Feedback           |
| ---------------- | ----------- | --------- | ------------ | ------------------ |
| `/get-mcp-token` | Route match | Always    | `/get-token` | Replace navigation |

## Permissions And Configuration

- Compatibility route only.

## Copy And Messages

- No visible copy is currently rendered.

## Open Questions

- Keep this route until all external setup docs and links use `/get-token`.
