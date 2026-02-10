import { RowCreatingItem } from '../RowCreatingItem.ts'
import { RowStackItemType } from '../../../config/types.ts'
import { createMockCreatingDeps, createMockRowEditorState, MockRowEditorState } from '../../__tests__/createMockDeps.ts'

describe('RowCreatingItem', () => {
  describe('initialization', () => {
    it('should create with Creating type', () => {
      const deps = createMockCreatingDeps()
      const state = createMockRowEditorState()
      const item = new RowCreatingItem(deps, false, state as never)

      expect(item.type).toBe(RowStackItemType.Creating)
    })

    it('should use provided state', () => {
      const deps = createMockCreatingDeps()
      const state = createMockRowEditorState()
      const item = new RowCreatingItem(deps, false, state as never)

      expect(item.state).toBe(state)
    })

    it('should set isSelectingForeignKey', () => {
      const deps = createMockCreatingDeps()
      const state = createMockRowEditorState()

      const item1 = new RowCreatingItem(deps, false, state as never)
      expect(item1.isSelectingForeignKey).toBe(false)

      const item2 = new RowCreatingItem(deps, true, state as never)
      expect(item2.isSelectingForeignKey).toBe(true)
    })

    it('should have unique id', () => {
      const deps = createMockCreatingDeps()
      const state = createMockRowEditorState()
      const item1 = new RowCreatingItem(deps, false, state as never)
      const item2 = new RowCreatingItem(deps, false, state as never)

      expect(item1.id).not.toEqual(item2.id)
    })
  })

  describe('approve', () => {
    it('should call createRow command on success', async () => {
      const deps = createMockCreatingDeps()
      ;(deps.mutationDataSource.createRow as jest.Mock).mockResolvedValue({ row: { id: 'new-row' } })

      const state = createMockRowEditorState()
      const item = new RowCreatingItem(deps, false, state as never)

      const resolver = jest.fn()
      item.setResolver(resolver)

      await item.approve()

      expect(deps.mutationDataSource.createRow).toHaveBeenCalled()
      expect(resolver).toHaveBeenCalledWith({ type: 'creatingToUpdating' })
    })

    it('should call selectForeignKeyRow when isSelectingForeignKey', async () => {
      const deps = createMockCreatingDeps()
      ;(deps.mutationDataSource.createRow as jest.Mock).mockResolvedValue({ row: { id: 'new-row' } })

      const state = createMockRowEditorState()
      const item = new RowCreatingItem(deps, true, state as never)

      const resolver = jest.fn()
      item.setResolver(resolver)

      await item.approve()

      expect(resolver).toHaveBeenCalledWith({ type: 'selectForeignKeyRow', rowId: 'test-row' })
    })

    it('should not resolve on failure', async () => {
      const deps = createMockCreatingDeps()
      ;(deps.mutationDataSource.createRow as jest.Mock).mockResolvedValue(null)

      const state = createMockRowEditorState()
      const item = new RowCreatingItem(deps, false, state as never)

      const resolver = jest.fn()
      item.setResolver(resolver)

      await item.approve()

      expect(resolver).not.toHaveBeenCalled()
    })

    it('should call editor.markAsSaved on success', async () => {
      const deps = createMockCreatingDeps()
      ;(deps.mutationDataSource.createRow as jest.Mock).mockResolvedValue({ row: { id: 'new-row' } })

      const state = createMockRowEditorState()
      const item = new RowCreatingItem(deps, false, state as never)
      item.setResolver(jest.fn())

      await item.approve()

      expect(state.editor.markAsSaved).toHaveBeenCalled()
    })
  })

  describe('dispose', () => {
    it('should dispose mutation data source', () => {
      const deps = createMockCreatingDeps()
      const state = createMockRowEditorState()
      const item = new RowCreatingItem(deps, false, state as never)

      item.dispose()

      expect(deps.mutationDataSource.dispose).toHaveBeenCalled()
    })
  })

  describe('computed properties', () => {
    it('should return correct isLoading state', async () => {
      const deps = createMockCreatingDeps()
      ;(deps.mutationDataSource.createRow as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ row: { id: 'new-row' } }), 10)),
      )

      const state = createMockRowEditorState()
      const item = new RowCreatingItem(deps, false, state as never)
      item.setResolver(jest.fn())

      expect(item.isLoading).toBe(false)

      const approvePromise = item.approve()
      expect(item.isLoading).toBe(true)

      await approvePromise
      expect(item.isLoading).toBe(false)
    })

    it('should return rowId from state', () => {
      const deps = createMockCreatingDeps()
      const state: MockRowEditorState = createMockRowEditorState()
      state.editor.rowId = 'custom-row-id'
      const item = new RowCreatingItem(deps, false, state as never)

      expect(item.rowId).toBe('custom-row-id')
    })
  })

  describe('methods', () => {
    it('should set row name', () => {
      const deps = createMockCreatingDeps()
      const state: MockRowEditorState = createMockRowEditorState()
      const item = new RowCreatingItem(deps, false, state as never)

      item.setRowName('new-name')

      expect(state.editor.setRowId).toHaveBeenCalledWith('new-name')
    })

    it('should return JSON string', () => {
      const deps = createMockCreatingDeps()
      const state: MockRowEditorState = createMockRowEditorState()
      state.editor.getValue.mockReturnValue({ name: 'Test', count: 42 })
      const item = new RowCreatingItem(deps, false, state as never)

      const jsonString = item.getJsonString()

      expect(JSON.parse(jsonString)).toEqual({ name: 'Test', count: 42 })
    })
  })

  describe('isConnectingForeignKey', () => {
    it('should return false when no pending request', () => {
      const deps = createMockCreatingDeps()
      const state = createMockRowEditorState()
      const item = new RowCreatingItem(deps, false, state as never)

      expect(item.isConnectingForeignKey).toBe(false)
    })
  })
})
