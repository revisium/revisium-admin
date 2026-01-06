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
    branch: {
      draft: { id: 'draft-1' },
      touched: overrides.touched ?? false,
    },
    updateTouched: jest.fn(),
  },
})

describe('CreateTableCommand', () => {
  describe('execute', () => {
    it('should create table with correct params', async () => {
      const { deps, mocks } = createMockDeps()
      const command = new CreateTableCommand(deps)

      const schema = { type: 'object', properties: {}, additionalProperties: false, required: [] }
      await command.execute('users', schema as never)

      expect(mocks.mutationDataSource.createTable).toHaveBeenCalledWith({
        revisionId: 'draft-1',
        tableId: 'users',
        schema,
      })
    })

    it('should return true on success', async () => {
      const { deps } = createMockDeps()
      const command = new CreateTableCommand(deps)

      const result = await command.execute('users', {} as never)

      expect(result).toBe(true)
    })

    it('should update touched when branch is not touched', async () => {
      const { deps, mocks } = createMockDeps({ touched: false })
      const command = new CreateTableCommand(deps)

      await command.execute('users', {} as never)

      expect(mocks.projectContext.updateTouched).toHaveBeenCalledWith(true)
    })

    it('should not update touched when branch is already touched', async () => {
      const { deps, mocks } = createMockDeps({ touched: true })
      const command = new CreateTableCommand(deps)

      await command.execute('users', {} as never)

      expect(mocks.projectContext.updateTouched).not.toHaveBeenCalled()
    })

    it('should refresh table list on success', async () => {
      const { deps, mocks } = createMockDeps()
      const command = new CreateTableCommand(deps)

      await command.execute('users', {} as never)

      expect(mocks.tableListRefreshService.refresh).toHaveBeenCalled()
    })

    it('should return false when mutation returns null', async () => {
      const { deps, mocks } = createMockDeps({ createTableResult: null })
      const command = new CreateTableCommand(deps)

      const result = await command.execute('users', {} as never)

      expect(result).toBe(false)
      expect(mocks.projectContext.updateTouched).not.toHaveBeenCalled()
      expect(mocks.tableListRefreshService.refresh).not.toHaveBeenCalled()
    })

    it('should return false and not throw on error', async () => {
      const { deps, mocks } = createMockDeps()
      mocks.mutationDataSource.createTable.mockRejectedValue(new Error('API error'))
      const command = new CreateTableCommand(deps)

      const result = await command.execute('users', {} as never)

      expect(result).toBe(false)
    })
  })
})
