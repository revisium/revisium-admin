jest.mock('src/shared/model/RouterService.ts', () => ({
  RouterService: jest.fn(),
}))

import { TableStackManager } from '../TableStackManager.ts'
import { TableListItem, TableCreatingItem, TableUpdatingItem } from '../items'
import { TableStackItemType } from '../../config/types.ts'
import { createMockManagerDeps as createMockDeps } from './createMockDeps.ts'

describe('TableStackManager', () => {
  describe('initialization', () => {
    it('should create with empty stack before init', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)

      expect(manager.stack).toHaveLength(0)
    })

    it('should create with one TableListItem after init', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(TableStackItemType.List)
      expect(manager.stack[0].isSelectingForeignKey).toBe(false)
    })
  })

  describe('dispose', () => {
    it('should dispose all items and clear stack', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()

      const item = manager.stack[0]
      const disposeSpy = jest.spyOn(item, 'dispose')

      manager.dispose()

      expect(disposeSpy).toHaveBeenCalled()
      expect(manager.stack).toHaveLength(0)
    })
  })

  describe('item.toCreating', () => {
    it('should replace TableListItem with TableCreatingItem', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()
      const listItem = manager.stack[0] as TableListItem

      listItem.toCreating()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(TableStackItemType.Creating)
    })

    it('should preserve isSelectingForeignKey', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()
      const listItem = manager.stack[0] as TableListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as TableCreatingItem

      expect(creatingItem.isSelectingForeignKey).toBe(false)
    })
  })

  describe('item.toList', () => {
    it('should replace TableCreatingItem with TableListItem', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()
      const listItem = manager.stack[0] as TableListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as TableCreatingItem

      creatingItem.toList()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(TableStackItemType.List)
    })
  })

  describe('item.toUpdating (from Creating)', () => {
    it('should replace TableCreatingItem with TableUpdatingItem preserving viewModel state', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()
      const listItem = manager.stack[0] as TableListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as TableCreatingItem
      const tableId = creatingItem.viewModel.tableId

      creatingItem.toUpdating()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(TableStackItemType.Updating)

      const updatingItem = manager.stack[0] as TableUpdatingItem
      expect(updatingItem.viewModel.tableId).toBe(tableId)
    })
  })

  describe('item.startForeignKeySelection', () => {
    it('should push new TableListItem with isSelectingForeignKey true', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()
      const listItem = manager.stack[0] as TableListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as TableCreatingItem

      const mockResolve = jest.fn()
      creatingItem.startForeignKeySelection(mockResolve)

      expect(manager.stack).toHaveLength(2)
      expect(manager.stack[1].type).toBe(TableStackItemType.List)
      expect(manager.stack[1].isSelectingForeignKey).toBe(true)
    })

    it('should set pending request on parent item', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()
      const listItem = manager.stack[0] as TableListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as TableCreatingItem

      const mockResolve = jest.fn()
      creatingItem.startForeignKeySelection(mockResolve)

      expect(creatingItem.hasPendingRequest).toBe(true)
    })
  })

  describe('item.selectTable (completeForeignKeySelection)', () => {
    it('should remove selecting item from stack and restore parent', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()
      const listItem = manager.stack[0] as TableListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as TableCreatingItem
      const tableId = creatingItem.viewModel.tableId

      const mockResolve = jest.fn()
      creatingItem.startForeignKeySelection(mockResolve)

      expect(manager.stack).toHaveLength(2)

      const selectingListItem = manager.stack[1] as TableListItem
      selectingListItem.selectTable('selected-table-id')

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(TableStackItemType.Creating)
      expect((manager.stack[0] as TableCreatingItem).viewModel.tableId).toBe(tableId)
    })

    it('should clear pending request on parent', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()
      const listItem = manager.stack[0] as TableListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as TableCreatingItem

      const mockResolve = jest.fn()
      creatingItem.startForeignKeySelection(mockResolve)

      expect(creatingItem.hasPendingRequest).toBe(true)

      const selectingListItem = manager.stack[1] as TableListItem
      selectingListItem.selectTable('selected-table-id')

      expect(manager.stack[0].hasPendingRequest).toBe(false)
    })

    it('should call resolve with selected tableId', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()
      const listItem = manager.stack[0] as TableListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as TableCreatingItem

      const mockResolve = jest.fn()
      creatingItem.startForeignKeySelection(mockResolve)

      const selectingListItem = manager.stack[1] as TableListItem
      selectingListItem.selectTable('selected-table-id')

      expect(mockResolve).toHaveBeenCalledWith('selected-table-id')
    })
  })

  describe('item.cancelForeignKeySelection', () => {
    it('should cancel all children and restore parent state', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()
      const listItem = manager.stack[0] as TableListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as TableCreatingItem
      const tableId = creatingItem.viewModel.tableId

      const mockResolve = jest.fn()
      creatingItem.startForeignKeySelection(mockResolve)

      expect(manager.stack).toHaveLength(2)

      creatingItem.cancelForeignKeySelection()

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].hasPendingRequest).toBe(false)
      expect(manager.stack[0].type).toBe(TableStackItemType.Creating)
      expect((manager.stack[0] as TableCreatingItem).viewModel.tableId).toBe(tableId)
    })

    it('should call resolve with null on cancel', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()
      const listItem = manager.stack[0] as TableListItem

      listItem.toCreating()
      const creatingItem = manager.stack[0] as TableCreatingItem

      const mockResolve = jest.fn()
      creatingItem.startForeignKeySelection(mockResolve)

      creatingItem.cancelForeignKeySelection()

      expect(mockResolve).toHaveBeenCalledWith(null)
    })
  })

  describe('nested foreign key selection', () => {
    it('should handle multiple levels of nesting', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()
      const level0 = manager.stack[0] as TableListItem

      level0.toCreating()
      const creatingItem0 = manager.stack[0] as TableCreatingItem

      const mockResolve1 = jest.fn()
      creatingItem0.startForeignKeySelection(mockResolve1)

      expect(manager.stack).toHaveLength(2)

      const level1 = manager.stack[1] as TableListItem
      level1.toCreating()
      const creatingItem1 = manager.stack[1] as TableCreatingItem

      const mockResolve2 = jest.fn()
      creatingItem1.startForeignKeySelection(mockResolve2)

      expect(manager.stack).toHaveLength(3)

      const level2List = manager.stack[2] as TableListItem
      level2List.selectTable('table-level-2')
      expect(manager.stack).toHaveLength(2)
      expect(mockResolve2).toHaveBeenCalledWith('table-level-2')

      const level1List = manager.stack[1] as TableListItem
      level1List.selectTable('table-level-1')
      expect(manager.stack).toHaveLength(1)
      expect(mockResolve1).toHaveBeenCalledWith('table-level-1')
    })

    it('should handle three level nesting and restore correct parent state', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()

      const listItem0 = manager.stack[0] as TableListItem
      listItem0.toCreating()
      const creatingItem0 = manager.stack[0] as TableCreatingItem
      const tableId0 = creatingItem0.viewModel.tableId

      const mockResolve0 = jest.fn()
      creatingItem0.startForeignKeySelection(mockResolve0)

      expect(manager.stack).toHaveLength(2)
      expect(creatingItem0.hasPendingRequest).toBe(true)

      const listItem1 = manager.stack[1] as TableListItem
      listItem1.toCreating()
      const creatingItem1 = manager.stack[1] as TableCreatingItem
      const tableId1 = creatingItem1.viewModel.tableId

      const mockResolve1 = jest.fn()
      creatingItem1.startForeignKeySelection(mockResolve1)

      expect(manager.stack).toHaveLength(3)
      expect(creatingItem1.hasPendingRequest).toBe(true)

      const listItem2 = manager.stack[2] as TableListItem
      listItem2.toCreating()
      const creatingItem2 = manager.stack[2] as TableCreatingItem
      const tableId2 = creatingItem2.viewModel.tableId

      const mockResolve2 = jest.fn()
      creatingItem2.startForeignKeySelection(mockResolve2)

      expect(manager.stack).toHaveLength(4)
      expect(creatingItem2.hasPendingRequest).toBe(true)

      const selectingList3 = manager.stack[3] as TableListItem
      selectingList3.selectTable('table-3')

      expect(manager.stack).toHaveLength(3)
      expect(manager.stack[2].type).toBe(TableStackItemType.Creating)
      expect((manager.stack[2] as TableCreatingItem).viewModel.tableId).toBe(tableId2)
      expect(manager.stack[2].hasPendingRequest).toBe(false)

      const selectingList2 = manager.stack[2] as TableListItem
      selectingList2.selectTable('table-2')

      expect(manager.stack).toHaveLength(2)
      expect(manager.stack[1].type).toBe(TableStackItemType.Creating)
      expect((manager.stack[1] as TableCreatingItem).viewModel.tableId).toBe(tableId1)
      expect(manager.stack[1].hasPendingRequest).toBe(false)

      const selectingList1 = manager.stack[1] as TableListItem
      selectingList1.selectTable('table-1')

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].type).toBe(TableStackItemType.Creating)
      expect((manager.stack[0] as TableCreatingItem).viewModel.tableId).toBe(tableId0)
      expect(manager.stack[0].hasPendingRequest).toBe(false)
    })

    it('should call resolve with selected tableId for each level in three level nesting', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      manager.init()

      const listItem0 = manager.stack[0] as TableListItem
      listItem0.toCreating()
      const creatingItem0 = manager.stack[0] as TableCreatingItem

      const mockResolve0 = jest.fn()
      creatingItem0.startForeignKeySelection(mockResolve0)

      const listItem1 = manager.stack[1] as TableListItem
      listItem1.toCreating()
      const creatingItem1 = manager.stack[1] as TableCreatingItem

      const mockResolve1 = jest.fn()
      creatingItem1.startForeignKeySelection(mockResolve1)

      const listItem2 = manager.stack[2] as TableListItem
      listItem2.toCreating()
      const creatingItem2 = manager.stack[2] as TableCreatingItem

      const mockResolve2 = jest.fn()
      creatingItem2.startForeignKeySelection(mockResolve2)

      expect(manager.stack).toHaveLength(4)

      const selectingList3 = manager.stack[3] as TableListItem
      selectingList3.selectTable('table-3')
      expect(mockResolve2).toHaveBeenCalledWith('table-3')

      const selectingList2 = manager.stack[2] as TableListItem
      selectingList2.selectTable('table-2')
      expect(mockResolve1).toHaveBeenCalledWith('table-2')

      const selectingList1 = manager.stack[1] as TableListItem
      selectingList1.selectTable('table-1')
      expect(mockResolve0).toHaveBeenCalledWith('table-1')
    })
  })
})
