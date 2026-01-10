import { JsonObjectSchema, JsonSchema, JsonSchemaTypeName } from 'src/entities/Schema/types/schema.types.ts'
import { extractForeignKeys } from '../extractForeignKeys.ts'

const createObjectSchema = (properties: JsonObjectSchema['properties']): JsonObjectSchema => ({
  type: JsonSchemaTypeName.Object,
  properties,
  required: Object.keys(properties),
  additionalProperties: false,
})

const createStringSchema = (foreignKey?: string): JsonSchema => ({
  type: JsonSchemaTypeName.String,
  default: '',
  ...(foreignKey ? { foreignKey } : {}),
})

describe('extractForeignKeys', () => {
  it('should return empty array for schema without foreign keys', () => {
    const schema = createObjectSchema({
      name: { type: JsonSchemaTypeName.String, default: '' },
      count: { type: JsonSchemaTypeName.Number, default: 0 },
    })

    const result = extractForeignKeys(schema)

    expect(result).toEqual([])
  })

  it('should extract single foreign key at root level', () => {
    const schema = createObjectSchema({
      categoryId: {
        type: JsonSchemaTypeName.String,
        default: '',
        foreignKey: 'categories',
      },
    })

    const result = extractForeignKeys(schema)

    expect(result).toEqual([{ fieldPath: 'categoryId', targetTableId: 'categories' }])
  })

  it('should extract multiple foreign keys at root level', () => {
    const schema = createObjectSchema({
      categoryId: {
        type: JsonSchemaTypeName.String,
        default: '',
        foreignKey: 'categories',
      },
      authorId: {
        type: JsonSchemaTypeName.String,
        default: '',
        foreignKey: 'authors',
      },
    })

    const result = extractForeignKeys(schema)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual({ fieldPath: 'categoryId', targetTableId: 'categories' })
    expect(result).toContainEqual({ fieldPath: 'authorId', targetTableId: 'authors' })
  })

  it('should extract foreign key from nested object', () => {
    const schema = createObjectSchema({
      metadata: {
        type: JsonSchemaTypeName.Object,
        properties: {
          authorId: {
            type: JsonSchemaTypeName.String,
            default: '',
            foreignKey: 'authors',
          },
        },
        required: ['authorId'],
        additionalProperties: false,
      },
    })

    const result = extractForeignKeys(schema)

    expect(result).toEqual([{ fieldPath: 'metadata.authorId', targetTableId: 'authors' }])
  })

  it('should extract foreign key from deeply nested object', () => {
    const schema = createObjectSchema({
      level1: {
        type: JsonSchemaTypeName.Object,
        properties: {
          level2: {
            type: JsonSchemaTypeName.Object,
            properties: {
              refId: {
                type: JsonSchemaTypeName.String,
                default: '',
                foreignKey: 'refs',
              },
            },
            required: ['refId'],
            additionalProperties: false,
          },
        },
        required: ['level2'],
        additionalProperties: false,
      },
    })

    const result = extractForeignKeys(schema)

    expect(result).toEqual([{ fieldPath: 'level1.level2.refId', targetTableId: 'refs' }])
  })

  it('should extract foreign key from array of strings', () => {
    const schema = createObjectSchema({
      tagIds: {
        type: JsonSchemaTypeName.Array,
        items: {
          type: JsonSchemaTypeName.String,
          default: '',
          foreignKey: 'tags',
        },
      },
    })

    const result = extractForeignKeys(schema)

    expect(result).toEqual([{ fieldPath: 'tagIds[*]', targetTableId: 'tags' }])
  })

  it('should extract foreign key from array of objects', () => {
    const schema = createObjectSchema({
      items: {
        type: JsonSchemaTypeName.Array,
        items: {
          type: JsonSchemaTypeName.Object,
          properties: {
            productId: {
              type: JsonSchemaTypeName.String,
              default: '',
              foreignKey: 'products',
            },
          },
          required: ['productId'],
          additionalProperties: false,
        },
      },
    })

    const result = extractForeignKeys(schema)

    expect(result).toEqual([{ fieldPath: 'items[*].productId', targetTableId: 'products' }])
  })

  it('should extract foreign key from nested array in object', () => {
    const schema = createObjectSchema({
      data: {
        type: JsonSchemaTypeName.Object,
        properties: {
          refs: {
            type: JsonSchemaTypeName.Array,
            items: {
              type: JsonSchemaTypeName.String,
              default: '',
              foreignKey: 'references',
            },
          },
        },
        required: ['refs'],
        additionalProperties: false,
      },
    })

    const result = extractForeignKeys(schema)

    expect(result).toEqual([{ fieldPath: 'data.refs[*]', targetTableId: 'references' }])
  })

  it('should extract foreign keys from complex nested structure', () => {
    const schema = createObjectSchema({
      categoryId: {
        type: JsonSchemaTypeName.String,
        default: '',
        foreignKey: 'categories',
      },
      metadata: {
        type: JsonSchemaTypeName.Object,
        properties: {
          authorId: {
            type: JsonSchemaTypeName.String,
            default: '',
            foreignKey: 'authors',
          },
          tags: {
            type: JsonSchemaTypeName.Array,
            items: {
              type: JsonSchemaTypeName.Object,
              properties: {
                tagId: {
                  type: JsonSchemaTypeName.String,
                  default: '',
                  foreignKey: 'tags',
                },
              },
              required: ['tagId'],
              additionalProperties: false,
            },
          },
        },
        required: ['authorId', 'tags'],
        additionalProperties: false,
      },
    })

    const result = extractForeignKeys(schema)

    expect(result).toHaveLength(3)
    expect(result).toContainEqual({ fieldPath: 'categoryId', targetTableId: 'categories' })
    expect(result).toContainEqual({ fieldPath: 'metadata.authorId', targetTableId: 'authors' })
    expect(result).toContainEqual({ fieldPath: 'metadata.tags[*].tagId', targetTableId: 'tags' })
  })

  it('should extract from nested arrays (array of arrays)', () => {
    const schema = createObjectSchema({
      matrix: {
        type: JsonSchemaTypeName.Array,
        items: {
          type: JsonSchemaTypeName.Array,
          items: {
            type: JsonSchemaTypeName.String,
            default: '',
            foreignKey: 'cells',
          },
        },
      },
    })

    const result = extractForeignKeys(schema)

    expect(result).toEqual([{ fieldPath: 'matrix[*][*]', targetTableId: 'cells' }])
  })

  it('should ignore $ref schemas', () => {
    const schema = createObjectSchema({
      file: {
        $ref: 'File',
      },
      categoryId: {
        type: JsonSchemaTypeName.String,
        default: '',
        foreignKey: 'categories',
      },
    })

    const result = extractForeignKeys(schema)

    expect(result).toEqual([{ fieldPath: 'categoryId', targetTableId: 'categories' }])
  })

  it('should handle mixed fields with and without foreign keys', () => {
    const schema = createObjectSchema({
      name: { type: JsonSchemaTypeName.String, default: '' },
      categoryId: {
        type: JsonSchemaTypeName.String,
        default: '',
        foreignKey: 'categories',
      },
      count: { type: JsonSchemaTypeName.Number, default: 0 },
      active: { type: JsonSchemaTypeName.Boolean, default: false },
    })

    const result = extractForeignKeys(schema)

    expect(result).toEqual([{ fieldPath: 'categoryId', targetTableId: 'categories' }])
  })

  describe('non-object schemas', () => {
    it('should return empty array for string schema without foreign key', () => {
      const schema = createStringSchema()

      const result = extractForeignKeys(schema)

      expect(result).toEqual([])
    })

    it('should extract foreign key from root-level string schema', () => {
      const schema = createStringSchema('categories')

      const result = extractForeignKeys(schema)

      expect(result).toEqual([{ fieldPath: '', targetTableId: 'categories' }])
    })

    it('should return empty array for number schema', () => {
      const schema: JsonSchema = { type: JsonSchemaTypeName.Number, default: 0 }

      const result = extractForeignKeys(schema)

      expect(result).toEqual([])
    })

    it('should return empty array for boolean schema', () => {
      const schema: JsonSchema = { type: JsonSchemaTypeName.Boolean, default: false }

      const result = extractForeignKeys(schema)

      expect(result).toEqual([])
    })

    it('should return empty array for ref schema', () => {
      const schema: JsonSchema = { $ref: 'File' }

      const result = extractForeignKeys(schema)

      expect(result).toEqual([])
    })

    it('should extract foreign keys from array schema at root', () => {
      const schema: JsonSchema = {
        type: JsonSchemaTypeName.Array,
        items: createStringSchema('tags'),
      }

      const result = extractForeignKeys(schema)

      expect(result).toEqual([{ fieldPath: '[*]', targetTableId: 'tags' }])
    })
  })
})
