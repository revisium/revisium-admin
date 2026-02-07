import { CreatingEditorVM, JsonSchemaTypeName, type JsonObjectSchema } from '@revisium/schema-toolkit-ui'
import { CreateTableCommand, CreateTableCommandDeps } from '../CreateTableCommand.ts'

const createMockDeps = (
  overrides: Partial<{
    createTableResult: unknown
    touched: boolean
  }> = {},
): { deps: CreateTableCommandDeps; mocks: ReturnType<typeof createMocks> } => {
  const mocks = createMocks(overrides)
  return {
    deps: {
      mutationDataSource: mocks.mutationDataSource as never,
      tableListRefreshService: mocks.tableListRefreshService as never,
      projectContext: mocks.projectContext as never,
    },
    mocks,
  }
}

const createMocks = (
  overrides: Partial<{
    createTableResult: unknown
    touched: boolean
  }> = {},
) => ({
  mutationDataSource: {
    createTable: jest
      .fn()
      .mockResolvedValue('createTableResult' in overrides ? overrides.createTableResult : { id: 'table-1' }),
  },
  tableListRefreshService: {
    refresh: jest.fn(),
  },
  projectContext: {
    revisionId: 'draft-1',
    touched: overrides.touched ?? false,
    updateTouched: jest.fn(),
  },
})

const createSchema = (): JsonObjectSchema => ({
  type: JsonSchemaTypeName.Object,
  properties: {},
  additionalProperties: false,
  required: [],
})

const createViewModel = (tableId: string, schema: JsonObjectSchema = createSchema()): CreatingEditorVM => {
  return new CreatingEditorVM(schema, { tableId })
}

describe('CreateTableCommand', () => {
  describe('execute', () => {
    it('should create table with correct params', async () => {
      const { deps, mocks } = createMockDeps()
      const command = new CreateTableCommand(deps)

      const schema = createSchema()
      const viewModel = createViewModel('users', schema)

      await command.execute(viewModel)

      expect(mocks.mutationDataSource.createTable).toHaveBeenCalledWith({
        revisionId: 'draft-1',
        tableId: 'users',
        schema,
      })
    })

    it('should return true on success', async () => {
      const { deps } = createMockDeps()
      const command = new CreateTableCommand(deps)

      const viewModel = createViewModel('users')

      const result = await command.execute(viewModel)

      expect(result).toBe(true)
    })

    it('should update touched when branch is not touched', async () => {
      const { deps, mocks } = createMockDeps({ touched: false })
      const command = new CreateTableCommand(deps)

      const viewModel = createViewModel('users')

      await command.execute(viewModel)

      expect(mocks.projectContext.updateTouched).toHaveBeenCalledWith(true)
    })

    it('should not update touched when branch is already touched', async () => {
      const { deps, mocks } = createMockDeps({ touched: true })
      const command = new CreateTableCommand(deps)

      const viewModel = createViewModel('users')

      await command.execute(viewModel)

      expect(mocks.projectContext.updateTouched).not.toHaveBeenCalled()
    })

    it('should refresh table list on success', async () => {
      const { deps, mocks } = createMockDeps()
      const command = new CreateTableCommand(deps)

      const viewModel = createViewModel('users')

      await command.execute(viewModel)

      expect(mocks.tableListRefreshService.refresh).toHaveBeenCalled()
    })

    it('should return false when mutation returns null', async () => {
      const { deps, mocks } = createMockDeps({ createTableResult: null })
      const command = new CreateTableCommand(deps)

      const viewModel = createViewModel('users')

      const result = await command.execute(viewModel)

      expect(result).toBe(false)
      expect(mocks.projectContext.updateTouched).not.toHaveBeenCalled()
      expect(mocks.tableListRefreshService.refresh).not.toHaveBeenCalled()
    })

    it('should return false and not throw on error', async () => {
      const { deps, mocks } = createMockDeps()
      mocks.mutationDataSource.createTable.mockRejectedValue(new Error('API error'))
      const command = new CreateTableCommand(deps)

      const viewModel = createViewModel('users')

      const result = await command.execute(viewModel)

      expect(result).toBe(false)
    })
  })
})
