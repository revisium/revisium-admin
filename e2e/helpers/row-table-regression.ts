import { Page, Request, Route } from '@playwright/test'
import {
  createConfigurationResponse,
  createFullBranchResponse,
  createFullProjectResponse,
  createMeProjectsResponse,
  createMeResponse,
  createTableViewsResponse,
} from '../fixtures/full-fixtures'
import { setupAuth } from './setup-auth'
import { getTablePageUrl, TEST_CONFIG } from './table-page-setup'
import { FILE_SCHEMA_REF, emptyFile, readyFile, uploadedFile } from './row-file-regression'

type JsonObject = Record<string, unknown>

export interface RegressionSchemaCase {
  name: string
  tableId: string
  schema: JsonObject
  createData: JsonObject
  updateData: JsonObject
  fileUploadPath?: string
  fileId?: string
}

const ownersTableId = 'owners'
const ownerRows = [
  { id: 'owner-1', data: { name: 'Ada' } },
  { id: 'owner-2', data: { name: 'Grace' } },
]

const stringField = (extra: JsonObject = {}) => ({ type: 'string', default: '', ...extra })
const numberField = () => ({ type: 'number', default: 0 })
const fileField = () => ({ $ref: FILE_SCHEMA_REF })
const fkField = () => stringField({ foreignKey: ownersTableId })

const objectSchema = (properties: JsonObject, required = Object.keys(properties)) => ({
  type: 'object',
  properties,
  additionalProperties: false,
  required,
})

const rootSchema = (properties: JsonObject, required = Object.keys(properties)) => objectSchema(properties, required)

const fileValue = (id: string) => readyFile(id)

