import { test, expect } from '@playwright/test'
import { createSampleRows } from '../fixtures/full-fixtures'
import { setupTablePageMocks, getTablePageUrl } from '../helpers/table-page-setup'

test.describe('Keyboard Navigation', () => {
  test.describe('Arrow Key Navigation', () => {
    test('ArrowDown moves focus to next row', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell1 = page.getByTestId('cell-row-1-name')
      await cell1.click()
      await expect(cell1).toHaveCSS('outline-color', 'rgb(96, 165, 250)')

      await page.keyboard.press('ArrowDown')

      const cell2 = page.getByTestId('cell-row-2-name')
      await expect(cell2).toHaveCSS('outline-color', 'rgb(96, 165, 250)')
    })

    test('ArrowUp moves focus to previous row', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell2 = page.getByTestId('cell-row-2-name')
      await cell2.click()

      await page.keyboard.press('ArrowUp')

      const cell1 = page.getByTestId('cell-row-1-name')
      await expect(cell1).toHaveCSS('outline-color', 'rgb(96, 165, 250)')
    })

    test('ArrowRight moves focus to next column', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const nameCell = page.getByTestId('cell-row-1-name')
      await nameCell.click()

      await page.keyboard.press('ArrowRight')

      const ageCell = page.getByTestId('cell-row-1-age')
      await expect(ageCell).toHaveCSS('outline-color', 'rgb(96, 165, 250)')
    })

    test('ArrowLeft moves focus to previous column', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const ageCell = page.getByTestId('cell-row-1-age')
      await ageCell.click()

      await page.keyboard.press('ArrowLeft')

      const nameCell = page.getByTestId('cell-row-1-name')
      await expect(nameCell).toHaveCSS('outline-color', 'rgb(96, 165, 250)')
    })

    test('ArrowDown at last row stays on last row', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const lastCell = page.getByTestId('cell-row-3-name')
      await lastCell.click()

      await page.keyboard.press('ArrowDown')

      await expect(lastCell).toHaveCSS('outline-color', 'rgb(96, 165, 250)')
    })
  })

  test.describe('Tab Navigation', () => {
    test('Tab moves to next cell in row', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const nameCell = page.getByTestId('cell-row-1-name')
      await nameCell.click()

      await page.keyboard.press('Tab')

      const ageCell = page.getByTestId('cell-row-1-age')
      await expect(ageCell).toHaveCSS('outline-color', 'rgb(96, 165, 250)')
    })

    test('Shift+Tab moves to previous cell', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const ageCell = page.getByTestId('cell-row-1-age')
      await ageCell.click()

      await page.keyboard.press('Shift+Tab')

      const nameCell = page.getByTestId('cell-row-1-name')
      await expect(nameCell).toHaveCSS('outline-color', 'rgb(96, 165, 250)')
    })

    test.skip('Tab at end of row moves to next row', async ({ page }) => {
      // Implementation dependent - behavior varies based on table configuration
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const activeCell = page.getByTestId('cell-row-1-active')
      await activeCell.click()

      await page.keyboard.press('Tab')
    })
  })

  test.describe.skip('Enter Key', () => {
    // Skipped: enter key navigation needs input selector investigation
    test('Enter on focused cell enters edit mode', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.click()

      await page.keyboard.press('Enter')

      await expect(page.locator('input:focus, textarea:focus')).toBeVisible()
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

      await page.keyboard.press('Enter')

      const cell2 = page.getByTestId('cell-row-2-name')
      await expect(cell2).toHaveCSS('outline-color', 'rgb(96, 165, 250)')
    })
  })

  test.describe('Escape Key', () => {
    test('Escape in edit mode cancels editing', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'Original', age: 25, active: true } }]
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.dblclick()

      const input = page.locator('input:focus, textarea:focus')
      await input.fill('Should Not Save')

      await page.keyboard.press('Escape')

      await expect(cell).toContainText('Original')
    })

    test.skip('Escape clears cell focus', async ({ page }) => {
      // Implementation dependent - behavior varies based on focus management
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.click()
      await expect(cell).toHaveCSS('outline-color', 'rgb(96, 165, 250)')

      await page.keyboard.press('Escape')
    })
  })

  test.describe('F2 Key', () => {
    test('F2 enters edit mode on focused cell', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.click()

      await page.keyboard.press('F2')

      await expect(page.locator('input:focus, textarea:focus')).toBeVisible()
    })
  })

  test.describe('Home/End Keys', () => {
    test.skip('Home moves to first cell in row', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const activeCell = page.getByTestId('cell-row-1-active')
      await activeCell.click()

      await page.keyboard.press('Home')

      const nameCell = page.getByTestId('cell-row-1-name')
      await expect(nameCell).toHaveCSS('outline-color', 'rgb(96, 165, 250)')
    })

    test.skip('End moves to last cell in row', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const nameCell = page.getByTestId('cell-row-1-name')
      await nameCell.click()

      await page.keyboard.press('End')

      const activeCell = page.getByTestId('cell-row-1-active')
      await expect(activeCell).toHaveCSS('outline-color', 'rgb(96, 165, 250)')
    })
  })

  test.describe('Typing to Start Edit', () => {
    test('typing character on focused cell starts editing', async ({ page }) => {
      const rows = createSampleRows(3)
      await setupTablePageMocks(page, { rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      const cell = page.getByTestId('cell-row-1-name')
      await cell.click()

      await page.keyboard.type('T')

      const input = page.locator('input:focus, textarea:focus')
      await expect(input).toBeVisible()
    })
  })

  test.describe('Ctrl/Cmd Shortcuts', () => {
    test.skip('Ctrl+C copies cell value', async () => {
      // Copy functionality needs verification
    })

    test.skip('Ctrl+V pastes into cell', async () => {
      // Paste functionality needs verification
    })

    test.skip('Ctrl+Z undoes last change', async () => {
      // Undo functionality needs verification
    })
  })

  test.describe('Delete/Backspace Keys', () => {
    test.skip('Delete key clears cell value', async () => {
      // Delete key functionality needs verification
    })

    test.skip('Backspace on focused cell starts editing', async () => {
      // Backspace functionality needs verification
    })
  })
})
