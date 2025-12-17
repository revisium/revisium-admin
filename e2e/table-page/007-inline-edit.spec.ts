import { test, expect } from '@playwright/test'
import { createSampleRows } from '../fixtures/full-fixtures'
import { setupTablePageMocks, getTablePageUrl, TEST_CONFIG } from '../helpers/table-page-setup'

const { orgId: ORG_ID, projectName: PROJECT_NAME, tableId: TABLE_ID } = TEST_CONFIG

test.describe('Inline Cell Editing', () => {
  test.describe('Cell Focus', () => {
    test('single click focuses cell', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.click()

      await expect(cell).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })

    test('clicking another cell moves focus', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
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
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      await expect(cell.locator('input, textarea')).toBeVisible()
    })

    test('can edit string cell value', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'Original', age: 25, active: true } }]
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      const input = cell.locator('input, textarea')
      await input.clear()
      await input.fill('Updated Value')

      await input.press('Enter')

      await expect(cell).toContainText('Updated Value')
    })

    test('Escape cancels editing without saving', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'Original', age: 25, active: true } }]
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      const input = cell.locator('input, textarea')
      await input.clear()
      await input.fill('Should Not Save')

      await input.press('Escape')

      await expect(cell).toContainText('Original')
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('arrow keys move focus between cells', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell1 = page.getByTestId('cell-row-1-name')
      await cell1.click()

      await page.keyboard.press('ArrowDown')

      const cell2 = page.getByTestId('cell-row-2-name')
      await expect(cell2).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })

    test('Tab moves to next cell', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const nameCell = page.getByTestId('cell-row-1-name')
      await nameCell.click()

      await page.keyboard.press('Tab')

      const ageCell = page.getByTestId('cell-row-1-age')
      await expect(ageCell).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })

    test('Enter in edit mode saves and moves down', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell1 = page.getByTestId('cell-row-1-name')
      await cell1.dblclick()

      const input = cell1.locator('input, textarea')
      await input.fill('New Value')
      await input.press('Enter')

      const cell2 = page.getByTestId('cell-row-2-name')
      await expect(cell2).toHaveCSS('outline-color', 'rgb(66, 153, 225)')
    })
  })

  test.describe('Number Cell Editing', () => {
    test('can edit number cell value', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'Test', age: 25, active: true } }]
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
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
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-active')
      await expect(cell).toContainText('true')

      await cell.dblclick()

      await page.getByText('false').click()

      await expect(cell).toContainText('false')
    })
  })

  test.describe('Readonly Cells', () => {
    test.skip('readonly cells cannot be edited', async () => {
      // This would test head revision which is readonly
      // Currently skipped as it requires different URL setup
    })
  })
})
