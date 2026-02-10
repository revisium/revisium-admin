import { RowStackItemFactory, RowStackItemFactoryDeps } from '../RowStackItemFactory.ts'
import { RowStackItemType } from '../../config/types.ts'
import { JsonObjectSchema } from 'src/entities/Schema'
import { createMockNotifications, createMockNavigation } from './createMockDeps.ts'

const createTestSchema = (): JsonObjectSchema =>
  ({
    type: 'object',
    properties: {
      name: { type: 'string', default: '' },
    },
    additionalProperties: false,
    required: ['name'],
  }) as JsonObjectSchema

const createMockFactoryDeps = (): RowStackItemFactoryDeps => ({
  projectContext: {
    isDraftRevision: true,
    revision: { id: 'rev-1' },
    branch: {
      draft: { id: 'draft-1' },
      touched: false,
    },
    row: null,
    updateTouched: jest.fn(),
  } as never,
  projectPermissions: {
    canCreateRow: true,
  } as never,
  mutationDataSource: {
    createRow: jest.fn(),
    updateRow: jest.fn(),
    renameRow: jest.fn(),
    dispose: jest.fn(),
  } as never,
  rowListRefreshService: {
    refresh: jest.fn(),
  } as never,
  schemaCache: {
    get: jest.fn().mockReturnValue(createTestSchema()),
    getOrThrow: jest.fn().mockReturnValue(createTestSchema()),
  } as never,
  notifications: createMockNotifications(),
  navigation: createMockNavigation(),
  searchForeignKey: jest.fn().mockResolvedValue({ ids: [], hasMore: false }),
  requestForeignKeySelection: jest.fn().mockResolvedValue(null),
  requestForeignKeyCreation: jest.fn().mockResolvedValue(null),
})

describe('RowStackItemFactory', () => {
  describe('createListItem', () => {
    it('should create RowListItem with correct type', () => {
      const deps = createMockFactoryDeps()
      const factory = new RowStackItemFactory(deps)

      const item = factory.createListItem('users', false)

      expect(item.type).toBe(RowStackItemType.List)
      expect(item.tableId).toBe('users')
      expect(item.isSelectingForeignKey).toBe(false)
    })

    it('should create RowListItem with isSelectingForeignKey true', () => {
      const deps = createMockFactoryDeps()
      const factory = new RowStackItemFactory(deps)

      const item = factory.createListItem('users', true)

      expect(item.isSelectingForeignKey).toBe(true)
    })

    it('should get schema from cache', () => {
      const deps = createMockFactoryDeps()
      const factory = new RowStackItemFactory(deps)

      factory.createListItem('users', false)

      expect(deps.schemaCache.get).toHaveBeenCalledWith('users')
    })
  })

  describe('createCreatingItem', () => {
    it('should create RowCreatingItem with correct type', () => {
      const deps = createMockFactoryDeps()
      const factory = new RowStackItemFactory(deps)
      const schema = createTestSchema()

      const item = factory.createCreatingItem('users', schema, false)

      expect(item.type).toBe(RowStackItemType.Creating)
      expect(item.tableId).toBe('users')
      expect(item.isSelectingForeignKey).toBe(false)
    })

    it('should create RowEditorState with creating mode', () => {
      const deps = createMockFactoryDeps()
      const factory = new RowStackItemFactory(deps)
      const schema = createTestSchema()

      const item = factory.createCreatingItem('users', schema, false)

      expect(item.state).toBeDefined()
      expect(item.state.editor).toBeDefined()
    })
  })

  describe('createCreatingItemFromClone', () => {
    it('should create RowCreatingItem with cloned data', () => {
      const deps = createMockFactoryDeps()
      const factory = new RowStackItemFactory(deps)
      const schema = createTestSchema()
      const sourceData = { name: 'Original' }

      const item = factory.createCreatingItemFromClone('users', schema, sourceData, false)

      expect(item.type).toBe(RowStackItemType.Creating)
    })

    it('should create RowEditorState with initial value', () => {
      const deps = createMockFactoryDeps()
      const factory = new RowStackItemFactory(deps)
      const schema = createTestSchema()
      const sourceData = { name: 'Original' }

      const item = factory.createCreatingItemFromClone('users', schema, sourceData, false)

      expect(item.state).toBeDefined()
      expect(item.state.editor).toBeDefined()
    })
  })

  describe('createUpdatingItem', () => {
    it('should create RowUpdatingItem with correct type', () => {
      const deps = createMockFactoryDeps()
      const factory = new RowStackItemFactory(deps)
      const schema = createTestSchema()

      const item = factory.createUpdatingItem('users', schema, 'row-123', { name: 'Test' }, 2, false)

      expect(item.type).toBe(RowStackItemType.Updating)
      expect(item.tableId).toBe('users')
      expect(item.originalRowId).toBe('row-123')
      expect(item.isSelectingForeignKey).toBe(false)
    })

    it('should create RowEditorState with editing mode', () => {
      const deps = createMockFactoryDeps()
      const factory = new RowStackItemFactory(deps)
      const schema = createTestSchema()
      const data = { name: 'Test' }

      const item = factory.createUpdatingItem('users', schema, 'row-123', data, 2, false)

      expect(item.state).toBeDefined()
      expect(item.state.editor).toBeDefined()
    })
  })

  describe('createUpdatingItemWithState', () => {
    it('should create RowUpdatingItem with provided state', () => {
      const deps = createMockFactoryDeps()
      const factory = new RowStackItemFactory(deps)
      const schema = createTestSchema()

      const existingItem = factory.createUpdatingItem('users', schema, 'row-123', { name: 'Test' }, 0, false)
      const state = existingItem.state

      const item = factory.createUpdatingItemWithState('users', state, 'row-123', false)

      expect(item.type).toBe(RowStackItemType.Updating)
      expect(item.state).toBe(state)
      expect(item.originalRowId).toBe('row-123')
    })
  })
})
