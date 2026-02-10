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
    it('should create with empty stack before init', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)

      expect(manager.stack).toHaveLength(0)
    })

    it('should create with one RowListItem when no row in context', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)

      manager.init()
      await flushPromises()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.List)
      expect(manager.stack[0].isSelectingForeignKey).toBe(false)
    })

    it('should create with one RowUpdatingItem when row exists in context', async () => {
      const deps = createMockDeps({
        row: { id: 'row-123', data: { name: 'Test Row' }, foreignKeysCount: 2 },
      })
      const manager = new RowStackManager(deps)

      manager.init()
      await flushPromises()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.Updating)
      expect(manager.stack[0].isSelectingForeignKey).toBe(false)

      const updatingItem = manager.stack[0] as RowUpdatingItem
      expect(updatingItem.originalRowId).toBe('row-123')
    })

    it('should set isFirstLevel true on RowUpdatingItem when row provided', async () => {
      const deps = createMockDeps({
        row: { id: 'row-123', data: { name: 'Test Row' }, foreignKeysCount: 0 },
      })
      const manager = new RowStackManager(deps)

      manager.init()
      await flushPromises()

      expect(manager.stack[0].isFirstLevel).toBe(true)
    })

    it('should set tableId from routerParams', async () => {
      const deps = createMockDeps({ tableId: 'my-table' })
      const manager = new RowStackManager(deps)

      manager.init()
      await flushPromises()

      expect(manager.stack[0].tableId).toBe('my-table')
    })

    it('should do nothing when tableId is not in routerParams', async () => {
      const deps = createMockDeps()
      ;(deps.routerParams as { tableId: null }).tableId = null
      const manager = new RowStackManager(deps)

      manager.init()
      await flushPromises()

      expect(manager.stack).toHaveLength(0)
    })
  })

  describe('item.toCreating', () => {
    it('should replace RowListItem with RowCreatingItem', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.Creating)
    })

    it('should preserve isSelectingForeignKey', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
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
      manager.init()
      await flushPromises()
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
    it('should replace RowCreatingItem with RowUpdatingItem preserving state', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem
      const state = creatingItem.state

      creatingItem.toUpdating()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.Updating)

      const updatingItem = manager.stack[0] as RowUpdatingItem
      expect(updatingItem.state).toBe(state)
    })
  })

  describe('item.startForeignKeySelection', () => {
    it('should push new RowListItem with isSelectingForeignKey true', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      creatingItem.startForeignKeySelection('fk-table')
      await flushPromises()

      expect(manager.stack).toHaveLength(2)
      expect(manager.stack[1].type).toBe(RowStackItemType.List)
      expect(manager.stack[1].isSelectingForeignKey).toBe(true)
    })

    it('should set pending request on parent item', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      creatingItem.startForeignKeySelection('fk-table')
      await flushPromises()

      expect(creatingItem.hasPendingRequest).toBe(true)
    })

    it('should set tableId for selecting item from foreignTableId', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      creatingItem.startForeignKeySelection('foreign-table')
      await flushPromises()

      expect(manager.stack[1].tableId).toBe('foreign-table')
    })
  })

  describe('item.startForeignKeyCreation', () => {
    it('should push RowCreatingItem with isSelectingForeignKey true', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      creatingItem.startForeignKeyCreation('fk-table')
      await flushPromises()

      expect(manager.stack).toHaveLength(2)
      expect(manager.stack[1].type).toBe(RowStackItemType.Creating)
      expect(manager.stack[1].isSelectingForeignKey).toBe(true)
    })

    it('should set pending request on parent item', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      creatingItem.startForeignKeyCreation('fk-table')
      await flushPromises()

      expect(creatingItem.hasPendingRequest).toBe(true)
    })

    it('should set tableId for creating item from foreignTableId', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      creatingItem.startForeignKeyCreation('foreign-table')
      await flushPromises()

      expect(manager.stack[1].tableId).toBe('foreign-table')
    })

    it('should restore parent after row is created and selected', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const parentCreatingItem = manager.stack[0] as RowCreatingItem

      parentCreatingItem.startForeignKeyCreation('fk-table')
      await flushPromises()

      const childCreatingItem = manager.stack[1] as RowCreatingItem
      childCreatingItem.selectForeignKeyRow('new-created-row-id')

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.Creating)
    })
  })

  describe('item.selectForeignKeyRow (completeForeignKeySelection)', () => {
    it('should remove selecting item from stack and restore parent', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem
      const state = creatingItem.state

      creatingItem.startForeignKeySelection('fk-table')
      await flushPromises()

      expect(manager.stack).toHaveLength(2)

      const selectingListItem = manager.stack[1] as RowListItem
      selectingListItem.selectForeignKeyRow('selected-row-id')

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(RowStackItemType.Creating)
      expect((manager.stack[0] as RowCreatingItem).state).toBe(state)
    })

    it('should clear pending request on parent', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      creatingItem.startForeignKeySelection('fk-table')
      await flushPromises()

      expect(creatingItem.hasPendingRequest).toBe(true)

      const selectingListItem = manager.stack[1] as RowListItem
      selectingListItem.selectForeignKeyRow('selected-row-id')

      expect(manager.stack[0].hasPendingRequest).toBe(false)
    })
  })

  describe('item.cancelForeignKeySelection', () => {
    it('should cancel all children and restore parent state', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem
      const state = creatingItem.state

      creatingItem.startForeignKeySelection('fk-table')
      await flushPromises()

      expect(manager.stack).toHaveLength(2)

      creatingItem.cancelForeignKeySelection()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].hasPendingRequest).toBe(false)
      expect(manager.stack[0].type).toBe(RowStackItemType.Creating)
      expect((manager.stack[0] as RowCreatingItem).state).toBe(state)
    })
  })

  describe('nested foreign key selection', () => {
    it('should handle multiple levels of nesting with list selection', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const level0 = manager.stack[0] as RowListItem

      level0.toCreating()
      await flushPromises()
      const creatingItem0 = manager.stack[0] as RowCreatingItem

      creatingItem0.startForeignKeySelection('fk-table-1')
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
      manager.init()
      await flushPromises()

      const listItem0 = manager.stack[0] as RowListItem
      listItem0.toCreating()
      await flushPromises()
      const creatingItem0 = manager.stack[0] as RowCreatingItem

      creatingItem0.startForeignKeySelection('fk-table-0')
      await flushPromises()

      expect(manager.stack).toHaveLength(2)

      const selectingList1 = manager.stack[1] as RowListItem
      selectingList1.selectForeignKeyRow('row-1')
      expect(manager.stack).toHaveLength(1)
    })
  })

  describe('currentItem', () => {
    it('should return undefined when stack is empty', () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)

      expect(manager.currentItem).toBeUndefined()
    })

    it('should return the last item in stack', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()

      expect(manager.currentItem).toBe(manager.stack[0])
    })

    it('should return the last item when multiple items in stack', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      creatingItem.startForeignKeySelection('fk-table')
      await flushPromises()

      expect(manager.currentItem).toBe(manager.stack[1])
    })
  })

  describe('isFirstLevel', () => {
    it('should set isFirstLevel true on first item', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const firstItem = manager.stack[0]

      expect(firstItem.isFirstLevel).toBe(true)
    })

    it('should not set isFirstLevel on pushed items', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      creatingItem.startForeignKeySelection('fk-table')
      await flushPromises()

      expect(manager.stack[1].isFirstLevel).toBe(false)
    })

    it('should preserve isFirstLevel when replacing item with toCreating', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
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
      manager.init()
      await flushPromises()
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
      manager.init()
      await flushPromises()
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
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      expect(creatingItem.isConnectingForeignKey).toBe(false)

      creatingItem.startForeignKeySelection('fk-table')
      await flushPromises()

      expect(creatingItem.isConnectingForeignKey).toBe(true)
    })

    it('should return false after selection completed', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      creatingItem.startForeignKeySelection('fk-table')
      await flushPromises()

      const selectingListItem = manager.stack[1] as RowListItem
      selectingListItem.selectForeignKeyRow('selected-row-id')

      expect((manager.stack[0] as RowCreatingItem).isConnectingForeignKey).toBe(false)
    })
  })

  describe('dispose', () => {
    it('should dispose all items in stack and clear schemaCache', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()

      const item = manager.stack[0]
      const disposeSpy = jest.spyOn(item, 'dispose')
      const schemaCacheDisposeSpy = jest.spyOn(deps.schemaCache, 'dispose')

      manager.dispose()

      expect(disposeSpy).toHaveBeenCalled()
      expect(schemaCacheDisposeSpy).toHaveBeenCalled()
      expect(manager.stack).toHaveLength(0)
    })

    it('should dispose all nested items', async () => {
      const deps = createMockDeps()
      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      creatingItem.startForeignKeySelection('fk-table')
      await flushPromises()

      expect(manager.stack).toHaveLength(2)

      const disposeSpy0 = jest.spyOn(manager.stack[0], 'dispose')
      const disposeSpy1 = jest.spyOn(manager.stack[1], 'dispose')

      manager.dispose()

      expect(disposeSpy0).toHaveBeenCalled()
      expect(disposeSpy1).toHaveBeenCalled()
      expect(manager.stack).toHaveLength(0)
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
      deps.schemaCache = createMockSchemaCache(() => ({
        loadTableWithRows: loadTableWithRowsMock,
        dispose: jest.fn(),
      }))

      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      creatingItem.startForeignKeySelection('foreign-table')
      await flushPromises()

      expect(loadTableWithRowsMock).toHaveBeenCalledWith('draft-1', 'foreign-table', 0)
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
      deps.schemaCache = createMockSchemaCache(() => ({
        loadTableWithRows: loadTableWithRowsMock,
        dispose: jest.fn(),
      }))

      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()
      const creatingItem = manager.stack[0] as RowCreatingItem

      creatingItem.startForeignKeySelection('foreign-table')
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
      deps.schemaCache = createMockSchemaCache(() => ({
        loadTableWithRows: loadTableWithRowsMock,
        dispose: jest.fn(),
      }))

      const manager = new RowStackManager(deps)
      manager.init()
      await flushPromises()
      const listItem = manager.stack[0] as RowListItem

      listItem.toCreating()
      await flushPromises()

      expect(loadTableWithRowsMock).not.toHaveBeenCalled()
    })
  })
})
