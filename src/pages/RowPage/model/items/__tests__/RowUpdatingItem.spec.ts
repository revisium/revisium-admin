import { RowUpdatingItem } from '../RowUpdatingItem.ts'
import { RowStackItemType } from '../../../config/types.ts'
import { createMockUpdatingDeps, createMockRowEditorState, MockRowEditorState } from '../../__tests__/createMockDeps.ts'

describe('RowUpdatingItem', () => {
  describe('initialization', () => {
    it('should create with Updating type', () => {
      const deps = createMockUpdatingDeps()
      const state = createMockRowEditorState()
      const item = new RowUpdatingItem(deps, false, state as never, 'original-row')

      expect(item.type).toBe(RowStackItemType.Updating)
    })

    it('should use provided state', () => {
      const deps = createMockUpdatingDeps()
      const state = createMockRowEditorState()
      const item = new RowUpdatingItem(deps, false, state as never, 'original-row')

      expect(item.state).toBe(state)
    })

    it('should set originalRowId', () => {
      const deps = createMockUpdatingDeps()
      const state = createMockRowEditorState()
      const item = new RowUpdatingItem(deps, false, state as never, 'original-row')

      expect(item.originalRowId).toBe('original-row')
    })

    it('should set isSelectingForeignKey', () => {
      const deps = createMockUpdatingDeps()
      const state = createMockRowEditorState()

      const item1 = new RowUpdatingItem(deps, false, state as never, 'original-row')
      expect(item1.isSelectingForeignKey).toBe(false)

      const item2 = new RowUpdatingItem(deps, true, state as never, 'original-row')
      expect(item2.isSelectingForeignKey).toBe(true)
    })

    it('should have unique id', () => {
      const deps = createMockUpdatingDeps()
      const state = createMockRowEditorState()
      const item1 = new RowUpdatingItem(deps, false, state as never, 'original-row')
      const item2 = new RowUpdatingItem(deps, false, state as never, 'original-row')

      expect(item1.id).not.toEqual(item2.id)
    })
  })

  describe('approve', () => {
    it('should call updateRow when there are data changes', async () => {
      const deps = createMockUpdatingDeps()
      ;(deps.mutationDataSource.updateRow as jest.Mock).mockResolvedValue({ row: { id: 'test-row' } })

      const state = createMockRowEditorState()
      state.editor.isDirty = true
      state.editor.getValue.mockReturnValue({ name: 'Updated' })

      const item = new RowUpdatingItem(deps, false, state as never, 'test-row')

      await item.approve()

      expect(deps.mutationDataSource.updateRow).toHaveBeenCalled()
    })

    it('should call renameRow when row id changed', async () => {
      const deps = createMockUpdatingDeps()
      ;(deps.mutationDataSource.renameRow as jest.Mock).mockResolvedValue({ row: { id: 'new-row' } })

      const state = createMockRowEditorState()
      state.editor.rowId = 'new-row'
      state.editor.isRowIdChanged = true

      const item = new RowUpdatingItem(deps, false, state as never, 'original-row')

      await item.approve()

      expect(deps.mutationDataSource.renameRow).toHaveBeenCalled()
    })

    it('should not call any mutation when no changes', async () => {
      const deps = createMockUpdatingDeps()

      const state = createMockRowEditorState()
      const item = new RowUpdatingItem(deps, false, state as never, 'test-row')

      await item.approve()

      expect(deps.mutationDataSource.updateRow).not.toHaveBeenCalled()
      expect(deps.mutationDataSource.renameRow).not.toHaveBeenCalled()
    })

    it('should call editor.markAsSaved on success', async () => {
      const deps = createMockUpdatingDeps()
      ;(deps.mutationDataSource.updateRow as jest.Mock).mockResolvedValue({ row: { id: 'test-row' } })

      const state = createMockRowEditorState()
      state.editor.isDirty = true
      state.editor.getValue.mockReturnValue({ name: 'Updated' })

      const item = new RowUpdatingItem(deps, false, state as never, 'test-row')

      await item.approve()

      expect(state.editor.markAsSaved).toHaveBeenCalled()
    })
  })

  describe('dispose', () => {
    it('should dispose mutation data source', () => {
      const deps = createMockUpdatingDeps()
      const state = createMockRowEditorState()
      const item = new RowUpdatingItem(deps, false, state as never, 'original-row')

      item.dispose()

      expect(deps.mutationDataSource.dispose).toHaveBeenCalled()
    })
  })

  describe('computed properties', () => {
    it('should return correct isLoading state', async () => {
      const deps = createMockUpdatingDeps()
      ;(deps.mutationDataSource.updateRow as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ row: { id: 'test-row' } }), 10)),
      )

      const state = createMockRowEditorState()
      state.editor.isDirty = true
      state.editor.getValue.mockReturnValue({ name: 'Updated' })

      const item = new RowUpdatingItem(deps, false, state as never, 'test-row')

      expect(item.isLoading).toBe(false)

      const approvePromise = item.approve()
      expect(item.isLoading).toBe(true)

      await approvePromise
      expect(item.isLoading).toBe(false)
    })

    it('should return canUpdateRow based on permissions and revision', () => {
      const deps = createMockUpdatingDeps({ isDraftRevision: true })
      ;(deps.projectPermissions as { canUpdateRow: boolean }).canUpdateRow = true
      const state = createMockRowEditorState()
      const item = new RowUpdatingItem(deps, false, state as never, 'original-row')

      expect(item.canUpdateRow).toBe(true)
    })

    it('should return false for canUpdateRow when not draft revision', () => {
      const deps = createMockUpdatingDeps({ isDraftRevision: false })
      ;(deps.projectPermissions as { canUpdateRow: boolean }).canUpdateRow = true
      const state = createMockRowEditorState()
      const item = new RowUpdatingItem(deps, false, state as never, 'original-row')

      expect(item.canUpdateRow).toBe(false)
    })

    it('should return currentRowId from state', () => {
      const deps = createMockUpdatingDeps()
      const state: MockRowEditorState = createMockRowEditorState()
      state.editor.rowId = 'current-row-id'
      const item = new RowUpdatingItem(deps, false, state as never, 'original-row')

      expect(item.currentRowId).toBe('current-row-id')
    })
  })

  describe('methods', () => {
    it('should set row name', () => {
      const deps = createMockUpdatingDeps()
      const state: MockRowEditorState = createMockRowEditorState()
      const item = new RowUpdatingItem(deps, false, state as never, 'original-row')

      item.setRowName('new-name')

      expect(state.editor.setRowId).toHaveBeenCalledWith('new-name')
    })

    it('should revert editor state', () => {
      const deps = createMockUpdatingDeps()
      const state: MockRowEditorState = createMockRowEditorState()
      const item = new RowUpdatingItem(deps, false, state as never, 'original-row')

      item.revert()

      expect(state.editor.revert).toHaveBeenCalled()
    })

    it('should return JSON string', () => {
      const deps = createMockUpdatingDeps()
      const state: MockRowEditorState = createMockRowEditorState()
      state.editor.getValue.mockReturnValue({ name: 'Test', value: 123 })
      const item = new RowUpdatingItem(deps, false, state as never, 'original-row')

      const jsonString = item.getJsonString()

      expect(JSON.parse(jsonString)).toEqual({ name: 'Test', value: 123 })
    })
  })

  describe('isConnectingForeignKey', () => {
    it('should return false when no pending request', () => {
      const deps = createMockUpdatingDeps()
      const state = createMockRowEditorState()
      const item = new RowUpdatingItem(deps, false, state as never, 'original-row')

      expect(item.isConnectingForeignKey).toBe(false)
    })
  })

  describe('uploadFile', () => {
    it('should upload file and return data on success', async () => {
      const deps = createMockUpdatingDeps()
      ;(deps.mutationDataSource.uploadFile as jest.Mock) = jest.fn().mockResolvedValue({
        row: { data: { name: 'Updated', file: 'uploaded' } },
      })

      const state: MockRowEditorState = createMockRowEditorState()
      const item = new RowUpdatingItem(deps, false, state as never, 'test-row')

      const result = await item.uploadFile('file-123', new File(['test'], 'test.txt'))

      expect(result).toEqual({ name: 'Updated', file: 'uploaded' })
      expect(deps.mutationDataSource.uploadFile).toHaveBeenCalledWith({
        revisionId: 'draft-1',
        tableId: 'test-table',
        rowId: 'test-row',
        fileId: 'file-123',
        file: expect.any(File),
      })
    })

    it('should update touched state on success', async () => {
      const deps = createMockUpdatingDeps({ touched: false })
      ;(deps.mutationDataSource.uploadFile as jest.Mock) = jest.fn().mockResolvedValue({
        row: { data: { name: 'Updated' } },
      })

      const state: MockRowEditorState = createMockRowEditorState()
      const item = new RowUpdatingItem(deps, false, state as never, 'test-row')

      await item.uploadFile('file-123', new File(['test'], 'test.txt'))

      expect(deps.projectContext.updateTouched).toHaveBeenCalledWith(true)
    })

    it('should return null on failure', async () => {
      const deps = createMockUpdatingDeps()
      ;(deps.mutationDataSource.uploadFile as jest.Mock) = jest.fn().mockResolvedValue(null)

      const state: MockRowEditorState = createMockRowEditorState()
      const item = new RowUpdatingItem(deps, false, state as never, 'test-row')

      const result = await item.uploadFile('file-123', new File(['test'], 'test.txt'))

      expect(result).toBeNull()
    })
  })

  describe('approve failure', () => {
    it('should return false when update fails', async () => {
      const deps = createMockUpdatingDeps()
      ;(deps.mutationDataSource.updateRow as jest.Mock).mockResolvedValue(null)

      const state = createMockRowEditorState()
      state.editor.isDirty = true
      state.editor.getValue.mockReturnValue({ name: 'Updated' })

      const item = new RowUpdatingItem(deps, false, state as never, 'test-row')

      const result = await item.approve()

      expect(result).toBe(false)
    })
  })
})
