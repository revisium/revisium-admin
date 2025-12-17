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
} from '../fixtures/full-fixtures'
import { setupAuth } from '../helpers/setup-auth'

const PROJECT_NAME = 'test-project'
const ORG_ID = 'testuser'
const TABLE_ID = 'users'

function createViewsResponse(
  options: {
    columns?: Array<{ field: string; width?: number }>
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
              columns: options.columns || null,
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

function createUpdateViewsResponse(
  options: {
    columns?: Array<{ field: string; width?: number }>
    sorts?: Array<{ field: string; direction: 'ASC' | 'DESC' }>
  } = {},
) {
  return {
    data: {
      updateTableViews: {
        __typename: 'TableViewsDataModel',
        version: 1,
        defaultViewId: 'default',
        views: [
          {
            id: 'default',
            name: 'Default',
            description: null,
            columns: options.columns || null,
            filters: null,
            sorts: options.sorts || null,
            search: null,
          },
        ],
      },
    },
  }
}

async function setupMocks(
  page: Page,
  options: {
    viewsResponse?: object
    onUpdateViews?: () => object
  } = {},
) {
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
        body: JSON.stringify(options.viewsResponse || createViewsResponse()),
      })
    }

    if (opName === 'UpdateTableViews') {
      const response = options.onUpdateViews ? options.onUpdateViews() : createUpdateViewsResponse()
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
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
}

