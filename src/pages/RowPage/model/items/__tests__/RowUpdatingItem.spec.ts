import { RowUpdatingItem } from '../RowUpdatingItem.ts'
import { RowStackItemType } from '../../../config/types.ts'
import {
  createMockUpdatingDeps,
  createMockRowDataCardStore,
  MockRowDataCardStore,
} from '../../__tests__/createMockDeps.ts'

describe('RowUpdatingItem', () => {
  describe('initialization', () => {
    it('should create with Updating type', () => {
      const deps = createMockUpdatingDeps()
      const store = createMockRowDataCardStore()
      const item = new RowUpdatingItem(deps, false, store as never, 'original-row')

      expect(item.type).toBe(RowStackItemType.Updating)
    })

    it('should use provided store', () => {
      const deps = createMockUpdatingDeps()
      const store = createMockRowDataCardStore()
      const item = new RowUpdatingItem(deps, false, store as never, 'original-row')

      expect(item.store).toBe(store)
    })

    it('should set originalRowId', () => {
      const deps = createMockUpdatingDeps()
      const store = createMockRowDataCardStore()
      const item = new RowUpdatingItem(deps, false, store as never, 'original-row')

      expect(item.originalRowId).toBe('original-row')
    })

    it('should set isSelectingForeignKey', () => {
      const deps = createMockUpdatingDeps()
      const store = createMockRowDataCardStore()

      const item1 = new RowUpdatingItem(deps, false, store as never, 'original-row')
      expect(item1.isSelectingForeignKey).toBe(false)

      const item2 = new RowUpdatingItem(deps, true, store as never, 'original-row')
      expect(item2.isSelectingForeignKey).toBe(true)
    })

    it('should have unique id', () => {
      const deps = createMockUpdatingDeps()
      const store = createMockRowDataCardStore()
      const item1 = new RowUpdatingItem(deps, false, store as never, 'original-row')
      const item2 = new RowUpdatingItem(deps, false, store as never, 'original-row')

      expect(item1.id).not.toEqual(item2.id)
    })
  })

  describe('approve', () => {
    it('should call updateRow when there are data changes', async () => {
      const deps = createMockUpdatingDeps()
      ;(deps.mutationDataSource.updateRow as jest.Mock).mockResolvedValue({ row: { id: 'test-row' } })

      const store = {
        name: {
          getPlainValue: jest.fn().mockReturnValue('test-row'),
          baseValue: 'test-row',
          value: 'test-row',
          touched: false,
        },
        root: {
          getPlainValue: jest.fn().mockReturnValue({ name: 'Updated' }),
          touched: true,
        },
        save: jest.fn(),
        syncReadOnlyStores: jest.fn(),
      } as never

      const item = new RowUpdatingItem(deps, false, store as never, 'test-row')

      await item.approve()

      expect(deps.mutationDataSource.updateRow).toHaveBeenCalled()
    })

    it('should call renameRow when row id changed', async () => {
      const deps = createMockUpdatingDeps()
      ;(deps.mutationDataSource.renameRow as jest.Mock).mockResolvedValue({ row: { id: 'new-row' } })

      const store = {
        name: {
          getPlainValue: jest.fn().mockReturnValue('new-row'),
          baseValue: 'original-row',
          value: 'new-row',
          touched: true,
        },
        root: {
          getPlainValue: jest.fn().mockReturnValue({ name: 'Test' }),
          touched: false,
        },
        save: jest.fn(),
        syncReadOnlyStores: jest.fn(),
      } as never

      const item = new RowUpdatingItem(deps, false, store as never, 'original-row')

      await item.approve()

      expect(deps.mutationDataSource.renameRow).toHaveBeenCalled()
    })

    it('should not call any mutation when no changes', async () => {
      const deps = createMockUpdatingDeps()

      const store = createMockRowDataCardStore()
      const item = new RowUpdatingItem(deps, false, store as never, 'test-row')

      await item.approve()

      expect(deps.mutationDataSource.updateRow).not.toHaveBeenCalled()
      expect(deps.mutationDataSource.renameRow).not.toHaveBeenCalled()
    })

    it('should call store.save on success', async () => {
      const deps = createMockUpdatingDeps()
      ;(deps.mutationDataSource.updateRow as jest.Mock).mockResolvedValue({ row: { id: 'test-row' } })

      const saveMock = jest.fn()
      const syncReadOnlyStoresMock = jest.fn()
      const store = {
        name: {
          getPlainValue: jest.fn().mockReturnValue('test-row'),
          baseValue: 'test-row',
          value: 'test-row',
          touched: false,
        },
        root: {
          getPlainValue: jest.fn().mockReturnValue({ name: 'Updated' }),
          touched: true,
        },
        save: saveMock,
        syncReadOnlyStores: syncReadOnlyStoresMock,
      } as never

      const item = new RowUpdatingItem(deps, false, store as never, 'test-row')

      await item.approve()

      expect(saveMock).toHaveBeenCalled()
      expect(syncReadOnlyStoresMock).toHaveBeenCalled()
    })
  })

  describe('dispose', () => {
    it('should dispose mutation data source', () => {
      const deps = createMockUpdatingDeps()
      const store = createMockRowDataCardStore()
      const item = new RowUpdatingItem(deps, false, store as never, 'original-row')

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

      const store = {
        name: {
          getPlainValue: jest.fn().mockReturnValue('test-row'),
          baseValue: 'test-row',
          value: 'test-row',
          touched: false,
        },
        root: {
          getPlainValue: jest.fn().mockReturnValue({ name: 'Updated' }),
          touched: true,
        },
        save: jest.fn(),
        syncReadOnlyStores: jest.fn(),
      } as never

      const item = new RowUpdatingItem(deps, false, store as never, 'test-row')

      expect(item.isLoading).toBe(false)

      const approvePromise = item.approve()
      expect(item.isLoading).toBe(true)

      await approvePromise
      expect(item.isLoading).toBe(false)
    })

    it('should return canUpdateRow based on permissions and revision', () => {
      const deps = createMockUpdatingDeps({ isDraftRevision: true })
      ;(deps.permissionContext as { canUpdateRow: boolean }).canUpdateRow = true
      const store = createMockRowDataCardStore()
      const item = new RowUpdatingItem(deps, false, store as never, 'original-row')

      expect(item.canUpdateRow).toBe(true)
    })

    it('should return false for canUpdateRow when not draft revision', () => {
      const deps = createMockUpdatingDeps({ isDraftRevision: false })
      ;(deps.permissionContext as { canUpdateRow: boolean }).canUpdateRow = true
      const store = createMockRowDataCardStore()
      const item = new RowUpdatingItem(deps, false, store as never, 'original-row')

      expect(item.canUpdateRow).toBe(false)
    })

    it('should return currentRowId from store', () => {
      const deps = createMockUpdatingDeps()
      const store: MockRowDataCardStore = createMockRowDataCardStore()
      store.name.getPlainValue.mockReturnValue('current-row-id')
      const item = new RowUpdatingItem(deps, false, store as never, 'original-row')

      expect(item.currentRowId).toBe('current-row-id')
    })
  })

  describe('methods', () => {
    it('should set row name', () => {
      const deps = createMockUpdatingDeps()
      const store: MockRowDataCardStore = createMockRowDataCardStore()
      const item = new RowUpdatingItem(deps, false, store as never, 'original-row')

      item.setRowName('new-name')

      expect(store.name.setValue).toHaveBeenCalledWith('new-name')
    })

    it('should revert store', () => {
      const deps = createMockUpdatingDeps()
      const store: MockRowDataCardStore = createMockRowDataCardStore()
      const item = new RowUpdatingItem(deps, false, store as never, 'original-row')

      item.revert()

      expect(store.reset).toHaveBeenCalled()
    })

    it('should return JSON string', () => {
      const deps = createMockUpdatingDeps()
      const store: MockRowDataCardStore = createMockRowDataCardStore()
      store.root.getPlainValue.mockReturnValue({ name: 'Test', value: 123 })
      const item = new RowUpdatingItem(deps, false, store as never, 'original-row')

      const jsonString = item.getJsonString()

      expect(JSON.parse(jsonString)).toEqual({ name: 'Test', value: 123 })
    })
  })

  describe('isConnectingForeignKey', () => {
    it('should return false when no pending request', () => {
      const deps = createMockUpdatingDeps()
      const store = createMockRowDataCardStore()
      const item = new RowUpdatingItem(deps, false, store as never, 'original-row')

      expect(item.isConnectingForeignKey).toBe(false)
    })
  })

  describe('uploadFile', () => {
    it('should upload file and return data on success', async () => {
      const deps = createMockUpdatingDeps()
      ;(deps.mutationDataSource.uploadFile as jest.Mock) = jest.fn().mockResolvedValue({
        row: { data: { name: 'Updated', file: 'uploaded' } },
      })

      const store: MockRowDataCardStore = createMockRowDataCardStore()
      store.name.getPlainValue.mockReturnValue('test-row')
      const item = new RowUpdatingItem(deps, false, store as never, 'test-row')

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

      const store: MockRowDataCardStore = createMockRowDataCardStore()
      const item = new RowUpdatingItem(deps, false, store as never, 'test-row')

      await item.uploadFile('file-123', new File(['test'], 'test.txt'))

      expect(deps.projectContext.updateTouched).toHaveBeenCalledWith(true)
    })

    it('should return null on failure', async () => {
      const deps = createMockUpdatingDeps()
      ;(deps.mutationDataSource.uploadFile as jest.Mock) = jest.fn().mockResolvedValue(null)

      const store: MockRowDataCardStore = createMockRowDataCardStore()
      const item = new RowUpdatingItem(deps, false, store as never, 'test-row')

      const result = await item.uploadFile('file-123', new File(['test'], 'test.txt'))

      expect(result).toBeNull()
    })
  })

  describe('syncReadOnlyStores', () => {
    it('should call store.syncReadOnlyStores with fresh data', () => {
      const deps = createMockUpdatingDeps()
      const store: MockRowDataCardStore = createMockRowDataCardStore()
      const item = new RowUpdatingItem(deps, false, store as never, 'test-row')

      const freshData = { name: 'Fresh' }
      item.syncReadOnlyStores(freshData)

      expect(store.syncReadOnlyStores).toHaveBeenCalledWith(freshData)
    })
  })

  describe('approve failure', () => {
    it('should return false when update fails', async () => {
      const deps = createMockUpdatingDeps()
      ;(deps.mutationDataSource.updateRow as jest.Mock).mockResolvedValue(null)

      const store = {
        name: {
          getPlainValue: jest.fn().mockReturnValue('test-row'),
          baseValue: 'test-row',
          value: 'test-row',
          touched: false,
        },
        root: {
          getPlainValue: jest.fn().mockReturnValue({ name: 'Updated' }),
          touched: true,
        },
        save: jest.fn(),
        syncReadOnlyStores: jest.fn(),
      } as never

      const item = new RowUpdatingItem(deps, false, store, 'test-row')

      const result = await item.approve()

      expect(result).toBe(false)
    })
  })
})
