jest.mock('src/widgets/TreeDataCard', () => ({
  RootValueNode: jest.fn(),
}))

import { RowStackManager } from '../RowStackManager.ts'
import { RowListItem, RowCreatingItem, RowUpdatingItem } from '../items'
import { RowStackItemType } from '../../config/types.ts'
import { createMockManagerDeps as createMockDeps } from './createMockDeps.ts'

describe('RowStackManager', () => {
  describe('initialization', () => {
    it('should create with one RowListItem', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.List)
      expect(manager.stack[0].isSelectingForeignKey).toBe(false)
    })

    it('should set tableId from deps', () => {
      const deps = createMockDeps({ tableId: 'my-table' })
      const manager = new RowStackManager(deps)

      expect(manager.stack[0].tableId).toBe('my-table')
    })
  })

  describe('item.toCreating', () => {
    it('should replace RowListItem with RowCreatingItem', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.Creating)
    })

    it('should preserve isSelectingForeignKey', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem

      expect(creatingItem.isSelectingForeignKey).toBe(false)
    })
  })

  describe('item.toList', () => {
    it('should replace RowCreatingItem with RowListItem', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem

      creatingItem.toList()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.List)
    })
  })

  describe('item.toUpdating (from Creating)', () => {
    it('should replace RowCreatingItem with RowUpdatingItem preserving store', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem
      const store = creatingItem.store

      creatingItem.toUpdating()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.Updating)

      const updatingItem = manager.stack[0] as RowUpdatingItem
      expect(updatingItem.store).toBe(store)
    })
  })

  describe('item.startForeignKeySelection', () => {
    it('should push new RowListItem with isSelectingForeignKey true', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')

      expect(manager.stack).toHaveLength(2)
      expect(manager.stack[1].type).toBe(RowStackItemType.List)
      expect(manager.stack[1].isSelectingForeignKey).toBe(true)
    })

    it('should set pending request on parent item', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')

      expect(creatingItem.hasPendingRequest).toBe(true)
    })

    it('should set tableId for selecting item from foreignTableId', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'foreign-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'foreign-table')

      expect(manager.stack[1].tableId).toBe('foreign-table')
    })
  })

  describe('item.selectForeignKeyRow (completeForeignKeySelection)', () => {
    it('should remove selecting item from stack and restore parent', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem
      const store = creatingItem.store

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')

      expect(manager.stack).toHaveLength(2)

      const selectingListItem = manager.stack[1] as RowListItem
      selectingListItem.selectForeignKeyRow('selected-row-id')

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.Creating)
      expect((manager.stack[0] as RowCreatingItem).store).toBe(store)
    })

    it('should clear pending request on parent', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')

      expect(creatingItem.hasPendingRequest).toBe(true)

      const selectingListItem = manager.stack[1] as RowListItem
      selectingListItem.selectForeignKeyRow('selected-row-id')

      expect(manager.stack[0].hasPendingRequest).toBe(false)
    })

    it('should call setValue on foreignKeyNode with selected rowId', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const setValueMock = jest.fn()
      const mockForeignKeyNode = { setValue: setValueMock, foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')

      const selectingListItem = manager.stack[1] as RowListItem
      selectingListItem.selectForeignKeyRow('selected-row-id')

      expect(setValueMock).toHaveBeenCalledWith('selected-row-id')
    })
  })

  describe('item.cancelForeignKeySelection', () => {
    it('should cancel all children and restore parent state', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem
      const store = creatingItem.store

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')

      expect(manager.stack).toHaveLength(2)

      creatingItem.cancelForeignKeySelection()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].hasPendingRequest).toBe(false)
      expect(manager.stack[0].type).toBe(RowStackItemType.Creating)
      expect((manager.stack[0] as RowCreatingItem).store).toBe(store)
    })
  })

  describe('nested foreign key selection', () => {
    it('should handle multiple levels of nesting with list selection', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const level0 = manager.stack[0] as RowListItem

      level0.toCreating()
      const creatingItem0 = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode1 = { setValue: jest.fn(), foreignKey: 'fk-table-1' } as never
      creatingItem0.startForeignKeySelection(mockForeignKeyNode1, 'fk-table-1')

      expect(manager.stack).toHaveLength(2)
      expect(manager.stack[1].isSelectingForeignKey).toBe(true)

      const level1List = manager.stack[1] as RowListItem
      level1List.selectForeignKeyRow('row-level-1')
      expect(manager.stack).toHaveLength(1)
    })

    it('should handle selection from nested list without creating', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)

      const listItem0 = manager.stack[0] as RowListItem
      listItem0.toCreating()
      const creatingItem0 = manager.stack[0] as RowCreatingItem

      const setValue0 = jest.fn()
      const mockForeignKeyNode0 = { setValue: setValue0, foreignKey: 'fk-table-0' } as never
      creatingItem0.startForeignKeySelection(mockForeignKeyNode0, 'fk-table-0')

      expect(manager.stack).toHaveLength(2)

      const selectingList1 = manager.stack[1] as RowListItem
      selectingList1.selectForeignKeyRow('row-1')
      expect(setValue0).toHaveBeenCalledWith('row-1')
      expect(manager.stack).toHaveLength(1)
    })
  })

  describe('currentItem', () => {
    it('should return the last item in stack', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)

      expect(manager.currentItem).toBe(manager.stack[0])
    })

    it('should return the last item when multiple items in stack', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')

      expect(manager.currentItem).toBe(manager.stack[1])
    })
  })

  describe('isFirstLevel', () => {
    it('should set isFirstLevel true on first item', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const firstItem = manager.stack[0]

      expect(firstItem.isFirstLevel).toBe(true)
    })

    it('should not set isFirstLevel on pushed items', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')

      expect(manager.stack[1].isFirstLevel).toBe(false)
    })
  })

  describe('isConnectingForeignKey', () => {
    it('should return true on item with pending request', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem

      expect(creatingItem.isConnectingForeignKey).toBe(false)

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')

      expect(creatingItem.isConnectingForeignKey).toBe(true)
    })

    it('should return false after selection completed', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')

      const selectingListItem = manager.stack[1] as RowListItem
      selectingListItem.selectForeignKeyRow('selected-row-id')

      expect((manager.stack[0] as RowCreatingItem).isConnectingForeignKey).toBe(false)
    })
  })

  describe('foreign table operations', () => {
    it('should load foreign schema when creating row in foreign table', async () => {
      const foreignSchema = {
        type: 'object',
        properties: { title: { type: 'string', default: '' } },
        additionalProperties: false,
        required: ['title'],
      }
      const loadTableWithRowsMock = jest.fn().mockResolvedValue({
        table: { id: 'foreign-table', schema: foreignSchema },
        rows: [],
      })
      const deps = createMockDeps()
      deps.foreignKeyTableDataSourceFactory = () =>
        ({
          loadTableWithRows: loadTableWithRowsMock,
          dispose: jest.fn(),
        }) as never

      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn() } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'foreign-table')

      const selectingListItem = manager.stack[1] as RowListItem
      expect(selectingListItem.tableId).toBe('foreign-table')

      await selectingListItem.toCreating()

      await new Promise((resolve) => setTimeout(resolve, 10))

      expect(loadTableWithRowsMock).toHaveBeenCalledWith('rev-1', 'foreign-table', 0)
      expect(manager.stack[1].type).toBe(RowStackItemType.Creating)
    })

    it('should cache foreign schema and not reload on second operation', async () => {
      const foreignSchema = {
        type: 'object',
        properties: { title: { type: 'string', default: '' } },
        additionalProperties: false,
        required: ['title'],
      }
      const loadTableWithRowsMock = jest.fn().mockResolvedValue({
        table: { id: 'foreign-table', schema: foreignSchema },
        rows: [],
      })
      const deps = createMockDeps()
      deps.foreignKeyTableDataSourceFactory = () =>
        ({
          loadTableWithRows: loadTableWithRowsMock,
          dispose: jest.fn(),
        }) as never

      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn() } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'foreign-table')

      const selectingListItem = manager.stack[1] as RowListItem

      await selectingListItem.toCreating()
      await new Promise((resolve) => setTimeout(resolve, 10))

      expect(loadTableWithRowsMock).toHaveBeenCalledTimes(1)

      const creatingInForeign = manager.stack[1] as RowCreatingItem
      creatingInForeign.toList()

      await new Promise((resolve) => setTimeout(resolve, 10))

      const listInForeign = manager.stack[1] as RowListItem
      await listInForeign.toCreating()
      await new Promise((resolve) => setTimeout(resolve, 10))

      expect(loadTableWithRowsMock).toHaveBeenCalledTimes(1)
    })

    it('should not load schema when creating row in main table', async () => {
      const loadTableWithRowsMock = jest.fn()
      const deps = createMockDeps()
      deps.foreignKeyTableDataSourceFactory = () =>
        ({
          loadTableWithRows: loadTableWithRowsMock,
          dispose: jest.fn(),
        }) as never

      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      await listItem.toCreating()
      await new Promise((resolve) => setTimeout(resolve, 10))

      expect(loadTableWithRowsMock).not.toHaveBeenCalled()
    })
  })
})
