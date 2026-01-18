# Environment Variables

This document describes all environment variables for **revisium-admin**.

## Quick Start

```bash
cp .env/.env.development .env/.env.development.local
# Edit .env.development.local with your configuration
```

---

## Server Configuration

| Variable | Default     | Description             |
| -------- | ----------- | ----------------------- |
| `HOST`   | `localhost` | Development server host |
| `PORT`   | `4000`      | Development server port |

---

## API Endpoints

| Variable                        | Default     | Description                    |
| ------------------------------- | ----------- | ------------------------------ |
| `REACT_APP_GRAPHQL_SERVER_URL`  | `/graphql`  | GraphQL API endpoint path      |
| `REACT_APP_SWAGGER_SERVER_URL`  | `/api`      | Swagger/REST API endpoint path |
| `REACT_APP_ENDPOINT_SERVER_URL` | `/endpoint` | Dynamic endpoint service path  |

---

## Backend Connection

| Variable                        | Default     | Description            |
| ------------------------------- | ----------- | ---------------------- |
| `REACT_APP_GRAPHQL_SERVER_HOST` | `localhost` | revisium-core host     |
| `REACT_APP_GRAPHQL_SERVER_PORT` | `8080`      | revisium-core port     |
| `REACT_APP_ENDPOINT_HOST`       | `localhost` | revisium-endpoint host |
| `REACT_APP_ENDPOINT_PORT`       | `8081`      | revisium-endpoint port |

---

## Development Tools

| Variable                     | Default | Description                        |
| ---------------------------- | ------- | ---------------------------------- |
| `REACT_APP_APOLLO_DEV_TOOLS` | `false` | Enable Apollo DevTools integration |

---

## Build-time Variables

These variables are injected at build time:

| Variable          | Description                           |
| ----------------- | ------------------------------------- |
| `PACKAGE_VERSION` | Application version from package.json |
| `GIT_COMMIT_HASH` | Current git commit hash               |
| `GIT_BRANCH_NAME` | Current git branch name               |
