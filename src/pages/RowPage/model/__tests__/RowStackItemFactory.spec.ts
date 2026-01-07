jest.mock('src/widgets/TreeDataCard', () => ({
  RootValueNode: jest.fn(),
}))

import { RowStackItemFactory, RowStackItemFactoryDeps } from '../RowStackItemFactory.ts'
import { RowStackItemType } from '../../config/types.ts'
import { JsonObjectSchema } from 'src/entities/Schema'
import { createMockRowDataCardStore, createMockNotifications, createMockNavigation } from './createMockDeps.ts'

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
  permissionContext: {
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
  storeFactory: {
    createEmpty: jest.fn().mockReturnValue(createMockRowDataCardStore()),
    createFromClone: jest.fn().mockReturnValue(createMockRowDataCardStore()),
    createForUpdating: jest.fn().mockReturnValue(createMockRowDataCardStore()),
  } as never,
  schemaCache: {
    get: jest.fn().mockReturnValue(createTestSchema()),
  } as never,
  notifications: createMockNotifications(),
  navigation: createMockNavigation(),
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

    it('should use storeFactory.createEmpty', () => {
      const deps = createMockFactoryDeps()
      const factory = new RowStackItemFactory(deps)
      const schema = createTestSchema()

      factory.createCreatingItem('users', schema, false)

      expect(deps.storeFactory.createEmpty).toHaveBeenCalledWith(schema, 'users')
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

    it('should use storeFactory.createFromClone', () => {
      const deps = createMockFactoryDeps()
      const factory = new RowStackItemFactory(deps)
      const schema = createTestSchema()
      const sourceData = { name: 'Original' }

      factory.createCreatingItemFromClone('users', schema, sourceData, false)

      expect(deps.storeFactory.createFromClone).toHaveBeenCalledWith(schema, 'users', sourceData)
    })
  })

  describe('createCreatingItemWithStore', () => {
    it('should create RowCreatingItem with provided store', () => {
      const deps = createMockFactoryDeps()
      const factory = new RowStackItemFactory(deps)
      const store = createMockRowDataCardStore()

      const item = factory.createCreatingItemWithStore('users', store as never, false)

      expect(item.type).toBe(RowStackItemType.Creating)
      expect(item.store).toBe(store)
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

    it('should use storeFactory.createForUpdating', () => {
      const deps = createMockFactoryDeps()
      const factory = new RowStackItemFactory(deps)
      const schema = createTestSchema()
      const data = { name: 'Test' }

      factory.createUpdatingItem('users', schema, 'row-123', data, 2, false)

      expect(deps.storeFactory.createForUpdating).toHaveBeenCalledWith(schema, 'row-123', data, 2)
    })
  })

  describe('createUpdatingItemWithStore', () => {
    it('should create RowUpdatingItem with provided store', () => {
      const deps = createMockFactoryDeps()
      const factory = new RowStackItemFactory(deps)
      const store = createMockRowDataCardStore()

      const item = factory.createUpdatingItemWithStore('users', store as never, 'row-123', false)

      expect(item.type).toBe(RowStackItemType.Updating)
      expect(item.store).toBe(store)
      expect(item.originalRowId).toBe('row-123')
    })
  })
})
