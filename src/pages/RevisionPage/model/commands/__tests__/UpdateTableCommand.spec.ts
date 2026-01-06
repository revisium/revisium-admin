import { UpdateTableCommand, UpdateTableCommandDeps } from '../UpdateTableCommand.ts'

interface MockStoreOptions {
  tableId?: string
  draftTableId?: string
  patches?: unknown[]
}

const createMockStore = (options: MockStoreOptions = {}) => ({
  tableId: options.tableId ?? 'table-1',
  draftTableId: options.draftTableId ?? 'table-1',
  getPatches: jest.fn().mockReturnValue(options.patches ?? []),
})

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
    branch: {
      draft: { id: 'draft-1' },
      touched: options.touched ?? false,
    },
    updateTouched: jest.fn(),
  },
})

describe('UpdateTableCommand', () => {
  describe('when no changes', () => {
    it('should return true without API calls', async () => {
      const { deps, mocks } = createMockDeps()
      const store = createMockStore({ tableId: 'users', draftTableId: 'users', patches: [] })
      const command = new UpdateTableCommand(deps)

      const result = await command.execute(store as never)

      expect(result).toBe(true)
      expect(mocks.mutationDataSource.renameTable).not.toHaveBeenCalled()
      expect(mocks.mutationDataSource.updateTable).not.toHaveBeenCalled()
    })

    it('should not refresh table list when no changes', async () => {
      const { deps, mocks } = createMockDeps()
      const store = createMockStore({ tableId: 'users', draftTableId: 'users', patches: [] })
      const command = new UpdateTableCommand(deps)

      await command.execute(store as never)

      expect(mocks.tableListRefreshService.refresh).not.toHaveBeenCalled()
    })
  })

  describe('when rename needed', () => {
    it('should call renameTable with correct params', async () => {
      const { deps, mocks } = createMockDeps()
      const store = createMockStore({ tableId: 'users', draftTableId: 'customers', patches: [] })
      const command = new UpdateTableCommand(deps)

      await command.execute(store as never)

      expect(mocks.mutationDataSource.renameTable).toHaveBeenCalledWith({
        revisionId: 'draft-1',
        tableId: 'users',
        nextTableId: 'customers',
      })
    })

    it('should return false if rename fails', async () => {
      const { deps } = createMockDeps({ renameResult: null })
      const store = createMockStore({ tableId: 'users', draftTableId: 'customers', patches: [] })
      const command = new UpdateTableCommand(deps)

      const result = await command.execute(store as never)

      expect(result).toBe(false)
    })

    it('should refresh table list after rename', async () => {
      const { deps, mocks } = createMockDeps()
      const store = createMockStore({ tableId: 'users', draftTableId: 'customers', patches: [] })
      const command = new UpdateTableCommand(deps)

      await command.execute(store as never)

      expect(mocks.tableListRefreshService.refresh).toHaveBeenCalled()
    })
  })

  describe('when patches exist', () => {
    it('should call updateTable with correct params', async () => {
      const patches = [{ op: 'add', path: '/properties/name', value: { type: 'string' } }]
      const { deps, mocks } = createMockDeps()
      const store = createMockStore({ tableId: 'users', draftTableId: 'users', patches })
      const command = new UpdateTableCommand(deps)

      await command.execute(store as never)

      expect(mocks.mutationDataSource.updateTable).toHaveBeenCalledWith({
        revisionId: 'draft-1',
        tableId: 'users',
        patches,
      })
    })

    it('should return false if update fails', async () => {
      const { deps } = createMockDeps({ updateResult: null })
      const store = createMockStore({
        tableId: 'users',
        draftTableId: 'users',
        patches: [{ op: 'add', path: '/x', value: {} }],
      })
      const command = new UpdateTableCommand(deps)

      const result = await command.execute(store as never)

      expect(result).toBe(false)
    })

    it('should refresh table list after update', async () => {
      const { deps, mocks } = createMockDeps()
      const store = createMockStore({
        tableId: 'users',
        draftTableId: 'users',
        patches: [{ op: 'add', path: '/x', value: {} }],
      })
      const command = new UpdateTableCommand(deps)

      await command.execute(store as never)

      expect(mocks.tableListRefreshService.refresh).toHaveBeenCalled()
    })
  })

  describe('when rename and patches', () => {
    it('should call both rename and update', async () => {
      const patches = [{ op: 'add', path: '/x', value: {} }]
      const { deps, mocks } = createMockDeps()
      const store = createMockStore({ tableId: 'users', draftTableId: 'customers', patches })
      const command = new UpdateTableCommand(deps)

      await command.execute(store as never)

      expect(mocks.mutationDataSource.renameTable).toHaveBeenCalled()
      expect(mocks.mutationDataSource.updateTable).toHaveBeenCalledWith({
        revisionId: 'draft-1',
        tableId: 'customers',
        patches,
      })
    })

    it('should not call update if rename fails', async () => {
      const { deps, mocks } = createMockDeps({ renameResult: null })
      const store = createMockStore({
        tableId: 'users',
        draftTableId: 'customers',
        patches: [{ op: 'add', path: '/x', value: {} }],
      })
      const command = new UpdateTableCommand(deps)

      await command.execute(store as never)

      expect(mocks.mutationDataSource.updateTable).not.toHaveBeenCalled()
    })
  })

  describe('touched state', () => {
    it('should update touched when branch is not touched', async () => {
      const { deps, mocks } = createMockDeps({ touched: false })
      const store = createMockStore({
        tableId: 'users',
        draftTableId: 'users',
        patches: [{ op: 'add', path: '/x', value: {} }],
      })
      const command = new UpdateTableCommand(deps)

      await command.execute(store as never)

      expect(mocks.projectContext.updateTouched).toHaveBeenCalledWith(true)
    })

    it('should not update touched when branch is already touched', async () => {
      const { deps, mocks } = createMockDeps({ touched: true })
      const store = createMockStore({
        tableId: 'users',
        draftTableId: 'users',
        patches: [{ op: 'add', path: '/x', value: {} }],
      })
      const command = new UpdateTableCommand(deps)

      await command.execute(store as never)

      expect(mocks.projectContext.updateTouched).not.toHaveBeenCalled()
    })

    it('should not update touched when no changes occur', async () => {
      const { deps, mocks } = createMockDeps({ touched: false })
      const store = createMockStore({ tableId: 'users', draftTableId: 'users', patches: [] })
      const command = new UpdateTableCommand(deps)

      await command.execute(store as never)

      expect(mocks.projectContext.updateTouched).not.toHaveBeenCalled()
    })

    it('should update touched when only rename occurs', async () => {
      const { deps, mocks } = createMockDeps({ touched: false })
      const store = createMockStore({ tableId: 'users', draftTableId: 'customers', patches: [] })
      const command = new UpdateTableCommand(deps)

      await command.execute(store as never)

      expect(mocks.projectContext.updateTouched).toHaveBeenCalledWith(true)
    })
  })

  describe('error handling', () => {
    it('should return false and not throw on error', async () => {
      const { deps, mocks } = createMockDeps()
      mocks.mutationDataSource.renameTable.mockRejectedValue(new Error('API error'))
      const store = createMockStore({ tableId: 'users', draftTableId: 'customers', patches: [] })
      const command = new UpdateTableCommand(deps)

      const result = await command.execute(store as never)

      expect(result).toBe(false)
    })
  })
})
