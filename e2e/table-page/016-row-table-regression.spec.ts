import { expect, Page, test } from '@playwright/test'
import {
  createRowTableRegressionMocks,
  getRegressionRevisionUrl,
  getRegressionTableUrl,
  RegressionSchemaCase,
  rootRequiredFkCase,
  rowSchemaCases,
} from '../helpers/row-table-regression'

async function switchToJsonMode(page: Page) {
  await page.getByTestId('view-mode-switcher').click()
  await page.getByTestId('row-editor-mode-json').click()
}

async function switchToTreeMode(page: Page) {
  await page.getByTestId('view-mode-switcher').click()
  await page.getByTestId('row-editor-mode-tree').click()
}

async function setJsonValue(page: Page, value: unknown) {
  const editor = page.locator('.cm-content').first()
  await editor.click()
  await page.keyboard.press('Control+A')
  await page.keyboard.press('Backspace')
  await page.keyboard.insertText(JSON.stringify(value, null, 2))
}

async function fillForeignKey(page: Page, fieldPathTestId: string, rowId: string) {
  await page.getByTestId(`${fieldPathTestId}-editor`).focus()
  await page.keyboard.press('Control+A')
  await page.keyboard.press('Backspace')
  await page.keyboard.insertText(rowId)
  await page.keyboard.press('Tab')
}

async function openCreateRow(page: Page, tableId: string, rowId: string) {
  await page.goto(getRegressionTableUrl(tableId))
  await page.getByRole('button', { name: 'New row' }).click()
  await page.getByTestId('row-id-input').fill(rowId)
}

async function createRowThroughJson(page: Page, schemaCase: RegressionSchemaCase, rowId: string) {
  await openCreateRow(page, schemaCase.tableId, rowId)
  await switchToJsonMode(page)
  await setJsonValue(page, schemaCase.createData)
  await expect(page.getByTestId('approve-create-row-button')).toBeEnabled()
  await page.getByTestId('approve-create-row-button').click()
}

async function openSchemaDesigner(page: Page, tableId: string) {
  await page.goto(getRegressionRevisionUrl())
  await page.getByTestId(`table-list-menu-${tableId}`).click({ force: true })
  await page.getByTestId(`edit-schema-button-${tableId}`).click()
  await expect(page.getByTestId('schema-editor-updating')).toBeVisible()
}

async function applySchemaChanges(page: Page) {
  await expect(page.getByTestId('schema-editor-approve-button')).toBeVisible()
  await page.getByTestId('schema-editor-approve-button').click()
  await page
    .getByRole('button', { name: /Apply Changes/ })
    .last()
    .click()
}

