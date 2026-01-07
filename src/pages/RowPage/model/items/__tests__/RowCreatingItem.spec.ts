import { RowCreatingItem } from '../RowCreatingItem.ts'
import { RowStackItemType } from '../../../config/types.ts'
import {
  createMockCreatingDeps,
  createMockRowDataCardStore,
  MockRowDataCardStore,
} from '../../__tests__/createMockDeps.ts'

describe('RowCreatingItem', () => {
  describe('initialization', () => {
    it('should create with Creating type', () => {
      const deps = createMockCreatingDeps()
      const store = createMockRowDataCardStore()
      const item = new RowCreatingItem(deps, false, store as never)

      expect(item.type).toBe(RowStackItemType.Creating)
    })

    it('should use provided store', () => {
      const deps = createMockCreatingDeps()
      const store = createMockRowDataCardStore()
      const item = new RowCreatingItem(deps, false, store as never)

      expect(item.store).toBe(store)
    })

    it('should set isSelectingForeignKey', () => {
      const deps = createMockCreatingDeps()
      const store = createMockRowDataCardStore()

      const item1 = new RowCreatingItem(deps, false, store as never)
      expect(item1.isSelectingForeignKey).toBe(false)

      const item2 = new RowCreatingItem(deps, true, store as never)
      expect(item2.isSelectingForeignKey).toBe(true)
    })

    it('should have unique id', () => {
      const deps = createMockCreatingDeps()
      const store = createMockRowDataCardStore()
      const item1 = new RowCreatingItem(deps, false, store as never)
      const item2 = new RowCreatingItem(deps, false, store as never)

      expect(item1.id).not.toEqual(item2.id)
    })
  })

  describe('approve', () => {
    it('should call createRow command on success', async () => {
      const deps = createMockCreatingDeps()
      ;(deps.mutationDataSource.createRow as jest.Mock).mockResolvedValue({ row: { id: 'new-row' } })

      const store = createMockRowDataCardStore()
      const item = new RowCreatingItem(deps, false, store as never)

      const resolver = jest.fn()
      item.setResolver(resolver)

      await item.approve()

      expect(deps.mutationDataSource.createRow).toHaveBeenCalled()
      expect(resolver).toHaveBeenCalledWith({ type: 'creatingToUpdating' })
    })

    it('should call selectForeignKeyRow when isSelectingForeignKey', async () => {
      const deps = createMockCreatingDeps()
      ;(deps.mutationDataSource.createRow as jest.Mock).mockResolvedValue({ row: { id: 'new-row' } })

      const store = createMockRowDataCardStore()
      const item = new RowCreatingItem(deps, true, store as never)

      const resolver = jest.fn()
      item.setResolver(resolver)

      await item.approve()

      expect(resolver).toHaveBeenCalledWith({ type: 'selectForeignKeyRow', rowId: 'test-row' })
    })

    it('should not resolve on failure', async () => {
      const deps = createMockCreatingDeps()
      ;(deps.mutationDataSource.createRow as jest.Mock).mockResolvedValue(null)

      const store = createMockRowDataCardStore()
      const item = new RowCreatingItem(deps, false, store as never)

      const resolver = jest.fn()
      item.setResolver(resolver)

      await item.approve()

      expect(resolver).not.toHaveBeenCalled()
    })

    it('should call store.save on success', async () => {
      const deps = createMockCreatingDeps()
      ;(deps.mutationDataSource.createRow as jest.Mock).mockResolvedValue({ row: { id: 'new-row' } })

      const saveMock = jest.fn()
      const store = {
        name: {
          getPlainValue: jest.fn().mockReturnValue('test-row'),
        },
        root: {
          getPlainValue: jest.fn().mockReturnValue({ name: 'Test' }),
        },
        save: saveMock,
      } as never
      const item = new RowCreatingItem(deps, false, store as never)
      item.setResolver(jest.fn())

      await item.approve()

      expect(saveMock).toHaveBeenCalled()
    })
  })

  describe('dispose', () => {
    it('should dispose mutation data source', () => {
      const deps = createMockCreatingDeps()
      const store = createMockRowDataCardStore()
      const item = new RowCreatingItem(deps, false, store as never)

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

      const store = createMockRowDataCardStore()
      const item = new RowCreatingItem(deps, false, store as never)
      item.setResolver(jest.fn())

      expect(item.isLoading).toBe(false)

      const approvePromise = item.approve()
      expect(item.isLoading).toBe(true)

      await approvePromise
      expect(item.isLoading).toBe(false)
    })

    it('should return rowId from store', () => {
      const deps = createMockCreatingDeps()
      const store: MockRowDataCardStore = createMockRowDataCardStore()
      store.name.getPlainValue.mockReturnValue('custom-row-id')
      const item = new RowCreatingItem(deps, false, store as never)

      expect(item.rowId).toBe('custom-row-id')
    })
  })

  describe('methods', () => {
    it('should set row name', () => {
      const deps = createMockCreatingDeps()
      const store: MockRowDataCardStore = createMockRowDataCardStore()
      const item = new RowCreatingItem(deps, false, store as never)

      item.setRowName('new-name')

      expect(store.name.setValue).toHaveBeenCalledWith('new-name')
    })

    it('should return JSON string', () => {
      const deps = createMockCreatingDeps()
      const store: MockRowDataCardStore = createMockRowDataCardStore()
      store.root.getPlainValue.mockReturnValue({ name: 'Test', count: 42 })
      const item = new RowCreatingItem(deps, false, store as never)

      const jsonString = item.getJsonString()

      expect(JSON.parse(jsonString)).toEqual({ name: 'Test', count: 42 })
    })
  })

  describe('isConnectingForeignKey', () => {
    it('should return false when no pending request', () => {
      const deps = createMockCreatingDeps()
      const store = createMockRowDataCardStore()
      const item = new RowCreatingItem(deps, false, store as never)

      expect(item.isConnectingForeignKey).toBe(false)
    })
  })
})
