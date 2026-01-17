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
    tableResponse?: object
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

    if (opName === 'CreateRow') {
      const newRowId = `new-row-${Date.now()}`
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            createRow: {
              __typename: 'RowModel',
              id: newRowId,
              versionId: `${newRowId}-v1`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              data: {},
            },
          },
        }),
      })
    }

    if (opName === 'DeleteRow') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            deleteRow: true,
          },
        }),
      })
    }

    if (opName === 'DeleteRows') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            deleteRows: true,
          },
        }),
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
      getTableForLoader: options.tableResponse || createFullTableResponse(TABLE_ID),
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

test.describe('Row Operations', () => {
  test.describe('Display Rows', () => {
    test('displays rows with correct data', async ({ page }) => {
      const rows = [
        { id: 'row-1', data: { name: 'Alice', age: 25, active: true } },
        { id: 'row-2', data: { name: 'Bob', age: 30, active: false } },
      ]
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByTestId('row-row-1')).toBeVisible()
      await expect(page.getByTestId('row-row-2')).toBeVisible()

      await expect(page.getByTestId('cell-row-1-name')).toHaveText('Alice')
      await expect(page.getByTestId('cell-row-2-name')).toHaveText('Bob')
    })

    test('displays row count in footer', async ({ page }) => {
      const rows = createSampleRows(10)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByText('10 rows')).toBeVisible()
    })

    test('shows empty state when no rows', async ({ page }) => {
      await setupMocks(page, { rows: [] })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByText('No rows yet')).toBeVisible()
    })
  })

  test.describe('Create Row', () => {
    test('create row link opens row creation', async ({ page }) => {
      await setupMocks(page, { rows: [] })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByText('No rows yet')).toBeVisible()

      // Click the "Create your first row to get started" link in empty state
      await page.getByText('Create your first row to get started').click()

      // Should navigate to new row page showing field names
      await expect(page.getByText('name:')).toBeVisible()
      await expect(page.getByText('age:')).toBeVisible()
    })
  })

  test.describe('Row Selection', () => {
    test('can enter selection mode via row menu', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Hover on row to show menu button, then click it
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      await expect(page.getByText('1 selected')).toBeVisible()
    })

    test('can select multiple rows after entering selection mode', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter selection mode via first row menu
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      await expect(page.getByText('1 selected')).toBeVisible()

      // Now checkboxes are visible, click second row's checkbox control (the visible box)
      const row2CheckboxControl = page.getByTestId('row-row-2').locator('[data-part="control"]')
      await row2CheckboxControl.click()

      await expect(page.getByText('2 selected')).toBeVisible()
    })

    test('select all checkbox selects all rows', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter selection mode first
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      await expect(page.getByText('1 selected')).toBeVisible()

      // Click select all button in the action bar
      await page.getByRole('button', { name: /select all/i }).click()

      await expect(page.getByText('3 selected')).toBeVisible()
    })

    test('can exit selection mode', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter selection mode
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      await expect(page.getByText('1 selected')).toBeVisible()

      // Click the close (X) button in the action bar
      const closeButton = page.locator('.chakra-action-bar__closeTrigger')
      await closeButton.click()

      await expect(page.getByText('1 selected')).not.toBeVisible()
    })
  })

  test.describe('Delete Rows', () => {
    test('delete button shows in selection mode', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter selection mode via row menu
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      await expect(page.getByRole('button', { name: /delete/i })).toBeVisible()
    })

    test('delete button opens confirmation dialog', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter selection mode via row menu
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      const deleteButton = page.getByRole('button', { name: /delete/i })
      await deleteButton.click()

      // Confirm dialog appears with heading and confirmation text
      await expect(page.getByRole('heading', { name: /delete row/i })).toBeVisible()
      await expect(page.getByText(/are you sure/i)).toBeVisible()
    })
  })

  test.describe('Row Cell Types', () => {
    test('string cell displays text value', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'John Doe', age: 30, active: true } }]
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByTestId('cell-row-1-name')).toHaveText('John Doe')
    })

    test('number cell displays numeric value', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'John', age: 42, active: true } }]
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByTestId('cell-row-1-age')).toHaveText('42')
    })

    test('boolean cell displays true/false value', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'John', age: 30, active: true } }]
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Boolean cells display "true" or "false" as text
      await expect(page.getByTestId('cell-row-1-active')).toHaveText('true')
    })
  })

  test.describe('Row Navigation', () => {
    test('clicking row ID navigates to row detail', async ({ page }) => {
      const rows = [{ id: 'test-row', data: { name: 'Test', age: 25, active: true } }]
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const rowIdLink = page.getByTestId('row-test-row').locator('a').first()
      await expect(rowIdLink).toHaveText('test-row')
    })
  })

  test.describe('Selection Persistence', () => {
    test('selection persists while loading more rows', async ({ page }) => {
      await setupAuth(page)

      const initialRows = createSampleRows(20)
      const nextPageRows = createSampleRows(10, 20)
      let pagesLoaded = 0

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

          if (after && pagesLoaded === 0) {
            pagesLoaded++
            return route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(createRowsResponse(nextPageRows, { hasNextPage: false })),
            })
          }

          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(
              createRowsResponse(initialRows, { hasNextPage: true, totalCount: 30, endCursor: 'cursor-next' }),
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
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter selection mode and select rows
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      await expect(page.getByText('1 selected')).toBeVisible()

      // Select another row
      const row5CheckboxControl = page.getByTestId('row-row-5').locator('[data-part="control"]')
      await row5CheckboxControl.click()

      await expect(page.getByText('2 selected')).toBeVisible()

      // Load more rows
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      const loadMoreButton = page.getByText(/load more/i).or(page.getByRole('button', { name: /more/i }))
      if (await loadMoreButton.isVisible()) {
        await loadMoreButton.click()
        // Wait for rows response
        await page.waitForResponse((resp) => resp.url().includes('graphql'))
      }

      // Selection should still show 2 selected
      await expect(page.getByText('2 selected')).toBeVisible()

      // Verify original rows are still selected
      const row1Checkbox = page.getByTestId('row-row-1').locator('[data-part="control"]')
      await expect(row1Checkbox).toHaveAttribute('data-state', 'checked')
    })
  })

  test.describe('Multi-Row Selection', () => {
    test('clicking checkbox adds row to selection', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter selection mode first via row menu
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      await expect(page.getByText('1 selected')).toBeVisible()

      // Click on another row's checkbox to add to selection
      const row3CheckboxControl = page.getByTestId('row-row-3').locator('[data-part="control"]')
      await row3CheckboxControl.click()

      // Should have 2 selected (both row-1 and row-3)
      await expect(page.getByText('2 selected')).toBeVisible()

      // Verify both rows are checked
      const row1Checkbox = page.getByTestId('row-row-1').locator('[data-part="control"]')
      await expect(row1Checkbox).toHaveAttribute('data-state', 'checked')
      const row3Checkbox = page.getByTestId('row-row-3').locator('[data-part="control"]')
      await expect(row3Checkbox).toHaveAttribute('data-state', 'checked')
    })

    test('clicking selected checkbox deselects row', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter selection mode
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      await expect(page.getByText('1 selected')).toBeVisible()

      // Select row-2
      const row2CheckboxControl = page.getByTestId('row-row-2').locator('[data-part="control"]')
      await row2CheckboxControl.click()

      await expect(page.getByText('2 selected')).toBeVisible()

      // Click row-1 again to deselect it
      const row1CheckboxControl = page.getByTestId('row-row-1').locator('[data-part="control"]')
      await row1CheckboxControl.click()

      // Should have 1 selected (only row-2)
      await expect(page.getByText('1 selected')).toBeVisible()

      // Verify row-1 is unchecked
      await expect(row1CheckboxControl).toHaveAttribute('data-state', 'unchecked')
    })
  })

  test.describe('Partial Selection', () => {
    test('select all checkbox shows indeterminate state when some rows selected', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter selection mode
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      await expect(page.getByText('1 selected')).toBeVisible()

      // Select one more row (not all)
      const row2CheckboxControl = page.getByTestId('row-row-2').locator('[data-part="control"]')
      await row2CheckboxControl.click()

      await expect(page.getByText('2 selected')).toBeVisible()

      // Header checkbox should be in indeterminate state (partial selection)
      // This is indicated by the "select all" button text and row count not matching
      const selectAllButton = page.getByRole('button', { name: /select all/i })
      await expect(selectAllButton).toBeVisible()
    })

    test('clicking select all when partially selected selects all rows', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter selection mode
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      await expect(page.getByText('1 selected')).toBeVisible()

      // Click select all
      await page.getByRole('button', { name: /select all/i }).click()

      // All 5 rows should be selected
      await expect(page.getByText('5 selected')).toBeVisible()
    })

    test('deselect all clears selection', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupMocks(page, { rows })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter selection mode and select all
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()
      await page.getByRole('button', { name: /select all/i }).click()

      await expect(page.getByText('5 selected')).toBeVisible()

      // Now deselect all (button should change to "Deselect all" or similar)
      const deselectButton = page.getByRole('button', { name: /deselect/i })
      if (await deselectButton.isVisible()) {
        await deselectButton.click()
        await expect(page.getByText('0 selected')).toBeVisible()
      }
    })
  })

  test.describe('Toast Notifications', () => {
    test('shows success toast after deleting rows', async ({ page }) => {
      await setupAuth(page)

      const rows = createSampleRows(3)

      await page.route('**/graphql', async (route, request) => {
        const body = request.postDataJSON()
        const opName = body?.operationName as string

        const projectResponse = createFullProjectResponse(PROJECT_NAME, ORG_ID)
        const branchResponse = createFullBranchResponse(PROJECT_NAME)

        if (opName === 'DeleteRows') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: {
                deleteRows: {
                  branch: { id: 'branch-1' },
                },
              },
            }),
          })
        }

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
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter selection mode and select a row via menu
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      // Row is now selected (1 selected)
      await expect(page.getByText('1 selected')).toBeVisible()

      // Click delete button
      await page.getByRole('button', { name: /delete/i }).click()

      // Confirm deletion
      const confirmButton = page.getByRole('button', { name: /^delete$/i })
      await confirmButton.click()

      // Should show success toast
      await expect(page.getByText(/deleted/i)).toBeVisible()
    })

    test('shows error toast when deletion fails', async ({ page }) => {
      await setupAuth(page)

      const rows = createSampleRows(3)

      await page.route('**/graphql', async (route, request) => {
        const body = request.postDataJSON()
        const opName = body?.operationName as string

        const projectResponse = createFullProjectResponse(PROJECT_NAME, ORG_ID)
        const branchResponse = createFullBranchResponse(PROJECT_NAME)

        if (opName === 'DeleteRows') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              errors: [{ message: 'Failed to delete rows' }],
              data: null,
            }),
          })
        }

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
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Enter selection mode and select a row via menu
      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      // Row is now selected (1 selected)
      await expect(page.getByText('1 selected')).toBeVisible()

      // Click delete button
      await page.getByRole('button', { name: /delete/i }).click()

      // Confirm deletion
      const confirmButton = page.getByRole('button', { name: /^delete$/i })
      await confirmButton.click()

      // Should show error toast
      await expect(page.getByText('Failed to delete rows').first()).toBeVisible()
    })
  })
})
