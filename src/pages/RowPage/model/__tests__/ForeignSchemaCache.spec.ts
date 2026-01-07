import { ForeignSchemaCache, ForeignSchemaCacheDataSource } from '../ForeignSchemaCache.ts'
import { JsonObjectSchema } from 'src/entities/Schema'

describe('ForeignSchemaCache', () => {
  const createTestSchema = (name: string): JsonObjectSchema =>
    ({
      type: 'object',
      properties: { [name]: { type: 'string', default: '' } },
      additionalProperties: false,
      required: [name],
    }) as JsonObjectSchema

  const createMockDataSource = (schema: JsonObjectSchema): ForeignSchemaCacheDataSource => ({
    loadTableWithRows: jest.fn().mockResolvedValue({
      table: { id: 'foreign-table', schema },
      rows: [],
    }),
    dispose: jest.fn(),
  })

  describe('get', () => {
    it('should return main schema for main tableId', () => {
      const mainSchema = createTestSchema('main')
      const cache = new ForeignSchemaCache('main-table', mainSchema, jest.fn())

      const result = cache.get('main-table')

      expect(result).toBe(mainSchema)
    })

    it('should return undefined for unknown tableId', () => {
      const mainSchema = createTestSchema('main')
      const cache = new ForeignSchemaCache('main-table', mainSchema, jest.fn())

      const result = cache.get('unknown-table')

      expect(result).toBeUndefined()
    })

    it('should return cached schema after load', async () => {
      const mainSchema = createTestSchema('main')
      const foreignSchema = createTestSchema('foreign')
      const mockDataSource = createMockDataSource(foreignSchema)
      const cache = new ForeignSchemaCache('main-table', mainSchema, () => mockDataSource)

      await cache.load('rev-1', 'foreign-table')
      const result = cache.get('foreign-table')

      expect(result).toBe(foreignSchema)
    })
  })

  describe('getOrThrow', () => {
    it('should return main schema for main tableId', () => {
      const mainSchema = createTestSchema('main')
      const cache = new ForeignSchemaCache('main-table', mainSchema, jest.fn())

      const result = cache.getOrThrow('main-table')

      expect(result).toBe(mainSchema)
    })

    it('should throw for unknown tableId', () => {
      const mainSchema = createTestSchema('main')
      const cache = new ForeignSchemaCache('main-table', mainSchema, jest.fn())

      expect(() => cache.getOrThrow('unknown-table')).toThrow('Schema for table unknown-table not available')
    })
  })

  describe('has', () => {
    it('should return true for main tableId', () => {
      const mainSchema = createTestSchema('main')
      const cache = new ForeignSchemaCache('main-table', mainSchema, jest.fn())

      expect(cache.has('main-table')).toBe(true)
    })

    it('should return false for unknown tableId', () => {
      const mainSchema = createTestSchema('main')
      const cache = new ForeignSchemaCache('main-table', mainSchema, jest.fn())

      expect(cache.has('unknown-table')).toBe(false)
    })

    it('should return true for loaded foreign table', async () => {
      const mainSchema = createTestSchema('main')
      const foreignSchema = createTestSchema('foreign')
      const mockDataSource = createMockDataSource(foreignSchema)
      const cache = new ForeignSchemaCache('main-table', mainSchema, () => mockDataSource)

      await cache.load('rev-1', 'foreign-table')

      expect(cache.has('foreign-table')).toBe(true)
    })
  })

  describe('load', () => {
    it('should return main schema immediately for main tableId', async () => {
      const mainSchema = createTestSchema('main')
      const mockFactory = jest.fn()
      const cache = new ForeignSchemaCache('main-table', mainSchema, mockFactory)

      const result = await cache.load('rev-1', 'main-table')

      expect(result).toBe(mainSchema)
      expect(mockFactory).not.toHaveBeenCalled()
    })

    it('should load and cache foreign schema', async () => {
      const mainSchema = createTestSchema('main')
      const foreignSchema = createTestSchema('foreign')
      const mockDataSource = createMockDataSource(foreignSchema)
      const cache = new ForeignSchemaCache('main-table', mainSchema, () => mockDataSource)

      const result = await cache.load('rev-1', 'foreign-table')

      expect(result).toBe(foreignSchema)
      expect(mockDataSource.loadTableWithRows).toHaveBeenCalledWith('rev-1', 'foreign-table', 0)
      expect(mockDataSource.dispose).toHaveBeenCalled()
    })

    it('should return cached schema on second load', async () => {
      const mainSchema = createTestSchema('main')
      const foreignSchema = createTestSchema('foreign')
      const mockDataSource = createMockDataSource(foreignSchema)
      const cache = new ForeignSchemaCache('main-table', mainSchema, () => mockDataSource)

      await cache.load('rev-1', 'foreign-table')
      const result = await cache.load('rev-1', 'foreign-table')

      expect(result).toBe(foreignSchema)
      expect(mockDataSource.loadTableWithRows).toHaveBeenCalledTimes(1)
    })

    it('should throw when dataSource returns null', async () => {
      const mainSchema = createTestSchema('main')
      const mockDataSource: ForeignSchemaCacheDataSource = {
        loadTableWithRows: jest.fn().mockResolvedValue(null),
        dispose: jest.fn(),
      }
      const cache = new ForeignSchemaCache('main-table', mainSchema, () => mockDataSource)

      await expect(cache.load('rev-1', 'foreign-table')).rejects.toThrow(
        'Failed to load schema for table foreign-table',
      )
      expect(mockDataSource.dispose).toHaveBeenCalled()
    })

    it('should dispose dataSource even on error', async () => {
      const mainSchema = createTestSchema('main')
      const mockDataSource: ForeignSchemaCacheDataSource = {
        loadTableWithRows: jest.fn().mockRejectedValue(new Error('Network error')),
        dispose: jest.fn(),
      }
      const cache = new ForeignSchemaCache('main-table', mainSchema, () => mockDataSource)

      await expect(cache.load('rev-1', 'foreign-table')).rejects.toThrow('Network error')
      expect(mockDataSource.dispose).toHaveBeenCalled()
    })
  })
})