export const rowSchemaCases: RegressionSchemaCase[] = [
  {
    name: 'root primitive required',
    tableId: 'case-root-primitive-required',
    schema: rootSchema({ title: stringField() }),
    createData: { title: 'created' },
    updateData: { title: 'updated' },
  },
  {
    name: 'root primitive optional',
    tableId: 'case-root-primitive-optional',
    schema: rootSchema({ title: stringField() }, []),
    createData: { title: 'created' },
    updateData: { title: 'updated' },
  },
  {
    name: 'root FK required',
    tableId: 'case-root-fk-required',
    schema: rootSchema({ ownerId: fkField() }),
    createData: { ownerId: 'owner-1' },
    updateData: { ownerId: 'owner-2' },
  },
  {
    name: 'root FK optional',
    tableId: 'case-root-fk-optional',
    schema: rootSchema({ ownerId: fkField() }, []),
    createData: { ownerId: 'owner-1' },
    updateData: { ownerId: 'owner-2' },
  },
  {
    name: 'root file',
    tableId: 'case-root-file',
    schema: rootSchema({ document: fileField() }),
    createData: { document: fileValue('file-root-create') },
    updateData: { document: fileValue('file-root-update') },
    fileUploadPath: 'document',
    fileId: 'file-root-update',
  },
  {
    name: 'primitive + FK',
    tableId: 'case-primitive-fk',
    schema: rootSchema({ title: stringField(), ownerId: fkField() }),
    createData: { title: 'created', ownerId: 'owner-1' },
    updateData: { title: 'updated', ownerId: 'owner-2' },
  },
  {
    name: 'primitive + file',
    tableId: 'case-primitive-file',
    schema: rootSchema({ title: stringField(), document: fileField() }),
    createData: { title: 'created', document: fileValue('file-primitive-create') },
    updateData: { title: 'updated', document: fileValue('file-primitive-update') },
  },
  {
    name: 'FK + file',
    tableId: 'case-fk-file',
    schema: rootSchema({ ownerId: fkField(), document: fileField() }),
    createData: { ownerId: 'owner-1', document: fileValue('file-fk-create') },
    updateData: { ownerId: 'owner-2', document: fileValue('file-fk-update') },
  },
  {
    name: 'object with primitive',
    tableId: 'case-object-primitive',
    schema: rootSchema({ profile: objectSchema({ note: stringField() }) }),
    createData: { profile: { note: 'created' } },
    updateData: { profile: { note: 'updated' } },
  },
  {
    name: 'object with required FK',
    tableId: 'case-object-required-fk',
    schema: rootSchema({ profile: objectSchema({ ownerId: fkField() }) }),
    createData: { profile: { ownerId: 'owner-1' } },
    updateData: { profile: { ownerId: 'owner-2' } },
  },
  {
    name: 'object with file',
    tableId: 'case-object-file',
    schema: rootSchema({ profile: objectSchema({ document: fileField() }) }),
    createData: { profile: { document: fileValue('file-object-create') } },
    updateData: { profile: { document: fileValue('file-object-update') } },
  },
  {
    name: 'object with FK + file',
    tableId: 'case-object-fk-file',
    schema: rootSchema({ profile: objectSchema({ ownerId: fkField(), document: fileField() }) }),
    createData: { profile: { ownerId: 'owner-1', document: fileValue('file-object-fk-create') } },
    updateData: { profile: { ownerId: 'owner-2', document: fileValue('file-object-fk-update') } },
  },
  {
    name: 'array of primitives',
    tableId: 'case-array-primitives',
    schema: rootSchema({ tags: { type: 'array', items: stringField() } }),
    createData: { tags: ['alpha'] },
    updateData: { tags: ['beta', 'gamma'] },
  },
  {
    name: 'array of FK',
    tableId: 'case-array-fk',
    schema: rootSchema({ owners: { type: 'array', items: fkField() } }),
    createData: { owners: ['owner-1'] },
    updateData: { owners: ['owner-2'] },
  },
  {
    name: 'array of files',
    tableId: 'case-array-files',
    schema: rootSchema({ documents: { type: 'array', items: fileField() } }),
    createData: { documents: [fileValue('file-array-create')] },
    updateData: { documents: [fileValue('file-array-update')] },
  },
  {
    name: 'array of objects with primitive',
    tableId: 'case-array-object-primitive',
    schema: rootSchema({ sections: { type: 'array', items: objectSchema({ label: stringField() }) } }),
    createData: { sections: [{ label: 'created' }] },
    updateData: { sections: [{ label: 'updated' }] },
  },
  {
    name: 'array of objects with FK',
    tableId: 'case-array-object-fk',
    schema: rootSchema({ sections: { type: 'array', items: objectSchema({ ownerId: fkField() }) } }),
    createData: { sections: [{ ownerId: 'owner-1' }] },
    updateData: { sections: [{ ownerId: 'owner-2' }] },
  },
  {
    name: 'array of objects with file',
    tableId: 'case-array-object-file',
    schema: rootSchema({ sections: { type: 'array', items: objectSchema({ document: fileField() }) } }),
    createData: { sections: [{ document: fileValue('file-array-object-create') }] },
    updateData: { sections: [{ document: fileValue('file-array-object-update') }] },
  },
  {
    name: 'nested object -> FK',
    tableId: 'case-nested-object-fk',
    schema: rootSchema({ meta: objectSchema({ nested: objectSchema({ ownerId: fkField() }) }) }),
    createData: { meta: { nested: { ownerId: 'owner-1' } } },
    updateData: { meta: { nested: { ownerId: 'owner-2' } } },
  },
  {
    name: 'nested object -> file',
    tableId: 'case-nested-object-file',
    schema: rootSchema({ meta: objectSchema({ nested: objectSchema({ document: fileField() }) }) }),
    createData: { meta: { nested: { document: fileValue('file-nested-create') } } },
    updateData: { meta: { nested: { document: fileValue('file-nested-update') } } },
  },
  {
    name: 'object -> array -> primitive',
    tableId: 'case-object-array-primitive',
    schema: rootSchema({ profile: objectSchema({ tags: { type: 'array', items: stringField() } }) }),
    createData: { profile: { tags: ['created'] } },
    updateData: { profile: { tags: ['updated'] } },
  },
  {
    name: 'object -> array -> FK',
    tableId: 'case-object-array-fk',
    schema: rootSchema({ profile: objectSchema({ owners: { type: 'array', items: fkField() } }) }),
    createData: { profile: { owners: ['owner-1'] } },
    updateData: { profile: { owners: ['owner-2'] } },
  },
  {
    name: 'object -> array -> file',
    tableId: 'case-object-array-file',
    schema: rootSchema({ profile: objectSchema({ documents: { type: 'array', items: fileField() } }) }),
    createData: { profile: { documents: [fileValue('file-object-array-create')] } },
    updateData: { profile: { documents: [fileValue('file-object-array-update')] } },
  },
  {
    name: 'array -> object -> array -> primitive',
    tableId: 'case-array-object-array-primitive',
    schema: rootSchema({
      sections: { type: 'array', items: objectSchema({ tags: { type: 'array', items: stringField() } }) },
    }),
    createData: { sections: [{ tags: ['created'] }] },
    updateData: { sections: [{ tags: ['updated'] }] },
  },
  {
    name: 'array -> object -> array -> FK',
    tableId: 'case-array-object-array-fk',
    schema: rootSchema({
      sections: { type: 'array', items: objectSchema({ owners: { type: 'array', items: fkField() } }) },
    }),
    createData: { sections: [{ owners: ['owner-1'] }] },
    updateData: { sections: [{ owners: ['owner-2'] }] },
  },
  {
    name: 'array -> object -> array -> file',
    tableId: 'case-array-object-array-file',
    schema: rootSchema({
      sections: { type: 'array', items: objectSchema({ documents: { type: 'array', items: fileField() } }) },
    }),
    createData: { sections: [{ documents: [fileValue('file-array-object-array-create')] }] },
    updateData: { sections: [{ documents: [fileValue('file-array-object-array-update')] }] },
  },
  {
    name: 'mixed primitive + FK + file + object',
    tableId: 'case-mixed-root',
    schema: rootSchema({
      title: stringField(),
      ownerId: fkField(),
      document: fileField(),
      profile: objectSchema({ score: numberField() }),
    }),
    createData: {
      title: 'created',
      ownerId: 'owner-1',
      document: fileValue('file-mixed-create'),
      profile: { score: 1 },
    },
    updateData: {
      title: 'updated',
      ownerId: 'owner-2',
      document: fileValue('file-mixed-update'),
      profile: { score: 2 },
    },
  },
  {
    name: 'mixed object -> array -> object -> FK + file',
    tableId: 'case-mixed-nested',
    schema: rootSchema({
      workflow: objectSchema({
        steps: {
          type: 'array',
          items: objectSchema({ ownerId: fkField(), evidence: fileField() }),
        },
      }),
    }),
    createData: { workflow: { steps: [{ ownerId: 'owner-1', evidence: fileValue('file-mixed-nested-create') }] } },
    updateData: { workflow: { steps: [{ ownerId: 'owner-2', evidence: fileValue('file-mixed-nested-update') }] } },
  },
  {
    name: 'schema update: add required FK to existing table',
    tableId: 'case-schema-update-required-fk',
    schema: rootSchema({ title: stringField(), ownerId: fkField() }),
    createData: { title: 'created', ownerId: 'owner-1' },
    updateData: { title: 'updated', ownerId: 'owner-2' },
  },
  {
    name: 'schema update: add file/FK into nested object/array',
    tableId: 'case-schema-update-nested-file-fk',
    schema: rootSchema({
      workflow: objectSchema({
        steps: { type: 'array', items: objectSchema({ ownerId: fkField(), evidence: fileField() }) },
      }),
    }),
    createData: { workflow: { steps: [{ ownerId: 'owner-1', evidence: fileValue('file-schema-update-create') }] } },
    updateData: { workflow: { steps: [{ ownerId: 'owner-2', evidence: fileValue('file-schema-update-update') }] } },
  },
]

