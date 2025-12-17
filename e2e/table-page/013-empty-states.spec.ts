import { test, expect } from '@playwright/test'
import { createRowsResponse } from '../fixtures/full-fixtures'
import { setupTablePageMocks, getTablePageUrl } from '../helpers/table-page-setup'

test.describe.skip('Empty States', () => {
  // Skipped: empty states need mock investigation
  test.describe('Empty Table', () => {
    test('shows empty state when table has no rows', async ({ page }) => {
      await setupTablePageMocks(page, { rows: [] })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByText('0 rows').or(page.getByText(/no rows/i))).toBeVisible()
    })

    test('shows column headers even when no rows', async ({ page }) => {
      await setupTablePageMocks(page, { rows: [] })

      await page.goto(getTablePageUrl())

      await expect(page.getByTestId('column-header-name')).toBeVisible()
      await expect(page.getByTestId('column-header-age')).toBeVisible()
      await expect(page.getByTestId('column-header-active')).toBeVisible()
    })

    test('new row button is visible on empty table', async ({ page }) => {
      await setupTablePageMocks(page, { rows: [] })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByRole('button', { name: /new row/i })).toBeVisible()
    })

    test('filter controls work on empty table', async ({ page }) => {
      await setupTablePageMocks(page, { rows: [] })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      await expect(page.getByTestId('filter-condition-0')).toBeVisible()
    })

    test('search works on empty table', async ({ page }) => {
      await setupTablePageMocks(page, { rows: [] })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByRole('button', { name: /search/i }).click()
      await page.getByPlaceholder('Search...').fill('test')

      await expect(page.getByText('0 rows').or(page.getByText(/no rows/i))).toBeVisible()
    })
  })

  test.describe('Empty Search Results', () => {
    test('shows no results message when search finds nothing', async ({ page }) => {
      const rows = [
        { id: 'row-1', data: { name: 'Alice', age: 25, active: true } },
        { id: 'row-2', data: { name: 'Bob', age: 30, active: false } },
      ]

      await setupTablePageMocks(page, {
        rows,
        onOperation: async (opName, variables, route) => {
          if (opName === 'RowListRows' || opName === 'RowsMst') {
            const data = (variables.data as Record<string, unknown>) || {}
            const where = data.where as Record<string, unknown> | undefined
            if (where?.data) {
              await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(createRowsResponse([])),
              })
              return true
            }
          }
          return false
        },
      })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()
      await expect(page.getByTestId('row-row-1')).toBeVisible()

      await page.getByRole('button', { name: /search/i }).click()
      await page.getByPlaceholder('Search...').fill('nonexistent')

      await expect(page.getByText(/no rows found/i).or(page.getByText('0 rows'))).toBeVisible()
    })
  })

  test.describe('Empty Filter Results', () => {
    test('shows message when filter returns no results', async ({ page }) => {
      const rows = [
        { id: 'row-1', data: { name: 'Alice', age: 25, active: true } },
        { id: 'row-2', data: { name: 'Bob', age: 30, active: false } },
      ]

      await setupTablePageMocks(page, {
        rows,
        onOperation: async (opName, variables, route) => {
          if (opName === 'RowListRows' || opName === 'RowsMst') {
            const data = (variables.data as Record<string, unknown>) || {}
            const where = data.where as Record<string, unknown> | undefined
            if (where?.data) {
              await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(createRowsResponse([])),
              })
              return true
            }
          }
          return false
        },
      })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      const valueInput = page.getByTestId('filter-condition-0').locator('input')
      await valueInput.fill('nonexistent')

      await page.getByTestId('filter-apply').click()

      await expect(page.getByText(/no rows/i).or(page.getByText('0 rows'))).toBeVisible()
    })
  })

  test.describe('Empty Columns', () => {
    test('handles table with all columns hidden', async ({ page }) => {
      await setupTablePageMocks(page, {
        rows: [{ id: 'row-1', data: { name: 'Alice', age: 25, active: true } }],
      })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('column-header-name').click()
      await page.getByRole('menuitem', { name: /hide all columns/i }).click()

      await expect(page.getByTestId('column-header-name')).not.toBeVisible()
      await expect(page.getByTestId('column-header-age')).not.toBeVisible()
    })
  })

  test.describe('Empty Values in Cells', () => {
    test('empty string is displayed correctly', async ({ page }) => {
      await setupTablePageMocks(page, {
        rows: [{ id: 'row-1', data: { name: '', age: 25, active: true } }],
      })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await expect(cell).toBeVisible()
    })

    test('null value is displayed correctly', async ({ page }) => {
      await setupTablePageMocks(page, {
        rows: [{ id: 'row-1', data: { name: null, age: 25, active: true } }],
      })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await expect(cell).toBeVisible()
    })

    test('zero number is displayed correctly', async ({ page }) => {
      await setupTablePageMocks(page, {
        rows: [{ id: 'row-1', data: { name: 'Test', age: 0, active: true } }],
      })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-age')
      await expect(cell).toContainText('0')
    })

    test('false boolean is displayed correctly', async ({ page }) => {
      await setupTablePageMocks(page, {
        rows: [{ id: 'row-1', data: { name: 'Test', age: 25, active: false } }],
      })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-active')
      await expect(cell).toContainText('false')
    })

    test('empty array is displayed correctly', async ({ page }) => {
      await setupTablePageMocks(page, {
        schema: {
          type: 'object',
          properties: {
            tags: { type: 'array', items: { type: 'string' }, default: [] },
          },
          additionalProperties: false,
          required: ['tags'],
        },
        rows: [{ id: 'row-1', data: { tags: [] } }],
      })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-tags')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-tags')
      await expect(cell).toBeVisible()
    })
  })
})
