import { SchemaEditorVM, type JsonObjectSchema } from '@revisium/schema-toolkit-ui'
import { UpdateTableCommand, UpdateTableCommandDeps } from '../UpdateTableCommand.ts'

interface MockDepsOptions {
  renameResult?: unknown
  updateResult?: unknown
  touched?: boolean
}

const createMockDeps = (
  options: MockDepsOptions = {},
): {
  deps: UpdateTableCommandDeps
  mocks: ReturnType<typeof createMocks>
} => {
  const mocks = createMocks(options)
  return {
    deps: {
      mutationDataSource: mocks.mutationDataSource as never,
      tableListRefreshService: mocks.tableListRefreshService as never,
      projectContext: mocks.projectContext as never,
    },
    mocks,
  }
}

const createMocks = (options: MockDepsOptions = {}) => ({
  mutationDataSource: {
    renameTable: jest.fn().mockResolvedValue('renameResult' in options ? options.renameResult : { id: 'table-1' }),
    updateTable: jest.fn().mockResolvedValue('updateResult' in options ? options.updateResult : { id: 'table-1' }),
  },
  tableListRefreshService: {
    refresh: jest.fn(),
  },
  projectContext: {
    revisionId: 'draft-1',
    touched: options.touched ?? false,
    updateTouched: jest.fn(),
  },
})

const createSchema = (properties: Record<string, unknown> = {}): JsonObjectSchema => ({
  type: 'object',
  properties: properties as Record<string, JsonObjectSchema>,
  additionalProperties: false,
  required: Object.keys(properties),
})

const createViewModel = (tableId: string, schema: JsonObjectSchema = createSchema()): SchemaEditorVM => {
  const viewModel = new SchemaEditorVM(schema, { tableId, mode: 'updating' })
  viewModel.markAsSaved()
  return viewModel
}

const addStringField = (viewModel: SchemaEditorVM, fieldName: string): void => {
  const rootId = viewModel.engine.root().id()
  viewModel.engine.addChild(rootId, fieldName)
}