export function rootRequiredFkCase(): RegressionSchemaCase {
  return rowSchemaCases.find((item) => item.name === 'root FK required')!
}

function rowModel(row: { id: string; data: JsonObject }, readonly = false) {
  return {
    __typename: 'RowModel',
    id: row.id,
    versionId: `${row.id}-v1`,
    readonly,
    data: row.data,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    publishedAt: null,
    createdId: row.id,
  }
}

function rowsConnection(rows: Array<{ id: string; data: JsonObject }>) {
  return {
    __typename: 'RowsConnection',
    totalCount: rows.length,
    pageInfo: {
      __typename: 'PageInfo',
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: rows.length ? 'cursor-1' : null,
      endCursor: rows.length ? `cursor-${rows.length}` : null,
    },
    edges: rows.map((row, index) => ({
      __typename: 'RowModelEdge',
      cursor: `cursor-${index + 1}`,
      node: rowModel(row),
    })),
  }
}

function tableModel(tableId: string, schema: JsonObject, count = 0) {
  return {
    __typename: 'TableModel',
    createdId: tableId,
    id: tableId,
    versionId: `${tableId}-v1`,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    readonly: false,
    count,
    schema,
  }
}

function tablesConnection(tables: Array<{ id: string; schema: JsonObject; count?: number }>) {
  return {
    data: {
      tables: {
        __typename: 'TablesConnection',
        totalCount: tables.length,
        pageInfo: {
          __typename: 'PageInfo',
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: tables.length ? 'cursor-1' : null,
          endCursor: tables.length ? `cursor-${tables.length}` : null,
        },
        edges: tables.map((table, index) => ({
          __typename: 'TableModelEdge',
          cursor: `cursor-${index + 1}`,
          node: tableModel(table.id, table.schema, table.count ?? 0),
        })),
      },
    },
  }
}

