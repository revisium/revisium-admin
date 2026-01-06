import { TableStackManager } from '../TableStackManager.ts'
import { TableStackItemDeps } from '../TableStackItem.ts'
import { TableStackStateType } from '../../config/types.ts'

const createMockDeps = (): TableStackItemDeps => ({
  projectContext: {
    isDraftRevision: true,
    revision: { id: 'rev-1' },
    branch: {
      draft: { id: 'draft-1' },
      touched: false,
    },
    updateTouched: jest.fn(),
  } as never,
  permissionContext: {
    canCreateTable: true,
  } as never,
  mutationDataSource: {
    createTable: jest.fn(),
    updateTable: jest.fn(),
    renameTable: jest.fn(),
    dispose: jest.fn(),
  } as never,
  tableListRefreshService: {
    refresh: jest.fn(),
  } as never,
  fetchDataSourceFactory: () =>
    ({
      fetch: jest.fn().mockResolvedValue({
        id: 'table-1',
        schema: { type: 'object', properties: {}, additionalProperties: false, required: [] },
      }),
      dispose: jest.fn(),
    }) as never,
})

describe('TableStackManager', () => {
  describe('initialization', () => {
    it('should create with one item in List state', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)

      expect(manager.stack).toHaveLength(1)
      expect(manager.stack[0].state).toEqual({ type: TableStackStateType.List })
    })
  })

  describe('selectForeignKey', () => {
    it('should push new item to stack', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      const firstItem = manager.stack[0]

      firstItem.toCreating()

      const mockForeignKeyNode = { setValue: jest.fn() } as never

      manager.selectForeignKey(firstItem, mockForeignKeyNode)

      expect(manager.stack).toHaveLength(2)
      expect(manager.stack[1].state.type).toBe(TableStackStateType.List)
    })

    it('should save item state before pushing', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      const firstItem = manager.stack[0]

      firstItem.toCreating()
      const store = firstItem.state.type === TableStackStateType.Creating ? firstItem.state.store : null

      const mockForeignKeyNode = { setValue: jest.fn() } as never
      manager.selectForeignKey(firstItem, mockForeignKeyNode)

      expect(firstItem.hasPendingRequest).toBe(true)

      manager.resolveRequest(manager.stack[1], 'selected-table-id')

      expect(firstItem.state.type).toBe(TableStackStateType.Creating)
      if (firstItem.state.type === TableStackStateType.Creating) {
        expect(firstItem.state.store).toBe(store)
      }
    })

    it('should restore state on reject', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      const firstItem = manager.stack[0]

      firstItem.toCreating()
      const store = firstItem.state.type === TableStackStateType.Creating ? firstItem.state.store : null

      const mockForeignKeyNode = { setValue: jest.fn() } as never
      manager.selectForeignKey(firstItem, mockForeignKeyNode)

      manager.rejectRequest(manager.stack[1])

      expect(firstItem.state.type).toBe(TableStackStateType.Creating)
      if (firstItem.state.type === TableStackStateType.Creating) {
        expect(firstItem.state.store).toBe(store)
      }
    })
  })

  describe('resolveRequest', () => {
    it('should remove selecting item from stack', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      const firstItem = manager.stack[0]

      firstItem.toCreating()

      const mockForeignKeyNode = { setValue: jest.fn() } as never
      manager.selectForeignKey(firstItem, mockForeignKeyNode)

      expect(manager.stack).toHaveLength(2)

      manager.resolveRequest(manager.stack[1], 'selected-table-id')

      expect(manager.stack).toHaveLength(1)
    })

    it('should clear pending request on parent', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      const firstItem = manager.stack[0]

      firstItem.toCreating()

      const mockForeignKeyNode = { setValue: jest.fn() } as never
      manager.selectForeignKey(firstItem, mockForeignKeyNode)

      expect(firstItem.hasPendingRequest).toBe(true)

      manager.resolveRequest(manager.stack[1], 'selected-table-id')

      expect(firstItem.hasPendingRequest).toBe(false)
    })
  })

  describe('cancelFromItem', () => {
    it('should cancel all children and restore parent state', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      const firstItem = manager.stack[0]

      firstItem.toCreating()

      const mockForeignKeyNode = { setValue: jest.fn() } as never
      manager.selectForeignKey(firstItem, mockForeignKeyNode)

      expect(manager.stack).toHaveLength(2)

      manager.cancelFromItem(firstItem)

      expect(manager.stack).toHaveLength(1)
      expect(firstItem.hasPendingRequest).toBe(false)
      expect(firstItem.state.type).toBe(TableStackStateType.Creating)
    })
  })

  describe('dispose', () => {
    it('should dispose all items', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      const firstItem = manager.stack[0]

      firstItem.toCreating()

      const mockForeignKeyNode = { setValue: jest.fn() } as never
      manager.selectForeignKey(firstItem, mockForeignKeyNode)

      manager.dispose()

      expect(deps.mutationDataSource.dispose).toHaveBeenCalledTimes(2)
    })
  })

  describe('nested foreign key selection', () => {
    it('should handle multiple levels of nesting', () => {
      const deps = createMockDeps()
      const manager = new TableStackManager(deps)
      const level0 = manager.stack[0]

      level0.toCreating()
      const mockForeignKeyNode1 = { setValue: jest.fn() } as never
      manager.selectForeignKey(level0, mockForeignKeyNode1)

      expect(manager.stack).toHaveLength(2)

      const level1 = manager.stack[1]
      level1.toCreating()
      const mockForeignKeyNode2 = { setValue: jest.fn() } as never
      manager.selectForeignKey(level1, mockForeignKeyNode2)

      expect(manager.stack).toHaveLength(3)

      manager.resolveRequest(manager.stack[2], 'table-level-2')
      expect(manager.stack).toHaveLength(2)

      manager.resolveRequest(manager.stack[1], 'table-level-1')
      expect(manager.stack).toHaveLength(1)
    })
  })
})
