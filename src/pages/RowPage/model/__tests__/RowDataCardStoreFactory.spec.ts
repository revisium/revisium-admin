jest.mock('src/widgets/TreeDataCard', () => ({
  RootValueNode: jest.fn(),
}))

import { RowDataCardStoreFactory } from '../RowDataCardStoreFactory.ts'
import { JsonObjectSchema } from 'src/entities/Schema'

describe('RowDataCardStoreFactory', () => {
  const createTestSchema = (properties: Record<string, unknown> = {}): JsonObjectSchema =>
    ({
      type: 'object',
      properties: {
        name: { type: 'string', default: '' },
        ...properties,
      },
      additionalProperties: false,
      required: ['name'],
    }) as JsonObjectSchema

  describe('createEmpty', () => {
    it('should create store with generated rowId based on tableId', () => {
      const factory = new RowDataCardStoreFactory()
      const schema = createTestSchema()

      const store = factory.createEmpty(schema, 'users')

      expect(store.name.getPlainValue()).toMatch(/^users-[a-z0-9_-]{9}$/)
    })

    it('should create store with default values from schema', () => {
      const factory = new RowDataCardStoreFactory()
      const schema = createTestSchema({
        age: { type: 'number', default: 0 },
      })

      const store = factory.createEmpty(schema, 'users')

      const data = store.root.getPlainValue()
      expect(data).toEqual({ name: '', age: 0 })
    })

    it('should lowercase tableId in generated rowId', () => {
      const factory = new RowDataCardStoreFactory()
      const schema = createTestSchema()

      const store = factory.createEmpty(schema, 'MyTable')

      expect(store.name.getPlainValue()).toMatch(/^mytable-[a-z0-9_-]{9}$/)
    })
  })

  describe('createFromClone', () => {
    it('should create store with new generated rowId', () => {
      const factory = new RowDataCardStoreFactory()
      const schema = createTestSchema()
      const sourceData = { name: 'Original Name' }

      const store = factory.createFromClone(schema, 'users', sourceData)

      expect(store.name.getPlainValue()).toMatch(/^users-[a-z0-9_-]{9}$/)
    })

    it('should copy data from source', () => {
      const factory = new RowDataCardStoreFactory()
      const schema = createTestSchema({
        age: { type: 'number', default: 0 },
      })
      const sourceData = { name: 'John', age: 30 }

      const store = factory.createFromClone(schema, 'users', sourceData)

      const data = store.root.getPlainValue()
      expect(data).toEqual({ name: 'John', age: 30 })
    })

    it('should generate different rowId than source', () => {
      const factory = new RowDataCardStoreFactory()
      const schema = createTestSchema()
      const sourceData = { name: 'Test' }

      const store1 = factory.createFromClone(schema, 'users', sourceData)
      const store2 = factory.createFromClone(schema, 'users', sourceData)

      expect(store1.name.getPlainValue()).not.toBe(store2.name.getPlainValue())
    })
  })

  describe('createForUpdating', () => {
    it('should create store with provided rowId', () => {
      const factory = new RowDataCardStoreFactory()
      const schema = createTestSchema()
      const data = { name: 'Test Row' }

      const store = factory.createForUpdating(schema, 'row-123', data, 5)

      expect(store.name.getPlainValue()).toBe('row-123')
    })

    it('should create store with provided data', () => {
      const factory = new RowDataCardStoreFactory()
      const schema = createTestSchema({
        age: { type: 'number', default: 0 },
      })
      const data = { name: 'John', age: 25 }

      const store = factory.createForUpdating(schema, 'row-123', data, 0)

      const storeData = store.root.getPlainValue()
      expect(storeData).toEqual({ name: 'John', age: 25 })
    })

    it('should create store with base data (not touched)', () => {
      const factory = new RowDataCardStoreFactory()
      const schema = createTestSchema()
      const data = { name: 'Test' }

      const store = factory.createForUpdating(schema, 'row-123', data, 3)

      expect(store.touched).toBe(false)
    })
  })
})
