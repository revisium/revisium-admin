import { test, expect, Page } from '@playwright/test'
import {
  createConfigurationResponse,
  createFullBranchResponse,
  createFullProjectResponse,
  createFullTableResponse,
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

async function setupMocks(
  page: Page,
  options: {
    rows?: Array<{ id: string; data: Record<string, unknown> }>
    schema?: object
  } = {},
) {
  await setupAuth(page)

  const rows = options.rows || []
  const rowsResponse = createRowsResponse(rows)

  const schema = options.schema || {
    type: 'object',
    properties: {
      name: { type: 'string', default: '' },
      age: { type: 'integer', default: 0 },
      active: { type: 'boolean', default: false },
    },
    additionalProperties: false,
    required: ['name', 'age', 'active'],
  }

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

    const responses: Record<string, object> = {
      configuration: createConfigurationResponse(),
      getMe: createMeResponse(ORG_ID),
      meProjectsMst: createMeProjectsResponse(PROJECT_NAME, ORG_ID),
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
      TablesMst: createTablesResponse(TABLE_ID),
      TableMst: createFullTableResponse(TABLE_ID, schema),
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

test.describe('Empty States', () => {
  test.describe('Empty Table', () => {
    test('shows empty state when table has no rows', async ({ page }) => {
      await setupMocks(page, { rows: [] })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Should show "0 rows" or "No rows" message
      await expect(page.getByText('0 rows').or(page.getByText(/no rows/i))).toBeVisible()
    })

    test('shows column headers even when no rows', async ({ page }) => {
      await setupMocks(page, { rows: [] })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

      // Column headers should still be visible
      await expect(page.getByTestId('column-header-name')).toBeVisible()
      await expect(page.getByTestId('column-header-age')).toBeVisible()
      await expect(page.getByTestId('column-header-active')).toBeVisible()
    })

    test('new row button is visible on empty table', async ({ page }) => {
      await setupMocks(page, { rows: [] })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByRole('button', { name: /new row/i })).toBeVisible()
    })

    test('filter controls work on empty table', async ({ page }) => {
      await setupMocks(page, { rows: [] })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      await expect(page.getByTestId('filter-condition-0')).toBeVisible()
    })

    test('search works on empty table', async ({ page }) => {
      await setupMocks(page, { rows: [] })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByRole('button', { name: /search/i }).click()
      await page.getByPlaceholder('Search...').fill('test')

      // Should handle empty search gracefully
      await expect(page.getByText('0 rows').or(page.getByText(/no rows/i))).toBeVisible()
    })
  })

  test.describe('Empty Search Results', () => {
    test('shows no results message when search finds nothing', async ({ page }) => {
      const rows = [
        { id: 'row-1', data: { name: 'Alice', age: 25, active: true } },
        { id: 'row-2', data: { name: 'Bob', age: 30, active: false } },
      ]

      await setupAuth(page)

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

        if (opName === 'RowListRows' || opName === 'RowsMst') {
          const where = body?.variables?.data?.where
          if (where?.data?.contains) {
            // Return empty results for search
            return route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(createRowsResponse([])),
            })
          }
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createRowsResponse(rows)),
          })
        }

        const responses: Record<string, object> = {
          configuration: createConfigurationResponse(),
          getMe: createMeResponse(ORG_ID),
          meProjectsMst: createMeProjectsResponse(PROJECT_NAME, ORG_ID),
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
          TablesMst: createTablesResponse(TABLE_ID),
          TableMst: createFullTableResponse(TABLE_ID),
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

      // Verify rows are visible initially
      await expect(page.getByTestId('row-row-1')).toBeVisible()

      // Search for non-existent term
      await page.getByRole('button', { name: /search/i }).click()
      await page.getByPlaceholder('Search...').fill('nonexistent')
      await page.waitForTimeout(500)

      // Should show no results message
      await expect(page.getByText(/no rows found/i).or(page.getByText('0 rows'))).toBeVisible()
    })
  })

  test.describe('Empty Filter Results', () => {
    test('shows message when filter returns no results', async ({ page }) => {
      const rows = [
        { id: 'row-1', data: { name: 'Alice', age: 25, active: true } },
        { id: 'row-2', data: { name: 'Bob', age: 30, active: false } },
      ]

      await setupAuth(page)

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

        if (opName === 'RowListRows' || opName === 'RowsMst') {
          const where = body?.variables?.data?.where
          // Check if there's a filter applied that would return no results
          if (where?.data) {
            return route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(createRowsResponse([])),
            })
          }
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createRowsResponse(rows)),
          })
        }

        const responses: Record<string, object> = {
          configuration: createConfigurationResponse(),
          getMe: createMeResponse(ORG_ID),
          meProjectsMst: createMeProjectsResponse(PROJECT_NAME, ORG_ID),
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
          TablesMst: createTablesResponse(TABLE_ID),
          TableMst: createFullTableResponse(TABLE_ID),
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

      // Add filter with non-matching value
      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      const valueInput = page.getByTestId('filter-condition-0').locator('input')
      await valueInput.fill('nonexistent')

      await page.getByTestId('filter-apply').click()
      await page.waitForTimeout(300)

      // Should show message indicating no matching rows
      await expect(page.getByText(/no rows/i).or(page.getByText('0 rows'))).toBeVisible()
    })
  })

  test.describe('Empty Columns', () => {
    test('handles table with all columns hidden', async ({ page }) => {
      await setupMocks(page, {
        rows: [{ id: 'row-1', data: { name: 'Alice', age: 25, active: true } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Hide all columns
      await page.getByTestId('column-header-name').click()
      await page.getByRole('menuitem', { name: /hide all columns/i }).click()

      // Should still have ID column or show some state
      await expect(page.getByTestId('column-header-name')).not.toBeVisible()
      await expect(page.getByTestId('column-header-age')).not.toBeVisible()
    })
  })

  test.describe('Empty Values in Cells', () => {
    test('empty string is displayed correctly', async ({ page }) => {
      await setupMocks(page, {
        rows: [{ id: 'row-1', data: { name: '', age: 25, active: true } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await expect(cell).toBeVisible()
      // Cell should be visible but may be empty or show placeholder
    })

    test('null value is displayed correctly', async ({ page }) => {
      await setupMocks(page, {
        rows: [{ id: 'row-1', data: { name: null, age: 25, active: true } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await expect(cell).toBeVisible()
    })

    test('zero number is displayed correctly', async ({ page }) => {
      await setupMocks(page, {
        rows: [{ id: 'row-1', data: { name: 'Test', age: 0, active: true } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-age')
      await expect(cell).toContainText('0')
    })

    test('false boolean is displayed correctly', async ({ page }) => {
      await setupMocks(page, {
        rows: [{ id: 'row-1', data: { name: 'Test', age: 25, active: false } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-active')
      await expect(cell).toContainText('false')
    })

    test('empty array is displayed correctly', async ({ page }) => {
      await setupMocks(page, {
        schema: {
          type: 'object',
          properties: {
            tags: { type: 'array', items: { type: 'string' }, default: [] },
          },
          additionalProperties: false,
          required: ['tags'],
        },
        rows: [{ id: 'row-1', data: { tags: [] } }],
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-tags')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-tags')
      await expect(cell).toBeVisible()
    })
  })
})
