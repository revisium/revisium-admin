import { Page } from '@playwright/test'
import { setupTablePageMocks } from './table-page-setup'

export const FILE_SCHEMA_REF = 'urn:jsonschema:io:revisium:file-schema:1.0.0'

export const fileShapeMatrix = [
  'root primitive field',
  'root file field',
  'root foreign key field',
  'object with primitive/file fields',
  'array of primitives',
  'array of files',
  'array of objects with file field',
  'nested object with file field',
  'array of arrays',
  'mixed nested object -> array -> object -> file',
] as const

export const emptyFile = {
  status: 'ready',
  fileId: '',
  url: '',
  fileName: '',
  hash: '',
  extension: '',
  mimeType: '',
  size: 0,
  width: 0,
  height: 0,
}

export function readyFile(fileId: string, fileName = '') {
  return {
    ...emptyFile,
    fileId,
    fileName,
  }
}

export function uploadedFile(fileId: string, fileName: string) {
  return {
    status: 'uploaded',
    fileId,
    url: `/uploads/${fileName}`,
    fileName,
    hash: `${fileId}-hash`,
    extension: fileName.split('.').pop() ?? '',
    mimeType: 'text/plain',
    size: 12,
    width: 0,
    height: 0,
  }
}

export function createRowFileRegressionFixture(tableId = 'file-regression') {
  const schema = {
    type: 'object',
    properties: {
      title: { type: 'string', default: '' },
      avatar: { $ref: FILE_SCHEMA_REF },
      ownerId: { type: 'string', default: '', foreignKey: 'owners' },
      profile: {
        type: 'object',
        properties: {
          note: { type: 'string', default: '' },
          contract: { $ref: FILE_SCHEMA_REF },
        },
        additionalProperties: false,
        required: ['contract', 'note'],
      },
      tags: {
        type: 'array',
        items: { type: 'string', default: '' },
      },
      gallery: {
        type: 'array',
        items: { $ref: FILE_SCHEMA_REF },
      },
      sections: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string', default: '' },
            attachment: { $ref: FILE_SCHEMA_REF },
          },
          additionalProperties: false,
          required: ['attachment', 'label'],
        },
      },
      metadata: {
        type: 'object',
        properties: {
          nested: {
            type: 'object',
            properties: {
              document: { $ref: FILE_SCHEMA_REF },
            },
            additionalProperties: false,
            required: ['document'],
          },
        },
        additionalProperties: false,
        required: ['nested'],
      },
      matrix: {
        type: 'array',
        items: {
          type: 'array',
          items: { type: 'string', default: '' },
        },
      },
      workflow: {
        type: 'object',
        properties: {
          steps: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', default: '' },
                evidence: { $ref: FILE_SCHEMA_REF },
              },
              additionalProperties: false,
              required: ['evidence', 'name'],
            },
          },
        },
        additionalProperties: false,
        required: ['steps'],
      },
    },
    additionalProperties: false,
    required: [
      'avatar',
      'gallery',
      'matrix',
      'metadata',
      'ownerId',
      'profile',
      'sections',
      'tags',
      'title',
      'workflow',
    ],
  }

  const draftData = () => ({
    title: 'Draft asset row',
    avatar: { ...emptyFile },
    ownerId: 'owner-1',
    profile: {
      note: 'Nested object with file',
      contract: { ...emptyFile },
    },
    tags: ['alpha', 'beta'],
    gallery: [{ ...emptyFile }],
    sections: [
      {
        label: 'first',
        attachment: { ...emptyFile },
      },
    ],
    metadata: {
      nested: {
        document: { ...emptyFile },
      },
    },
    matrix: [['a1', 'a2'], ['b1']],
    workflow: {
      steps: [
        {
          name: 'review',
          evidence: { ...emptyFile },
        },
      ],
    },
  })

  const savedData = () => {
    const data = draftData()

    return {
      ...data,
      avatar: readyFile('file-avatar-created'),
      profile: {
        ...data.profile,
        contract: readyFile('file-contract-created'),
      },
      gallery: [readyFile('file-gallery-created')],
      sections: [
        {
          ...data.sections[0],
          attachment: readyFile('file-section-created'),
        },
      ],
      metadata: {
        nested: {
          document: readyFile('file-nested-document-created'),
        },
      },
      workflow: {
        steps: [
          {
            ...data.workflow.steps[0],
            evidence: readyFile('file-workflow-evidence-created'),
          },
        ],
      },
    }
  }

  return {
    tableId,
    schema,
    draftData,
    savedData,
    shapes: fileShapeMatrix,
  }
}

