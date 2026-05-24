# MCP Server

Route: `/app/:organizationId/:projectName/-/mcp`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Explains how to connect MCP-compatible AI assistants to Revisium and provides copyable setup values.

## Context And Entry

- Parent context: project.
- Parent shell: project sidebar under `Management`.
- Sidebar entry: `MCP Server`, shown only for authenticated users.
- Authentication note: the MCP server prompts for authentication when the external client starts using it.

## Functionality

- Explains MCP and how Revisium tools can be used by AI assistants.
- Shows example natural-language capabilities for project setup, schema management, data operations, version control, and API endpoints.
- Shows MCP URL and server name.
- Provides Claude Code setup via CLI command or config snippet.
- Copies URL, command, and config snippets.
- Explains that authentication is prompted when using the MCP server.

## Functional Blocks

| Block                    | Shows                                                               | Visible when          | UX note                                           |
| ------------------------ | ------------------------------------------------------------------- | --------------------- | ------------------------------------------------- |
| Header                   | `MCP Server` and short description                                  | Always                | Positions MCP as AI assistant integration         |
| What is MCP              | Introductory explanation                                            | Always                | Explains tools and external data access           |
| Capability examples      | Project setup, schema, data, version control, API endpoint examples | Always                | Examples are natural-language prompts             |
| Connection               | MCP URL, server name, copy URL                                      | Always                | Server name is derived from current host          |
| Claude Code CLI setup    | `claude mcp add...` command and management commands                 | Accordion option open | Command includes current server name and URL      |
| Configuration file setup | JSON snippet and copy config                                        | Accordion option open | Snippet uses current server name and URL          |
| Authentication note      | Short auth explanation                                              | Always                | Clarifies auth happens during external client use |

## Primary Actions

| Action              | Trigger                    | Available when           | Result                               | Failure/recovery                             |
| ------------------- | -------------------------- | ------------------------ | ------------------------------------ | -------------------------------------------- |
| Copy MCP URL        | Copy icon by URL           | Page ready               | URL copied and toast appears         | Clipboard failure is not separately surfaced |
| Copy CLI command    | Copy icon on command block | CLI setup option visible | Command copied and toast appears     | Clipboard failure is not separately surfaced |
| Copy config snippet | Copy icon on config block  | Config option visible    | JSON config copied and toast appears | Clipboard failure is not separately surfaced |
| Open MCP URL        | MCP URL link               | Page ready               | Opens MCP URL in new tab/window      | Browser handles target                       |
| Switch setup option | Accordion trigger          | Page ready               | CLI/config instructions expand       | Local state only                             |

## Optional Features And Gates

| Feature               | Gate               | Visible/active when               | Hidden/disabled when        | Result                                                 |
| --------------------- | ------------------ | --------------------------------- | --------------------------- | ------------------------------------------------------ |
| Sidebar entry         | Authenticated user | User is authenticated             | Public/guest project access | `MCP Server` appears in project nav                    |
| Server name suffix    | Current hostname   | Host is available                 | N/A                         | Produces environment-specific `revisium-*` server name |
| Authentication prompt | External MCP usage | Assistant connects and needs auth | No external client use      | Client prompts user to authenticate                    |

## States

| State                        | Trigger/source            | UI behavior                | User path forward            |
| ---------------------------- | ------------------------- | -------------------------- | ---------------------------- |
| Ready                        | Page loaded               | Full setup content visible | Copy URL/config or read docs |
| Clipboard copied             | Copy action succeeds      | Toast: copied to clipboard | Paste into external client   |
| Public/guest project context | User is not authenticated | Sidebar item hidden        | Sign in to access setup page |

## Transitions

| From     | Trigger                  | Condition           | To                     | Feedback              |
| -------- | ------------------------ | ------------------- | ---------------------- | --------------------- |
| MCP page | Accordion option clicked | Always              | Expanded setup section | Local accordion state |
| MCP page | Copy clicked             | Clipboard available | Same page              | Toast appears         |
| MCP URL  | Link clicked             | URL available       | New browser target     | Browser navigation    |

## Permissions And Configuration

- Sidebar item is shown only for authenticated users.
- Uses project context to build server name and URL.

## Copy And Messages

- Header: `MCP Server`.
- Description: `Connect AI assistants to manage your Revisium data using natural language.`
- Sections: `What is MCP?`, `What You Can Do`, `Connection`, `Setup with Claude Code`, `Authentication`.
- Toasts: `Copied to clipboard`, `Configuration copied to clipboard`.

## Open Questions

- Should the page include links to public MCP docs once those are available?
- Should authentication state be shown before users copy setup snippets?
