import { JsonSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { createJsonSchemaStore } from 'src/entities/Schema/lib/createJsonSchemaStore'
import { isSemanticName, selectDefaultColumns } from '../selectDefaultColumns'

describe('isSemanticName', () => {
  it('should return true for semantic names', () => {
    expect(isSemanticName('title')).toBe(true)
    expect(isSemanticName('Title')).toBe(true)
    expect(isSemanticName('TITLE')).toBe(true)
    expect(isSemanticName('name')).toBe(true)
    expect(isSemanticName('description')).toBe(true)
    expect(isSemanticName('text')).toBe(true)
    expect(isSemanticName('content')).toBe(true)
    expect(isSemanticName('label')).toBe(true)
    expect(isSemanticName('summary')).toBe(true)
    expect(isSemanticName('body')).toBe(true)
    expect(isSemanticName('message')).toBe(true)
    expect(isSemanticName('subject')).toBe(true)
    expect(isSemanticName('caption')).toBe(true)
    expect(isSemanticName('headline')).toBe(true)
  })

  it('should return false for non-semantic names', () => {
    expect(isSemanticName('id')).toBe(false)
    expect(isSemanticName('createdAt')).toBe(false)
    expect(isSemanticName('count')).toBe(false)
    expect(isSemanticName('myTitle')).toBe(false)
    expect(isSemanticName('titleCase')).toBe(false)
    expect(isSemanticName('user_name')).toBe(false)
  })
})

describe('selectDefaultColumns', () => {
  const createSchema = (properties: Record<string, JsonSchema>): JsonSchema => ({
    type: JsonSchemaTypeName.Object,
    additionalProperties: false,
    required: Object.keys(properties),
    properties,
  })

  describe('basic selection', () => {
    it('should select up to 3 columns by default', () => {
      const schema = createSchema({
        field1: { type: JsonSchemaTypeName.String, default: '' },
        field2: { type: JsonSchemaTypeName.String, default: '' },
        field3: { type: JsonSchemaTypeName.String, default: '' },
        field4: { type: JsonSchemaTypeName.String, default: '' },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store)

      expect(result.length).toBe(3)
    })

    it('should return fewer columns if schema has less fields', () => {
      const schema = createSchema({
        field1: { type: JsonSchemaTypeName.String, default: '' },
        field2: { type: JsonSchemaTypeName.Number, default: 0 },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store)

      expect(result.length).toBe(2)
    })

    it('should respect maxColumns parameter', () => {
      const schema = createSchema({
        field1: { type: JsonSchemaTypeName.String, default: '' },
        field2: { type: JsonSchemaTypeName.String, default: '' },
        field3: { type: JsonSchemaTypeName.String, default: '' },
        field4: { type: JsonSchemaTypeName.String, default: '' },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store, 2)

      expect(result.length).toBe(2)
    })
  })

  describe('file priority', () => {
    it('should prioritize file field over other fields', () => {
      const schema = createSchema({
        regularField: { type: JsonSchemaTypeName.String, default: '' },
        image: { $ref: SystemSchemaIds.File },
        anotherField: { type: JsonSchemaTypeName.Number, default: 0 },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store)

      expect(result[0].name).toBe('image')
    })

    it('should include only one file field', () => {
      const schema = createSchema({
        image1: { $ref: SystemSchemaIds.File },
        image2: { $ref: SystemSchemaIds.File },
        image3: { $ref: SystemSchemaIds.File },
        title: { type: JsonSchemaTypeName.String, default: '' },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store, 4)

      const fileFields = result.filter((r) => r.$ref === SystemSchemaIds.File)
      expect(fileFields.length).toBe(1)
    })
  })

  describe('semantic string priority', () => {
    it('should prioritize semantic names over regular strings', () => {
      const schema = createSchema({
        regularField: { type: JsonSchemaTypeName.String, default: '' },
        title: { type: JsonSchemaTypeName.String, default: '' },
        anotherField: { type: JsonSchemaTypeName.String, default: '' },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store, 1)

      expect(result[0].name).toBe('title')
    })

    it('should prioritize multiple semantic names', () => {
      const schema = createSchema({
        regularField: { type: JsonSchemaTypeName.String, default: '' },
        description: { type: JsonSchemaTypeName.String, default: '' },
        name: { type: JsonSchemaTypeName.String, default: '' },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store, 2)

      const names = result.map((r) => r.name)
      expect(names).toContain('description')
      expect(names).toContain('name')
    })
  })

  describe('foreign key priority', () => {
    it('should place foreign key fields last', () => {
      const schema = createSchema({
        categoryId: { type: JsonSchemaTypeName.String, default: '', foreignKey: 'categories' },
        regularField: { type: JsonSchemaTypeName.String, default: '' },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store)

      expect(result[0].name).toBe('regularField')
      expect(result[1].name).toBe('categoryId')
    })
  })

  describe('array fields exclusion', () => {
    it('should exclude fields inside arrays', () => {
      const schema = createSchema({
        items: {
          type: JsonSchemaTypeName.Array,
          items: {
            type: JsonSchemaTypeName.Object,
            additionalProperties: false,
            required: ['title'],
            properties: {
              title: { type: JsonSchemaTypeName.String, default: '' },
            },
          },
        },
        name: { type: JsonSchemaTypeName.String, default: '' },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store)

      expect(result.length).toBe(1)
      expect(result[0].name).toBe('name')
    })

    it('should exclude file fields inside arrays', () => {
      const schema = createSchema({
        gallery: {
          type: JsonSchemaTypeName.Array,
          items: { $ref: SystemSchemaIds.File },
        },
        name: { type: JsonSchemaTypeName.String, default: '' },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store)

      expect(result.length).toBe(1)
      expect(result[0].name).toBe('name')
    })
  })

  describe('depth priority', () => {
    it('should prefer shallower fields over deeper ones with same priority', () => {
      const schema = createSchema({
        nested: {
          type: JsonSchemaTypeName.Object,
          additionalProperties: false,
          required: ['deepTitle'],
          properties: {
            deepTitle: { type: JsonSchemaTypeName.String, default: '' },
          },
        },
        title: { type: JsonSchemaTypeName.String, default: '' },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store, 2)

      expect(result[0].name).toBe('title')
      expect(result[1].name).toBe('deepTitle')
    })

    it('should prefer shallower file over deeper file', () => {
      const schema = createSchema({
        nested: {
          type: JsonSchemaTypeName.Object,
          additionalProperties: false,
          required: ['deepImage'],
          properties: {
            deepImage: { $ref: SystemSchemaIds.File },
          },
        },
        image: { $ref: SystemSchemaIds.File },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store, 1)

      expect(result[0].name).toBe('image')
    })
  })

  describe('combined priorities', () => {
    it('should follow correct priority order: File > SemanticString > Primitive > ForeignKey', () => {
      const schema = createSchema({
        categoryId: { type: JsonSchemaTypeName.String, default: '', foreignKey: 'categories' },
        regularField: { type: JsonSchemaTypeName.String, default: '' },
        title: { type: JsonSchemaTypeName.String, default: '' },
        image: { $ref: SystemSchemaIds.File },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store, 4)

      expect(result[0].name).toBe('image')
      expect(result[1].name).toBe('title')
      expect(result[2].name).toBe('regularField')
      expect(result[3].name).toBe('categoryId')
    })

    it('should handle complex schema with all field types', () => {
      const schema = createSchema({
        id: { type: JsonSchemaTypeName.Number, default: 0 },
        title: { type: JsonSchemaTypeName.String, default: '' },
        description: { type: JsonSchemaTypeName.String, default: '' },
        image: { $ref: SystemSchemaIds.File },
        image2: { $ref: SystemSchemaIds.File },
        categoryId: { type: JsonSchemaTypeName.String, default: '', foreignKey: 'categories' },
        isActive: { type: JsonSchemaTypeName.Boolean, default: false },
        tags: {
          type: JsonSchemaTypeName.Array,
          items: { type: JsonSchemaTypeName.String, default: '' },
        },
        metadata: {
          type: JsonSchemaTypeName.Object,
          additionalProperties: false,
          required: ['author'],
          properties: {
            author: { type: JsonSchemaTypeName.String, default: '' },
          },
        },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store, 3)

      expect(result[0].name).toBe('image')
      expect(result[1].name).toBe('title')
      expect(result[2].name).toBe('description')
    })
  })

  describe('edge cases', () => {
    it('should return empty array for empty schema', () => {
      const schema = createSchema({})

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store)

      expect(result.length).toBe(0)
    })

    it('should handle schema with only foreign keys', () => {
      const schema = createSchema({
        categoryId: { type: JsonSchemaTypeName.String, default: '', foreignKey: 'categories' },
        authorId: { type: JsonSchemaTypeName.String, default: '', foreignKey: 'users' },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store)

      expect(result.length).toBe(2)
    })

    it('should handle deeply nested structures', () => {
      const schema = createSchema({
        level1: {
          type: JsonSchemaTypeName.Object,
          additionalProperties: false,
          required: ['level2'],
          properties: {
            level2: {
              type: JsonSchemaTypeName.Object,
              additionalProperties: false,
              required: ['level3'],
              properties: {
                level3: {
                  type: JsonSchemaTypeName.Object,
                  additionalProperties: false,
                  required: ['deepField'],
                  properties: {
                    deepField: { type: JsonSchemaTypeName.String, default: '' },
                  },
                },
              },
            },
          },
        },
        title: { type: JsonSchemaTypeName.String, default: '' },
      })

      const store = createJsonSchemaStore(schema)
      const result = selectDefaultColumns(store, 2)

      expect(result[0].name).toBe('title')
      expect(result[1].name).toBe('deepField')
    })
  })
})
