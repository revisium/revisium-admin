import { test, expect, Page } from '@playwright/test'
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
  emptyRowsResponse,
} from '../fixtures/full-fixtures'
import { setupAuth } from '../helpers/setup-auth'

const PROJECT_NAME = 'test-project'
const ORG_ID = 'testuser'
const TABLE_ID = 'users'

async function setupMocks(page: Page, rowsResponse: object) {
  await setupAuth(page)

  await page.route('**/graphql', async (route, request) => {
    const body = request.postDataJSON()
    const opName = body?.operationName as string

    const projectResponse = createFullProjectResponse(PROJECT_NAME, ORG_ID)
    const branchResponse = createFullBranchResponse(PROJECT_NAME)

    const responses: Record<string, object> = {
      configuration: createConfigurationResponse(),
      getMe: createMeResponse(ORG_ID),
      meProjectsList: createMeProjectsResponse(PROJECT_NAME, ORG_ID),
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
      tableListData: createTablesResponse(TABLE_ID),
      getTableForLoader: createFullTableResponse(TABLE_ID),
      GetTableViews: createTableViewsResponse(TABLE_ID),
      RowListRows: rowsResponse,
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

test.describe('TablePage - Smoke Tests', () => {
  test('renders table with rows', async ({ page }) => {
    const rows = createSampleRows(3)
    await setupMocks(page, createRowsResponse(rows))

    await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

    await expect(page.getByText('User 1')).toBeVisible()
    await expect(page.getByText('User 2')).toBeVisible()
    await expect(page.getByText('User 3')).toBeVisible()
  })

  test('shows row count in footer', async ({ page }) => {
    const rows = createSampleRows(5)
    await setupMocks(page, createRowsResponse(rows, { totalCount: 5 }))

    await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

    await expect(page.getByText('User 1')).toBeVisible()
    await expect(page.getByText(/5\s*rows?/i)).toBeVisible()
  })

  test('shows create row button', async ({ page }) => {
    const rows = createSampleRows(2)
    await setupMocks(page, createRowsResponse(rows))

    await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

    await expect(page.getByText('User 1')).toBeVisible()

    const createButton = page.getByTestId('create-row-button').or(page.getByLabel('New row'))
    await expect(createButton).toBeVisible()
  })

  test('shows empty state when no rows', async ({ page }) => {
    await setupMocks(page, emptyRowsResponse)

    await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

    await expect(page.getByText('No rows yet')).toBeVisible()
  })

  test('shows error on API failure', async ({ page }) => {
    await setupAuth(page)

    await page.route('**/graphql', async (route, request) => {
      const body = request.postDataJSON()
      const opName = body?.operationName as string

      if (opName === 'RowListRows') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            errors: [{ message: 'Database connection failed' }],
          }),
        })
      }

      const responses: Record<string, object> = {
        configuration: createConfigurationResponse(),
        getMe: createMeResponse(ORG_ID),
        getProjectForLoader: createFullProjectResponse(PROJECT_NAME, ORG_ID),
        getBranchForLoader: createFullBranchResponse(PROJECT_NAME),
        getTableForLoader: createFullTableResponse(TABLE_ID),
        GetTableViews: createTableViewsResponse(TABLE_ID),
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

    await expect(page.getByText(/error/i)).toBeVisible()
  })
})
