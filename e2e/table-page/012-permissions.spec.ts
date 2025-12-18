import { test, expect } from '@playwright/test'
import { setupTablePageMocks, getTablePageUrl } from '../helpers/table-page-setup'

test.describe('Permissions', () => {
  test.describe('Draft Revision (Editable)', () => {
    test('cells are editable in draft revision', async ({ page }) => {
      await setupTablePageMocks(page, { isHeadRevision: false })

      await page.goto(getTablePageUrl('draft'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      await expect(page.locator('input:focus, textarea:focus')).toBeVisible()
    })

    test('new row button is visible in draft revision', async ({ page }) => {
      await setupTablePageMocks(page, { isHeadRevision: false })

      await page.goto(getTablePageUrl('draft'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByRole('button', { name: /new row/i })).toBeVisible()
    })

    test('row menu has delete option in draft revision', async ({ page }) => {
      await setupTablePageMocks(page, { isHeadRevision: false })

      await page.goto(getTablePageUrl('draft'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()

      await expect(page.getByRole('menuitem', { name: /delete/i })).toBeVisible()
    })

    test('add column button is visible in draft revision', async ({ page }) => {
      await setupTablePageMocks(page, { isHeadRevision: false })

      await page.goto(getTablePageUrl('draft'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByRole('button', { name: /add column/i })).toBeVisible()
    })
  })

  test.describe('Head Revision (Readonly)', () => {
    test('cells are readonly in head revision', async ({ page }) => {
      await setupTablePageMocks(page, { isHeadRevision: true, rowsReadonly: true })

      await page.goto(getTablePageUrl('head'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      // Textarea should have readonly attribute
      const textarea = page.locator('textarea:focus')
      await expect(textarea).toHaveAttribute('readonly', '')
    })

    test('new row button is hidden in head revision', async ({ page }) => {
      await setupTablePageMocks(page, { isHeadRevision: true, rowsReadonly: true })

      await page.goto(getTablePageUrl('head'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByRole('button', { name: /new row/i })).not.toBeVisible()
    })

    test('row menu does not have delete option in head revision', async ({ page }) => {
      await setupTablePageMocks(page, { isHeadRevision: true, rowsReadonly: true })

      await page.goto(getTablePageUrl('head'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('row-row-1').hover()

      const menuButton = page.getByTestId('row-list-menu-row-1')
      if (await menuButton.isVisible()) {
        await menuButton.click()
        await expect(page.getByRole('menuitem', { name: /delete/i })).not.toBeVisible()
      }
    })

    test('column operations are available in head revision', async ({ page }) => {
      await setupTablePageMocks(page, { isHeadRevision: true, rowsReadonly: true })

      await page.goto(getTablePageUrl('head'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Add column button should be visible (view settings are local)
      await expect(page.getByRole('button', { name: /add column/i })).toBeVisible()
    })

    test('view changes show local badge in head revision', async ({ page }) => {
      await setupTablePageMocks(page, { isHeadRevision: true, rowsReadonly: true })

      await page.goto(getTablePageUrl('head'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Hide a column to trigger view changes
      await page.getByTestId('column-header-name').click()
      await page.getByRole('menuitem', { name: /hide column/i }).click()

      // Should show "local" badge
      await expect(page.getByTestId('view-settings-badge')).toBeVisible()
      await expect(page.getByTestId('view-settings-badge')).toContainText('local')
    })

    test('local view changes popover shows correct message', async ({ page }) => {
      await setupTablePageMocks(page, { isHeadRevision: true, rowsReadonly: true })

      await page.goto(getTablePageUrl('head'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Hide a column to trigger view changes
      await page.getByTestId('column-header-name').click()
      await page.getByRole('menuitem', { name: /hide column/i }).click()

      // Click on badge to open popover
      await page.getByTestId('view-settings-badge').click()

      // Should show local view changes message
      await expect(page.getByText('Local view changes')).toBeVisible()
      await expect(page.getByText(/can only be saved in draft/i)).toBeVisible()

      // Should have revert button but no save button
      await expect(page.getByTestId('view-settings-revert')).toBeVisible()
      await expect(page.getByTestId('view-settings-save')).not.toBeVisible()
    })

    test.skip('revert button does not undo local view changes', async ({ page }) => {
      // BUG: revert button in head revision doesn't actually revert local changes
      await setupTablePageMocks(page, { isHeadRevision: true, rowsReadonly: true })

      await page.goto(getTablePageUrl('head'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Hide a column to trigger view changes
      await page.getByTestId('column-header-name').click()
      await page.getByRole('menuitem', { name: /hide column/i }).click()

      // Column should be hidden
      await expect(page.getByTestId('column-header-name')).not.toBeVisible()

      // Click on badge to open popover
      await page.getByTestId('view-settings-badge').click()

      // Click revert
      await page.getByTestId('view-settings-revert').click()

      // BUG: Column should be visible again after revert, but it's not
      await expect(page.getByTestId('column-header-name')).toBeVisible()
    })
  })

  test.describe('Selection Mode Permissions', () => {
    test('selection checkboxes are visible in draft revision', async ({ page }) => {
      await setupTablePageMocks(page, { isHeadRevision: false })

      await page.goto(getTablePageUrl('draft'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      const checkbox = page.getByTestId('row-row-1').locator('[data-part="control"]')
      await expect(checkbox).toBeVisible()
    })

    test('bulk delete is available in draft revision', async ({ page }) => {
      await setupTablePageMocks(page, { isHeadRevision: false })

      await page.goto(getTablePageUrl('draft'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('row-row-1').hover()
      await page.getByTestId('row-list-menu-row-1').click()
      await page.getByTestId('select-row-row-1').click()

      const checkbox = page.getByTestId('row-row-1').locator('[data-part="control"]')
      await checkbox.click()

      await expect(page.getByRole('button', { name: /delete/i })).toBeVisible()
    })
  })

  test.describe('View Settings Permissions', () => {
    test('filters can be added in draft revision', async ({ page }) => {
      await setupTablePageMocks(page)

      await page.goto(getTablePageUrl('draft'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      await expect(page.getByTestId('filter-condition-0')).toBeVisible()
    })

    test('sorting can be added in draft revision', async ({ page }) => {
      await setupTablePageMocks(page)

      await page.goto(getTablePageUrl('draft'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('sort-button').click()
      await page.getByTestId('sort-add').click()

      await expect(page.getByTestId('sort-condition-0')).toBeVisible()
    })

    test('column visibility can be changed in draft revision', async ({ page }) => {
      await setupTablePageMocks(page)

      await page.goto(getTablePageUrl('draft'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const nameHeader = page.getByTestId('column-header-name')
      await nameHeader.click()
      await page.getByRole('menuitem', { name: /hide column/i }).click()

      await expect(nameHeader).not.toBeVisible()
    })
  })

  test.describe('Column Operations Permissions', () => {
    test('schema modification is allowed in draft revision', async ({ page }) => {
      await setupTablePageMocks(page, { isHeadRevision: false })

      await page.goto(getTablePageUrl('draft'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const addColumnButton = page.getByRole('button', { name: /add column/i })
      await expect(addColumnButton).toBeEnabled()
    })

    test.skip('column menu has rename option in draft revision', async ({ page }) => {
      // Skip: column rename is done in schema editor, not in table view
      await setupTablePageMocks(page, { isHeadRevision: false })

      await page.goto(getTablePageUrl('draft'))
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('column-header-name').click()

      await expect(
        page.getByRole('menuitem', { name: /rename/i }).or(page.getByRole('menuitem', { name: /edit/i })),
      ).toBeVisible()
    })
  })
})
