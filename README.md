<div align="center">

# @revisium/admin

Web UI for [Revisium](https://github.com/revisium/revisium) — unopinionated data platform for hierarchical structures.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
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

## Related Packages

| Package                                                                | Description                                                   |
| ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| [@revisium/core](https://github.com/revisium/revisium-core)            | Backend API — required data source                            |
| [@revisium/endpoint](https://github.com/revisium/revisium-endpoint)    | Dynamic GraphQL/REST API generator                            |
| [@revisium/schema-toolkit](https://github.com/revisium/schema-toolkit) | JSON Schema utilities, validation, and transformation helpers |

## License

Apache 2.0 — See [Revisium](https://github.com/revisium/revisium) for full license.
