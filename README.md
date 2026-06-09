<div align="center">

# @revisium/admin

Web UI for [Revisium](https://github.com/revisium/revisium) — unopinionated data platform with referential integrity.

**Your schema. Your data. Full control.**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=revisium_revisium-admin&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=revisium_revisium-admin)
[![npm](https://img.shields.io/npm/v/@revisium/admin?color=red)](https://www.npmjs.com/package/@revisium/admin)
[![Docker](https://img.shields.io/docker/v/revisium/revisium-admin?label=docker&sort=semver)](https://hub.docker.com/r/revisium/revisium-admin)

> Referential integrity with foreign keys at any depth.
> Git-like versioning: branches, revisions, drafts.
> Schema evolution: migrations with data transformations.

Part of the [Revisium](https://github.com/revisium/revisium) ecosystem.
Available on [npm](https://www.npmjs.com/package/@revisium/admin) | [Docker Hub](https://hub.docker.com/r/revisium/revisium-admin).

</div>

## Overview

Administration interface for managing Revisium projects, schemas, and data.

## Features

- **Projects** — create, configure, manage multiple projects
- **Branches** — create, switch, compare branches
- **Revisions** — navigate history, commit changes, revert
- **Tables** — visual schema editor with JSON Schema support
- **Rows** — Excel-like editing with custom columns, filtering, and sorting
- **Migrations** — view and apply schema migrations
- **Endpoints** — create and manage GraphQL/REST API endpoints
- **Diff viewer** — compare changes between revisions
- **Users & Roles** — manage users and permissions

## Development

This project uses [pnpm](https://pnpm.io) (pinned via the `packageManager` field). Node version: see `.nvmrc` (24.11.1).

```bash
corepack enable           # activates the pinned pnpm
pnpm install              # install dependencies (build scripts gated by pnpm-workspace.yaml allowBuilds)

pnpm run format:check     # check formatting
pnpm run lint             # lint
pnpm run ts:check         # type-check
pnpm run test:ci          # unit tests
pnpm run build            # production build (tsc + vite)
pnpm dev                  # local dev server
pnpm run test:e2e         # Playwright E2E tests (requires a running app)
```

## Configuration

See [ENV.md](./ENV.md) for all environment variables.

## Documentation

Admin UX and page behavior documentation is in [`./docs`](./docs/README.md).
Runbook-style and implementation docs in this repo are the canonical source for
admin behavior changes.

## Related Packages

| Package                                                                | Description                                                   |
| ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| [@revisium/core](https://github.com/revisium/revisium-core)            | Backend API — required data source                            |
| [@revisium/endpoint](https://github.com/revisium/revisium-endpoint)    | Dynamic GraphQL/REST API generator                            |
| [@revisium/schema-toolkit](https://github.com/revisium/schema-toolkit) | JSON Schema utilities, validation, and transformation helpers |

## License

Apache 2.0 — See [Revisium](https://github.com/revisium/revisium) for full license.
