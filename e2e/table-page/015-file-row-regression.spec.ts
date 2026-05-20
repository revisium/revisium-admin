import { test, expect, Page } from '@playwright/test'
import { getTablePageUrl } from '../helpers/table-page-setup'
import { createRowFileRegressionFixture, createRowPageUploadMocks } from '../helpers/row-file-regression'

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

test.describe('Rows with file fields regression', () => {
  test('create row: root primitive/file/FK, arrays, objects, nested and mixed files can upload without reload', async ({
    page,
  }) => {
    const mocks = createRowPageUploadMocks()
    await mocks.setup(page)

    // Regression guard: upload must become available after save without page.reload()
    // or manually reopening the row; backend createRow response provides generated fileId.
    await page.goto(getTablePageUrl('draft', { tableId: mocks.tableId }))
    await page.getByRole('button', { name: 'New row' }).click()
    await page.getByTestId('row-id-input').fill('complex-row')
    await switchToJsonMode(page)
    await setJsonValue(page, mocks.draftData())

    await page.getByTestId('approve-create-row-button').click()

    await expect(page.getByTestId('avatar-upload-file')).toBeVisible()

    await page.getByTestId('avatar-file-input').setInputFiles({
      name: 'avatar.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('avatar file'),
    })

    await expect.poll(() => mocks.uploadRequests).toContain('file-avatar-created')
    await expect(page.getByTestId('avatar-open-file')).toBeVisible()
  })

  test('update row: existing row with object/file, arrays and mixed nested structure uploads nested file without reload', async ({
    page,
  }) => {
    const fixture = createRowFileRegressionFixture()
    const mocks = createRowPageUploadMocks({
      rowId: 'complex-row',
      initialRowData: fixture.savedData(),
    })
    await mocks.setup(page)

    await page.goto(`${getTablePageUrl('draft', { tableId: mocks.tableId })}/complex-row`)
    await switchToJsonMode(page)
    await setJsonValue(page, {
      ...mocks.savedData(),
      title: 'Updated asset row',
      ownerId: 'owner-2',
      tags: ['updated', 'files'],
      matrix: [['x'], ['y', 'z']],
      workflow: {
        steps: [
          {
            name: 'approved',
            evidence: {
              ...mocks.savedData().workflow.steps[0].evidence,
            },
          },
        ],
      },
    })

    await page.getByTestId('row-editor-approve-button').click()

    await expect.poll(() => mocks.updateRequests.length).toBe(1)
    expect(mocks.updateRequests[0]).toMatchObject({
      title: 'Updated asset row',
      ownerId: 'owner-2',
      tags: ['updated', 'files'],
      matrix: [['x'], ['y', 'z']],
      workflow: {
        steps: [
          {
            name: 'approved',
            evidence: {
              fileId: 'file-workflow-evidence-created',
            },
          },
        ],
      },
    })

    await switchToTreeMode(page)
    await page.getByTestId('workflow-steps-0-evidence-file-input').setInputFiles({
      name: 'evidence.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('evidence file'),
    })

    await expect.poll(() => mocks.uploadRequests).toContain('file-workflow-evidence-created')
    await expect(page.getByTestId('workflow-steps-0-evidence-open-file')).toBeVisible()
  })
})
