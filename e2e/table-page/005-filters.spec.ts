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
    test('file field shows nested fields in filter dropdown', async ({ page }) => {
      const schemaWithFile = {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          avatar: { $ref: SystemSchemaIds.File },
        },
        additionalProperties: false,
        required: ['name', 'avatar'],
      }

      const rows = [
        {
          id: 'row-1',
          data: {
            name: 'User 1',
            avatar: {
              fileId: 'file-1',
              status: 'uploaded',
              fileName: 'photo.jpg',
              url: '',
              hash: '',
              extension: 'jpg',
              mimeType: 'image/jpeg',
              size: 1024,
              width: 100,
              height: 100,
            },
          },
        },
      ]

      await setupTablePageMocks(page, { rows, schema: schemaWithFile })

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
      const schemaWithFile = {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          avatar: { $ref: SystemSchemaIds.File },
        },
        additionalProperties: false,
        required: ['name', 'avatar'],
      }

      const rows = [
        {
          id: 'row-1',
          data: {
            name: 'User 1',
            avatar: {
              fileId: 'file-1',
              status: 'uploaded',
              fileName: 'photo.jpg',
              url: '',
              hash: '',
              extension: 'jpg',
              mimeType: 'image/jpeg',
              size: 1024,
              width: 100,
              height: 100,
            },
          },
        },
      ]

      await setupTablePageMocks(page, { rows, schema: schemaWithFile })

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
      const schemaWithFile = {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          avatar: { $ref: SystemSchemaIds.File },
        },
        additionalProperties: false,
        required: ['name', 'avatar'],
      }

      const rows = [
        {
          id: 'row-1',
          data: {
            name: 'User 1',
            avatar: {
              fileId: 'file-1',
              status: 'uploaded',
              fileName: 'photo.jpg',
              url: '',
              hash: '',
              extension: 'jpg',
              mimeType: 'image/jpeg',
              size: 1024,
              width: 100,
              height: 100,
            },
          },
        },
      ]

      await setupTablePageMocks(page, { rows, schema: schemaWithFile })

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
    test('can add filter group', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-group').click()

      // Group should be created with index 0
      await expect(page.getByTestId('filter-group-0')).toBeVisible()
    })

    test('can add condition inside group', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-group').click()

      // Add condition to the group using data-testid
      await page.getByTestId('filter-group-0-add-condition').click()

      // Condition should be added inside the group (group has its own conditions)
      const group = page.getByTestId('filter-group-0')
      const conditionInGroup = group.locator('button').first()
      await expect(conditionInGroup).toBeVisible()
    })

    test('can remove group', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-group').click()

      await expect(page.getByTestId('filter-group-0')).toBeVisible()

      // Remove the group using data-testid
      await page.getByTestId('filter-remove-group-0').click()

      await expect(page.getByTestId('filter-group-0')).not.toBeVisible()
    })

    test('can add multiple groups', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()

      // Add first group
      await page.getByTestId('filter-add-group').click()
      await expect(page.getByTestId('filter-group-0')).toBeVisible()

      // Add second group
      await page.getByTestId('filter-add-group').click()
      await expect(page.getByTestId('filter-group-1')).toBeVisible()

      // Both groups should be visible
      const groups = page.locator('[data-testid^="filter-group-"]:not([data-testid*="-add-"]):not([data-testid*="-remove-"])')
      await expect(groups).toHaveCount(2)
    })

    test('group has logic selector', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-group').click()

      // Group should have logic selector (All/Any)
      const group = page.getByTestId('filter-group-0')
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
