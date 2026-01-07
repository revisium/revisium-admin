import { UpdateRowCommand, UpdateRowCommandDeps } from '../UpdateRowCommand.ts'

const createMockDeps = (
  overrides: Partial<{
    touched: boolean
  }> = {},
): UpdateRowCommandDeps => {
  const { touched = false } = overrides

  return {
    mutationDataSource: {
      renameRow: jest.fn().mockResolvedValue({ row: { id: 'new-row' } }),
      updateRow: jest.fn().mockResolvedValue({ row: { id: 'test-row' } }),
      dispose: jest.fn(),
    } as never,
    rowListRefreshService: {
      refresh: jest.fn(),
    } as never,
    projectContext: {
      branch: {
        draft: { id: 'draft-1' },
        touched,
      },
      updateTouched: jest.fn(),
    } as never,
    tableId: 'test-table',
  }
}

const createMockStore = (
  overrides: Partial<{
    currentRowId: string
    originalRowId: string
    rootTouched: boolean
    data: unknown
  }> = {},
) => {
  const { currentRowId = 'test-row', rootTouched = false, data = { name: 'Test' } } = overrides

  return {
    name: {
      getPlainValue: jest.fn().mockReturnValue(currentRowId),
    },
    root: {
      getPlainValue: jest.fn().mockReturnValue(data),
      touched: rootTouched,
    },
  } as never
}

describe('UpdateRowCommand', () => {
  describe('execute', () => {
    describe('rename only', () => {
      it('should call renameRow when row id changed', async () => {
        const deps = createMockDeps()
        const store = createMockStore({ currentRowId: 'new-row' })
        const command = new UpdateRowCommand(deps)

        const result = await command.execute(store, 'original-row')

        expect(result).toBe(true)
        expect(deps.mutationDataSource.renameRow).toHaveBeenCalledWith({
          revisionId: 'draft-1',
          tableId: 'test-table',
          rowId: 'original-row',
          nextRowId: 'new-row',
        })
        expect(deps.mutationDataSource.updateRow).not.toHaveBeenCalled()
      })

      it('should return false when renameRow fails', async () => {
        const deps = createMockDeps()
        ;(deps.mutationDataSource.renameRow as jest.Mock).mockResolvedValue(null)
        const store = createMockStore({ currentRowId: 'new-row' })
        const command = new UpdateRowCommand(deps)

        const result = await command.execute(store, 'original-row')

        expect(result).toBe(false)
      })
    })

    describe('update only', () => {
      it('should call updateRow when data changed', async () => {
        const deps = createMockDeps()
        const store = createMockStore({ rootTouched: true, data: { name: 'Updated' } })
        const command = new UpdateRowCommand(deps)

        const result = await command.execute(store, 'test-row')

        expect(result).toBe(true)
        expect(deps.mutationDataSource.updateRow).toHaveBeenCalledWith({
          revisionId: 'draft-1',
          tableId: 'test-table',
          rowId: 'test-row',
          data: { name: 'Updated' },
        })
        expect(deps.mutationDataSource.renameRow).not.toHaveBeenCalled()
      })

      it('should return false when updateRow fails', async () => {
        const deps = createMockDeps()
        ;(deps.mutationDataSource.updateRow as jest.Mock).mockResolvedValue(null)
        const store = createMockStore({ rootTouched: true })
        const command = new UpdateRowCommand(deps)

        const result = await command.execute(store, 'test-row')

        expect(result).toBe(false)
      })
    })

    describe('rename and update', () => {
      it('should call both renameRow and updateRow', async () => {
        const deps = createMockDeps()
        const store = createMockStore({
          currentRowId: 'new-row',
          rootTouched: true,
          data: { name: 'Updated' },
        })
        const command = new UpdateRowCommand(deps)

        const result = await command.execute(store, 'original-row')

        expect(result).toBe(true)
        expect(deps.mutationDataSource.renameRow).toHaveBeenCalledWith({
          revisionId: 'draft-1',
          tableId: 'test-table',
          rowId: 'original-row',
          nextRowId: 'new-row',
        })
        expect(deps.mutationDataSource.updateRow).toHaveBeenCalledWith({
          revisionId: 'draft-1',
          tableId: 'test-table',
          rowId: 'new-row',
          data: { name: 'Updated' },
        })
      })

      it('should not call updateRow if renameRow fails', async () => {
        const deps = createMockDeps()
        ;(deps.mutationDataSource.renameRow as jest.Mock).mockResolvedValue(null)
        const store = createMockStore({
          currentRowId: 'new-row',
          rootTouched: true,
        })
        const command = new UpdateRowCommand(deps)

        await command.execute(store, 'original-row')

        expect(deps.mutationDataSource.updateRow).not.toHaveBeenCalled()
      })
    })

    describe('no changes', () => {
      it('should not call any mutation when no changes', async () => {
        const deps = createMockDeps()
        const store = createMockStore()
        const command = new UpdateRowCommand(deps)

        const result = await command.execute(store, 'test-row')

        expect(result).toBe(true)
        expect(deps.mutationDataSource.renameRow).not.toHaveBeenCalled()
        expect(deps.mutationDataSource.updateRow).not.toHaveBeenCalled()
      })

      it('should not refresh list when no changes', async () => {
        const deps = createMockDeps()
        const store = createMockStore()
        const command = new UpdateRowCommand(deps)

        await command.execute(store, 'test-row')

        expect(deps.rowListRefreshService.refresh).not.toHaveBeenCalled()
      })
    })

    describe('side effects', () => {
      it('should update touched state when changes made and branch not touched', async () => {
        const deps = createMockDeps({ touched: false })
        const store = createMockStore({ rootTouched: true })
        const command = new UpdateRowCommand(deps)

        await command.execute(store, 'test-row')

        expect(deps.projectContext.updateTouched).toHaveBeenCalledWith(true)
      })

      it('should not update touched state when branch already touched', async () => {
        const deps = createMockDeps({ touched: true })
        const store = createMockStore({ rootTouched: true })
        const command = new UpdateRowCommand(deps)

        await command.execute(store, 'test-row')

        expect(deps.projectContext.updateTouched).not.toHaveBeenCalled()
      })

      it('should refresh row list when changes made', async () => {
        const deps = createMockDeps()
        const store = createMockStore({ rootTouched: true })
        const command = new UpdateRowCommand(deps)

        await command.execute(store, 'test-row')

        expect(deps.rowListRefreshService.refresh).toHaveBeenCalled()
      })
    })

    describe('error handling', () => {
      it('should return false when exception thrown', async () => {
        const deps = createMockDeps()
        ;(deps.mutationDataSource.updateRow as jest.Mock).mockRejectedValue(new Error('Network error'))
        const store = createMockStore({ rootTouched: true })
        const command = new UpdateRowCommand(deps)

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
        const result = await command.execute(store, 'test-row')

        expect(result).toBe(false)
        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
      })
    })
  })
})
