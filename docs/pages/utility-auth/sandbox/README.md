# Apollo Sandbox

Route: `/sandbox/*`

Status: current admin behavior documented from source review on 2026-05-05.

## Purpose

Provides a full-screen GraphQL sandbox pointed at the selected endpoint path.

## Context And Entry

- Parent context: standalone sandbox route outside the standard app shell.
- Route parameter: wildcard path is appended to the endpoint GraphQL base URL.
- Auth context: current token is included when available; cookies are also included.

## Functionality

- Embeds Apollo Sandbox full-screen.
- Builds the endpoint URL from the endpoint server URL plus the wildcard path.
- Starts with a sample GraphQL document.
- Includes cookies and, when available, a bearer token header.

## Functional Blocks

| Block             | Shows                                     | Visible when         | UX note                                     |
| ----------------- | ----------------------------------------- | -------------------- | ------------------------------------------- |
| Apollo Sandbox    | GraphQL operation editor and execution UI | Always               | Takes the full viewport height              |
| Initial operation | Sample query                              | First load           | Gives the user a starting document          |
| Auth context      | Cookies and optional bearer token         | Current token exists | Supports authenticated endpoint exploration |

## Primary Actions

| Action                    | Trigger              | Available when | Result                                  | Failure/recovery                  |
| ------------------------- | -------------------- | -------------- | --------------------------------------- | --------------------------------- |
| Execute GraphQL operation | Sandbox run controls | Sandbox loaded | Request goes to computed endpoint URL   | Sandbox UI handles request errors |
| Edit endpoint document    | Sandbox editor       | Sandbox loaded | Query/mutation document changes locally | Sandbox state manages validation  |

## Optional Features And Gates

| Feature                | Gate                                   | Visible/active when             | Hidden/disabled when          | Result                           |
| ---------------------- | -------------------------------------- | ------------------------------- | ----------------------------- | -------------------------------- |
| Bearer token header    | Current auth token exists              | User/session has token          | No token available            | Authorization header is added    |
| Cookies                | Sandbox `includeCookies` initial state | Always                          | Not disabled in current setup | Browser cookies are sent         |
| Wildcard endpoint path | Route wildcard segment                 | Path provided after `/sandbox/` | Empty wildcard                | Sandbox targets base GraphQL URL |

## States

| State           | Trigger/source            | UI behavior                           | User path forward                        |
| --------------- | ------------------------- | ------------------------------------- | ---------------------------------------- |
| Ready           | Sandbox component mounted | Full-screen sandbox                   | Explore endpoint                         |
| Unauthenticated | No token available        | Sandbox still loads with cookies only | Use public endpoint or sign in elsewhere |
| Endpoint error  | Query fails               | Sandbox error UI                      | Adjust query, endpoint path, or auth     |

## Transitions

| From          | Trigger            | Condition                     | To                     | Feedback                  |
| ------------- | ------------------ | ----------------------------- | ---------------------- | ------------------------- |
| Sandbox route | Page loaded        | Wildcard path exists or empty | Sandbox ready          | Endpoint URL is prefilled |
| Sandbox ready | Operation executed | User runs query               | Response panel updates | Sandbox-native feedback   |

## Permissions And Configuration

- Separate sandbox route.
- Uses the current auth token when present.
- Endpoint base comes from endpoint-server URL configuration.

## Copy And Messages

- Initial document starts with `query ExampleQuery`.
- Most UI copy is provided by Apollo Sandbox.

## Open Questions

- Should sandbox entry links always encode the exact endpoint path from the Endpoints page?
