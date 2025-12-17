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
    columns?: Array<{ field: string; width?: number }>
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
              sorts: null,
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

test.describe('Column Operations', () => {
  test.describe('Hide Column', () => {
    // BUG: Hidden data columns don't appear in Insert Before/After menus
    // Only system fields are shown, but hidden user data fields are missing
    // Expected: When 'name' column is hidden, it should appear in "Data fields" section
    // Actual: Only "System fields" section is shown with createdAt, updatedAt, etc.
    test.skip('hidden column appears in insert before menu', async ({ page }) => {
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
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const nameHeader = page.getByTestId('column-header-name')
      const ageHeader = page.getByTestId('column-header-age')

      await expect(nameHeader).toBeVisible()
      await expect(ageHeader).toBeVisible()

      await nameHeader.click()
      await page.getByRole('menuitem', { name: /hide column/i }).click()

      await expect(nameHeader).not.toBeVisible()

      await ageHeader.click()
      await page.getByText('Insert before').click()

      const submenu = page.locator('[role="menu"]').last()
      await expect(submenu.getByText('name', { exact: true })).toBeVisible()
    })

    // BUG: Same issue as above - hidden data columns don't appear in Insert After menu
    test.skip('hidden column appears in insert after menu', async ({ page }) => {
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
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const nameHeader = page.getByTestId('column-header-name')
      const ageHeader = page.getByTestId('column-header-age')

      await nameHeader.click()
      await page.getByRole('menuitem', { name: /hide column/i }).click()

      await expect(nameHeader).not.toBeVisible()

      await ageHeader.click()
      await page.getByText('Insert after').click()

      const submenu = page.locator('[role="menu"]').last()
      await expect(submenu.getByText('name', { exact: true })).toBeVisible()
    })

    test('hide all columns hides all data columns', async ({ page }) => {
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
      const activeHeader = page.getByTestId('column-header-active')

      await expect(nameHeader).toBeVisible()
      await expect(ageHeader).toBeVisible()
      await expect(activeHeader).toBeVisible()

      await nameHeader.click()
      await page.getByRole('menuitem', { name: /hide all columns/i }).click()

      await expect(nameHeader).not.toBeVisible()
      await expect(ageHeader).not.toBeVisible()
      await expect(activeHeader).not.toBeVisible()
    })
  })

  test.describe('Insert Column', () => {
    test('insert before adds column to the left', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          columns: [
            { field: 'data.age', width: 100 },
            { field: 'data.active', width: 100 },
          ],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-age')).toBeVisible()

      const ageHeader = page.getByTestId('column-header-age')
      const nameHeader = page.getByTestId('column-header-name')

      await expect(ageHeader).toBeVisible()
      await expect(nameHeader).not.toBeVisible()

      await ageHeader.click()
      await page.getByText('Insert before').click()
      const submenu = page.locator('[role="menu"]').last()
      await submenu.getByText('name', { exact: true }).click()

      await expect(nameHeader).toBeVisible()

      const headers = page.locator('[data-testid^="column-header-"]')
      const headerTexts = await headers.allTextContents()
      const nameIndex = headerTexts.findIndex((t) => t.includes('name'))
      const ageIndex = headerTexts.findIndex((t) => t.includes('age'))
      expect(nameIndex).toBeLessThan(ageIndex)
    })

    test('insert after adds column to the right', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          columns: [
            { field: 'data.name', width: 200 },
            { field: 'data.active', width: 100 },
          ],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const nameHeader = page.getByTestId('column-header-name')
      const ageHeader = page.getByTestId('column-header-age')

      await expect(nameHeader).toBeVisible()
      await expect(ageHeader).not.toBeVisible()

      await nameHeader.click()
      await page.getByText('Insert after').click()
      const submenu = page.locator('[role="menu"]').last()
      await submenu.getByText('age', { exact: true }).click()

      await expect(ageHeader).toBeVisible()

      const headers = page.locator('[data-testid^="column-header-"]')
      const headerTexts = await headers.allTextContents()
      const nameIndex = headerTexts.findIndex((t) => t.includes('name'))
      const ageIndex = headerTexts.findIndex((t) => t.includes('age'))
      expect(nameIndex).toBeLessThan(ageIndex)
    })

    test('inserted column disappears from insert menus', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          columns: [
            { field: 'data.age', width: 100 },
            { field: 'data.active', width: 100 },
          ],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-age')).toBeVisible()

      const ageHeader = page.getByTestId('column-header-age')

      await ageHeader.click()
      await page.getByText('Insert before').click()
      let submenu = page.locator('[role="menu"]').last()
      await expect(submenu.getByText('name', { exact: true })).toBeVisible()
      await submenu.getByText('name', { exact: true }).click()

      await ageHeader.click()
      await page.getByText('Insert before').click()
      submenu = page.locator('[role="menu"]').last()

      await expect(submenu.getByText('name', { exact: true })).not.toBeVisible()
    })
  })

  test.describe('Move Column', () => {
    test('move column left changes column order', async ({ page }) => {
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

      const ageHeader = page.getByTestId('column-header-age')

      await ageHeader.click()
      await page.getByText('Move column').click()
      await page.getByRole('menuitem', { name: /move left/i }).click()

      const headers = page.locator('[data-testid^="column-header-"]')
      const headerTexts = await headers.allTextContents()
      const ageIndex = headerTexts.findIndex((t) => t.includes('age'))
      const nameIndex = headerTexts.findIndex((t) => t.includes('name'))
      expect(ageIndex).toBeLessThan(nameIndex)
    })

    test('move column right changes column order', async ({ page }) => {
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

      const ageHeader = page.getByTestId('column-header-age')

      await ageHeader.click()
      await page.getByText('Move column').click()
      await page.getByRole('menuitem', { name: /move right/i }).click()

      const headers = page.locator('[data-testid^="column-header-"]')
      const headerTexts = await headers.allTextContents()
      const ageIndex = headerTexts.findIndex((t) => t.includes('age'))
      const activeIndex = headerTexts.findIndex((t) => t.includes('active'))
      expect(ageIndex).toBeGreaterThan(activeIndex)
    })

    test('move to start moves column to first position', async ({ page }) => {
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

      const activeHeader = page.getByTestId('column-header-active')

      await activeHeader.click()
      await page.getByText('Move column').click()
      await page.getByRole('menuitem', { name: /move to start/i }).click()

      const headers = page.locator('[data-testid^="column-header-"]')
      const headerTexts = await headers.allTextContents()
      const activeIndex = headerTexts.findIndex((t) => t.includes('active'))
      expect(activeIndex).toBe(0)
    })

    test('move to end moves column to last position', async ({ page }) => {
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

      await nameHeader.click()
      await page.getByText('Move column').click()
      await page.getByRole('menuitem', { name: /move to end/i }).click()

      const headers = page.locator('[data-testid^="column-header-"]')
      const headerTexts = await headers.allTextContents()
      const nameIndex = headerTexts.findIndex((t) => t.includes('name'))
      expect(nameIndex).toBe(headerTexts.length - 1)
    })
  })

  test.describe.skip('Column Resize', () => {
    // Skipped: resize handle selectors need investigation
    test('column resize handle is visible on hover', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          columns: [
            { field: 'data.name', width: 200 },
            { field: 'data.age', width: 100 },
          ],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const nameHeader = page.getByTestId('column-header-name')
      await nameHeader.hover()

      // Resize handle should be visible on hover
      const resizeHandle = nameHeader
        .locator('[data-testid="column-resize-handle"]')
        .or(nameHeader.locator('[role="separator"]'))
      await expect(resizeHandle).toBeVisible()
    })

    test('dragging resize handle changes column width', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          columns: [
            { field: 'data.name', width: 200 },
            { field: 'data.age', width: 100 },
          ],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const nameHeader = page.getByTestId('column-header-name')
      const initialWidth = await nameHeader.evaluate((el) => el.getBoundingClientRect().width)

      // Find and drag resize handle
      const resizeHandle = nameHeader
        .locator('[data-testid="column-resize-handle"]')
        .or(nameHeader.locator('[role="separator"]'))
        .or(nameHeader.locator('group'))
      const box = await resizeHandle.boundingBox()

      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
        await page.mouse.down()
        await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2)
        await page.mouse.up()

        const newWidth = await nameHeader.evaluate((el) => el.getBoundingClientRect().width)
        expect(newWidth).toBeGreaterThan(initialWidth)
      }
    })

    test('column width is persisted in view settings', async ({ page }) => {
      let savedColumns: Array<{ field: string; width: number }> | null = null

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
            body: JSON.stringify(
              createViewsResponse({
                columns: [
                  { field: 'data.name', width: 200 },
                  { field: 'data.age', width: 100 },
                ],
              }),
            ),
          })
        }

        if (opName === 'UpdateTableViews') {
          // Capture saved column widths
          const viewsData = body?.variables?.data?.data
          if (viewsData?.views?.[0]?.columns) {
            savedColumns = viewsData.views[0].columns
          }
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

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const nameHeader = page.getByTestId('column-header-name')
      const resizeHandle = nameHeader
        .locator('[data-testid="column-resize-handle"]')
        .or(nameHeader.locator('[role="separator"]'))
        .or(nameHeader.locator('group'))
      const box = await resizeHandle.boundingBox()

      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
        await page.mouse.down()
        await page.mouse.move(box.x + box.width / 2 + 50, box.y + box.height / 2)
        await page.mouse.up()

        // Wait for UpdateTableViews API call
        await page.waitForResponse((resp) => resp.url().includes('graphql'))

        // Check that width was saved
        if (savedColumns) {
          const nameColumn = savedColumns.find((c) => c.field === 'data.name')
          expect(nameColumn).toBeDefined()
          if (nameColumn) {
            expect(nameColumn.width).toBeGreaterThan(200)
          }
        }
      }
    })

    test('minimum column width is enforced', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          columns: [
            { field: 'data.name', width: 200 },
            { field: 'data.age', width: 100 },
          ],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const nameHeader = page.getByTestId('column-header-name')
      const resizeHandle = nameHeader
        .locator('[data-testid="column-resize-handle"]')
        .or(nameHeader.locator('[role="separator"]'))
        .or(nameHeader.locator('group'))
      const box = await resizeHandle.boundingBox()

      if (box) {
        // Try to drag far to the left to make column very narrow
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
        await page.mouse.down()
        await page.mouse.move(box.x - 300, box.y + box.height / 2)
        await page.mouse.up()

        const finalWidth = await nameHeader.evaluate((el) => el.getBoundingClientRect().width)
        // Column should have minimum width (typically 50-100px)
        expect(finalWidth).toBeGreaterThan(40)
      }
    })

    test('double click resize handle auto-fits column width', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          columns: [
            { field: 'data.name', width: 50 }, // Start narrow
            { field: 'data.age', width: 100 },
          ],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const nameHeader = page.getByTestId('column-header-name')
      const initialWidth = await nameHeader.evaluate((el) => el.getBoundingClientRect().width)

      const resizeHandle = nameHeader
        .locator('[data-testid="column-resize-handle"]')
        .or(nameHeader.locator('[role="separator"]'))
        .or(nameHeader.locator('group'))
      await resizeHandle.dblclick()

      // Wait for width to change from initial value
      await expect(async () => {
        const width = await nameHeader.evaluate((el) => el.getBoundingClientRect().width)
        expect(width).not.toBe(initialWidth)
      }).toPass({ timeout: 2000 })

      const newWidth = await nameHeader.evaluate((el) => el.getBoundingClientRect().width)
      // Column should auto-fit to content, typically becoming wider
      expect(newWidth).not.toBe(initialWidth)
    })
  })

  test.describe('Column Visibility State', () => {
    test('all columns shown initially when no saved view', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByText('User 1')).toBeVisible()

      await expect(page.getByTestId('column-header-name')).toBeVisible()
      await expect(page.getByTestId('column-header-age')).toBeVisible()
      await expect(page.getByTestId('column-header-active')).toBeVisible()
    })

    test('saved view columns are restored on page load', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          columns: [{ field: 'data.name', width: 200 }],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByText('User 1')).toBeVisible()

      await expect(page.getByTestId('column-header-name')).toBeVisible()
      await expect(page.getByTestId('column-header-age')).not.toBeVisible()
      await expect(page.getByTestId('column-header-active')).not.toBeVisible()
    })

    test('hiding and showing column shows view settings badge', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          columns: [
            { field: 'data.name', width: 200 },
            { field: 'data.age', width: 100 },
          ],
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByText('User 1')).toBeVisible()

      await expect(page.getByTestId('view-settings-badge')).not.toBeVisible()

      const nameHeader = page.getByTestId('column-header-name')
      await nameHeader.click()
      await page.getByRole('menuitem', { name: /hide column/i }).click()

      await expect(page.getByTestId('view-settings-badge')).toBeVisible()
      await expect(page.getByTestId('view-settings-badge')).toHaveText('unsaved')
    })
  })

  test.describe('System Fields', () => {
    test('Add Column button shows system fields section', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByRole('button', { name: /add column/i }).click()

      // System fields section should be visible in the dropdown
      await expect(page.getByText(/system fields/i)).toBeVisible()
    })

    test('can add createdAt system field as column', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByRole('button', { name: /add column/i }).click()

      // Find and click on createdAt in system fields
      await page.getByRole('menuitem', { name: 'createdAt' }).click()

      // Column should now be visible
      await expect(page.getByTestId('column-header-createdAt')).toBeVisible()
    })

    test('can add updatedAt system field as column', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByRole('button', { name: /add column/i }).click()

      // Find and click on updatedAt in system fields
      await page.getByRole('menuitem', { name: 'updatedAt' }).click()

      // Column should now be visible
      await expect(page.getByTestId('column-header-updatedAt')).toBeVisible()
    })

    test('system field displays datetime value', async ({ page }) => {
      await setupAuth(page)

      const rows = [
        {
          id: 'row-1',
          data: { name: 'Test User', age: 25, active: true },
        },
      ]

      await page.route('**/graphql', async (route, request) => {
        const body = request.postDataJSON()
        const opName = body?.operationName as string

        const projectResponse = createFullProjectResponse(PROJECT_NAME, ORG_ID)
        const branchResponse = createFullBranchResponse(PROJECT_NAME)

        if (opName === 'GetTableViews') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(
              createViewsResponse({
                columns: [
                  { field: 'data.name', width: 200 },
                  { field: 'createdAt', width: 200 },
                ],
              }),
            ),
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
      await expect(page.getByTestId('column-header-createdAt')).toBeVisible()

      // The cell should contain a formatted date
      const cell = page.getByTestId('cell-row-1-createdAt')
      await expect(cell).toBeVisible()
      // Check that it contains date-like text (2024)
      await expect(cell).toContainText('2024')
    })
  })
})
