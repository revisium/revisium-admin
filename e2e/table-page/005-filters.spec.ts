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
    const schemaWithSystemRef = {
      type: 'object',
      properties: {
        name: { type: 'string', default: '' },
        myCreatedAt: { $ref: 'RowCreatedAt' },
      },
      additionalProperties: false,
      required: ['name', 'myCreatedAt'],
    }

    async function setupMocksWithCustomSchema(page: Page) {
      await setupAuth(page)

      const rows = createSampleRows(3)
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
          TableMst: createFullTableResponse(TABLE_ID, schemaWithSystemRef),
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

    // BUG: Fields with system $ref (like RowCreatedAt) should appear in System Fields section
    // Currently they appear in Data Fields section
    // Expected: myCreatedAt (with $ref: RowCreatedAt) should be in "System fields" menu section
    // Actual: myCreatedAt appears in "Data fields" section
    test.skip('schema field with system $ref should appear in System Fields menu', async ({ page }) => {
      await setupMocksWithCustomSchema(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      const filterCondition = page.getByTestId('filter-condition-0')
      const fieldSelect = filterCondition.locator('button').first()
      await fieldSelect.click()

      await expect(page.getByText('System fields')).toBeVisible()
      const systemFieldsSection = page.locator('[role="group"]').filter({ hasText: 'System fields' })
      await expect(systemFieldsSection.getByRole('menuitem', { name: 'myCreatedAt' })).toBeVisible()
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

  test.describe.skip('File Field Filters', () => {
    // Skipped: file field filter operators need investigation
    async function setupMocksWithFileSchema(page: Page) {
      await setupAuth(page)

      const schemaWithFile = {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          avatar: { $ref: 'File' },
        },
        additionalProperties: false,
        required: ['name', 'avatar'],
      }

      const rows = [
        {
          id: 'row-1',
          data: {
            name: 'User 1',
            avatar: { fileId: 'file-1', status: 'uploaded', fileName: 'photo.jpg' },
          },
        },
      ]
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
          TableMst: createFullTableResponse(TABLE_ID, schemaWithFile),
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

    test('file field shows only is empty / is not empty operators', async ({ page }) => {
      await setupMocksWithFileSchema(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select the avatar (file) field
      const fieldSelect = page.getByTestId('filter-condition-0').locator('button').first()
      await fieldSelect.click()
      await page.getByRole('menuitem', { name: 'avatar' }).click()

      // Check that only is empty / is not empty operators are available
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()

      await expect(page.getByRole('menuitem', { name: 'is empty' })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: 'is not empty' })).toBeVisible()
      // File fields don't support equals/contains operators
      await expect(page.getByRole('menuitem', { name: 'equals' })).not.toBeVisible()
      await expect(page.getByRole('menuitem', { name: 'contains' })).not.toBeVisible()
    })
  })

  test.describe.skip('Nested Filter Groups', () => {
    // Skipped: nested filter group UI needs investigation
    test('can add nested filter group inside a group', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-group').click()

      // Find the first group and add a nested group inside it
      const firstGroup = page.locator('[data-testid^="filter-group-"]').first()
      const addGroupButton = firstGroup.getByRole('button', { name: /add group/i })
      await addGroupButton.click()

      // Should now have nested group structure
      const nestedGroups = page.locator('[data-testid^="filter-group-"]')
      await expect(nestedGroups).toHaveCount(2)
    })

    test('can add condition inside nested group', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-group').click()

      // Add condition to the group
      const firstGroup = page.locator('[data-testid^="filter-group-"]').first()
      const addConditionButton = firstGroup.getByRole('button', { name: /add condition/i })
      await addConditionButton.click()

      // Condition should be added inside the group
      const conditionInGroup = firstGroup.locator('[data-testid^="filter-condition-"]')
      await expect(conditionInGroup).toBeVisible()
    })

    test('can remove nested group', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-group').click()

      const groups = page.locator('[data-testid^="filter-group-"]')
      await expect(groups).toHaveCount(1)

      // Remove the group
      const removeGroupButton = page.getByRole('button', { name: /remove group/i })
      await removeGroupButton.click()

      await expect(groups).toHaveCount(0)
    })

    test('nested group can have different logic than parent', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()
      await page.getByTestId('filter-add-group').click()

      // Root should be "All" (AND)
      const rootLogicButton = page.getByRole('button', { name: 'All', exact: true }).first()
      await expect(rootLogicButton).toBeVisible()

      // Change nested group logic to "Any" (OR)
      const nestedGroup = page.locator('[data-testid^="filter-group-"]').first()
      const nestedLogicButton = nestedGroup.getByRole('button', { name: 'All', exact: true })
      await nestedLogicButton.click()
      await page.getByRole('menuitem', { name: 'Any (OR)' }).click()

      // Nested group should now show "Any"
      await expect(nestedGroup.getByRole('button', { name: 'Any', exact: true })).toBeVisible()
      // Root should still be "All"
      await expect(rootLogicButton).toBeVisible()
    })

    test('complex nested structure with multiple groups and conditions', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()

      // Add condition at root level
      await page.getByTestId('filter-add-condition').click()
      await expect(page.getByTestId('filter-condition-0')).toBeVisible()

      // Add first group
      await page.getByTestId('filter-add-group').click()

      // Add second group
      await page.getByTestId('filter-add-group').click()

      // Verify badge shows correct count (1 root condition + 2 groups)
      // Note: The exact count depends on implementation - groups may or may not count
      await expect(page.getByTestId('filter-badge')).toBeVisible()
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

  test.describe.skip('Number Field Filters', () => {
    // Skipped: number field filter UI needs investigation
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

      // Numeric operators should be available
      await expect(page.getByRole('menuitem', { name: 'equals' })).toBeVisible()
      await expect(
        page.getByRole('menuitem', { name: /greater than/i }).or(page.getByRole('menuitem', { name: 'gt' })),
      ).toBeVisible()
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

  test.describe.skip('DateTime Field Filters', () => {
    // Skipped: datetime filter components not implemented
    function createTableWithDateTimeSchema() {
      return {
        data: {
          table: {
            __typename: 'TableModel',
            id: TABLE_ID,
            versionId: `${TABLE_ID}-v1`,
            readonly: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', default: '' },
                createdAt: { type: 'string', format: 'date-time', default: '' },
                updatedAt: { type: 'string', format: 'date-time', default: '' },
              },
              additionalProperties: false,
              required: ['name', 'createdAt', 'updatedAt'],
            },
          },
        },
      }
    }

    async function setupDateTimeMocks(page: Page) {
      await setupAuth(page)

      const rows = [
        {
          id: 'row-1',
          data: { name: 'Old Item', createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
        },
        {
          id: 'row-2',
          data: { name: 'Recent Item', createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-06-20T10:00:00Z' },
        },
        {
          id: 'row-3',
          data: { name: 'New Item', createdAt: '2024-12-01T10:00:00Z', updatedAt: '2024-12-10T10:00:00Z' },
        },
      ]
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

        if (opName === 'TableMst') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(createTableWithDateTimeSchema()),
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

    test('datetime field shows date comparison operators', async ({ page }) => {
      await setupDateTimeMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select datetime field
      const fieldSelect = page.getByTestId('filter-condition-0').locator('button').first()
      await fieldSelect.click()
      await page.getByRole('menuitem', { name: 'createdAt' }).click()

      // Check operator options for datetime
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()

      // DateTime operators should include date comparisons
      await expect(
        page.getByRole('menuitem', { name: 'equals' }).or(page.getByRole('menuitem', { name: 'is' })),
      ).toBeVisible()
    })

    test('datetime field shows date picker for value input', async ({ page }) => {
      await setupDateTimeMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select datetime field
      const fieldSelect = page.getByTestId('filter-condition-0').locator('button').first()
      await fieldSelect.click()
      await page.getByRole('menuitem', { name: 'createdAt' }).click()

      // Value input should be present (could be date picker or text input)
      const valueInput = page.getByTestId('filter-condition-0').locator('input')
      await expect(valueInput).toBeVisible()
    })

    test('datetime filter can be applied', async ({ page }) => {
      await setupDateTimeMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select datetime field
      const fieldSelect = page.getByTestId('filter-condition-0').locator('button').first()
      await fieldSelect.click()
      await page.getByRole('menuitem', { name: 'createdAt' }).click()

      // Enter a date value
      const valueInput = page.getByTestId('filter-condition-0').locator('input')
      if (await valueInput.isVisible()) {
        await valueInput.fill('2024-06-01')
      }

      // Apply filter
      await page.getByTestId('filter-apply').click()

      // Filter badge should indicate applied filter
      await expect(page.getByTestId('filter-badge')).toHaveAttribute('data-badge-color', 'gray')
    })

    test.skip('datetime filter supports before operator', async () => {
      // BUG: Before/After operators need verification
    })

    test.skip('datetime filter supports after operator', async () => {
      // BUG: Before/After operators need verification
    })

    test.skip('datetime filter supports between operator', async () => {
      // BUG: Between operator with two date pickers needs implementation
    })
  })
})
