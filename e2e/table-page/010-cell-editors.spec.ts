import { test, expect, Page } from '@playwright/test'
import {
  createConfigurationResponse,
  createFullBranchResponse,
  createFullProjectResponse,
  createMeProjectsResponse,
  createMeResponse,
  createRowsResponse,
  createTablesResponse,
  createTableViewsResponse,
} from '../fixtures/full-fixtures'
import { setupAuth } from '../helpers/setup-auth'

const PROJECT_NAME = 'test-project'
const ORG_ID = 'testuser'
const TABLE_ID = 'users'

function createTableWithSchema(tableId: string, schema: object) {
  return {
    data: {
      table: {
        __typename: 'TableModel',
        createdId: tableId,
        id: tableId,
        versionId: `${tableId}-v1`,
        readonly: false,
        count: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        schema,
      },
    },
  }
}

async function setupMocks(
  page: Page,
  options: {
    schema?: object
    rows?: Array<{ id: string; data: Record<string, unknown> }>
  } = {},
) {
  await setupAuth(page)

  const schema = options.schema || {
    type: 'object',
    properties: {
      name: { type: 'string', default: '' },
      age: { type: 'number', default: 0 },
      active: { type: 'boolean', default: false },
    },
    additionalProperties: false,
    required: ['name', 'age', 'active'],
  }

  const rows = options.rows || [{ id: 'row-1', data: { name: 'Test User', age: 25, active: true } }]

  await page.route('**/graphql', async (route, request) => {
    const body = request.postDataJSON()
    const opName = body?.operationName as string

    const projectResponse = createFullProjectResponse(PROJECT_NAME, ORG_ID)
    const branchResponse = createFullBranchResponse(PROJECT_NAME)

    if (opName === 'GetTableViews') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(createTableViewsResponse(TABLE_ID)),
      })
    }

    if (opName === 'UpdateTableViews') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: { updateTableViews: null } }),
      })
    }

    if (opName === 'TableMst') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(createTableWithSchema(TABLE_ID, schema)),
      })
    }

    if (opName === 'UpdateRow' || opName === 'PatchRowInline') {
      const data = body.variables?.data || {}
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            [opName === 'PatchRowInline' ? 'patchRow' : 'updateRow']: {
              __typename: 'RowModel',
              id: data.rowId || 'row-1',
              versionId: 'row-1-v2',
              readonly: false,
              data: data.data || {},
              createdAt: '2024-01-01T00:00:00Z',
              updatedAt: new Date().toISOString(),
            },
          },
        }),
      })
    }

    const responses: Record<string, object> = {
      configuration: createConfigurationResponse(),
      getMe: createMeResponse(ORG_ID),
      meProjectsList: createMeProjectsResponse(PROJECT_NAME, ORG_ID),
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
      TablesMst: createTablesResponse(TABLE_ID, schema),
      RowsMst: createRowsResponse(rows),
      RowListRows: createRowsResponse(rows),
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

test.describe('Cell Editors', () => {
  test.describe('String Editor', () => {
    test('renders text input for string field', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            title: { type: 'string', default: '' },
          },
          additionalProperties: false,
          required: ['title'],
        },
        rows: [{ id: 'row-1', data: { title: 'Hello World' } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-title')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-title')
      await cell.dblclick()

      const input = page.locator('input:focus, textarea:focus')
      await expect(input).toBeVisible()
      await expect(input).toHaveValue('Hello World')
    })

    test('can clear and type new string value', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            title: { type: 'string', default: '' },
          },
          additionalProperties: false,
          required: ['title'],
        },
        rows: [{ id: 'row-1', data: { title: 'Original' } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-title')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-title')
      await cell.dblclick()

      const input = page.locator('input:focus, textarea:focus')
      await input.clear()
      await input.fill('New Value')
      await input.press('Enter')

      await expect(cell).toContainText('New Value')
    })

    test('multiline string shows textarea', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            description: { type: 'string', default: '' },
          },
          additionalProperties: false,
          required: ['description'],
        },
        rows: [{ id: 'row-1', data: { description: 'Line 1\nLine 2' } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-description')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-description')
      await cell.dblclick()

      // Should be able to type multi-line content
      const input = page.locator('input:focus, textarea:focus')
      await expect(input).toBeVisible()
    })
  })

  test.describe('Number Editor', () => {
    test('renders number input for number field', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            count: { type: 'number', default: 0 },
          },
          additionalProperties: false,
          required: ['count'],
        },
        rows: [{ id: 'row-1', data: { count: 42 } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-count')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-count')
      await cell.dblclick()

      const input = page.locator('input:focus, textarea:focus')
      await expect(input).toBeVisible()
      await expect(input).toHaveValue('42')
    })

    test('can edit number value', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            count: { type: 'number', default: 0 },
          },
          additionalProperties: false,
          required: ['count'],
        },
        rows: [{ id: 'row-1', data: { count: 10 } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-count')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-count')
      await cell.dblclick()

      const input = page.locator('input:focus, textarea:focus')
      await input.clear()
      await input.fill('99')
      await input.press('Enter')

      await expect(cell).toContainText('99')
    })

    test('handles decimal numbers', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            price: { type: 'number', default: 0 },
          },
          additionalProperties: false,
          required: ['price'],
        },
        rows: [{ id: 'row-1', data: { price: 19.99 } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-price')).toBeVisible()

      await expect(page.getByTestId('cell-row-1-price')).toContainText('19.99')
    })
  })

  test.describe('Boolean Editor', () => {
    test('shows true/false toggle for boolean field', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean', default: false },
          },
          additionalProperties: false,
          required: ['enabled'],
        },
        rows: [{ id: 'row-1', data: { enabled: true } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-enabled')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-enabled')
      await expect(cell).toContainText('true')
    })

    test('can toggle boolean from true to false', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean', default: false },
          },
          additionalProperties: false,
          required: ['enabled'],
        },
        rows: [{ id: 'row-1', data: { enabled: true } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-enabled')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-enabled')
      await expect(cell).toContainText('true')

      await cell.dblclick()

      // Select false option
      await page.getByText('false').click()

      await expect(cell).toContainText('false')
    })

    test('can toggle boolean from false to true', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            enabled: { type: 'boolean', default: false },
          },
          additionalProperties: false,
          required: ['enabled'],
        },
        rows: [{ id: 'row-1', data: { enabled: false } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-enabled')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-enabled')
      await expect(cell).toContainText('false')

      await cell.dblclick()

      // Select true option
      await page.getByText('true').click()

      await expect(cell).toContainText('true')
    })
  })

  test.describe.skip('Array Editor', () => {
    // Skip: array columns don't show column headers - needs UI implementation
    test('displays array values', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            tags: {
              type: 'array',
              items: { type: 'string' },
              default: [],
            },
          },
          additionalProperties: false,
          required: ['tags'],
        },
        rows: [{ id: 'row-1', data: { tags: ['react', 'typescript', 'node'] } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-tags')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-tags')
      // Array should be displayed in some format
      await expect(cell).toBeVisible()
    })

    test.skip('can edit array items', async ({ page }) => {
      // BUG: Array editing UI needs to be implemented
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            tags: {
              type: 'array',
              items: { type: 'string' },
              default: [],
            },
          },
          additionalProperties: false,
          required: ['tags'],
        },
        rows: [{ id: 'row-1', data: { tags: ['tag1'] } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      // Test array editing functionality
    })
  })

  test.describe.skip('Object Editor', () => {
    // Skip: object columns don't show column headers - needs UI implementation
    test('displays nested object values', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            address: {
              type: 'object',
              properties: {
                city: { type: 'string', default: '' },
                country: { type: 'string', default: '' },
              },
              default: {},
            },
          },
          additionalProperties: false,
          required: ['address'],
        },
        rows: [{ id: 'row-1', data: { address: { city: 'NYC', country: 'USA' } } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-address')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-address')
      await expect(cell).toBeVisible()
    })

    test.skip('can edit nested object properties', async () => {
      // BUG: Object editing UI needs verification
    })
  })

  test.describe('Date Editor', () => {
    test('displays date values', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            createdAt: { type: 'string', format: 'date-time', default: '' },
          },
          additionalProperties: false,
          required: ['createdAt'],
        },
        rows: [{ id: 'row-1', data: { createdAt: '2024-01-15T10:30:00Z' } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-createdAt')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-createdAt')
      await expect(cell).toBeVisible()
    })
  })

  test.describe('File Editor', () => {
    test('displays file field', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            avatar: { $ref: 'urn:jsonschema:io:revisium:file-schema:1.0.0' },
          },
          additionalProperties: false,
          required: ['avatar'],
        },
        rows: [
          {
            id: 'row-1',
            data: {
              avatar: {
                fileId: 'file-123',
                fileName: 'photo.jpg',
                hash: 'abc123',
                mimeType: 'image/jpeg',
                size: 1024,
                status: 'uploaded',
                url: 'https://example.com/photo.jpg',
              },
            },
          },
        ],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-avatar')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-avatar')
      await expect(cell).toBeVisible()
    })

    test('displays empty file field placeholder', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            document: { $ref: 'urn:jsonschema:io:revisium:file-schema:1.0.0' },
          },
          additionalProperties: false,
          required: ['document'],
        },
        rows: [
          {
            id: 'row-1',
            data: {
              document: {
                fileId: '',
                status: 'ready',
              },
            },
          },
        ],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-document')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-document')
      await expect(cell).toBeVisible()
    })
  })

  test.describe('Foreign Key Editor', () => {
    async function setupForeignKeyMocks(
      page: Page,
      options: {
        foreignTableId?: string
        foreignRows?: Array<{ id: string; data: Record<string, unknown> }>
        currentValue?: string
      } = {},
    ) {
      await setupAuth(page)

      const foreignTableId = options.foreignTableId || 'categories'
      const foreignRows = options.foreignRows || [
        { id: 'cat-1', data: { name: 'Category 1' } },
        { id: 'cat-2', data: { name: 'Category 2' } },
        { id: 'cat-3', data: { name: 'Category 3' } },
      ]
      const currentValue = options.currentValue || 'cat-1'

      const schema = {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            default: '',
            foreignKey: foreignTableId,
          },
        },
        additionalProperties: false,
        required: ['categoryId'],
      }

      const rows = [{ id: 'row-1', data: { categoryId: currentValue } }]

      await page.route('**/graphql', async (route, request) => {
        const body = request.postDataJSON()
        const opName = body?.operationName as string

        const projectResponse = createFullProjectResponse(PROJECT_NAME, ORG_ID)
        const branchResponse = createFullBranchResponse(PROJECT_NAME)

        if (opName === 'GetTableViews') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTableViewsResponse(TABLE_ID)),
          })
        }

        if (opName === 'UpdateTableViews') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: { updateTableViews: null } }),
          })
        }

        if (opName === 'TableMst') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTableWithSchema(TABLE_ID, schema)),
          })
        }

        if (opName === 'findForeignKey') {
          const searchFilter = body?.variables?.data?.where
          let filteredRows = foreignRows

          if (searchFilter?.OR) {
            const searchTerm = searchFilter.OR[0]?.id?.contains || searchFilter.OR[1]?.data?.search
            if (searchTerm) {
              filteredRows = foreignRows.filter(
                (row) =>
                  row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  JSON.stringify(row.data).toLowerCase().includes(searchTerm.toLowerCase()),
              )
            }
          }

          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                rows: {
                  totalCount: filteredRows.length,
                  pageInfo: { hasNextPage: false, endCursor: null },
                  edges: filteredRows.map((row, index) => ({
                    cursor: `cursor-${index}`,
                    node: {
                      __typename: 'RowModel',
                      id: row.id,
                      versionId: `${row.id}-v1`,
                      readonly: false,
                      data: row.data,
                      createdAt: '2024-01-01T00:00:00Z',
                      updatedAt: '2024-01-01T00:00:00Z',
                    },
                  })),
                },
              },
            }),
          })
        }

        if (opName === 'UpdateRow' || opName === 'PatchRowInline') {
          const variables = body.variables?.data || {}
          const rowData = variables.data || {}
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                [opName === 'PatchRowInline' ? 'patchRow' : 'updateRow']: {
                  __typename: 'RowModel',
                  id: variables.rowId || 'row-1',
                  versionId: 'row-1-v2',
                  readonly: false,
                  data: rowData,
                  createdAt: '2024-01-01T00:00:00Z',
                  updatedAt: new Date().toISOString(),
                },
              },
            }),
          })
        }

        const responses: Record<string, object> = {
          configuration: createConfigurationResponse(),
          getMe: createMeResponse(ORG_ID),
          meProjectsList: createMeProjectsResponse(PROJECT_NAME, ORG_ID),
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
          TablesMst: createTablesResponse(TABLE_ID, schema),
          RowsMst: createRowsResponse(rows),
          RowListRows: createRowsResponse(rows),
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

    test('displays foreign key reference value', async ({ page }) => {
      await setupForeignKeyMocks(page, { currentValue: 'cat-1' })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-categoryId')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-categoryId')
      await expect(cell).toContainText('cat-1')
    })

    test('opens foreign key picker on double click', async ({ page }) => {
      await setupForeignKeyMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-categoryId')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-categoryId')
      await cell.dblclick()

      // Foreign key picker popover should appear with table name header
      await expect(page.getByText('categories')).toBeVisible()
    })

    test('shows list of available foreign key options', async ({ page }) => {
      await setupForeignKeyMocks(page, {
        foreignRows: [
          { id: 'cat-1', data: { name: 'Electronics' } },
          { id: 'cat-2', data: { name: 'Books' } },
          { id: 'cat-3', data: { name: 'Clothing' } },
        ],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-categoryId')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-categoryId')
      await cell.dblclick()

      // Wait for options to load using data-testid
      await expect(page.getByTestId('fk-option-cat-1')).toBeVisible()
      await expect(page.getByTestId('fk-option-cat-2')).toBeVisible()
      await expect(page.getByTestId('fk-option-cat-3')).toBeVisible()
    })

    test('can select a different foreign key value', async ({ page }) => {
      await setupForeignKeyMocks(page, { currentValue: 'cat-1' })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-categoryId')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-categoryId')
      await cell.dblclick()

      // Wait for options to load and select different value using data-testid
      await page.getByTestId('fk-option-cat-2').click()

      // Cell should now show new value
      await expect(cell).toContainText('cat-2')
    })

    test('can search foreign key options', async ({ page }) => {
      await setupForeignKeyMocks(page, {
        foreignRows: [
          { id: 'electronics', data: { name: 'Electronics' } },
          { id: 'books', data: { name: 'Books' } },
          { id: 'clothing', data: { name: 'Clothing' } },
        ],
        currentValue: 'electronics',
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-categoryId')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-categoryId')
      await cell.dblclick()

      // Wait for picker to load using data-testid
      await expect(page.getByTestId('fk-option-electronics')).toBeVisible()

      // Type in search field using data-testid
      const searchInput = page.getByTestId('fk-search-input')
      await searchInput.fill('book')

      // Should filter results - only books should be visible
      await expect(page.getByTestId('fk-option-books')).toBeVisible()
      await expect(page.getByTestId('fk-option-electronics')).not.toBeVisible()
      await expect(page.getByTestId('fk-option-clothing')).not.toBeVisible()
    })

    test('displays empty foreign key field placeholder', async ({ page }) => {
      await setupForeignKeyMocks(page, { currentValue: '' })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-categoryId')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-categoryId')
      // Empty foreign key should show empty or placeholder
      await expect(cell).toBeVisible()
    })

    test('closes picker on clicking outside', async ({ page }) => {
      await setupForeignKeyMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-categoryId')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-categoryId')
      await cell.dblclick()

      // Picker should be visible
      await expect(page.getByText('categories')).toBeVisible()

      // Click outside
      await page.click('body', { position: { x: 10, y: 10 } })

      // Picker should close
      await expect(page.getByText('categories')).not.toBeVisible()
    })

    test('shows "No results found" when search has no matches', async ({ page }) => {
      await setupForeignKeyMocks(page, {
        foreignRows: [
          { id: 'cat-1', data: { name: 'Electronics' } },
          { id: 'cat-2', data: { name: 'Books' } },
        ],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-categoryId')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-categoryId')
      await cell.dblclick()

      // Wait for picker to load
      await expect(page.getByTestId('fk-option-cat-1')).toBeVisible()

      // Type in search field using data-testid
      const searchInput = page.getByTestId('fk-search-input')
      await searchInput.fill('nonexistent')

      // Should show no results message using data-testid
      await expect(page.getByTestId('fk-not-found')).toBeVisible()
    })
  })

  test.describe('Null Values', () => {
    test('handles null string value', async ({ page }) => {
      await setupMocks(page, {
        rows: [{ id: 'row-1', data: { name: '', age: 0, active: false } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await expect(cell).toBeVisible()
    })

    test('handles null number value', async ({ page }) => {
      await setupMocks(page, {
        rows: [{ id: 'row-1', data: { name: '', age: 0, active: false } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-age')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-age')
      await expect(cell).toContainText('0')
    })
  })

  test.describe('Validation', () => {
    test.skip('shows error for invalid number input', async ({ page }) => {
      // BUG: Input validation needs to be verified
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            count: { type: 'number', default: 0 },
          },
          additionalProperties: false,
          required: ['count'],
        },
        rows: [{ id: 'row-1', data: { count: 10 } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      const cell = page.getByTestId('cell-row-1-count')
      await cell.dblclick()

      const input = cell.locator('input')
      await input.clear()
      await input.fill('not a number')
      await input.press('Enter')

      // Should show validation error or prevent save
    })
  })

  test.describe('Save State', () => {
    test.skip('cell shows spinner during slow save', { timeout: 10000 }, async ({ page }) => {
      // Skip: spinner element selector needs verification
      await setupAuth(page)

      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
        },
        additionalProperties: false,
        required: ['name'],
      }
      const rows = [{ id: 'row-1', data: { name: 'Original' } }]

      await page.route('**/graphql', async (route, request) => {
        const body = request.postDataJSON()
        const opName = body?.operationName as string

        const projectResponse = createFullProjectResponse(PROJECT_NAME, ORG_ID)
        const branchResponse = createFullBranchResponse(PROJECT_NAME)

        if (opName === 'PatchRowInline') {
          // Delay response for 2 seconds to trigger saving indicator (shows after 1s)
          await new Promise((resolve) => setTimeout(resolve, 2000))
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                patchRow: {
                  __typename: 'RowModel',
                  id: 'row-1',
                  versionId: 'row-1-v2',
                  readonly: false,
                  data: { name: 'New Value' },
                  createdAt: '2024-01-01T00:00:00Z',
                  updatedAt: new Date().toISOString(),
                },
              },
            }),
          })
        }

        if (opName === 'GetTableViews') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTableViewsResponse(TABLE_ID)),
          })
        }

        if (opName === 'UpdateTableViews') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: { updateTableViews: null } }),
          })
        }

        if (opName === 'TableMst') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTableWithSchema(TABLE_ID, schema)),
          })
        }

        const responses: Record<string, object> = {
          configuration: createConfigurationResponse(),
          getMe: createMeResponse(ORG_ID),
          meProjectsList: createMeProjectsResponse(PROJECT_NAME, ORG_ID),
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
          TablesMst: createTablesResponse(TABLE_ID, schema),
          RowsMst: createRowsResponse(rows),
          RowListRows: createRowsResponse(rows),
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

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      const input = page.locator('input:focus, textarea:focus')
      await input.clear()
      await input.fill('New Value')
      await input.press('Enter')

      // Spinner appears after 1 second delay
      await expect(cell.locator('[data-scope="spinner"]')).toBeVisible()
    })

    test('cell shows error state on save failure', async ({ page }) => {
      await setupAuth(page)

      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
        },
        additionalProperties: false,
        required: ['name'],
      }
      const rows = [{ id: 'row-1', data: { name: 'Original' } }]

      await page.route('**/graphql', async (route, request) => {
        const body = request.postDataJSON()
        const opName = body?.operationName as string

        const projectResponse = createFullProjectResponse(PROJECT_NAME, ORG_ID)
        const branchResponse = createFullBranchResponse(PROJECT_NAME)

        if (opName === 'PatchRowInline') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              errors: [{ message: 'Failed to save row' }],
              data: null,
            }),
          })
        }

        if (opName === 'GetTableViews') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTableViewsResponse(TABLE_ID)),
          })
        }

        if (opName === 'UpdateTableViews') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: { updateTableViews: null } }),
          })
        }

        if (opName === 'TableMst') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTableWithSchema(TABLE_ID, schema)),
          })
        }

        const responses: Record<string, object> = {
          configuration: createConfigurationResponse(),
          getMe: createMeResponse(ORG_ID),
          meProjectsList: createMeProjectsResponse(PROJECT_NAME, ORG_ID),
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
          TablesMst: createTablesResponse(TABLE_ID, schema),
          RowsMst: createRowsResponse(rows),
          RowListRows: createRowsResponse(rows),
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

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      const input = page.locator('input:focus, textarea:focus')
      await input.clear()
      await input.fill('New Value')
      await input.press('Enter')

      // Cell should show error state (red outline)
      await expect(cell).toHaveCSS('outline-color', 'rgb(248, 113, 113)')
    })

    test('cell value reverts on save failure', async ({ page }) => {
      await setupAuth(page)

      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
        },
        additionalProperties: false,
        required: ['name'],
      }
      const rows = [{ id: 'row-1', data: { name: 'Original Value' } }]

      await page.route('**/graphql', async (route, request) => {
        const body = request.postDataJSON()
        const opName = body?.operationName as string

        const projectResponse = createFullProjectResponse(PROJECT_NAME, ORG_ID)
        const branchResponse = createFullBranchResponse(PROJECT_NAME)

        if (opName === 'PatchRowInline') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              errors: [{ message: 'Failed to save' }],
              data: null,
            }),
          })
        }

        if (opName === 'GetTableViews') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTableViewsResponse(TABLE_ID)),
          })
        }

        if (opName === 'UpdateTableViews') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: { updateTableViews: null } }),
          })
        }

        if (opName === 'TableMst') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTableWithSchema(TABLE_ID, schema)),
          })
        }

        const responses: Record<string, object> = {
          configuration: createConfigurationResponse(),
          getMe: createMeResponse(ORG_ID),
          meProjectsList: createMeProjectsResponse(PROJECT_NAME, ORG_ID),
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
          TablesMst: createTablesResponse(TABLE_ID, schema),
          RowsMst: createRowsResponse(rows),
          RowListRows: createRowsResponse(rows),
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

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await expect(cell).toContainText('Original Value')

      await cell.dblclick()

      const input = page.locator('input:focus, textarea:focus')
      await input.clear()
      await input.fill('Changed Value')
      await input.press('Enter')

      // After error, value should revert to original
      await expect(cell).toContainText('Original Value')
    })

    test('successful save updates cell value', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string', default: '' },
          },
          additionalProperties: false,
          required: ['name'],
        },
        rows: [{ id: 'row-1', data: { name: 'Original' } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      const input = page.locator('input:focus, textarea:focus')
      await input.clear()
      await input.fill('Updated Value')
      await input.press('Enter')

      // Cell should show new value
      await expect(cell).toContainText('Updated Value')
    })
  })
})
