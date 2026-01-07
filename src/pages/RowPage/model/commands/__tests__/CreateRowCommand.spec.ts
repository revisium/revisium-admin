import { CreateRowCommand, CreateRowCommandDeps } from '../CreateRowCommand.ts'

const createMockDeps = (
  overrides: Partial<{
    touched: boolean
  }> = {},
): CreateRowCommandDeps => {
  const { touched = false } = overrides

  return {
    mutationDataSource: {
      createRow: jest.fn().mockResolvedValue({ row: { id: 'new-row' } }),
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

describe('CreateRowCommand', () => {
  describe('execute', () => {
    it('should call createRow with correct parameters', async () => {
      const deps = createMockDeps()
      const command = new CreateRowCommand(deps)
      const data = { name: 'Test Row' }

      const result = await command.execute('new-row', data)

      expect(result).toBe(true)
      expect(deps.mutationDataSource.createRow).toHaveBeenCalledWith({
        revisionId: 'draft-1',
        tableId: 'test-table',
        rowId: 'new-row',
        data,
      })
    })

    it('should return false when createRow returns null', async () => {
      const deps = createMockDeps()
      ;(deps.mutationDataSource.createRow as jest.Mock).mockResolvedValue(null)
      const command = new CreateRowCommand(deps)

      const result = await command.execute('new-row', { name: 'Test' })

      expect(result).toBe(false)
    })

    describe('side effects', () => {
      it('should update touched state when branch not touched', async () => {
        const deps = createMockDeps({ touched: false })
        const command = new CreateRowCommand(deps)

        await command.execute('new-row', { name: 'Test' })

        expect(deps.projectContext.updateTouched).toHaveBeenCalledWith(true)
      })

      it('should not update touched state when branch already touched', async () => {
        const deps = createMockDeps({ touched: true })
        const command = new CreateRowCommand(deps)

        await command.execute('new-row', { name: 'Test' })

        expect(deps.projectContext.updateTouched).not.toHaveBeenCalled()
      })

      it('should refresh row list on success', async () => {
        const deps = createMockDeps()
        const command = new CreateRowCommand(deps)

        await command.execute('new-row', { name: 'Test' })

        expect(deps.rowListRefreshService.refresh).toHaveBeenCalled()
      })

      it('should not refresh row list on failure', async () => {
        const deps = createMockDeps()
        ;(deps.mutationDataSource.createRow as jest.Mock).mockResolvedValue(null)
        const command = new CreateRowCommand(deps)

        await command.execute('new-row', { name: 'Test' })

        expect(deps.rowListRefreshService.refresh).not.toHaveBeenCalled()
      })

      it('should not update touched on failure', async () => {
        const deps = createMockDeps()
        ;(deps.mutationDataSource.createRow as jest.Mock).mockResolvedValue(null)
        const command = new CreateRowCommand(deps)

        await command.execute('new-row', { name: 'Test' })

        expect(deps.projectContext.updateTouched).not.toHaveBeenCalled()
      })
    })

    describe('error handling', () => {
      it('should return false when exception thrown', async () => {
        const deps = createMockDeps()
        ;(deps.mutationDataSource.createRow as jest.Mock).mockRejectedValue(new Error('Network error'))
        const command = new CreateRowCommand(deps)

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
        const result = await command.execute('new-row', { name: 'Test' })

        expect(result).toBe(false)
        expect(consoleSpy).toHaveBeenCalled()
        consoleSpy.mockRestore()
      })
    })
  })
})
