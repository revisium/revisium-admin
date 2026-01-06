import { test, expect } from '@playwright/test'
import { createRowsResponse, createSampleRows } from '../fixtures/full-fixtures'
import { setupTablePageMocks, getTablePageUrl } from '../helpers/table-page-setup'

test.describe('Error Handling', () => {
  test.describe('Network Errors', () => {
    test('shows error or empty state when API request fails', async ({ page }) => {
      await setupTablePageMocks(page, {
        onOperation: async (opName, _variables, route) => {
          if (opName === 'RowListRows' || opName === 'RowListRows') {
            await route.abort('failed')
            return true
          }
          return false
        },
      })

      await page.goto(getTablePageUrl())

      // Should show error message or handle gracefully (page should at least load)
      await expect(
        page
          .getByText(/error/i)
          .or(page.getByText(/failed/i))
          .or(page.getByTestId('column-header-name')),
      ).toBeVisible()
    })

    test('handles 500 server error gracefully', async ({ page }) => {
      await setupTablePageMocks(page, {
        onOperation: async (opName, _variables, route) => {
          if (opName === 'RowListRows' || opName === 'RowListRows') {
            await route.fulfill({
              status: 500,
              contentType: 'application/json',
              body: JSON.stringify({ errors: [{ message: 'Internal server error' }] }),
            })
            return true
          }
          return false
        },
      })

      await page.goto(getTablePageUrl())

      // Page should handle error gracefully - shows toast with error message
      // Use .first() because multiple requests may trigger multiple toasts
      await expect(page.getByText('Internal server error').first()).toBeVisible()
    })
  })

  test.describe('GraphQL Errors', () => {
    test('handles GraphQL error in response', async ({ page }) => {
      await setupTablePageMocks(page, {
        onOperation: async (opName, _variables, route) => {
          if (opName === 'RowListRows' || opName === 'RowListRows') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                data: null,
                errors: [{ message: 'Permission denied', path: ['rows'] }],
              }),
            })
            return true
          }
          return false
        },
      })

      await page.goto(getTablePageUrl())

      // Should display error toast
      // Use .first() because multiple requests may trigger multiple toasts
      await expect(page.getByText('Permission denied').first()).toBeVisible()
    })
  })

  test.describe('Update Errors', () => {
    test('shows error state when row update fails', async ({ page }) => {
      const rows = createSampleRows(3)

      await setupTablePageMocks(page, {
        rows,
        onOperation: async (opName, _variables, route) => {
          if (opName === 'UpdateRow' || opName === 'PatchRowInline') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                data: null,
                errors: [{ message: 'Validation error: Name cannot be empty' }],
              }),
            })
            return true
          }
          return false
        },
      })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      const input = page.locator('input:focus, textarea:focus')
      await input.fill('New Value')
      await input.press('Enter')

      // Should show error toast
      await expect(page.getByText('Validation error: Name cannot be empty')).toBeVisible()
    })

    test('shows error when delete fails', async ({ page }) => {
      const rows = createSampleRows(3)

      await setupTablePageMocks(page, {
        rows,
        onOperation: async (opName, _variables, route) => {
          if (opName === 'RemoveRow' || opName === 'RemoveRows') {
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify({
                data: null,
                errors: [{ message: 'Cannot delete row: referenced by other rows' }],
              }),
            })
            return true
          }
          return false
        },
      })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByRole('menuitem', { name: /delete/i }).click()

      const confirmButton = page.getByRole('button', { name: /delete/i }).last()
      if (await confirmButton.isVisible()) {
        await confirmButton.click()
      }

      // Row should still be visible after failed delete
      await expect(page.getByTestId('row-row-1')).toBeVisible()
    })
  })

  test.describe('Timeout Handling', () => {
    test.skip('shows timeout message for slow requests', async ({ page }) => {
      await setupTablePageMocks(page, {
        onOperation: async (opName, _variables, route) => {
          if (opName === 'RowListRows' || opName === 'RowListRows') {
            await new Promise((resolve) => setTimeout(resolve, 30000))
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(createRowsResponse([])),
            })
            return true
          }
          return false
        },
      })

      await page.goto(getTablePageUrl())

      // Should show loading indicator and eventually timeout message
    })
  })

  test.describe('Validation Errors', () => {
    test.skip('shows validation error for invalid data', async () => {
      // Client-side validation needs verification
    })
  })

  test.describe('Recovery', () => {
    test.skip('can retry after error by reloading', async ({ page }) => {
      // Skip: Mock state (requestCount) doesn't behave correctly across page reload
      let requestCount = 0

      await setupTablePageMocks(page, {
        onOperation: async (opName, _variables, route) => {
          if (opName === 'RowListRows' || opName === 'RowListRows') {
            requestCount++
            if (requestCount === 1) {
              await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ errors: [{ message: 'Server error' }] }),
              })
              return true
            }
            await route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(createRowsResponse(createSampleRows(3))),
            })
            return true
          }
          return false
        },
      })

      await page.goto(getTablePageUrl())

      // After reload, data should load successfully
      await page.reload()

      await expect(page.getByTestId('column-header-name')).toBeVisible()
      await expect(page.getByTestId('row-row-1')).toBeVisible()
    })
  })
})