test.describe('View Settings Badge', () => {
  test.describe('Sort Badge', () => {
    test('shows no badge initially when no sorts applied', async ({ page }) => {
      await setupMocks(page)
      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

      await expect(page.getByText('User 1')).toBeVisible()

      const sortBadge = page.getByTestId('sort-badge')
      await expect(sortBadge).not.toBeVisible()
    })

    test('shows orange badge when sort is added but not applied', async ({ page }) => {
      await setupMocks(page)
      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

      await expect(page.getByText('User 1')).toBeVisible()

      // Open sort popover
      await page.getByTestId('sort-button').click()

      // Add a sort
      await page.getByTestId('sort-add').click()

      // Badge should appear with orange color (pending)
      const sortBadge = page.getByTestId('sort-badge')
      await expect(sortBadge).toBeVisible()
      await expect(sortBadge).toHaveAttribute('data-badge-color', 'orange')
      await expect(sortBadge).toHaveText('1')
    })

    test('shows gray badge after sort is applied', async ({ page }) => {
      await setupMocks(page)
      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

      await expect(page.getByText('User 1')).toBeVisible()

      // Open sort popover and add sort
      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()

      // Apply the sort
      await page.getByTestId('sort-apply').click()

      // Badge should be gray (applied)
      const sortBadge = page.getByTestId('sort-badge')
      await expect(sortBadge).toBeVisible()
      await expect(sortBadge).toHaveAttribute('data-badge-color', 'gray')
    })

    test('badge count increases with multiple sorts', async ({ page }) => {
      await setupMocks(page)
      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

      await expect(page.getByText('User 1')).toBeVisible()

      // Open sort popover
      await page.getByTestId('sort-button').click()

      // Add first sort
      await page.getByTestId('sort-add').click()
      await expect(page.getByTestId('sort-badge')).toHaveText('1')

      // Add second sort
      await page.getByTestId('sort-add').click()
      await expect(page.getByTestId('sort-badge')).toHaveText('2')
    })

    test('clear all removes badge', async ({ page }) => {
      await setupMocks(page)
      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

      await expect(page.getByText('User 1')).toBeVisible()

      // Add and apply sort
      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()
      await page.getByTestId('sort-apply').click()

      // Reopen and clear all
      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-clear-all').click()

      // Badge should disappear
      await expect(page.getByTestId('sort-badge')).not.toBeVisible()
    })
  })

  test.describe('Filter Badge', () => {
    test('shows no badge initially when no filters applied', async ({ page }) => {
      await setupMocks(page)
      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

      await expect(page.getByText('User 1')).toBeVisible()

      const filterBadge = page.getByTestId('filter-badge')
      await expect(filterBadge).not.toBeVisible()
    })

    test('shows orange badge when filter condition added but not applied', async ({ page }) => {
      await setupMocks(page)
      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

      await expect(page.getByText('User 1')).toBeVisible()

      // Open filter popover
      await page.getByTestId('filter-button').click()

      // Wait for popover to open and add condition button to be visible
      const addConditionButton = page.getByTestId('filter-add-condition')
      await expect(addConditionButton).toBeVisible()
      await addConditionButton.click()

      // Badge should appear with orange color (pending)
      const filterBadge = page.getByTestId('filter-badge')
      await expect(filterBadge).toBeVisible()
      await expect(filterBadge).toHaveAttribute('data-badge-color', 'orange')
    })

    test('badge persists after filter is applied', async ({ page }) => {
      await setupMocks(page)
      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

      await expect(page.getByText('User 1')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()
      await page.getByTestId('filter-apply').click()

      const filterBadge = page.getByTestId('filter-badge')
      await expect(filterBadge).toBeVisible()
      await expect(filterBadge).toHaveText('1')
    })

    test('clear all removes badge', async ({ page }) => {
      await setupMocks(page)
      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

      await expect(page.getByText('User 1')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()
      await page.getByTestId('filter-apply').click()

      await page.getByTestId('filter-button').click()
      await expect(page.getByTestId('filter-clear-all')).toBeVisible()
      await page.getByTestId('filter-clear-all').click({ force: true })

      await expect(page.getByTestId('filter-badge')).not.toBeVisible()
    })
  })

  test.describe('View Settings Badge (columns/sorts persistence)', () => {
    test('shows unsaved badge when sort is applied (changes view)', async ({ page }) => {
      await setupMocks(page)
      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

      await expect(page.getByText('User 1')).toBeVisible()

      // Initially no view settings badge
      await expect(page.getByTestId('view-settings-badge')).not.toBeVisible()

      // Add and apply sort
      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()
      await page.getByTestId('sort-apply').click()

      // View settings badge should appear showing "unsaved"
      const viewBadge = page.getByTestId('view-settings-badge')
      await expect(viewBadge).toBeVisible()
      await expect(viewBadge).toHaveText('unsaved')
      await expect(viewBadge).toHaveAttribute('data-badge-color', 'orange')
    })

    test('save button saves view settings', async ({ page }) => {
      let updateViewsCalled = false

      await setupMocks(page, {
        onUpdateViews: () => {
          updateViewsCalled = true
          return createUpdateViewsResponse({
            sorts: [{ field: 'name', direction: 'ASC' }],
          })
        },
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByText('User 1')).toBeVisible()

      // Add and apply sort
      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()
      await page.getByTestId('sort-apply').click()

      // Click view settings badge to open popover
      await page.getByTestId('view-settings-badge').click()

      // Click save button
      await page.getByTestId('view-settings-save').click()

      // Badge should disappear after save
      await expect(page.getByTestId('view-settings-badge')).not.toBeVisible()
      expect(updateViewsCalled).toBe(true)
    })

    test('revert button restores original sort from saved view', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          sorts: [{ field: 'data.name', direction: 'ASC' }],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByText('User 1')).toBeVisible()

      await expect(page.getByTestId('sort-badge')).toBeVisible()
      await expect(page.getByTestId('sort-badge')).toHaveText('1')
      await expect(page.getByTestId('sort-badge')).toHaveAttribute('data-badge-color', 'gray')

      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()
      await page.getByTestId('sort-apply').click()

      await expect(page.getByTestId('sort-badge')).toHaveText('2')
      await expect(page.getByTestId('view-settings-badge')).toBeVisible()

      await page.getByTestId('view-settings-badge').click()
      await page.getByTestId('view-settings-revert').click()

      await expect(page.getByTestId('view-settings-badge')).not.toBeVisible()
      await expect(page.getByTestId('sort-badge')).toHaveText('1')
      await expect(page.getByTestId('sort-badge')).toHaveAttribute('data-badge-color', 'gray')
    })

    test('revert button restores hidden column', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          columns: [
            { field: 'data.name', width: 200 },
            { field: 'data.age', width: 100 },
            { field: 'data.active', width: 100 },
          ],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByText('User 1')).toBeVisible()

      const nameHeader = page.getByTestId('column-header-name')
      const ageHeader = page.getByTestId('column-header-age')

      await expect(nameHeader).toBeVisible()
      await expect(ageHeader).toBeVisible()

      await nameHeader.click()
      await page.getByRole('menuitem', { name: /hide column/i }).click()

      await expect(nameHeader).not.toBeVisible()
      await expect(page.getByTestId('view-settings-badge')).toBeVisible()

      await page.getByTestId('view-settings-badge').click()
      await page.getByTestId('view-settings-revert').click()

      await expect(page.getByTestId('view-settings-badge')).not.toBeVisible()
      await expect(nameHeader).toBeVisible()
      await expect(ageHeader).toBeVisible()
    })

    test('revert button restores both sorts and columns together', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          columns: [
            { field: 'data.name', width: 200 },
            { field: 'data.age', width: 100 },
            { field: 'data.active', width: 100 },
          ],
          sorts: [{ field: 'data.name', direction: 'ASC' }],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByText('User 1')).toBeVisible()

      const nameHeader = page.getByTestId('column-header-name')
      await expect(nameHeader).toBeVisible()
      await expect(page.getByTestId('sort-badge')).toHaveText('1')

      await nameHeader.click()
      await page.getByRole('menuitem', { name: /hide column/i }).click()
      await expect(nameHeader).not.toBeVisible()

      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()
      await page.getByTestId('sort-apply').click()
      await expect(page.getByTestId('sort-badge')).toHaveText('2')

      await expect(page.getByTestId('view-settings-badge')).toBeVisible()
      await expect(page.getByTestId('view-settings-badge')).toHaveText('unsaved')

      await page.getByTestId('view-settings-badge').click()
      await page.getByTestId('view-settings-revert').click()

      await expect(page.getByTestId('view-settings-badge')).not.toBeVisible()
      await expect(nameHeader).toBeVisible()
      await expect(page.getByTestId('sort-badge')).toHaveText('1')
    })

    test('shows unsaved badge when column is hidden', async ({ page }) => {
      await setupMocks(page)
      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)

      await expect(page.getByText('User 1')).toBeVisible()

      await expect(page.getByTestId('view-settings-badge')).not.toBeVisible()

      const nameHeader = page.getByTestId('column-header-name')
      await expect(nameHeader).toBeVisible()

      await nameHeader.click()
      await page.getByRole('menuitem', { name: /hide column/i }).click()

      await expect(page.getByTestId('view-settings-badge')).toBeVisible()
    })
  })
})
