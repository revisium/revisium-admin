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

async function setupMocks(
  page: Page,
  options: {
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
          data: {
            updateRow: {
              __typename: 'RowModel',
              id: body.variables?.data?.rowId || 'row-1',
              versionId: 'row-1-v2',
              readonly: false,
              data: body.variables?.data?.data || {},
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

test.describe('Inline Cell Editing', () => {
  test.describe('Cell Focus', () => {
    test('single click focuses cell', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.click()

      // Focused cell should have blue outline
      await expect(cell).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })

    test('clicking another cell moves focus', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell1 = page.getByTestId('cell-row-1-name')
      const cell2 = page.getByTestId('cell-row-2-name')

      await cell1.click()
      await expect(cell1).toHaveCSS('outline-color', 'rgb(66, 153, 225)')

      await cell2.click()
      await expect(cell2).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })
  })

  test.describe('Edit Mode', () => {
    test('double click enters edit mode', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      // Should show input field in edit mode
      await expect(cell.locator('input, textarea')).toBeVisible()
    })

    test('can edit string cell value', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'Original', age: 25, active: true } }]
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      const input = cell.locator('input, textarea')
      await input.clear()
      await input.fill('Updated Value')

      // Press Enter to save
      await input.press('Enter')

      // Cell should show updated value
      await expect(cell).toContainText('Updated Value')
    })

    test('Escape cancels editing without saving', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'Original', age: 25, active: true } }]
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      const input = cell.locator('input, textarea')
      await input.clear()
      await input.fill('Should Not Save')

      // Press Escape to cancel
      await input.press('Escape')

      // Cell should still show original value
      await expect(cell).toContainText('Original')
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('arrow keys move focus between cells', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Focus first cell
      const cell1 = page.getByTestId('cell-row-1-name')
      await cell1.click()

      // Press down arrow
      await page.keyboard.press('ArrowDown')

      // Second row should now be focused
      const cell2 = page.getByTestId('cell-row-2-name')
      await expect(cell2).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })

    test('Tab moves to next cell', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Focus first cell
      const nameCell = page.getByTestId('cell-row-1-name')
      await nameCell.click()

      // Press Tab
      await page.keyboard.press('Tab')

      // Age cell should now be focused
      const ageCell = page.getByTestId('cell-row-1-age')
      await expect(ageCell).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })

    test('Enter in edit mode saves and moves down', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Double click to edit
      const cell1 = page.getByTestId('cell-row-1-name')
      await cell1.dblclick()

      // Edit and press Enter
      const input = cell1.locator('input, textarea')
      await input.fill('New Value')
      await input.press('Enter')

      // Focus should move to row 2
      const cell2 = page.getByTestId('cell-row-2-name')
      await expect(cell2).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })
  })

  test.describe('Number Cell Editing', () => {
    test('can edit number cell value', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'Test', age: 25, active: true } }]
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-age')
      await cell.dblclick()

      const input = cell.locator('input')
      await input.clear()
      await input.fill('30')
      await input.press('Enter')

      await expect(cell).toContainText('30')
    })
  })

  test.describe('Boolean Cell Editing', () => {
    test('can toggle boolean cell value', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'Test', age: 25, active: true } }]
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-active')
      await expect(cell).toContainText('true')

      // Double click to open boolean selector
      await cell.dblclick()

      // Select false option
      await page.getByText('false').click()

      await expect(cell).toContainText('false')
    })
  })

  test.describe('Readonly Cells', () => {
    // BUG: Head revision cells should be readonly
    test.skip('readonly cells cannot be edited', async () => {
      // This would test head revision which is readonly
      // Currently skipped as it requires different URL setup
    })
  })
})
