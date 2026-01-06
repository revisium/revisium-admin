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

async function setupMocks(
  page: Page,
  options: {
    rows?: Array<{ id: string; data: Record<string, unknown> }>
    searchResults?: Array<{ id: string; data: Record<string, unknown> }>
  } = {},
) {
  await setupAuth(page)

  const rows = options.rows || createSampleRows(10)
  const searchResults = options.searchResults || []

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

    // Handle search in RowListRows query
    if (opName === 'RowListRows' || opName === 'RowListRows') {
      const where = body?.variables?.data?.where
      // Search uses: { OR: [{ id: { contains } }, { data: { search } }] }
      const searchTerm = where?.OR?.[0]?.id?.contains || where?.OR?.[1]?.data?.search
      if (searchTerm) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(createRowsResponse(searchResults)),
        })
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(createRowsResponse(rows)),
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

test.describe('Search Functionality', () => {
  test.describe('Search UI', () => {
    test('search icon expands to input on click', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Click search icon
      const searchButton = page.getByRole('button', { name: /search/i })
      await searchButton.click()

      // Input should be visible
      await expect(page.getByPlaceholder('Search...')).toBeVisible()
    })

    test('can type search query', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Expand search
      await page.getByRole('button', { name: /search/i }).click()

      // Type in search
      const searchInput = page.getByPlaceholder('Search...')
      await searchInput.fill('User 1')

      await expect(searchInput).toHaveValue('User 1')
    })

    test('clear button appears when search has value', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Expand search and type
      await page.getByRole('button', { name: /search/i }).click()
      const searchInput = page.getByPlaceholder('Search...')
      await searchInput.fill('test')

      // Clear button should appear
      await expect(page.locator('[aria-label="Close"]')).toBeVisible()
    })

    test('clear button clears search', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Expand search and type
      await page.getByRole('button', { name: /search/i }).click()
      const searchInput = page.getByPlaceholder('Search...')
      await searchInput.fill('test')

      // Click clear
      await page.locator('[aria-label="Close"]').click()

      // Input should be empty
      await expect(searchInput).toHaveValue('')
    })

    test('Escape key collapses empty search', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Expand search
      await page.getByRole('button', { name: /search/i }).click()
      const searchInput = page.getByPlaceholder('Search...')
      await expect(searchInput).toBeVisible()

      // Press Escape
      await searchInput.press('Escape')

      // Should collapse back to icon
      await expect(page.getByRole('button', { name: /search/i })).toBeVisible()
    })

    test('clicking outside empty search collapses it', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Expand search
      await page.getByRole('button', { name: /search/i }).click()
      const searchInput = page.getByPlaceholder('Search...')
      await expect(searchInput).toBeVisible()

      // Click outside (on the table)
      await page.getByTestId('column-header-name').click()

      // Should collapse back to icon
      await expect(page.getByRole('button', { name: /search/i })).toBeVisible()
    })

    test('search with value does not collapse on blur', async ({ page }) => {
      const rows = createSampleRows(5)
      const searchResults = [{ id: 'row-1', data: { name: 'User 1', age: 25, active: true } }]
      await setupMocks(page, { rows, searchResults })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Expand search and type
      await page.getByRole('button', { name: /search/i }).click()
      const searchInput = page.getByPlaceholder('Search...')
      await searchInput.fill('User 1')

      // Wait for search response
      await page.waitForResponse((resp) => resp.url().includes('graphql'))

      // Click outside
      await page.getByTestId('column-header-name').click()

      // Search should remain visible because it has a value
      await expect(searchInput).toBeVisible()
      await expect(searchInput).toHaveValue('User 1')
    })
  })

  test.describe('Search Results', () => {
    test('search filters displayed rows', async ({ page }) => {
      const rows = [
        { id: 'row-1', data: { name: 'Alice Smith', age: 25, active: true } },
        { id: 'row-2', data: { name: 'Bob Jones', age: 30, active: false } },
        { id: 'row-3', data: { name: 'Alice Brown', age: 28, active: true } },
      ]
      const searchResults = [
        { id: 'row-1', data: { name: 'Alice Smith', age: 25, active: true } },
        { id: 'row-3', data: { name: 'Alice Brown', age: 28, active: true } },
      ]
      await setupMocks(page, { rows, searchResults })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Verify all rows visible initially
      await expect(page.getByTestId('row-row-1')).toBeVisible()
      await expect(page.getByTestId('row-row-2')).toBeVisible()
      await expect(page.getByTestId('row-row-3')).toBeVisible()

      // Search for Alice
      await page.getByRole('button', { name: /search/i }).click()
      await page.getByPlaceholder('Search...').fill('Alice')

      // Wait for search response and row to disappear
      await expect(page.getByTestId('row-row-2')).not.toBeVisible()

      // Should show only Alice rows
      await expect(page.getByTestId('row-row-1')).toBeVisible()
      await expect(page.getByTestId('row-row-3')).toBeVisible()
    })

    test('empty search results shows message', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupMocks(page, { rows, searchResults: [] })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Search for something that doesn't exist
      await page.getByRole('button', { name: /search/i }).click()
      await page.getByPlaceholder('Search...').fill('nonexistent')

      // Should show no results message (waits for it to appear)
      await expect(page.getByText('No rows found')).toBeVisible()
    })

    test('clearing search restores all rows', async ({ page }) => {
      const rows = createSampleRows(5)
      await setupMocks(page, { rows, searchResults: [] })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Search
      await page.getByRole('button', { name: /search/i }).click()
      await page.getByPlaceholder('Search...').fill('test')

      // Wait for "No rows found" to appear (search returned empty)
      await expect(page.getByText(/no rows/i).or(page.getByText('0 rows'))).toBeVisible()

      // Clear search
      await page.locator('[aria-label="Close"]').click()

      // All rows should be back
      await expect(page.getByText('5 rows')).toBeVisible()
    })

    test('search shows X of Y rows count', async ({ page }) => {
      const rows = [
        { id: 'row-1', data: { name: 'Alice Smith', age: 25, active: true } },
        { id: 'row-2', data: { name: 'Bob Jones', age: 30, active: false } },
        { id: 'row-3', data: { name: 'Alice Brown', age: 28, active: true } },
        { id: 'row-4', data: { name: 'Charlie White', age: 35, active: true } },
        { id: 'row-5', data: { name: 'David Black', age: 40, active: false } },
      ]
      const searchResults = [
        { id: 'row-1', data: { name: 'Alice Smith', age: 25, active: true } },
        { id: 'row-3', data: { name: 'Alice Brown', age: 28, active: true } },
      ]
      await setupMocks(page, { rows, searchResults })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Initially shows total count
      await expect(page.getByText('5 rows')).toBeVisible()

      // Search for Alice
      await page.getByRole('button', { name: /search/i }).click()
      await page.getByPlaceholder('Search...').fill('Alice')

      // Should show "X of Y rows" format (waits for it to appear)
      await expect(page.getByText('2 of 5 rows')).toBeVisible()
    })
  })

  test.describe('Search with Filters', () => {
    test('search works together with filters', async ({ page }) => {
      const rows = createSampleRows(10)
      await setupMocks(page, { rows, searchResults: [] })

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Add a filter
      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Search
      await page.getByRole('button', { name: /search/i }).click()
      await page.getByPlaceholder('Search...').fill('test')

      // Both filter badge and search should be active
      await expect(page.getByTestId('filter-badge')).toBeVisible()
    })
  })

  test.describe('Search Type Options (via Filter)', () => {
    test('search filter shows all search type options including prefix and tsquery', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Open filter sidebar
      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select search operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'search', exact: true }).click()

      // Open search type dropdown (defaults to "plain — Words...")
      await page.getByRole('button', { name: /plain — Words/i }).click()

      // Should show all search type options including prefix and tsquery
      await expect(page.getByRole('menuitem', { name: /plain — Words/i })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: /phrase — Exact phrase/i })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: /prefix — Partial words/i })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: /tsquery — Raw/i })).toBeVisible()
    })

    test('can select prefix search type in filter', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Open filter sidebar
      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select search operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'search', exact: true }).click()

      // Open search type dropdown and select prefix
      await page.getByRole('button', { name: /plain — Words/i }).click()
      await page.getByRole('menuitem', { name: /prefix — Partial words/i }).click()

      // Should show prefix as selected
      await expect(page.getByRole('button', { name: /prefix — Partial words/i })).toBeVisible()
    })

    test('can select tsquery search type in filter', async ({ page }) => {
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Open filter sidebar
      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select search operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'search', exact: true }).click()

      // Open search type dropdown and select tsquery
      await page.getByRole('button', { name: /plain — Words/i }).click()
      await page.getByRole('menuitem', { name: /tsquery — Raw/i }).click()

      // Should show tsquery as selected
      await expect(page.getByRole('button', { name: /tsquery — Raw/i })).toBeVisible()
    })

    test('prefix search type generates correct JSON', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write'])
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Open filter sidebar
      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select search operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'search', exact: true }).click()

      // Select prefix type
      await page.getByRole('button', { name: /plain — Words/i }).click()
      await page.getByRole('menuitem', { name: /prefix — Partial words/i }).click()

      // Enter search value
      const valueInput = page.getByTestId('filter-condition-0').locator('input')
      await valueInput.fill('крев')

      // Copy JSON
      await page.getByTestId('filter-copy-json').click()
      await page.getByTestId('filter-copy-json-copy').click()

      const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
      const parsedJson = JSON.parse(clipboardText)

      expect(parsedJson.data).toHaveProperty('search', 'крев')
      expect(parsedJson.data).toHaveProperty('searchType', 'prefix')
    })

    test('tsquery search type generates correct JSON', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write'])
      await setupMocks(page)

      await page.goto(`/app/${ORG_ID}/${PROJECT_NAME}/master/draft/${TABLE_ID}`)
      await expect(page.getByTestId('column-header-name')).toBeVisible()

      // Open filter sidebar
      await page.getByTestId('filter-button').click()
      await page.getByTestId('filter-add-condition').click()

      // Select search operator
      const operatorSelect = page.getByTestId('filter-condition-0').locator('button').nth(1)
      await operatorSelect.click()
      await page.getByRole('menuitem', { name: 'search', exact: true }).click()

      // Select tsquery type
      await page.getByRole('button', { name: /plain — Words/i }).click()
      await page.getByRole('menuitem', { name: /tsquery — Raw/i }).click()

      // Enter search value (tsquery syntax)
      const valueInput = page.getByTestId('filter-condition-0').locator('input')
      await valueInput.fill('foo:* & bar')

      // Copy JSON
      await page.getByTestId('filter-copy-json').click()
      await page.getByTestId('filter-copy-json-copy').click()

      const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
      const parsedJson = JSON.parse(clipboardText)

      expect(parsedJson.data).toHaveProperty('search', 'foo:* & bar')
      expect(parsedJson.data).toHaveProperty('searchType', 'tsquery')
    })
  })
})
