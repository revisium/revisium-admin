import { Page, Route, Request } from '@playwright/test'
import {
  createConfigurationResponse,
  createFullBranchResponse,
  createFullProjectResponse,
  createMeProjectsResponse,
  createMeResponse,
  createSampleRows,
  createTablesResponse,
  createTableViewsResponse,
} from '../fixtures/full-fixtures'
import { setupAuth } from './setup-auth'

export const TEST_CONFIG = {
  projectName: 'test-project',
  orgId: 'testuser',
  tableId: 'users',
} as const

export type GraphQLOperationName =
  | 'configuration'
  | 'getMe'
  | 'meProjectsMst'
  | 'ProjectMst'
  | 'getProject'
  | 'BranchMst'
  | 'BranchesMst'
  | 'TablesMst'
  | 'TableMst'
  | 'RowsMst'
  | 'RowListRows'
  | 'GetTableViews'
  | 'UpdateTableViews'
  | 'UpdateRow'
  | 'PatchRowInline'
  | 'RemoveRow'
  | 'RemoveRows'
  | 'CreateRow'
  | 'getChanges'
  | 'GetRevisionChanges'
  | 'findForeignKey'

export interface TablePageMockOptions {
  rows?: Array<{ id: string; data: Record<string, unknown> }>
  schema?: object
  isHeadRevision?: boolean
  rowsReadonly?: boolean
  projectName?: string
  orgId?: string
  tableId?: string
  onOperation?: (
    opName: string,
    variables: Record<string, unknown>,
    route: Route,
    request: Request,
  ) => Promise<boolean | void>
}

function getOperationName(body: Record<string, unknown> | null): string {
  return (body?.operationName as string) || ''
}

export function createDefaultSchema() {
  return {
    type: 'object',
    properties: {
      name: { type: 'string', default: '' },
      age: { type: 'number', default: 0 },
      active: { type: 'boolean', default: false },
    },
    additionalProperties: false,
    required: ['active', 'age', 'name'],
  }
}

export async function setupTablePageMocks(page: Page, options: TablePageMockOptions = {}) {
  await setupAuth(page)

  const projectName = options.projectName ?? TEST_CONFIG.projectName
  const orgId = options.orgId ?? TEST_CONFIG.orgId
  const tableId = options.tableId ?? TEST_CONFIG.tableId
  const rows = options.rows ?? createSampleRows(5)
  const schema = options.schema ?? createDefaultSchema()
  const rowsReadonly = options.rowsReadonly ?? options.isHeadRevision ?? false

  const projectResponse = createFullProjectResponse(projectName, orgId)
  const branchResponse = createFullBranchResponse(projectName)

  const rowsResponse = {
    data: {
      rows: {
        __typename: 'RowsConnection',
        totalCount: rows.length,
        pageInfo: {
          __typename: 'PageInfo',
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: rows.length > 0 ? 'cursor-1' : null,
          endCursor: rows.length > 0 ? `cursor-${rows.length}` : null,
        },
        edges: rows.map((row, index) => ({
          __typename: 'RowModelEdge',
          cursor: `cursor-${index + 1}`,
          node: {
            __typename: 'RowModel',
            id: row.id,
            versionId: `${row.id}-v1`,
            readonly: rowsReadonly,
            data: row.data,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            publishedAt: null,
            createdId: row.id,
          },
        })),
      },
    },
  }

  await page.route('**/graphql', async (route, request) => {
    const body = request.postDataJSON()
    const opName = getOperationName(body)
    const variables = (body?.variables as Record<string, unknown>) || {}

    if (options.onOperation) {
      const handled = await options.onOperation(opName, variables, route, request)
      if (handled) {
        return
      }
    }

    if (opName === 'GetTableViews') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(createTableViewsResponse(tableId)),
      })
    }

    if (opName === 'UpdateTableViews') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { updateTableViews: null } }),
      })
    }

    if (opName === 'UpdateRow' || opName === 'PatchRowInline') {
      const data = (variables.data as Record<string, unknown>) || {}
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            [opName === 'PatchRowInline' ? 'patchRow' : 'updateRow']: {
              __typename: 'RowModel',
              id: (data.rowId as string) || 'row-1',
              versionId: 'row-1-v2',
              readonly: false,
              data: (data.data as Record<string, unknown>) || {},
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: new Date().toISOString(),
            },
          },
        }),
      })
    }

    if (opName === 'RemoveRow' || opName === 'RemoveRows') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            [opName === 'RemoveRows' ? 'removeRows' : 'removeRow']: true,
          },
        }),
      })
    }

    if (opName === 'CreateRow') {
      const data = (variables.data as Record<string, unknown>) || {}
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            createRow: {
              __typename: 'RowModel',
              id: (data.rowId as string) || 'new-row',
              versionId: 'new-row-v1',
              readonly: false,
              data: (data.data as Record<string, unknown>) || {},
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        }),
      })
    }

    if (opName === 'TableMst') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            table: {
              __typename: 'TableModel',
              createdId: tableId,
              id: tableId,
              versionId: `${tableId}-v1`,
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: '2024-01-01T00:00:00Z',
              readonly: false,
              count: rows.length,
              schema,
            },
          },
        }),
      })
    }

    const responses: Record<string, object> = {
      configuration: createConfigurationResponse(),
      getMe: createMeResponse(orgId),
      meProjectsMst: createMeProjectsResponse(projectName, orgId),
      ProjectMst: projectResponse,
      getProject: projectResponse,
      BranchMst: branchResponse,
      BranchesMst: {
        data: {
          branches: {
            totalCount: 1,
            pageInfo: { hasNextPage: false, endCursor: null },
            edges: [{ cursor: 'cursor-1', node: branchResponse.data.branch }],
          },
        },
      },
      TablesMst: createTablesResponse(tableId),
      RowsMst: rowsResponse,
      RowListRows: rowsResponse,
      getChanges: { data: { changes: { tables: 0, rows: 0 } } },
      GetRevisionChanges: { data: { revisionChanges: { tables: 0, rows: 0 } } },
    }

    const response = responses[opName]
    if (response) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      })
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: null }),
    })
  })
}

export function getTablePageUrl(
  revision: 'draft' | 'head' = 'draft',
  config: { orgId?: string; projectName?: string; tableId?: string } = {},
) {
  const orgId = config.orgId ?? TEST_CONFIG.orgId
  const projectName = config.projectName ?? TEST_CONFIG.projectName
  const tableId = config.tableId ?? TEST_CONFIG.tableId
  return `/app/${orgId}/${projectName}/master/${revision}/${tableId}`
}
