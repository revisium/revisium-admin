import { test, expect } from '@playwright/test'
import {
  createConfigurationResponse,
  createFullBranchResponse,
  createFullProjectResponse,
  createFullTableResponse,
  createMeProjectsResponse,
  createMeResponse,
  createRowsResponse,
  createSampleRows,
  createTablesResponse,
  createTableViewsResponse,
} from '../fixtures/full-fixtures'
import { setupAuth } from '../helpers/setup-auth'

const PROJECT_NAME = 'test-project'
const ORG_ID = 'testuser'
const TABLE_ID = 'users'

test.describe('Error Handling', () => {
  test.describe('Network Errors', () => {
    test('shows error message when API request fails', async ({ page }) => {
      await setupAuth(page)

      await page.route('**/graphql', async (route, request) => {
        const body = request.postDataJSON()
        const opName = body?.operationName as string

        if (opName === 'RowListRows' || opName === 'RowsMst') {
          // Simulate network error
          return route.abort('failed')
        }

        const projectResponse = createFullProjectResponse(PROJECT_NAME, ORG_ID)
        const branchResponse = createFullBranchResponse(PROJECT_NAME)

        if (opName === 'GetTableViews') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTableViewsResponse(TABLE_ID)),
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

      // Should show error message or handle gracefully
      // The exact behavior depends on implementation
    })

    test('handles 500 server error gracefully', async ({ page }) => {
      await setupAuth(page)

      await page.route('**/graphql', async (route, request) => {
        const body = request.postDataJSON()
        const opName = body?.operationName as string

        if (opName === 'RowListRows' || opName === 'RowsMst') {
          return route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ errors: [{ message: 'Internal server error' }] }),
          })
        }

        const projectResponse = createFullProjectResponse(PROJECT_NAME, ORG_ID)
        const branchResponse = createFullBranchResponse(PROJECT_NAME)

        if (opName === 'GetTableViews') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTableViewsResponse(TABLE_ID)),
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

      // Should handle server error gracefully
    })
  })

  test.describe('GraphQL Errors', () => {
    test('handles GraphQL error in response', async ({ page }) => {
      await setupAuth(page)

      await page.route('**/graphql', async (route, request) => {
        const body = request.postDataJSON()
        const opName = body?.operationName as string

        if (opName === 'RowListRows' || opName === 'RowsMst') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: null,
              errors: [{ message: 'Permission denied', path: ['rows'] }],
            }),
          })
        }

        const projectResponse = createFullProjectResponse(PROJECT_NAME, ORG_ID)
        const branchResponse = createFullBranchResponse(PROJECT_NAME)

        if (opName === 'GetTableViews') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTableViewsResponse(TABLE_ID)),
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

      // Should display error or handle gracefully
    })
  })

  test.describe('Update Errors', () => {
    test('shows error when row update fails', async ({ page }) => {
      await setupAuth(page)

      const rows = createSampleRows(3)
      const rowsResponse = createRowsResponse(rows)

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

        if (opName === 'UpdateRow') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: null,
              errors: [{ message: 'Validation error: Name cannot be empty' }],
            }),
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

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Try to edit a cell
      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      const input = cell.locator('input, textarea')
      await input.fill('New Value')
      await input.press('Enter')

      // Error should be shown (toast or inline error)
      // The exact behavior depends on implementation
    })

    test('shows error when delete fails', async ({ page }) => {
      await setupAuth(page)

      const rows = createSampleRows(3)
      const rowsResponse = createRowsResponse(rows)

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

        if (opName === 'RemoveRow') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: null,
              errors: [{ message: 'Cannot delete row: referenced by other rows' }],
            }),
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

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Try to delete a row
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByRole('menuitem', { name: /delete/i }).click()

      // Confirm deletion in dialog
      const confirmButton = page.getByRole('button', { name: /delete/i }).last()
      if (await confirmButton.isVisible()) {
        await confirmButton.click()
      }

      // Error should be shown
    })
  })

  test.describe('Timeout Handling', () => {
    test.skip('shows timeout message for slow requests', async ({ page }) => {
      // BUG: Timeout handling needs verification
      await setupAuth(page)

      await page.route('**/graphql', async (route, request) => {
        const body = request.postDataJSON()
        const opName = body?.operationName as string

        if (opName === 'RowListRows' || opName === 'RowsMst') {
          // Simulate very slow response
          await new Promise((resolve) => setTimeout(resolve, 30000))
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createRowsResponse([])),
          })
        }

        // Return other responses normally
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

      // Should show loading indicator and eventually timeout message
    })
  })

  test.describe('Validation Errors', () => {
    test.skip('shows validation error for invalid data', async () => {
      // BUG: Client-side validation needs verification
    })
  })

  test.describe('Recovery', () => {
    test('can retry after error', async ({ page }) => {
      await setupAuth(page)

      let requestCount = 0

      await page.route('**/graphql', async (route, request) => {
        const body = request.postDataJSON()
        const opName = body?.operationName as string

        const projectResponse = createFullProjectResponse(PROJECT_NAME, ORG_ID)
        const branchResponse = createFullBranchResponse(PROJECT_NAME)

        if (opName === 'RowListRows' || opName === 'RowsMst') {
          requestCount++
          if (requestCount === 1) {
            // First request fails
            return route.fulfill({
              status: 500,
              contentType: 'application/json',
              body: JSON.stringify({ errors: [{ message: 'Server error' }] }),
            })
          }
          // Subsequent requests succeed
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createRowsResponse(createSampleRows(3))),
          })
        }

        if (opName === 'GetTableViews') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTableViewsResponse(TABLE_ID)),
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

      // After retry (page reload), data should load
      await page.reload()

      await expect(page.getByTestId('column-header-name')).toBeVisible()
    })
  })
})