describe('UpdateTableCommand', () => {
  describe('when no changes', () => {
    it('should return true without API calls', async () => {
      const { deps, mocks } = createMockDeps()
      const viewModel = createViewModel('users')
      const command = new UpdateTableCommand(deps)

      const result = await command.execute(viewModel)

      expect(result).toBe(true)
      expect(mocks.mutationDataSource.renameTable).not.toHaveBeenCalled()
      expect(mocks.mutationDataSource.updateTable).not.toHaveBeenCalled()
    })

    it('should not refresh table list when no changes', async () => {
      const { deps, mocks } = createMockDeps()
      const viewModel = createViewModel('users')
      const command = new UpdateTableCommand(deps)

      await command.execute(viewModel)

      expect(mocks.tableListRefreshService.refresh).not.toHaveBeenCalled()
    })
  })

  describe('when rename needed', () => {
    it('should call renameTable with correct params', async () => {
      const { deps, mocks } = createMockDeps()
      const viewModel = createViewModel('users')
      viewModel.setTableId('customers')

      const command = new UpdateTableCommand(deps)

      await command.execute(viewModel)

      expect(mocks.mutationDataSource.renameTable).toHaveBeenCalledWith({
        revisionId: 'draft-1',
        tableId: 'users',
        nextTableId: 'customers',
      })
    })

    it('should return false if rename fails', async () => {
      const { deps } = createMockDeps({ renameResult: null })
      const viewModel = createViewModel('users')
      viewModel.setTableId('customers')

      const command = new UpdateTableCommand(deps)

      const result = await command.execute(viewModel)

      expect(result).toBe(false)
    })

    it('should refresh table list after rename', async () => {
      const { deps, mocks } = createMockDeps()
      const viewModel = createViewModel('users')
      viewModel.setTableId('customers')

      const command = new UpdateTableCommand(deps)

      await command.execute(viewModel)

      expect(mocks.tableListRefreshService.refresh).toHaveBeenCalled()
    })
  })

  describe('when schema changes exist', () => {
    it('should call updateTable when field added', async () => {
      const { deps, mocks } = createMockDeps()
      const viewModel = createViewModel('users')

      addStringField(viewModel, 'field1')

      const command = new UpdateTableCommand(deps)

      await command.execute(viewModel)

      expect(mocks.mutationDataSource.updateTable).toHaveBeenCalled()
      const callArgs = mocks.mutationDataSource.updateTable.mock.calls[0][0]
      expect(callArgs.revisionId).toBe('draft-1')
      expect(callArgs.tableId).toBe('users')
      expect(callArgs.patches.length).toBeGreaterThan(0)
    })

    it('should return false if update fails', async () => {
      const { deps } = createMockDeps({ updateResult: null })
      const viewModel = createViewModel('users')
      addStringField(viewModel, 'field1')

      const command = new UpdateTableCommand(deps)

      const result = await command.execute(viewModel)

      expect(result).toBe(false)
    })

    it('should refresh table list after update', async () => {
      const { deps, mocks } = createMockDeps()
      const viewModel = createViewModel('users')
      addStringField(viewModel, 'field1')

      const command = new UpdateTableCommand(deps)

      await command.execute(viewModel)

      expect(mocks.tableListRefreshService.refresh).toHaveBeenCalled()
    })
  })

  describe('when rename and schema changes', () => {
    it('should call both rename and update', async () => {
      const { deps, mocks } = createMockDeps()
      const viewModel = createViewModel('users')
      viewModel.setTableId('customers')
      addStringField(viewModel, 'field1')

      const command = new UpdateTableCommand(deps)

      await command.execute(viewModel)

      expect(mocks.mutationDataSource.renameTable).toHaveBeenCalled()
      expect(mocks.mutationDataSource.updateTable).toHaveBeenCalled()
      const callArgs = mocks.mutationDataSource.updateTable.mock.calls[0][0]
      expect(callArgs.tableId).toBe('customers')
    })

    it('should not call update if rename fails', async () => {
      const { deps, mocks } = createMockDeps({ renameResult: null })
      const viewModel = createViewModel('users')
      viewModel.setTableId('customers')
      addStringField(viewModel, 'field1')

      const command = new UpdateTableCommand(deps)

      await command.execute(viewModel)

      expect(mocks.mutationDataSource.updateTable).not.toHaveBeenCalled()
    })
  })

  describe('touched state', () => {
    it('should update touched when branch is not touched', async () => {
      const { deps, mocks } = createMockDeps({ touched: false })
      const viewModel = createViewModel('users')
      addStringField(viewModel, 'field1')

      const command = new UpdateTableCommand(deps)

      await command.execute(viewModel)

      expect(mocks.projectContext.updateTouched).toHaveBeenCalledWith(true)
    })

    it('should not update touched when branch is already touched', async () => {
      const { deps, mocks } = createMockDeps({ touched: true })
      const viewModel = createViewModel('users')
      addStringField(viewModel, 'field1')

      const command = new UpdateTableCommand(deps)

      await command.execute(viewModel)

      expect(mocks.projectContext.updateTouched).not.toHaveBeenCalled()
    })

    it('should not update touched when no changes occur', async () => {
      const { deps, mocks } = createMockDeps({ touched: false })
      const viewModel = createViewModel('users')
      const command = new UpdateTableCommand(deps)

      await command.execute(viewModel)

      expect(mocks.projectContext.updateTouched).not.toHaveBeenCalled()
    })

    it('should update touched when only rename occurs', async () => {
      const { deps, mocks } = createMockDeps({ touched: false })
      const viewModel = createViewModel('users')
      viewModel.setTableId('customers')

      const command = new UpdateTableCommand(deps)

      await command.execute(viewModel)

      expect(mocks.projectContext.updateTouched).toHaveBeenCalledWith(true)
    })
  })

  describe('error handling', () => {
    it('should return false and not throw on error', async () => {
      const { deps, mocks } = createMockDeps()
      mocks.mutationDataSource.renameTable.mockRejectedValue(new Error('API error'))
      const viewModel = createViewModel('users')
      viewModel.setTableId('customers')

      const command = new UpdateTableCommand(deps)

      const result = await command.execute(viewModel)

      expect(result).toBe(false)
    })
  })
})
