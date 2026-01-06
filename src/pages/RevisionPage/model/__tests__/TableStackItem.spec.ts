import { TableStackItem, TableStackItemDeps } from '../TableStackItem.ts'
import { TableStackStateType } from '../../config/types.ts'

const createMockDeps = (
  overrides: Partial<{
    isDraftRevision: boolean
    canCreateTable: boolean
  }> = {},
): TableStackItemDeps => ({
  projectContext: {
    isDraftRevision: overrides.isDraftRevision ?? true,
    revision: { id: 'rev-1' },
    branch: {
      draft: { id: 'draft-1' },
      touched: false,
    },
    updateTouched: jest.fn(),
  } as never,
  permissionContext: {
    canCreateTable: overrides.canCreateTable ?? true,
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

describe('TableStackItem', () => {
  describe('initialization', () => {
    it('should create with List state', () => {
      const deps = createMockDeps()
      const item = new TableStackItem(deps, { type: TableStackStateType.List })

      expect(item.state).toEqual({ type: TableStackStateType.List })
    })

    it('should have unique id', () => {
      const deps = createMockDeps()
      const item1 = new TableStackItem(deps, { type: TableStackStateType.List })
      const item2 = new TableStackItem(deps, { type: TableStackStateType.List })

      expect(item1.id).not.toEqual(item2.id)
    })
  })

  describe('computed properties', () => {
    it('should return isEditableRevision from projectContext', () => {
      const deps = createMockDeps({ isDraftRevision: true })
      const item = new TableStackItem(deps, { type: TableStackStateType.List })

      expect(item.isEditableRevision).toBe(true)
    })

    it('should return canCreateTable based on permissions and editable state', () => {
      const deps = createMockDeps({ isDraftRevision: true, canCreateTable: true })
      const item = new TableStackItem(deps, { type: TableStackStateType.List })

      expect(item.canCreateTable).toBe(true)
    })

    it('should return false for canCreateTable when not editable', () => {
      const deps = createMockDeps({ isDraftRevision: false, canCreateTable: true })
      const item = new TableStackItem(deps, { type: TableStackStateType.List })

      expect(item.canCreateTable).toBe(false)
    })

    it('should return revisionId from projectContext', () => {
      const deps = createMockDeps()
      const item = new TableStackItem(deps, { type: TableStackStateType.List })

      expect(item.revisionId).toBe('rev-1')
    })
  })

  describe('state transitions', () => {
    it('should transition to List state', () => {
      const deps = createMockDeps()
      const item = new TableStackItem(deps, { type: TableStackStateType.List })

      item.toCreating()
      expect(item.state.type).toBe(TableStackStateType.Creating)

      item.toList()
      expect(item.state).toEqual({ type: TableStackStateType.List })
    })

    it('should transition to Creating state with new store', () => {
      const deps = createMockDeps()
      const item = new TableStackItem(deps, { type: TableStackStateType.List })

      item.toCreating()

      expect(item.state.type).toBe(TableStackStateType.Creating)
      if (item.state.type === TableStackStateType.Creating) {
        expect(item.state.store).toBeDefined()
      }
    })
  })

  describe('foreign key handling', () => {
    it('should save and restore state for foreign key selection', () => {
      const deps = createMockDeps()
      const item = new TableStackItem(deps, { type: TableStackStateType.List })

      item.toCreating()
      const originalStore = item.state.type === TableStackStateType.Creating ? item.state.store : null

      item.saveStateForForeignKey()
      item.toList()

      expect(item.state.type).toBe(TableStackStateType.List)

      item.restoreStateAfterForeignKey()

      expect(item.state.type).toBe(TableStackStateType.Creating)
      if (item.state.type === TableStackStateType.Creating) {
        expect(item.state.store).toBe(originalStore)
      }
    })

    it('should not restore if nothing was saved', () => {
      const deps = createMockDeps()
      const item = new TableStackItem(deps, { type: TableStackStateType.List })

      item.restoreStateAfterForeignKey()

      expect(item.state.type).toBe(TableStackStateType.List)
    })
  })

  describe('dispose', () => {
    it('should dispose mutation data source', () => {
      const deps = createMockDeps()
      const item = new TableStackItem(deps, { type: TableStackStateType.List })

      item.dispose()

      expect(deps.mutationDataSource.dispose).toHaveBeenCalled()
    })
  })
})
