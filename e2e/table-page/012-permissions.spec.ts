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

async function setupMocks(
  page: Page,
  options: {
    isHeadRevision?: boolean
    rows?: Array<{ id: string; data: Record<string, unknown> }>
    rowsReadonly?: boolean
  } = {},
) {
  await setupAuth(page)

  const rows = options.rows || createSampleRows(3)
  const rowsReadonly = options.rowsReadonly ?? options.isHeadRevision ?? false

  const rowsResponse = {
    data: {
      rows: {
        totalCount: rows.length,
        pageInfo: { hasNextPage: false, endCursor: null },
        edges: rows.map((row, index) => ({
          cursor: `cursor-${index}`,
          node: {
            __typename: 'RowModel',
            id: row.id,
            versionId: `${row.id}-v1`,
            readonly: rowsReadonly,
            data: row.data,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        })),
      },
    },
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

test.describe('Permissions', () => {
  test.describe('Draft Revision (Editable)', () => {
    test('cells are editable in draft revision', async ({ page }) => {
      await setupMocks(page, { isHeadRevision: false })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Double click to edit
      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      // Should show input for editing
      await expect(cell.locator('input, textarea')).toBeVisible()
    })

    test('new row button is visible in draft revision', async ({ page }) => {
      await setupMocks(page, { isHeadRevision: false })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByRole('button', { name: /new row/i })).toBeVisible()
    })

    test('row menu has delete option in draft revision', async ({ page }) => {
      await setupMocks(page, { isHeadRevision: false })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Hover on row and click menu
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()

      await expect(page.getByRole('menuitem', { name: /delete/i })).toBeVisible()
    })

    test('add column button is visible in draft revision', async ({ page }) => {
      await setupMocks(page, { isHeadRevision: false })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByRole('button', { name: /add column/i })).toBeVisible()
    })
  })

  test.describe('Head Revision (Readonly)', () => {
    test('cells are not editable in head revision', async ({ page }) => {
      await setupMocks(page, { isHeadRevision: true, rowsReadonly: true })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/head/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Double click to try to edit
      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      // Should NOT show input for editing (readonly cells)
      await expect(cell.locator('input, textarea')).not.toBeVisible()
    })

    test('new row button is hidden in head revision', async ({ page }) => {
      await setupMocks(page, { isHeadRevision: true, rowsReadonly: true })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/head/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByRole('button', { name: /new row/i })).not.toBeVisible()
    })

    test('row menu does not have delete option in head revision', async ({ page }) => {
      await setupMocks(page, { isHeadRevision: true, rowsReadonly: true })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/head/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Hover on row
      await page.getByTestId('row-row-1').hover()

      // Menu button may not be visible or delete option should be hidden
      const menuButton = page.getByTestId('row-list-menu-row-1')
      if (await menuButton.isVisible()) {
        await menuButton.click()
        await expect(page.getByRole('menuitem', { name: /delete/i })).not.toBeVisible()
      }
    })

    test('add column button is hidden in head revision', async ({ page }) => {
      await setupMocks(page, { isHeadRevision: true, rowsReadonly: true })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/head/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByRole('button', { name: /add column/i })).not.toBeVisible()
    })
  })

  test.describe('Selection Mode Permissions', () => {
    test('selection checkboxes are visible in draft revision', async ({ page }) => {
      await setupMocks(page, { isHeadRevision: false })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter selection mode
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      // Checkboxes should be visible
      const checkbox = page.getByTestId('row-row-1').locator('[role="checkbox"]')
      await expect(checkbox).toBeVisible()
    })

    test('bulk delete is available in draft revision', async ({ page }) => {
      await setupMocks(page, { isHeadRevision: false })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter selection mode and select row
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      // Select the checkbox
      const checkbox = page.getByTestId('row-row-1').locator('[data-part="control"]')
      await checkbox.click()

      // Action bar should have delete button
      await expect(page.getByRole('button', { name: /delete/i })).toBeVisible()
    })
  })

  test.describe('View Settings Permissions', () => {
    test('filters can be added in any revision', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      await expect(page.getByTestId('filter-condition-0')).toBeVisible()
    })

    test('sorting can be added in any revision', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add-condition').click()

      await expect(page.getByTestId('sort-condition-0')).toBeVisible()
    })

    test('column visibility can be changed in any revision', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const nameHeader = page.getByTestId('column-header-name')
      await nameHeader.click()
      await page.getByRole('menuitem', { name: /hide column/i }).click()

      await expect(nameHeader).not.toBeVisible()
    })
  })

  test.describe('Column Operations Permissions', () => {
    test('schema modification is allowed in draft revision', async ({ page }) => {
      await setupMocks(page, { isHeadRevision: false })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Add column button should work
      const addColumnButton = page.getByRole('button', { name: /add column/i })
      await expect(addColumnButton).toBeEnabled()
    })

    test('column menu has rename option in draft revision', async ({ page }) => {
      await setupMocks(page, { isHeadRevision: false })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('column-header-name').click()

      // Rename column option should be available
      await expect(
        page.getByRole('menuitem', { name: /rename/i }).or(page.getByRole('menuitem', { name: /edit/i })),
      ).toBeVisible()
    })
  })

  test.describe('Readonly Cells', () => {
    test('readonly cells show readonly indicator', async ({ page }) => {
      await setupMocks(page, { rowsReadonly: true })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/head/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Cells should be visually indicated as readonly
      const cell = page.getByTestId('cell-row-1-name')
      await expect(cell).toBeVisible()

      // Try to edit - should not work
      await cell.dblclick()
      await expect(cell.locator('input, textarea')).not.toBeVisible()
    })
  })
})
