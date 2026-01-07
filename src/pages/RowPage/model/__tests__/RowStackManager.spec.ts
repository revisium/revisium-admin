jest.mock('src/widgets/TreeDataCard', () => ({
  RootValueNode: jest.fn(),
}))

import { RowStackManager } from '../RowStackManager.ts'
import { RowListItem, RowCreatingItem, RowUpdatingItem } from '../items'
import { RowStackItemType } from '../../config/types.ts'
import { createMockManagerDeps as createMockDeps, createMockSchemaCache } from './createMockDeps.ts'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('RowStackManager', () => {
  describe('initialization', () => {
    it('should create with one RowListItem when no rowData', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.List)
      expect(manager.stack[0].isSelectingForeignKey).toBe(false)
    })

    it('should create with one RowUpdatingItem when rowData provided', () => {
      const deps = createMockDeps({
        rowData: { rowId: 'row-123', data: { name: 'Test Row' }, foreignKeysCount: 2 },
      })
      const manager = new RowStackManager(deps)

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.Updating)
      expect(manager.stack[0].isSelectingForeignKey).toBe(false)

      const updatingItem = manager.stack[0] as RowUpdatingItem
      expect(updatingItem.originalRowId).toBe('row-123')
    })

    it('should set isFirstLevel true on RowUpdatingItem when rowData provided', () => {
      const deps = createMockDeps({
        rowData: { rowId: 'row-123', data: { name: 'Test Row' }, foreignKeysCount: 0 },
      })
      const manager = new RowStackManager(deps)

      expect(manager.stack[0].isFirstLevel).toBe(true)
    })

    it('should set tableId from deps', () => {
      const deps = createMockDeps({ tableId: 'my-table' })
      const manager = new RowStackManager(deps)

      expect(manager.stack[0].tableId).toBe('my-table')
    })
  })

  describe('item.toCreating', () => {
    it('should replace RowListItem with RowCreatingItem', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.Creating)
    })

    it('should preserve isSelectingForeignKey', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      expect(creatingItem.isSelectingForeignKey).toBe(false)
    })
  })

  describe('item.toList', () => {
    it('should replace RowCreatingItem with RowListItem', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      creatingItem.toList()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.List)
    })
  })

  describe('item.toUpdating (from Creating)', () => {
    it('should replace RowCreatingItem with RowUpdatingItem preserving store', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
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
    it('should push new RowListItem with isSelectingForeignKey true', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')
      await flushPromises()

      expect(manager.stack).toHaveLength(2)
      expect(manager.stack[1].type).toBe(RowStackItemType.List)
      expect(manager.stack[1].isSelectingForeignKey).toBe(true)
    })

    it('should set pending request on parent item', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')
      await flushPromises()

      expect(creatingItem.hasPendingRequest).toBe(true)
    })

    it('should set tableId for selecting item from foreignTableId', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'foreign-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'foreign-table')
      await flushPromises()

      expect(manager.stack[1].tableId).toBe('foreign-table')
    })
  })

  describe('item.startForeignKeyCreation', () => {
    it('should push RowCreatingItem with isSelectingForeignKey true', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeyCreation(mockForeignKeyNode, 'fk-table')
      await flushPromises()

      expect(manager.stack).toHaveLength(2)
      expect(manager.stack[1].type).toBe(RowStackItemType.Creating)
      expect(manager.stack[1].isSelectingForeignKey).toBe(true)
    })

    it('should set pending request on parent item', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeyCreation(mockForeignKeyNode, 'fk-table')
      await flushPromises()

      expect(creatingItem.hasPendingRequest).toBe(true)
    })

    it('should set tableId for creating item from foreignTableId', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'foreign-table' } as never
      creatingItem.startForeignKeyCreation(mockForeignKeyNode, 'foreign-table')
      await flushPromises()

      expect(manager.stack[1].tableId).toBe('foreign-table')
    })

    it('should call setValue and restore parent after row is created and selected', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const parentCreatingItem = manager.stack[0] as RowCreatingItem

      const setValueMock = jest.fn()
      const mockForeignKeyNode = { setValue: setValueMock, foreignKey: 'fk-table' } as never
      parentCreatingItem.startForeignKeyCreation(mockForeignKeyNode, 'fk-table')
      await flushPromises()

      const childCreatingItem = manager.stack[1] as RowCreatingItem
      childCreatingItem.selectForeignKeyRow('new-created-row-id')

      expect(setValueMock).toHaveBeenCalledWith('new-created-row-id')
      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.Creating)
    })
  })

  describe('item.selectForeignKeyRow (completeForeignKeySelection)', () => {
    it('should remove selecting item from stack and restore parent', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem
      const store = creatingItem.store

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')
      await flushPromises()

      expect(manager.stack).toHaveLength(2)

      const selectingListItem = manager.stack[1] as RowListItem
      selectingListItem.selectForeignKeyRow('selected-row-id')

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.Creating)
      expect((manager.stack[0] as RowCreatingItem).store).toBe(store)
    })

    it('should clear pending request on parent', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')
      await flushPromises()

      expect(creatingItem.hasPendingRequest).toBe(true)

      const selectingListItem = manager.stack[1] as RowListItem
      selectingListItem.selectForeignKeyRow('selected-row-id')

      expect(manager.stack[0].hasPendingRequest).toBe(false)
    })

    it('should call setValue on foreignKeyNode with selected rowId', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const setValueMock = jest.fn()
      const mockForeignKeyNode = { setValue: setValueMock, foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')
      await flushPromises()

      const selectingListItem = manager.stack[1] as RowListItem
      selectingListItem.selectForeignKeyRow('selected-row-id')

      expect(setValueMock).toHaveBeenCalledWith('selected-row-id')
    })
  })

  describe('item.cancelForeignKeySelection', () => {
    it('should cancel all children and restore parent state', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem
      const store = creatingItem.store

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')
      await flushPromises()

      expect(manager.stack).toHaveLength(2)

      creatingItem.cancelForeignKeySelection()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].hasPendingRequest).toBe(false)
      expect(manager.stack[0].type).toBe(RowStackItemType.Creating)
      expect((manager.stack[0] as RowCreatingItem).store).toBe(store)
    })
  })

  describe('nested foreign key selection', () => {
    it('should handle multiple levels of nesting with list selection', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const level0 = manager.stack[0] as RowListItem

      level0.toCreating()
      await flushPromises()
      const creatingItem0 = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode1 = { setValue: jest.fn(), foreignKey: 'fk-table-1' } as never
      creatingItem0.startForeignKeySelection(mockForeignKeyNode1, 'fk-table-1')
      await flushPromises()

      expect(manager.stack).toHaveLength(2)
      expect(manager.stack[1].isSelectingForeignKey).toBe(true)

      const level1List = manager.stack[1] as RowListItem
      level1List.selectForeignKeyRow('row-level-1')
      expect(manager.stack).toHaveLength(1)
    })

    it('should handle selection from nested list without creating', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)

      const listItem0 = manager.stack[0] as RowListItem
      listItem0.toCreating()
      await flushPromises()
      const creatingItem0 = manager.stack[0] as RowCreatingItem

      const setValue0 = jest.fn()
      const mockForeignKeyNode0 = { setValue: setValue0, foreignKey: 'fk-table-0' } as never
      creatingItem0.startForeignKeySelection(mockForeignKeyNode0, 'fk-table-0')
      await flushPromises()

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

    it('should return the last item when multiple items in stack', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')
      await flushPromises()

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

    it('should not set isFirstLevel on pushed items', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')
      await flushPromises()

      expect(manager.stack[1].isFirstLevel).toBe(false)
    })

    it('should preserve isFirstLevel when replacing item with toCreating', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      expect(listItem.isFirstLevel).toBe(true)

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      expect(creatingItem.isFirstLevel).toBe(true)
    })

    it('should preserve isFirstLevel when replacing item with toList', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      expect(creatingItem.isFirstLevel).toBe(true)

      creatingItem.toList()
      const newListItem = manager.stack[0] as RowListItem

      expect(newListItem.isFirstLevel).toBe(true)
    })

    it('should preserve isFirstLevel when replacing item with toUpdating', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      expect(creatingItem.isFirstLevel).toBe(true)

      creatingItem.toUpdating()
      const updatingItem = manager.stack[0] as RowUpdatingItem

      expect(updatingItem.isFirstLevel).toBe(true)
    })
  })

  describe('isConnectingForeignKey', () => {
    it('should return true on item with pending request', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      expect(creatingItem.isConnectingForeignKey).toBe(false)

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')
      await flushPromises()

      expect(creatingItem.isConnectingForeignKey).toBe(true)
    })

    it('should return false after selection completed', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn(), foreignKey: 'fk-table' } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')
      await flushPromises()

      const selectingListItem = manager.stack[1] as RowListItem
      selectingListItem.selectForeignKeyRow('selected-row-id')

      expect((manager.stack[0] as RowCreatingItem).isConnectingForeignKey).toBe(false)
    })
  })

  describe('init', () => {
    it('should do nothing when rowId is the same', () => {
      const deps = createMockDeps({
        rowData: { rowId: 'row-123', data: { name: 'Test' }, foreignKeysCount: 0 },
      })
      const manager = new RowStackManager(deps)
      const originalItem = manager.stack[0]

      manager.init('row-123')

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0]).toBe(originalItem)
    })

    it('should reset to RowListItem when rowId becomes undefined', () => {
      const deps = createMockDeps({
        rowData: { rowId: 'row-123', data: { name: 'Test' }, foreignKeysCount: 0 },
      })
      const manager = new RowStackManager(deps)

      expect(manager.stack[0].type).toBe(RowStackItemType.Updating)

      manager.init(undefined)

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.List)
      expect(manager.stack[0].isFirstLevel).toBe(true)
    })

    it('should reset to RowUpdatingItem when rowId is provided and row exists', () => {
      const deps = createMockDeps({
        row: { id: 'new-row', data: { name: 'New Row' }, foreignKeysCount: 1 },
      })
      const manager = new RowStackManager(deps)

      expect(manager.stack[0].type).toBe(RowStackItemType.List)

      manager.init('new-row')

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.Updating)
      expect(manager.stack[0].isFirstLevel).toBe(true)

      const updatingItem = manager.stack[0] as RowUpdatingItem
      expect(updatingItem.originalRowId).toBe('new-row')
    })

    it('should dispose old items when resetting', () => {
      const deps = createMockDeps({
        rowData: { rowId: 'row-123', data: { name: 'Test' }, foreignKeysCount: 0 },
      })
      const manager = new RowStackManager(deps)
      const originalItem = manager.stack[0]
      const disposeSpy = jest.spyOn(originalItem, 'dispose')

      manager.init(undefined)

      expect(disposeSpy).toHaveBeenCalled()
    })

    it('should reset to RowListItem when rowId provided but row is null in context', () => {
      const deps = createMockDeps({
        row: null,
      })
      const manager = new RowStackManager(deps)

      manager.init('some-row-id')

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.List)
    })

    it('should reset to RowListItem when rowId does not match row.id in context', () => {
      const deps = createMockDeps({
        row: { id: 'different-row', data: { name: 'Different' }, foreignKeysCount: 0 },
      })
      const manager = new RowStackManager(deps)

      manager.init('requested-row-id')

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.List)
    })

    it('should dispose all items in stack when resetting', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn() } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'fk-table')
      await flushPromises()

      expect(manager.stack).toHaveLength(2)

      const disposeSpy0 = jest.spyOn(manager.stack[0], 'dispose')
      const disposeSpy1 = jest.spyOn(manager.stack[1], 'dispose')

      manager.init('new-row-id')

      expect(disposeSpy0).toHaveBeenCalled()
      expect(disposeSpy1).toHaveBeenCalled()
    })

    it('should handle transition from one row to another', () => {
      const deps = createMockDeps({
        rowData: { rowId: 'row-1', data: { name: 'Row 1' }, foreignKeysCount: 0 },
        row: { id: 'row-2', data: { name: 'Row 2' }, foreignKeysCount: 2 },
      })
      const manager = new RowStackManager(deps)

      expect(manager.stack[0].type).toBe(RowStackItemType.Updating)
      expect((manager.stack[0] as RowUpdatingItem).originalRowId).toBe('row-1')

      manager.init('row-2')

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.Updating)
      expect((manager.stack[0] as RowUpdatingItem).originalRowId).toBe('row-2')
    })
  })

  describe('foreign table operations', () => {
    it('should load foreign schema when starting foreign key selection', async () => {
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
      deps.schemaCache = createMockSchemaCache('test-table', () => ({
        loadTableWithRows: loadTableWithRowsMock,
        dispose: jest.fn(),
      }))

      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn() } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'foreign-table')
      await flushPromises()

      expect(loadTableWithRowsMock).toHaveBeenCalledWith('rev-1', 'foreign-table', 0)
      expect(manager.stack).toHaveLength(2)

      const selectingListItem = manager.stack[1] as RowListItem
      expect(selectingListItem.tableId).toBe('foreign-table')
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
      deps.schemaCache = createMockSchemaCache('test-table', () => ({
        loadTableWithRows: loadTableWithRowsMock,
        dispose: jest.fn(),
      }))

      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      const mockForeignKeyNode = { setValue: jest.fn() } as never
      creatingItem.startForeignKeySelection(mockForeignKeyNode, 'foreign-table')
      await flushPromises()

      expect(loadTableWithRowsMock).toHaveBeenCalledTimes(1)

      const selectingListItem = manager.stack[1] as RowListItem
      selectingListItem.toCreating()
      await flushPromises()

      expect(loadTableWithRowsMock).toHaveBeenCalledTimes(1)

      const creatingInForeign = manager.stack[1] as RowCreatingItem
      creatingInForeign.toList()

      const listInForeign = manager.stack[1] as RowListItem
      listInForeign.toCreating()
      await flushPromises()

      expect(loadTableWithRowsMock).toHaveBeenCalledTimes(1)
    })

    it('should not load schema when creating row in main table', async () => {
      const loadTableWithRowsMock = jest.fn()
      const deps = createMockDeps()
      deps.schemaCache = createMockSchemaCache('test-table', () => ({
        loadTableWithRows: loadTableWithRowsMock,
        dispose: jest.fn(),
      }))

      const manager = new RowStackManager(deps)
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()

      expect(loadTableWithRowsMock).not.toHaveBeenCalled()
    })
  })
})
