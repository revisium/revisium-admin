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
} from '../fixtures/full-fixtures'
import { setupAuth } from '../helpers/setup-auth'

const PROJECT_NAME = 'test-project'
const ORG_ID = 'testuser'
const TABLE_ID = 'users'

function createViewsResponse(
  options: {
    sorts?: Array<{ field: string; direction: 'ASC' | 'DESC' }>
  } = {},
) {
  return {
    data: {
      table: {
        id: TABLE_ID,
        views: {
          __typename: 'TableViewsDataModel',
          version: 1,
          defaultViewId: 'default',
          views: [
            {
              id: 'default',
              name: 'Default',
              description: null,
              columns: null,
              filters: null,
              sorts: options.sorts || null,
              search: null,
            },
          ],
        },
      },
    },
  }
}

async function setupMocks(
  page: Page,
  options: {
    viewsResponse?: object
    rows?: Array<{ id: string; data: Record<string, unknown> }>
  } = {},
) {
  await setupAuth(page)

  const rows = options.rows || createSampleRows(5)
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
        body: JSON.stringify(options.viewsResponse || createTableViewsResponse(TABLE_ID)),
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
}

test.describe('Sort Operations', () => {
  test.describe('Add Sort', () => {
    test('can add first sort', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByTestId('sort-badge')).not.toBeVisible()

      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()

      await expect(page.getByTestId('sort-condition-0')).toBeVisible()
      await expect(page.getByTestId('sort-badge')).toBeVisible()
      await expect(page.getByTestId('sort-badge')).toHaveText('1')
    })

    test('can add multiple sorts', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()

      await expect(page.getByTestId('sort-condition-0')).toBeVisible()

      await page.getByTestId('sort-add').click()

      await expect(page.getByTestId('sort-condition-1')).toBeVisible()
      await expect(page.getByTestId('sort-badge')).toHaveText('2')
    })

    test('add sort button hidden when all fields used', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('sort-button').click()

      for (let i = 0; i < 10; i++) {
        const addButton = page.getByTestId('sort-add')
        if (await addButton.isVisible()) {
          await addButton.click()
        } else {
          break
        }
      }

      await expect(page.getByTestId('sort-add')).not.toBeVisible()
    })
  })

  test.describe('Remove Sort', () => {
    test('can remove sort condition', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          sorts: [{ field: 'data.name', direction: 'ASC' }],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByTestId('sort-badge')).toHaveText('1')

      await page.getByTestId('sort-button').click()
      await expect(page.getByTestId('sort-condition-0')).toBeVisible()

      const removeButton = page.getByTestId('sort-condition-0').getByRole('button', { name: /remove/i })
      await removeButton.click()

      await expect(page.getByTestId('sort-condition-0')).not.toBeVisible()
    })

    test('clear all removes all sorts', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          sorts: [
            { field: 'data.name', direction: 'ASC' },
            { field: 'data.age', direction: 'DESC' },
          ],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByTestId('sort-badge')).toHaveText('2')

      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-clear-all').click()

      await expect(page.getByTestId('sort-badge')).not.toBeVisible()
    })
  })

  test.describe('Change Sort Direction', () => {
    test('can change sort direction from ASC to DESC', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()

      const sortCondition = page.getByTestId('sort-condition-0')
      const directionButton = sortCondition.getByRole('button').filter({ hasText: 'A → Z' })
      await expect(directionButton).toBeVisible()

      await directionButton.click()
      await page.getByRole('menuitem', { name: 'Z → A' }).click()

      await expect(sortCondition.getByRole('button').filter({ hasText: 'Z → A' })).toBeVisible()
    })
  })

  test.describe('Change Sort Field', () => {
    test('can change sort field', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()

      const sortCondition = page.getByTestId('sort-condition-0')
      const fieldSelect = sortCondition.locator('button').first()
      await fieldSelect.click()

      await page.getByRole('menuitem', { name: 'age' }).click()

      await expect(sortCondition.getByText('age')).toBeVisible()
    })
  })

  test.describe('Apply Sort', () => {
    test('apply button applies pending sorts', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()

      await expect(page.getByTestId('sort-badge')).toHaveAttribute('data-badge-color', 'orange')

      await page.getByTestId('sort-apply').click()

      await expect(page.getByTestId('sort-badge')).toHaveAttribute('data-badge-color', 'gray')
    })

    test('apply button disabled when no pending changes', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          sorts: [{ field: 'data.name', direction: 'ASC' }],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('sort-button').click()

      await expect(page.getByTestId('sort-apply')).toBeDisabled()
    })
  })

  test.describe('Sort from Column Header', () => {
    test('can add sort ASC from column header menu', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('column-header-name').click()
      await page.getByText('Sort').click()
      await page.getByRole('menuitem', { name: 'Sort A → Z' }).click()

      await expect(page.getByTestId('sort-badge')).toBeVisible()
    })

    test('can add sort DESC from column header menu', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('column-header-name').click()
      await page.getByText('Sort').click()
      await page.getByRole('menuitem', { name: 'Sort Z → A' }).click()

      await expect(page.getByTestId('sort-badge')).toBeVisible()
    })
  })

  test.describe('Saved Sorts', () => {
    test('saved sorts are restored on page load', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          sorts: [{ field: 'data.name', direction: 'ASC' }],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByTestId('sort-badge')).toBeVisible()
      await expect(page.getByTestId('sort-badge')).toHaveText('1')
      await expect(page.getByTestId('sort-badge')).toHaveAttribute('data-badge-color', 'gray')
    })

    test('multiple saved sorts are restored', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          sorts: [
            { field: 'data.name', direction: 'ASC' },
            { field: 'data.age', direction: 'DESC' },
          ],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByTestId('sort-badge')).toHaveText('2')

      await page.getByTestId('sort-button').click()
      await expect(page.getByTestId('sort-condition-0')).toBeVisible()
      await expect(page.getByTestId('sort-condition-1')).toBeVisible()
    })
  })

  test.describe('Copy JSON', () => {
    test('copy json button not visible when no sorts added', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('sort-button').click()

      await expect(page.getByTestId('sort-copy-json')).not.toBeVisible()
    })

    test('copy json button visible immediately after adding sort (before apply)', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()

      await expect(page.getByTestId('sort-copy-json')).toBeVisible()
    })

    test('clicking copy json button opens json popover', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()

      await page.getByTestId('sort-copy-json').click()

      await expect(page.getByTestId('sort-copy-json-copy')).toBeVisible()
    })

    test('can copy sort json to clipboard before apply', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write'])
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()

      await page.getByTestId('sort-copy-json').click()
      await page.getByTestId('sort-copy-json-copy').click()

      const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
      const parsedJson = JSON.parse(clipboardText)

      expect(Array.isArray(parsedJson)).toBe(true)
      expect(parsedJson.length).toBe(1)
      expect(parsedJson[0]).toHaveProperty('field')
      expect(parsedJson[0]).toHaveProperty('direction')
    })

    test('copy json button hidden after clearing sorts', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()

      await expect(page.getByTestId('sort-copy-json')).toBeVisible()

      const removeButton = page.getByTestId('sort-condition-0').getByRole('button', { name: /remove/i })
      await removeButton.click()

      await expect(page.getByTestId('sort-copy-json')).not.toBeVisible()
    })
  })

  test.describe('View Settings Persistence', () => {
    test('apply sort calls UpdateTableViews API', async ({ page }) => {
      let updateViewsCalled = false
      let updateViewsPayload: unknown = null

      await setupAuth(page)
      const rows = createSampleRows(5)
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
          updateViewsCalled = true
          updateViewsPayload = body?.variables?.data
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                updateTableViews: {
                  __typename: 'TableViewsDataModel',
                  version: 2,
                  defaultViewId: 'default',
                  views: [],
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

      // Add and apply sort
      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()
      await page.getByTestId('sort-apply').click()

      // Open view settings popover and save
      await page.getByTestId('view-settings-badge').click()
      await page.getByTestId('view-settings-save').click()

      // Wait for UpdateTableViews API call
      await page.waitForTimeout(500)

      expect(updateViewsCalled).toBe(true)
      expect(updateViewsPayload).toBeTruthy()
    })

    test('sorts persist after page reload', async ({ page }) => {
      let sortsSaved: Array<{ field: string; direction: string }> | null = null

      await setupAuth(page)
      const rows = createSampleRows(5)
      const rowsResponse = createRowsResponse(rows)

      await page.route('**/graphql', async (route, request) => {
        const body = request.postDataJSON()
        const opName = body?.operationName as string

        const projectResponse = createFullProjectResponse(PROJECT_NAME, ORG_ID)
        const branchResponse = createFullBranchResponse(PROJECT_NAME)

        if (opName === 'GetTableViews') {
          // Return saved sorts if we have them
          const viewsResponse = sortsSaved
            ? createViewsResponse({ sorts: sortsSaved })
            : createTableViewsResponse(TABLE_ID)
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(viewsResponse),
          })
        }

        if (opName === 'UpdateTableViews') {
          // Capture saved sorts from the views data
          const viewsData = body?.variables?.data?.viewsData
          if (viewsData?.views?.[0]?.sorts) {
            sortsSaved = viewsData.views[0].sorts
          }
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                updateTableViews: {
                  __typename: 'TableViewsDataModel',
                  version: 2,
                  defaultViewId: 'default',
                  views: [],
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

      // Add and apply sort
      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()
      await page.getByTestId('sort-apply').click()

      // Open view settings popover and save
      await page.getByTestId('view-settings-badge').click()
      await page.getByTestId('view-settings-save').click()

      // Wait for UpdateTableViews API call
      await page.waitForTimeout(500)

      // Reload page
      await page.reload()

      // Should still have sort badge
      await expect(page.getByTestId('column-header-name')).toBeVisible()
      await expect(page.getByTestId('sort-badge')).toBeVisible()
      await expect(page.getByTestId('sort-badge')).toHaveText('1')
    })
  })
})
