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
  SystemSchemaIds,
} from '../fixtures/full-fixtures'
import { setupAuth } from '../helpers/setup-auth'
import { setupTablePageMocks, getTablePageUrl } from '../helpers/table-page-setup'

const PROJECT_NAME = 'test-project'
const ORG_ID = 'testuser'
const TABLE_ID = 'users'

interface FilterConditionConfig {
  field: string
  fieldPath?: string[]
  fieldType?: string
  operator: string
  value: string | number | boolean
}

interface FilterGroupConfig {
  logic: 'and' | 'or'
  conditions: FilterConditionConfig[]
}

function createViewsResponse(options: { filters?: FilterGroupConfig } = {}) {
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
              columns: null,
              filters: options.filters || null,
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
      RowListRows: rowsResponse,
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

test.describe('Filter Operations', () => {
  test.describe('Add Filter', () => {
    test('can add first filter condition', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByTestId('filter-badge')).not.toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      await expect(page.getByTestId('filter-condition-0')).toBeVisible()
      await expect(page.getByTestId('filter-badge')).toBeVisible()
      await expect(page.getByTestId('filter-badge')).toHaveText('1')
    })

    test('can add multiple filter conditions', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      await expect(page.getByTestId('filter-condition-0')).toBeVisible()

      await page.getByTestId('filter-add-condition').click()

      await expect(page.getByTestId('filter-condition-1')).toBeVisible()
      await expect(page.getByTestId('filter-badge')).toHaveText('2')
    })

    test('can add filter group', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-group').click()

      await expect(page.getByText('Match')).toBeVisible()
      await expect(page.getByText('Remove group')).toBeVisible()
    })
  })

  test.describe('Remove Filter', () => {
    test('can remove filter condition', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      await expect(page.getByTestId('filter-badge')).toHaveText('1')
      await expect(page.getByTestId('filter-condition-0')).toBeVisible()

      const removeButton = page.getByTestId('filter-condition-0').getByRole('button', { name: /remove/i })
      await removeButton.click()

      await expect(page.getByTestId('filter-condition-0')).not.toBeVisible()
      await expect(page.getByTestId('filter-badge')).toHaveText('0')
    })

    test('clear all removes all filters', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()
      await page.getByTestId('filter-add-condition').click()

      await expect(page.getByTestId('filter-badge')).toHaveText('2')
      await expect(page.getByTestId('filter-badge')).toHaveAttribute('data-badge-color', 'orange')
      await expect(page.getByTestId('filter-condition-0')).toBeVisible()
      await expect(page.getByTestId('filter-condition-1')).toBeVisible()

      await page.getByTestId('filter-clear-all').click()

      await expect(page.getByTestId('filter-badge')).not.toBeVisible()
    })
  })

  test.describe('Change Filter Operator', () => {
    test('can change filter operator', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      const filterCondition = page.getByTestId('filter-condition-0')
      const operatorButton = filterCondition.locator('button').filter({ hasText: 'contains' })
      await expect(operatorButton).toBeVisible()

      await operatorButton.click()
      await page.getByRole('menuitem', { name: 'equals', exact: true }).click()

      await expect(filterCondition.locator('button').filter({ hasText: /^equals$/ })).toBeVisible()
    })
  })

  test.describe('Change Filter Field', () => {
    test('can change filter field', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      const filterCondition = page.getByTestId('filter-condition-0')
      const fieldSelect = filterCondition.locator('button').first()
      await fieldSelect.click()

      await page.getByRole('menuitem', { name: 'age' }).click()

      await expect(filterCondition.locator('button').first().getByText('age')).toBeVisible()
    })
  })

  test.describe('Change Filter Value', () => {
    test('can enter filter value', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      const filterCondition = page.getByTestId('filter-condition-0')
      const valueInput = filterCondition.locator('input')
      await valueInput.fill('test value')

      await expect(valueInput).toHaveValue('test value')
    })
  })

  test.describe('Apply Filter', () => {
    test('apply button applies pending filters', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      const filterCondition = page.getByTestId('filter-condition-0')
      const valueInput = filterCondition.locator('input')
      await valueInput.fill('test')

      await expect(page.getByTestId('filter-badge')).toHaveAttribute('data-badge-color', 'orange')

      await page.getByTestId('filter-apply').click()

      await expect(page.getByTestId('filter-badge')).toHaveAttribute('data-badge-color', 'gray')
    })

    test('apply button disabled when no pending changes', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          filters: {
            logic: 'and',
            conditions: [{ field: 'name', operator: 'contains', value: 'test' }],
          },
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()

      await expect(page.getByTestId('filter-apply')).toBeDisabled()
    })
  })

  test.describe('Filter Logic', () => {
    test('can change filter logic from AND to OR', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()
      await page.getByTestId('filter-add-condition').click()

      await expect(page.getByText('Where')).toBeVisible()

      const logicButton = page.getByRole('button', { name: 'All', exact: true })
      await expect(logicButton).toBeVisible()
      await logicButton.click()
      await page.getByRole('menuitem', { name: 'Any (OR)' }).click()

      await expect(page.getByRole('button', { name: 'Any', exact: true })).toBeVisible()
    })
  })

  test.describe('Saved Filters', () => {
    // BUG: Filter persistence is NOT implemented in the codebase
    // restoreViewFromSaved() only restores columns and sorts, not filters
    // FilterModel doesn't have a restoreFromView method
    // getCurrentViewSnapshot() only includes columns and sorts
    test.skip('saved filters are restored on page load', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          filters: {
            logic: 'and',
            conditions: [{ field: 'name', operator: 'contains', value: 'test' }],
          },
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByTestId('filter-badge')).toBeVisible()
      await expect(page.getByTestId('filter-badge')).toHaveText('1')
      await expect(page.getByTestId('filter-badge')).toHaveAttribute('data-badge-color', 'gray')
    })

    // BUG: Filter persistence is NOT implemented
    test.skip('multiple saved filters are restored', async ({ page }) => {
      await setupMocks(page, {
        viewsResponse: createViewsResponse({
          filters: {
            logic: 'and',
            conditions: [
              { field: 'name', operator: 'contains', value: 'test' },
              { field: 'age', operator: 'equals', value: 25 },
            ],
          },
        }),
      })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await expect(page.getByTestId('filter-badge')).toHaveText('2')

      await page.getByTestId('filter-button').click()
      await expect(page.getByTestId('filter-condition-0')).toBeVisible()
      await expect(page.getByTestId('filter-condition-1')).toBeVisible()
    })
  })

  test.describe('System Fields in Filter', () => {
    // Schema fields with $ref to system types (like RowCreatedAt) should appear in "Data fields"
    // section, not "System fields". System fields are row-level fields (createdAt, updatedAt)
    // that are NOT defined in the schema.
    test('schema field with system $ref appears in Data Fields (schema fields are data fields)', async ({ page }) => {
      const schemaWithSystemRef = {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          myCreatedAt: { $ref: SystemSchemaIds.RowCreatedAt },
        },
        additionalProperties: false,
        required: ['name', 'myCreatedAt'],
      }

      const rows = [
        { id: 'row-1', data: { name: 'User 1', myCreatedAt: '2024-01-01T00:00:00Z' } },
        { id: 'row-2', data: { name: 'User 2', myCreatedAt: '2024-01-02T00:00:00Z' } },
      ]

      await setupTablePageMocks(page, { schema: schemaWithSystemRef, rows })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      const filterCondition = page.getByTestId('filter-condition-0')
      const fieldSelect = filterCondition.locator('button').first()
      await fieldSelect.click()

      const dataFieldsSection = page.locator('[role="group"]').filter({ hasText: 'Data fields' })
      await expect(dataFieldsSection.getByRole('menuitem', { name: 'myCreatedAt' })).toBeVisible()
    })
  })

  test.describe('Filter from Column Header', () => {
    test('can add filter from column header menu', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('column-header-name').click()
      await page.getByRole('menuitem', { name: 'Add filter' }).click()

      await expect(page.getByText('Filter by name')).toBeVisible()
      const filterValue = page.locator('[role="dialog"]').locator('input')
      await filterValue.fill('test')

      await page.getByRole('button', { name: 'Add', exact: true }).click()

      await expect(page.getByTestId('filter-badge')).toBeVisible()
      await expect(page.getByTestId('filter-badge')).toHaveText('1')
      await expect(page.getByTestId('filter-badge')).toHaveAttribute('data-badge-color', 'gray')
    })
  })

  test.describe('File Field Filters', () => {
    const fileSchema = {
      type: 'object',
      properties: {
        name: { type: 'string', default: '' },
        avatar: { $ref: SystemSchemaIds.File },
      },
      additionalProperties: false,
      required: ['name', 'avatar'],
    }

    const createFileData = (fileName: string) => ({
      fileId: 'file-1',
      status: 'uploaded',
      fileName,
      url: '',
      hash: '',
      extension: 'jpg',
      mimeType: 'image/jpeg',
      size: 1024,
      width: 100,
      height: 100,
    })

    test('file field shows nested fields in filter dropdown', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'User 1', avatar: createFileData('photo.jpg') } }]

      await setupTablePageMocks(page, { rows, schema: fileSchema })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Open the field select dropdown
      const fieldSelect = page.getByTestId('filter-condition-0').locator('button').first()
      await fieldSelect.click()

      // File nested fields should be visible in the dropdown
      await expect(page.getByRole('menuitem', { name: 'avatar.fileName' })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: 'avatar.status' })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: 'avatar.fileId' })).toBeVisible()
    })

    test('can filter by file string field (fileName)', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'User 1', avatar: createFileData('photo.jpg') } }]

      await setupTablePageMocks(page, { rows, schema: fileSchema })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select the avatar.fileName field
      const fieldSelect = page.getByTestId('filter-condition-0').locator('button').first()
      await fieldSelect.click()
      await page.getByRole('menuitem', { name: 'avatar.fileName' }).click()

      // String operators should be available for fileName
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()

      await expect(page.getByRole('menuitem', { name: 'contains', exact: true })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: 'equals', exact: true })).toBeVisible()
    })

    test('can filter by file number field (size)', async ({ page }) => {
      const rows = [{ id: 'row-1', data: { name: 'User 1', avatar: createFileData('photo.jpg') } }]

      await setupTablePageMocks(page, { rows, schema: fileSchema })

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select the avatar.size field
      const fieldSelect = page.getByTestId('filter-condition-0').locator('button').first()
      await fieldSelect.click()
      await page.getByRole('menuitem', { name: 'avatar.size' }).click()

      // Number operators should be available for size (use symbols: =, !=, >, <, >=, <=)
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()

      await expect(page.getByRole('menuitem', { name: '=', exact: true })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: '>', exact: true })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: '<', exact: true })).toBeVisible()
    })
  })

  test.describe('Nested Filter Groups', () => {
    const getFilterGroups = (page: Page) =>
      page.locator(
        '[data-testid^="filter-group-"]:not([data-testid*="-add-"]):not([data-testid*="-remove-"]):not([data-testid*="-condition-"])',
      )

    test('can add filter group', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-group').click()

      // Group should be created
      await expect(getFilterGroups(page)).toHaveCount(1)
    })

    test('can add condition inside group', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-group').click()

      // Add condition to the group using add-condition button inside the group
      const group = getFilterGroups(page).first()
      await group.locator('[data-testid$="-add-condition"]').click()

      // Condition should be added inside the group
      const conditionInGroup = group.locator('button').first()
      await expect(conditionInGroup).toBeVisible()
    })

    test('can remove group', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-group').click()

      await expect(getFilterGroups(page)).toHaveCount(1)

      // Remove the group using remove button inside the group
      const group = getFilterGroups(page).first()
      await group.locator('[data-testid^="filter-remove-group-"]').click()

      await expect(getFilterGroups(page)).toHaveCount(0)
    })

    test('can add multiple groups', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()

      // Add first group
      await page.getByTestId('filter-add-group').click()
      await expect(getFilterGroups(page)).toHaveCount(1)

      // Add second group
      await page.getByTestId('filter-add-group').click()
      await expect(getFilterGroups(page)).toHaveCount(2)
    })

    test('group has logic selector', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-group').click()

      // Group should have logic selector (All/Any)
      const group = getFilterGroups(page).first()
      const logicButton = group.getByRole('button', { name: /all|any/i }).first()
      await expect(logicButton).toBeVisible()
    })
  })

  test.describe('Boolean Field Filters', () => {
    test('boolean field shows true/false value options', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select the active (boolean) field
      const fieldSelect = page.getByTestId('filter-condition-0').locator('button').first()
      await fieldSelect.click()
      await page.getByRole('menuitem', { name: 'active' }).click()

      // Check operator options for boolean
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()

      await expect(
        page.getByRole('menuitem', { name: 'is true' }).or(page.getByRole('menuitem', { name: 'equals' })),
      ).toBeVisible()
    })
  })

  test.describe('Number Field Filters', () => {
    test('number field shows numeric operators', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select the age (number) field
      const fieldSelect = page.getByTestId('filter-condition-0').locator('button').first()
      await fieldSelect.click()
      await page.getByRole('menuitem', { name: 'age' }).click()

      // Check operator options for number
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()

      // Numeric operators use symbols: =, !=, >, >=, <, <=
      await expect(page.getByRole('menuitem', { name: '=', exact: true })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: '>', exact: true })).toBeVisible()
    })

    test('number field accepts numeric input', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select the age field
      const fieldSelect = page.getByTestId('filter-condition-0').locator('button').first()
      await fieldSelect.click()
      await page.getByRole('menuitem', { name: 'age' }).click()

      // Enter numeric value
      const valueInput = page.getByTestId('filter-condition-0').locator('input')
      await valueInput.fill('25')

      await expect(valueInput).toHaveValue('25')
    })
  })

  test.describe('is empty / is not empty Operators', () => {
    test('string field supports is empty operator', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()

      await expect(page.getByRole('menuitem', { name: 'is empty' })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: 'is not empty' })).toBeVisible()
    })

    test('is empty operator hides value input', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select is empty operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'is empty' }).click()

      // Value input should be hidden for is empty operator
      const valueInput = page.getByTestId('filter-condition-0').locator('input')
      await expect(valueInput).not.toBeVisible()
    })
  })

  test.describe('Copy JSON', () => {
    test('copy json button not visible when no filters added', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()

      await expect(page.getByTestId('filter-copy-json')).not.toBeVisible()
    })

    test('copy json button visible immediately after adding filter (before apply)', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      const filterCondition = page.getByTestId('filter-condition-0')
      const valueInput = filterCondition.locator('input')
      await valueInput.fill('test')

      await expect(page.getByTestId('filter-copy-json')).toBeVisible()
    })

    test('clicking copy json button opens json popover', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      const filterCondition = page.getByTestId('filter-condition-0')
      const valueInput = filterCondition.locator('input')
      await valueInput.fill('test')

      await page.getByTestId('filter-copy-json').click()

      await expect(page.getByTestId('filter-copy-json-copy')).toBeVisible()
    })

    test('can copy filter json to clipboard before apply', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write'])
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      const filterCondition = page.getByTestId('filter-condition-0')
      const valueInput = filterCondition.locator('input')
      await valueInput.fill('test')

      await page.getByTestId('filter-copy-json').click()
      await page.getByTestId('filter-copy-json-copy').click()

      const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
      const parsedJson = JSON.parse(clipboardText)

      expect(parsedJson).toHaveProperty('data')
      expect(parsedJson.data).toHaveProperty('path')
      expect(parsedJson.data).toHaveProperty('string_contains', 'test')
    })

    test('copy json button hidden after removing all filters', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      const filterCondition = page.getByTestId('filter-condition-0')
      const valueInput = filterCondition.locator('input')
      await valueInput.fill('test')

      await expect(page.getByTestId('filter-copy-json')).toBeVisible()

      const removeButton = filterCondition.getByRole('button', { name: /remove/i })
      await removeButton.click()

      await expect(page.getByTestId('filter-copy-json')).not.toBeVisible()
    })
  })

  test.describe('Search Filter', () => {
    test('string field supports search operator', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select operator dropdown
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()

      await expect(page.getByRole('menuitem', { name: 'search', exact: true })).toBeVisible()
    })

    test('search operator shows language and type selectors', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select search operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'search', exact: true }).click()

      // Language and type selectors should be visible
      await expect(page.getByRole('button', { name: /Simple|Russian|English/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /Words|Exact phrase/i })).toBeVisible()
    })

    test('can change search language', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select search operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'search', exact: true }).click()

      // Open language dropdown and select Russian
      await page.getByRole('button', { name: /Simple/i }).click()
      await page.getByRole('menuitem', { name: 'Russian' }).click()

      // Russian should now be selected
      await expect(page.getByRole('button', { name: /Russian/i })).toBeVisible()
    })

    test('can change search type', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select search operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'search', exact: true }).click()

      // Open type dropdown and select phrase
      await page.getByRole('button', { name: /Words/i }).click()
      await page.getByRole('menuitem', { name: 'Exact phrase' }).click()

      // Phrase should now be selected
      await expect(page.getByRole('button', { name: /Exact phrase/i })).toBeVisible()
    })

    test('search filter can be applied', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select search operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'search', exact: true }).click()

      // Enter search value
      const valueInput = page.getByTestId('filter-condition-0').locator('input')
      await valueInput.fill('test search')

      // Apply filter
      await page.getByTestId('filter-apply').click()

      // Filter badge should indicate applied filter
      await expect(page.getByTestId('filter-badge')).toHaveAttribute('data-badge-color', 'gray')
    })

    test('search filter generates correct JSON', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write'])
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select search operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'search', exact: true }).click()

      // Select Russian language
      await page.getByRole('button', { name: /Simple/i }).click()
      await page.getByRole('menuitem', { name: 'Russian' }).click()

      // Enter search value
      const valueInput = page.getByTestId('filter-condition-0').locator('input')
      await valueInput.fill('форель')

      // Copy JSON
      await page.getByTestId('filter-copy-json').click()
      await page.getByTestId('filter-copy-json-copy').click()

      const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
      const parsedJson = JSON.parse(clipboardText)

      expect(parsedJson).toHaveProperty('data')
      expect(parsedJson.data).toHaveProperty('path')
      expect(parsedJson.data).toHaveProperty('search', 'форель')
      expect(parsedJson.data).toHaveProperty('searchLanguage', 'russian')
      expect(parsedJson.data).toHaveProperty('searchType', 'plain')
    })

    test('search filter with phrase type generates correct JSON', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write'])
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select search operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'search', exact: true }).click()

      // Select phrase type
      await page.getByRole('button', { name: /Words/i }).click()
      await page.getByRole('menuitem', { name: 'Exact phrase' }).click()

      // Enter search value
      const valueInput = page.getByTestId('filter-condition-0').locator('input')
      await valueInput.fill('hello world')

      // Copy JSON
      await page.getByTestId('filter-copy-json').click()
      await page.getByTestId('filter-copy-json-copy').click()

      const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
      const parsedJson = JSON.parse(clipboardText)

      expect(parsedJson.data).toHaveProperty('search', 'hello world')
      expect(parsedJson.data).toHaveProperty('searchType', 'phrase')
    })

    test('changing from search to other operator hides language/type selectors', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select search operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'search', exact: true }).click()

      // Language and type selectors should be visible
      await expect(page.getByRole('button', { name: /Simple|Russian|English/i })).toBeVisible()

      // Change to contains operator
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'contains', exact: true }).click()

      // Language selector should not be visible
      await expect(page.getByRole('button', { name: /Simple \(no stemming\)/i })).not.toBeVisible()
    })

    test('can add search filter from column header with language and type options', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Open column header menu
      await page.getByTestId('column-header-name').click()
      await page.getByRole('menuitem', { name: 'Add filter' }).click()

      // Select search operator
      const dialog = page.locator('[role="dialog"]')
      const operatorButton = dialog.locator('button').filter({ hasText: 'contains' })
      await operatorButton.click()
      await page.getByRole('menuitem', { name: 'search', exact: true }).click()

      // Language and type selectors should be visible
      await expect(dialog.getByRole('button', { name: /Simple/i })).toBeVisible()
      await expect(dialog.getByRole('button', { name: /Words/i })).toBeVisible()

      // Select Russian language
      await dialog.getByRole('button', { name: /Simple/i }).click()
      await page.getByRole('menuitem', { name: 'Russian' }).click()

      // Enter search value
      const filterValue = dialog.locator('input')
      await filterValue.fill('форель')

      // Add filter
      await page.getByRole('button', { name: 'Add', exact: true }).click()

      // Filter should be applied
      await expect(page.getByTestId('filter-badge')).toBeVisible()
      await expect(page.getByTestId('filter-badge')).toHaveText('1')
    })
  })

  test.describe('DateTime Field Filters', () => {
    // DateTime filters work with system fields (createdAt, updatedAt, publishedAt)
    test('system datetime field shows date comparison operators', async ({ page }) => {
      await setupTablePageMocks(page)

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select system createdAt field (exact match to avoid matching user-defined fields)
      const fieldSelect = page.getByTestId('filter-condition-0').locator('button').first()
      await fieldSelect.click()
      await page.getByRole('menuitem', { name: 'createdAt', exact: true }).click()

      // Check operator options for datetime
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()

      // DateTime operators: is, is not, before, after
      await expect(page.getByRole('menuitem', { name: 'is', exact: true })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: 'before', exact: true })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: 'after', exact: true })).toBeVisible()
    })

    test('datetime field shows input for value', async ({ page }) => {
      await setupTablePageMocks(page)

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select system createdAt field
      const fieldSelect = page.getByTestId('filter-condition-0').locator('button').first()
      await fieldSelect.click()
      await page.getByRole('menuitem', { name: 'createdAt', exact: true }).click()

      // Value input should be present
      const valueInput = page.getByTestId('filter-condition-0').locator('input')
      await expect(valueInput).toBeVisible()
    })

    test('datetime filter can be applied', async ({ page }) => {
      await setupTablePageMocks(page)

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select system createdAt field
      const fieldSelect = page.getByTestId('filter-condition-0').locator('button').first()
      await fieldSelect.click()
      await page.getByRole('menuitem', { name: 'createdAt', exact: true }).click()

      // Enter a datetime value (datetime-local format)
      const valueInput = page.getByTestId('filter-condition-0').locator('input')
      await valueInput.fill('2024-06-01T12:00')

      // Apply filter
      await page.getByTestId('filter-apply').click()

      // Filter badge should indicate applied filter
      await expect(page.getByTestId('filter-badge')).toHaveAttribute('data-badge-color', 'gray')
    })

    test('datetime filter supports before operator', async ({ page }) => {
      await setupTablePageMocks(page)

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select system createdAt field
      const fieldSelect = page.getByTestId('filter-condition-0').locator('button').first()
      await fieldSelect.click()
      await page.getByRole('menuitem', { name: 'createdAt', exact: true }).click()

      // Select before operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'before', exact: true }).click()

      // Value input should still be visible
      const valueInput = page.getByTestId('filter-condition-0').locator('input')
      await expect(valueInput).toBeVisible()
    })

    test('datetime filter supports after operator', async ({ page }) => {
      await setupTablePageMocks(page)

      await page.goto(getTablePageUrl())
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select system createdAt field
      const fieldSelect = page.getByTestId('filter-condition-0').locator('button').first()
      await fieldSelect.click()
      await page.getByRole('menuitem', { name: 'createdAt', exact: true }).click()

      // Select after operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'after', exact: true }).click()

      // Value input should still be visible
      const valueInput = page.getByTestId('filter-condition-0').locator('input')
      await expect(valueInput).toBeVisible()
    })
  })
})