export function createRowPageUploadMocks(
  options: {
    rowId?: string
    tableId?: string
    initialRowData?: Record<string, unknown>
  } = {},
) {
  const fixture = createRowFileRegressionFixture(options.tableId)
  let rowId = options.rowId ?? 'complex-row'
  let rowData = options.initialRowData ?? fixture.savedData()
  const uploadRequests: string[] = []
  const updateRequests: unknown[] = []

  const fulfillRowMutation = (operationName: 'createRow' | 'updateRow', nextRowData: Record<string, unknown>) => ({
    data: {
      [operationName]: {
        row: {
          __typename: 'RowModel',
          id: rowId,
          versionId: `${rowId}-v2`,
          createdId: rowId,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:01Z',
          readonly: false,
          data: nextRowData,
        },
        table: {
          __typename: 'TableModel',
          id: fixture.tableId,
          versionId: `${fixture.tableId}-v2`,
          createdId: fixture.tableId,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:01Z',
          readonly: false,
          count: 1,
          schema: fixture.schema,
        },
        previousVersionTableId: fixture.tableId,
        previousVersionRowId: rowId,
      },
    },
  })

  return {
    ...fixture,
    uploadRequests,
    updateRequests,
    get rowData() {
      return rowData
    },
    setup: async (page: Page) => {
      await setupTablePageMocks(page, {
        tableId: fixture.tableId,
        schema: fixture.schema,
        rows: options.initialRowData ? [{ id: rowId, data: rowData }] : [],
        onOperation: async (opName, variables, route) => {
          if (opName === 'createRowForStack') {
            const data = variables.data as { rowId: string }
            rowId = data.rowId
            rowData = fixture.savedData()

            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(fulfillRowMutation('createRow', rowData)),
            })
            return true
          }

          if (opName === 'updateRowForStack') {
            const data = variables.data as { data: Record<string, unknown>; rowId: string }
            rowId = data.rowId
            rowData = data.data
            updateRequests.push(data.data)

            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(fulfillRowMutation('updateRow', rowData)),
            })
            return true
          }

          if (opName === 'rowPageData') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                data: {
                  row: { id: rowId, data: rowData },
                  table: { id: fixture.tableId, schema: fixture.schema },
                  getRowCountForeignKeysTo: 0,
                },
              }),
            })
            return true
          }

          if (opName === 'fetchTableForStack') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                data: {
                  table: {
                    id: fixture.tableId,
                    versionId: `${fixture.tableId}-v1`,
                    readonly: false,
                    count: options.initialRowData ? 1 : 0,
                    schema: fixture.schema,
                  },
                },
              }),
            })
            return true
          }
        },
      })

      await page.route('**/api/revision/**/upload/**', async (route, request) => {
        const url = new URL(request.url())
        const fileId = url.pathname.split('/').pop() ?? ''
        uploadRequests.push(fileId)

        const nextData = JSON.parse(JSON.stringify(rowData))

        if (fileId === 'file-avatar-created') {
          nextData.avatar = uploadedFile(fileId, 'avatar.txt')
        }
        if (fileId === 'file-contract-created') {
          nextData.profile.contract = uploadedFile(fileId, 'contract.txt')
        }
        if (fileId === 'file-workflow-evidence-created') {
          nextData.workflow.steps[0].evidence = uploadedFile(fileId, 'evidence.txt')
        }

        rowData = nextData

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            row: {
              data: rowData,
            },
          }),
        })
      })
    },
  }
}
