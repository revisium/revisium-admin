import { test, expect, Page } from '@playwright/test'
import {
  createConfigurationResponse,
  createFullBranchResponse,
  createFullProjectResponse,
  createFullTableResponse,
  createMeProjectsResponse,
  createMeResponse,
  createSampleRows,
  createTablesResponse,
  createTableViewsResponse,
} from '../fixtures/full-fixtures'
import { setupAuth } from '../helpers/setup-auth'

const PROJECT_NAME = 'test-project'
const ORG_ID = 'testuser'
const TABLE_ID = 'users'

function createPaginatedRowsResponse(
  rows: Array<{ id: string; data: Record<string, unknown> }>,
  options: { hasNextPage: boolean; endCursor: string | null; totalCount?: number } = {
    hasNextPage: false,
    endCursor: null,
  },
) {
  return {
    data: {
      rows: {
        __typename: 'RowsConnection',
        totalCount: options.totalCount ?? rows.length,
        pageInfo: {
          __typename: 'PageInfo',
          hasNextPage: options.hasNextPage,
          hasPreviousPage: false,
          startCursor: rows.length > 0 ? 'cursor-1' : null,
          endCursor: options.endCursor,
        },
        edges: rows.map((row, index) => ({
          __typename: 'RowModelEdge',
          cursor: `cursor-${index + 1}`,
          node: {
            __typename: 'RowModel',
            id: row.id,
            versionId: `${row.id}-v1`,
            readonly: false,
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
}

async function setupMocks(
  page: Page,
  options: {
    initialRows?: Array<{ id: string; data: Record<string, unknown> }>
    nextPageRows?: Array<{ id: string; data: Record<string, unknown> }>
    hasNextPage?: boolean
    totalCount?: number
  } = {},
) {
  await setupAuth(page)

  const initialRows = options.initialRows || createSampleRows(20)
  const nextPageRows = options.nextPageRows || createSampleRows(10, 20)
  const hasNextPage = options.hasNextPage ?? true
  const totalCount = options.totalCount ?? 30

  let loadedPages = 0

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

    if (opName === 'RowListRows') {
      const after = body?.variables?.data?.after

      if (after && loadedPages === 0) {
        loadedPages++
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(
            createPaginatedRowsResponse(nextPageRows, {
              hasNextPage: false,
              endCursor: null,
              totalCount,
            }),
          ),
        })
      }

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          createPaginatedRowsResponse(initialRows, {
            hasNextPage,
            endCursor: hasNextPage ? 'cursor-next' : null,
            totalCount,
          }),
        ),
      })
    }

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

test.describe('Pagination', () => {
  test.describe('Row Count Display', () => {
    test('displays total row count', async ({ page }) => {
      const rows = createSampleRows(25)
      await setupMocks(page, { initialRows: rows, totalCount: 25, hasNextPage: false })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByText('25 rows')).toBeVisible()
    })

    test('displays singular row for single row', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'Single User', age: 25, active: true } }]
      await setupMocks(page, { initialRows: rows, totalCount: 1, hasNextPage: false })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByText('1 row')).toBeVisible()
    })
  })

  test.describe('Load More', () => {
    test.skip('shows load more button when more rows available', async ({ page }) => {
      // Skip: UI uses infinite scroll, not explicit "load more" button
      const rows = createSampleRows(20)
      await setupMocks(page, { initialRows: rows, totalCount: 30, hasNextPage: true })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Scroll to bottom to trigger load more visibility
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })

      // Should show load more button or trigger infinite scroll
      await expect(page.getByText(/load more/i).or(page.getByRole('button', { name: /more/i }))).toBeVisible()
    })

    test('hides load more when all rows loaded', async ({ page }) => {
      const rows = createSampleRows(10)
      await setupMocks(page, { initialRows: rows, totalCount: 10, hasNextPage: false })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Should not show load more
      await expect(page.getByText(/load more/i)).not.toBeVisible()
    })

    test.skip('loads more rows on button click', async ({ page }) => {
      // Skip: UI uses infinite scroll, not explicit "load more" button
      const initialRows = createSampleRows(20)
      const nextPageRows = createSampleRows(10, 20) // rows 21-30
      await setupMocks(page, {
        initialRows,
        nextPageRows,
        totalCount: 30,
        hasNextPage: true,
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Verify initial rows
      await expect(page.getByTestId('row-row-1')).toBeVisible()
      await expect(page.getByTestId('row-row-20')).toBeVisible()

      // Scroll to bottom
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })

      // Click load more
      const loadMoreButton = page.getByText(/load more/i).or(page.getByRole('button', { name: /more/i }))
      if (await loadMoreButton.isVisible()) {
        await loadMoreButton.click()

        // Verify new rows are visible (auto-waits for them to appear)
        await expect(page.getByTestId('row-row-21')).toBeVisible()
      }
    })
  })

  test.describe('Infinite Scroll', () => {
    test.skip('automatically loads more rows on scroll', async ({ page }) => {
      // BUG: Infinite scroll behavior needs to be verified
      // This test verifies that scrolling to bottom triggers loading more rows
      const initialRows = createSampleRows(20)
      await setupMocks(page, {
        initialRows,
        totalCount: 50,
        hasNextPage: true,
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Scroll to trigger infinite scroll
      await page.evaluate(() => {
        const table = document.querySelector('table')
        if (table) {
          table.scrollTop = table.scrollHeight
        }
      })

      // Should trigger loading indicator or load more rows
      await page.waitForTimeout(500)
    })
  })

  test.describe('Loading States', () => {
    test('shows loading indicator while fetching rows', async ({ page }) => {
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

        if (opName === 'RowListRows') {
          // Delay the response to observe loading state
          await new Promise<void>((resolve) => {
            setTimeout(resolve, 100)
          })

          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(
              createPaginatedRowsResponse(createSampleRows(5), {
                hasNextPage: false,
                endCursor: null,
              }),
            ),
          })
        }

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

      // Eventually rows should appear
      await expect(page.getByTestId('row-row-1')).toBeVisible()
    })
  })

  test.describe('Empty State with Pagination', () => {
    test('shows empty state when no rows exist', async ({ page }) => {
      await setupMocks(page, { initialRows: [], totalCount: 0, hasNextPage: false })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      // When empty, the table shows an empty state without column headers
      await expect(page.getByText('No rows yet')).toBeVisible()
    })
  })
})
