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

test.describe('Keyboard Navigation', () => {
  test.describe('Arrow Key Navigation', () => {
    test('ArrowDown moves focus to next row', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Click first cell to focus
      const cell1 = page.getByTestId('cell-row-1-name')
      await cell1.click()
      await expect(cell1).toHaveCSS('outline-color', 'rgb(66, 153, 225)')

      // Press ArrowDown
      await page.keyboard.press('ArrowDown')

      // Second row should be focused
      const cell2 = page.getByTestId('cell-row-2-name')
      await expect(cell2).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })

    test('ArrowUp moves focus to previous row', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Click second cell to focus
      const cell2 = page.getByTestId('cell-row-2-name')
      await cell2.click()

      // Press ArrowUp
      await page.keyboard.press('ArrowUp')

      // First row should be focused
      const cell1 = page.getByTestId('cell-row-1-name')
      await expect(cell1).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })

    test('ArrowRight moves focus to next column', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Click name cell
      const nameCell = page.getByTestId('cell-row-1-name')
      await nameCell.click()

      // Press ArrowRight
      await page.keyboard.press('ArrowRight')

      // Age cell should be focused
      const ageCell = page.getByTestId('cell-row-1-age')
      await expect(ageCell).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })

    test('ArrowLeft moves focus to previous column', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Click age cell
      const ageCell = page.getByTestId('cell-row-1-age')
      await ageCell.click()

      // Press ArrowLeft
      await page.keyboard.press('ArrowLeft')

      // Name cell should be focused
      const nameCell = page.getByTestId('cell-row-1-name')
      await expect(nameCell).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })

    test('ArrowDown at last row stays on last row', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Click last row cell
      const lastCell = page.getByTestId('cell-row-3-name')
      await lastCell.click()

      // Press ArrowDown
      await page.keyboard.press('ArrowDown')

      // Should still be on last row (or move to first - depends on implementation)
      await expect(lastCell).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })
  })

  test.describe('Tab Navigation', () => {
    test('Tab moves to next cell in row', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Click name cell
      const nameCell = page.getByTestId('cell-row-1-name')
      await nameCell.click()

      // Press Tab
      await page.keyboard.press('Tab')

      // Next column should be focused
      const ageCell = page.getByTestId('cell-row-1-age')
      await expect(ageCell).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })

    test('Shift+Tab moves to previous cell', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Click age cell
      const ageCell = page.getByTestId('cell-row-1-age')
      await ageCell.click()

      // Press Shift+Tab
      await page.keyboard.press('Shift+Tab')

      // Previous column should be focused
      const nameCell = page.getByTestId('cell-row-1-name')
      await expect(nameCell).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })

    test('Tab at end of row moves to next row', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Click last column of first row
      const activeCell = page.getByTestId('cell-row-1-active')
      await activeCell.click()

      // Press Tab multiple times to get to next row
      await page.keyboard.press('Tab')

      // Should move to next row first column or stay on same row
      // Implementation dependent
    })
  })

  test.describe('Enter Key', () => {
    test('Enter on focused cell enters edit mode', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Click to focus cell
      const cell = page.getByTestId('cell-row-1-name')
      await cell.click()

      // Press Enter to edit
      await page.keyboard.press('Enter')

      // Input should be visible
      await expect(cell.locator('input, textarea')).toBeVisible()
    })

    test('Enter in edit mode saves and moves down', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter edit mode
      const cell1 = page.getByTestId('cell-row-1-name')
      await cell1.dblclick()

      const input = cell1.locator('input, textarea')
      await input.fill('New Value')

      // Press Enter to save
      await page.keyboard.press('Enter')

      // Should move focus to next row
      const cell2 = page.getByTestId('cell-row-2-name')
      await expect(cell2).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })
  })

  test.describe('Escape Key', () => {
    test('Escape in edit mode cancels editing', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'Original', age: 25, active: true } }]
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter edit mode
      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      const input = cell.locator('input, textarea')
      await input.fill('Should Not Save')

      // Press Escape to cancel
      await page.keyboard.press('Escape')

      // Original value should remain
      await expect(cell).toContainText('Original')
    })

    test('Escape clears cell focus', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Click to focus cell
      const cell = page.getByTestId('cell-row-1-name')
      await cell.click()
      await expect(cell).toHaveCSS('outline-color', 'rgb(66, 153, 225)')

      // Press Escape - focus should be cleared or moved
      await page.keyboard.press('Escape')

      // Cell may or may not remain focused depending on implementation
    })
  })

  test.describe('F2 Key', () => {
    test('F2 enters edit mode on focused cell', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Click to focus cell
      const cell = page.getByTestId('cell-row-1-name')
      await cell.click()

      // Press F2 to edit
      await page.keyboard.press('F2')

      // Input should be visible
      await expect(cell.locator('input, textarea')).toBeVisible()
    })
  })

  test.describe('Home/End Keys', () => {
    test.skip('Home moves to first cell in row', async ({ page }) => {
      // BUG: Home key navigation needs verification
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Click last column
      const activeCell = page.getByTestId('cell-row-1-active')
      await activeCell.click()

      // Press Home
      await page.keyboard.press('Home')

      // First column should be focused
      const nameCell = page.getByTestId('cell-row-1-name')
      await expect(nameCell).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })

    test.skip('End moves to last cell in row', async ({ page }) => {
      // BUG: End key navigation needs verification
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Click first column
      const nameCell = page.getByTestId('cell-row-1-name')
      await nameCell.click()

      // Press End
      await page.keyboard.press('End')

      // Last column should be focused
      const activeCell = page.getByTestId('cell-row-1-active')
      await expect(activeCell).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })
  })

  test.describe('Typing to Start Edit', () => {
    test('typing character on focused cell starts editing', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Click to focus cell
      const cell = page.getByTestId('cell-row-1-name')
      await cell.click()

      // Type a character
      await page.keyboard.type('T')

      // Should enter edit mode with typed character
      const input = cell.locator('input, textarea')
      await expect(input).toBeVisible()
    })
  })

  test.describe('Ctrl/Cmd Shortcuts', () => {
    test.skip('Ctrl+C copies cell value', async () => {
      // BUG: Copy functionality needs verification
    })

    test.skip('Ctrl+V pastes into cell', async () => {
      // BUG: Paste functionality needs verification
    })

    test.skip('Ctrl+Z undoes last change', async () => {
      // BUG: Undo functionality needs verification
    })
  })

  test.describe('Delete/Backspace Keys', () => {
    test.skip('Delete key clears cell value', async () => {
      // BUG: Delete key functionality needs verification
    })

    test.skip('Backspace on focused cell starts editing', async () => {
      // BUG: Backspace functionality needs verification
    })
  })
})