test.describe('Row/table regression matrix', () => {
  test.describe('required FK validation regression', () => {
    test('enables save after required root FK is selected on create without reload', async ({ page }) => {
      const schemaCase = rootRequiredFkCase()
      const mocks = createRowTableRegressionMocks({ schemaCase, rows: [] })
      await mocks.setup(page)

      // Regression guard: a required FK starts invalid, then must unlock Create as soon as the user selects a row.
      await openCreateRow(page, mocks.tableId, 'row-create-fk')
      await expect(page.getByTestId('approve-create-row-button')).toBeDisabled()

      await fillForeignKey(page, 'ownerId', 'owner-1')

      await expect(page.getByTestId('approve-create-row-button')).toBeEnabled()
      await page.getByTestId('approve-create-row-button').click()

      await expect.poll(() => mocks.createRequests).toHaveLength(1)
      expect(mocks.createRequests[0]).toMatchObject({
        rowId: 'row-create-fk',
        data: { ownerId: 'owner-1' },
      })
      await expect(page.getByTestId('ownerId-fk-navigate')).toBeVisible()
    })

    test('enables save after required root FK is selected on update without reload', async ({ page }) => {
      const schemaCase = rootRequiredFkCase()
      const mocks = createRowTableRegressionMocks({
        schemaCase,
        rows: [{ id: 'row-update-fk', data: { ownerId: 'owner-1' } }],
      })
      await mocks.setup(page)

      await page.goto(getRegressionTableUrl(mocks.tableId, 'row-update-fk'))
      await switchToJsonMode(page)
      await setJsonValue(page, { ownerId: '' })
      await switchToTreeMode(page)

      await expect(page.getByTestId('row-editor-approve-button')).toBeDisabled()

      await fillForeignKey(page, 'ownerId', 'owner-2')

      await expect(page.getByTestId('row-editor-approve-button')).toBeEnabled()
      await page.getByTestId('row-editor-approve-button').click()

      await expect.poll(() => mocks.updateRequests).toHaveLength(1)
      expect(mocks.updateRequests[0]).toMatchObject({
        rowId: 'row-update-fk',
        data: { ownerId: 'owner-2' },
      })
      await expect(page.getByTestId('ownerId-fk-navigate')).toBeVisible()
    })
  })

  test.describe('create row schema shape matrix', () => {
    for (const schemaCase of rowSchemaCases) {
      test(`creates row with ${schemaCase.name}`, async ({ page }) => {
        const mocks = createRowTableRegressionMocks({ schemaCase, rows: [] })
        await mocks.setup(page)

        await createRowThroughJson(page, schemaCase, `create-${schemaCase.tableId}`)

        await expect.poll(() => mocks.createRequests).toHaveLength(1)
        expect(mocks.createRequests[0]).toMatchObject({
          rowId: `create-${schemaCase.tableId}`,
          data: schemaCase.createData,
        })
      })
    }
  })

  test.describe('update row schema shape matrix', () => {
    for (const schemaCase of rowSchemaCases.filter((_, index) => index % 3 === 0)) {
      test(`updates row with ${schemaCase.name}`, async ({ page }) => {
        const rowId = `update-${schemaCase.tableId}`
        const mocks = createRowTableRegressionMocks({
          schemaCase,
          rows: [{ id: rowId, data: schemaCase.createData }],
        })
        await mocks.setup(page)

        await page.goto(getRegressionTableUrl(schemaCase.tableId, rowId))
        await switchToJsonMode(page)
        await setJsonValue(page, schemaCase.updateData)

        await expect(page.getByTestId('row-editor-approve-button')).toBeEnabled()
        await page.getByTestId('row-editor-approve-button').click()

        await expect.poll(() => mocks.updateRequests).toHaveLength(1)
        expect(mocks.updateRequests[0]).toMatchObject({
          rowId,
          data: schemaCase.updateData,
        })
      })
    }
  })

  test.describe('schema update row form rebuild regression', () => {
    test('rebuilds row form after adding required FK to schema and recalculates validation', async ({ page }) => {
      const schemaCase = rowSchemaCases.find(
        (item) => item.name === 'schema update: add required FK to existing table',
      )!
      const mocks = createRowTableRegressionMocks({ schemaCase, rows: [] })
      await mocks.setup(page)

      await openCreateRow(page, schemaCase.tableId, 'row-schema-update-fk')

      await expect(page.getByTestId('ownerId-editor')).toBeAttached()
      await expect(page.getByTestId('approve-create-row-button')).toBeDisabled()

      await fillForeignKey(page, 'ownerId', 'owner-1')

      await expect(page.getByTestId('approve-create-row-button')).toBeEnabled()
    })

    test('rebuilds row form after adding file/FK into nested object/array', async ({ page }) => {
      const schemaCase = rowSchemaCases.find(
        (item) => item.name === 'schema update: add file/FK into nested object/array',
      )!
      const mocks = createRowTableRegressionMocks({ schemaCase, rows: [] })
      await mocks.setup(page)

      await openCreateRow(page, schemaCase.tableId, 'row-schema-update-nested')
      await switchToJsonMode(page)
      await setJsonValue(page, schemaCase.createData)
      await switchToTreeMode(page)

      await expect(page.getByTestId('workflow-steps-0-ownerId-editor')).toBeVisible()
      await expect(page.getByTestId('workflow-steps-0-evidence')).toBeVisible()
      await expect(page.getByTestId('approve-create-row-button')).toBeEnabled()
    })
  })

  test.describe('table schema designer regression', () => {
    test('adds a file field to an existing table schema', async ({ page }) => {
      const schemaCase = rowSchemaCases.find((item) => item.name === 'root primitive required')!
      const mocks = createRowTableRegressionMocks({ schemaCase, rows: [] })
      await mocks.setup(page)

      await openSchemaDesigner(page, schemaCase.tableId)
      await page.getByTestId('root-create-field-button').click({ force: true })
      await page.getByTestId('root-1').fill('attachment')
      await page.getByTestId('root-1-select-type-button').click({ force: true })
      await page.getByTestId('root-1-menu-submenu-schemas-submenu').click()
      await page.getByTestId('root-1-menu-sub-File').click()

      await applySchemaChanges(page)

      await expect.poll(() => mocks.schemaUpdateRequests).toHaveLength(1)
      expect(JSON.stringify(mocks.schemaUpdateRequests[0])).toContain('attachment')
      expect(JSON.stringify(mocks.schemaUpdateRequests[0])).toContain('urn:jsonschema:io:revisium:file-schema:1.0.0')
    })

    test('adds a required FK field to an existing table schema', async ({ page }) => {
      const schemaCase = rowSchemaCases.find((item) => item.name === 'root primitive required')!
      const mocks = createRowTableRegressionMocks({ schemaCase, rows: [] })
      await mocks.setup(page)

      await openSchemaDesigner(page, schemaCase.tableId)
      await page.getByTestId('root-create-field-button').click({ force: true })
      await page.getByTestId('root-1').fill('ownerId')
      await page.getByTestId('root-1-select-type-button').click({ force: true })
      await page.getByTestId('root-1-menu-type-ForeignKeyString').click()
      await page.getByTestId('root-1-connect-foreign-key').click()
      await page.getByTestId('table-owners-select').click()

      await applySchemaChanges(page)

      await expect.poll(() => mocks.schemaUpdateRequests).toHaveLength(1)
      expect(JSON.stringify(mocks.schemaUpdateRequests[0])).toContain('ownerId')
      expect(JSON.stringify(mocks.schemaUpdateRequests[0])).toContain('owners')
    })

    test('adds object and array nested fields to an existing table schema', async ({ page }) => {
      const schemaCase = rowSchemaCases.find((item) => item.name === 'root primitive required')!
      const mocks = createRowTableRegressionMocks({ schemaCase, rows: [] })
      await mocks.setup(page)

      await openSchemaDesigner(page, schemaCase.tableId)

      await page.getByTestId('root-create-field-button').click({ force: true })
      await page.getByTestId('root-1').fill('profile')
      await page.getByTestId('root-1-select-type-button').click({ force: true })
      await page.getByTestId('root-1-menu-type-Object').click()
      await page.getByTestId('root-1-create-field-button').click({ force: true })
      await page.getByTestId('root-1-0').fill('notes')

      await page.getByTestId('root-create-field-button').click({ force: true })
      await page.getByTestId('root-2').fill('workflow')
      await page.getByTestId('root-2-select-type-button').click({ force: true })
      await page.getByTestId('root-2-menu-type-Array').click()
      await page.getByTestId('root-2-select-type-button').nth(1).click({ force: true })
      await page.getByTestId('root-2-menu-type-Object').click()
      await page.getByTestId('root-2-0-create-field-button').click({ force: true })
      await page.getByTestId('root-2-0-0').fill('stepName')

      await applySchemaChanges(page)

      await expect.poll(() => mocks.schemaUpdateRequests).toHaveLength(1)
      const schemaUpdate = JSON.stringify(mocks.schemaUpdateRequests[0])
      expect(schemaUpdate).toContain('profile')
      expect(schemaUpdate).toContain('notes')
      expect(schemaUpdate).toContain('workflow')
      expect(schemaUpdate).toContain('stepName')
    })
  })
})