function getOperationName(body: Record<string, unknown> | null): string {
  return (body?.operationName as string) || ''
}

function filterForeignRows(search: string) {
  if (!search) {
    return ownerRows
  }

  return ownerRows.filter((row) => row.id.includes(search) || JSON.stringify(row.data).includes(search))
}

export function createRowTableRegressionMocks(options: {
  schemaCase: RegressionSchemaCase
  rows?: Array<{ id: string; data: JsonObject }>
  tableId?: string
}): {
  tableId: string
  schemaCase: RegressionSchemaCase
  createRequests: Array<{ rowId: string; data: JsonObject }>
  updateRequests: Array<{ rowId: string; data: JsonObject }>
  schemaUpdateRequests: JsonObject[]
  uploadRequests: string[]
  getRows: () => Array<{ id: string; data: JsonObject }>
  setup: (page: Page) => Promise<void>
} {
  const schemaCase = options.schemaCase
  const tableId = options.tableId ?? schemaCase.tableId
  const rows = [...(options.rows ?? [])]
  const createRequests: Array<{ rowId: string; data: JsonObject }> = []
  const updateRequests: Array<{ rowId: string; data: JsonObject }> = []
  const schemaUpdateRequests: JsonObject[] = []
  const uploadRequests: string[] = []
  const projectName = TEST_CONFIG.projectName
  const orgId = TEST_CONFIG.orgId
  const ownerSchema = rootSchema({ name: stringField() })

  const fulfillRowMutation = (operationName: 'createRow' | 'updateRow', rowId: string, data: JsonObject) => ({
    data: {
      [operationName]: {
        row: rowModel({ id: rowId, data }),
        table: tableModel(tableId, schemaCase.schema, rows.length),
        previousVersionTableId: tableId,
        previousVersionRowId: rowId,
      },
    },
  })

  const setup = async (page: Page) => {
    await setupAuth(page)
    await page.route('**/api/revision/**/upload/**', async (route) => {
      const fileId = route.request().url().split('/').pop() ?? ''
      uploadRequests.push(fileId)

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: uploadedFile(fileId, `${fileId}.txt`),
        }),
      })
    })

    await page.route('**/graphql', async (route: Route, request: Request) => {
      const body = request.postDataJSON()
      const opName = getOperationName(body)
      const variables = (body?.variables as Record<string, unknown>) || {}
      const projectResponse = createFullProjectResponse(projectName, orgId)
      const branchResponse = createFullBranchResponse(projectName)

      if (opName === 'createRowForStack' || opName === 'CreateRow') {
        const data = (variables.data as { rowId?: string; data?: JsonObject }) || {}
        const rowId = data.rowId ?? `row-${rows.length + 1}`
        const rowData = data.data ?? schemaCase.createData
        rows.push({ id: rowId, data: rowData })
        createRequests.push({ rowId, data: rowData })

        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(
            opName === 'CreateRow'
              ? { data: { createRow: rowModel({ id: rowId, data: rowData }) } }
              : fulfillRowMutation('createRow', rowId, rowData),
          ),
        })
      }

      if (opName === 'updateRowForStack' || opName === 'UpdateRow' || opName === 'PatchRowInline') {
        const data = (variables.data as { rowId?: string; data?: JsonObject }) || {}
        const rowId = data.rowId ?? rows[0]?.id ?? 'row-1'
        const rowData = data.data ?? {}
        const index = rows.findIndex((row) => row.id === rowId)
        if (index === -1) {
          rows.push({ id: rowId, data: rowData })
        } else {
          rows[index] = { id: rowId, data: rowData }
        }
        updateRequests.push({ rowId, data: rowData })

        const field = opName === 'PatchRowInline' ? 'patchRow' : 'updateRow'
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(
            opName === 'updateRowForStack'
              ? fulfillRowMutation('updateRow', rowId, rowData)
              : { data: { [field]: rowModel({ id: rowId, data: rowData }) } },
          ),
        })
      }

      if (opName === 'rowPageData') {
        const rowId = ((variables.rowData as JsonObject)?.rowId as string) ?? rows[0]?.id ?? 'row-1'
        const row = rows.find((item) => item.id === rowId) ?? { id: rowId, data: schemaCase.createData }

        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              row: { id: row.id, data: row.data },
              table: { id: tableId, schema: schemaCase.schema },
              getRowCountForeignKeysTo: 0,
            },
          }),
        })
      }

      if (opName === 'findForeignKey') {
        const search = JSON.stringify((variables.data as JsonObject)?.where ?? '').match(/owner-[12]/)?.[0] ?? ''
        const foreignRows = filterForeignRows(search)

        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { rows: rowsConnection(foreignRows) } }),
        })
      }

      if (opName === 'foreignKeyTableWithRows') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              table: tableModel(ownersTableId, ownerSchema, ownerRows.length),
              rows: rowsConnection(ownerRows),
            },
          }),
        })
      }

      if (opName === 'getTableForLoader' || opName === 'fetchTableForStack') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: { table: tableModel(tableId, schemaCase.schema, rows.length) } }),
        })
      }

      if (opName === 'updateTableForStack') {
        const data = ((variables.data as JsonObject) ?? {}) as JsonObject
        schemaUpdateRequests.push(data)

        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: {
              updateTable: {
                table: tableModel(tableId, schemaCase.schema, rows.length),
                previousVersionTableId: tableId,
              },
            },
          }),
        })
      }

      const responses: Record<string, object> = {
        configuration: createConfigurationResponse(),
        getMe: createMeResponse(orgId),
        meProjectsList: createMeProjectsResponse(projectName, orgId),
        getProjectForLoader: projectResponse,
        getProject: projectResponse,
        getBranchForLoader: branchResponse,
        findBranches: {
          data: {
            branches: {
              totalCount: 1,
              pageInfo: { hasNextPage: false, endCursor: null },
              edges: [{ cursor: 'cursor-1', node: branchResponse.data.branch }],
            },
          },
        },
        tableListData: tablesConnection([
          { id: tableId, schema: schemaCase.schema, count: rows.length },
          { id: ownersTableId, schema: ownerSchema, count: ownerRows.length },
        ]),
        RowListRows: { data: { rows: rowsConnection(rows) } },
        GetTableViews: createTableViewsResponse(tableId),
        UpdateTableViews: { data: { updateTableViews: null } },
        getChanges: { data: { changes: { tables: 0, rows: 0 } } },
        GetRevisionChanges: { data: { revisionChanges: { tables: 0, rows: 0 } } },
      }

      const response = responses[opName]
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response ?? { data: null }),
      })
    })
  }

  return {
    tableId,
    schemaCase,
    createRequests,
    updateRequests,
    schemaUpdateRequests,
    uploadRequests,
    getRows: () => rows,
    setup,
  }
}

export function getRegressionTableUrl(tableId: string, rowId?: string) {
  const tableUrl = getTablePageUrl('draft', { tableId })
  return rowId ? `${tableUrl}/${rowId}` : tableUrl
}

export function getRegressionRevisionUrl() {
  return `/app/${TEST_CONFIG.orgId}/${TEST_CONFIG.projectName}/master/draft`
}

export { ownersTableId, ownerRows, emptyFile }
