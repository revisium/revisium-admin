import { JsonObjectSchema, JsonSchema, JsonSchemaTypeName } from 'src/entities/Schema/types/schema.types.ts'
import { TableRelationsLayoutService } from '../TableRelationsLayoutService.ts'
import { TableWithSchema } from '../types.ts'

const createObjectTable = (id: string, properties: Record<string, unknown>, count = 0): TableWithSchema => ({
  id,
  count,
  schema: {
    type: JsonSchemaTypeName.Object,
    properties: properties as JsonObjectSchema['properties'],
    required: Object.keys(properties),
    additionalProperties: false,
  },
})

const createPrimitiveTable = (id: string, schema: JsonSchema, count = 0): TableWithSchema => ({
  id,
  count,
  schema,
})

const stringField = () => ({ type: JsonSchemaTypeName.String, default: '' })
const fkField = (targetTable: string) => ({
  type: JsonSchemaTypeName.String,
  default: '',
  foreignKey: targetTable,
})

describe('TableRelationsLayoutService', () => {
  let service: TableRelationsLayoutService

  beforeEach(() => {
    service = new TableRelationsLayoutService()
  })

  describe('buildGraph', () => {
    it('should return empty graph for empty tables', () => {
      const result = service.buildGraph([])

      expect(result.nodes).toEqual([])
      expect(result.edges).toEqual([])
    })

    it('should create nodes without edges for tables without foreign keys', () => {
      const tables = [
        createObjectTable('users', { name: stringField() }),
        createObjectTable('posts', { title: stringField() }),
      ]

      const result = service.buildGraph(tables)

      expect(result.nodes).toHaveLength(2)
      expect(result.edges).toHaveLength(0)
      expect(result.nodes[0].incomingEdges).toHaveLength(0)
      expect(result.nodes[0].outgoingEdges).toHaveLength(0)
    })

    it('should create edge for simple foreign key', () => {
      const tables = [
        createObjectTable('categories', { name: stringField() }),
        createObjectTable('products', { name: stringField(), categoryId: fkField('categories') }),
      ]

      const result = service.buildGraph(tables)

      expect(result.edges).toHaveLength(1)
      expect(result.edges[0]).toEqual({
        id: 'products-categoryId-categories',
        sourceTableId: 'products',
        targetTableId: 'categories',
        fieldPath: 'categoryId',
        curveOffset: 0,
      })
    })

    it('should track incoming and outgoing edges on nodes', () => {
      const tables = [
        createObjectTable('categories', { name: stringField() }),
        createObjectTable('products', { name: stringField(), categoryId: fkField('categories') }),
      ]

      const result = service.buildGraph(tables)

      const categoriesNode = result.nodes.find((n) => n.id === 'categories')
      const productsNode = result.nodes.find((n) => n.id === 'products')

      expect(categoriesNode?.incomingEdges).toHaveLength(1)
      expect(categoriesNode?.outgoingEdges).toHaveLength(0)
      expect(productsNode?.incomingEdges).toHaveLength(0)
      expect(productsNode?.outgoingEdges).toHaveLength(1)
    })

    it('should handle multiple foreign keys from one table', () => {
      const tables = [
        createObjectTable('categories', { name: stringField() }),
        createObjectTable('authors', { name: stringField() }),
        createObjectTable('posts', {
          title: stringField(),
          categoryId: fkField('categories'),
          authorId: fkField('authors'),
        }),
      ]

      const result = service.buildGraph(tables)

      expect(result.edges).toHaveLength(2)

      const postsNode = result.nodes.find((n) => n.id === 'posts')
      expect(postsNode?.outgoingEdges).toHaveLength(2)
    })

    it('should handle multiple tables pointing to same target', () => {
      const tables = [
        createObjectTable('users', { name: stringField() }),
        createObjectTable('posts', { authorId: fkField('users') }),
        createObjectTable('comments', { authorId: fkField('users') }),
      ]

      const result = service.buildGraph(tables)

      expect(result.edges).toHaveLength(2)

      const usersNode = result.nodes.find((n) => n.id === 'users')
      expect(usersNode?.incomingEdges).toHaveLength(2)
    })

    it('should handle nested foreign keys', () => {
      const tables = [
        createObjectTable('tags', { name: stringField() }),
        createObjectTable('posts', {
          metadata: {
            type: JsonSchemaTypeName.Object,
            properties: {
              tagId: fkField('tags'),
            },
            required: ['tagId'],
            additionalProperties: false,
          },
        }),
      ]

      const result = service.buildGraph(tables)

      expect(result.edges).toHaveLength(1)
      expect(result.edges[0].fieldPath).toBe('metadata.tagId')
    })

    it('should handle array foreign keys', () => {
      const tables = [
        createObjectTable('tags', { name: stringField() }),
        createObjectTable('posts', {
          tagIds: {
            type: JsonSchemaTypeName.Array,
            items: fkField('tags'),
          },
        }),
      ]

      const result = service.buildGraph(tables)

      expect(result.edges).toHaveLength(1)
      expect(result.edges[0].fieldPath).toBe('tagIds[*]')
    })

    it('should ignore foreign keys to non-existent tables', () => {
      const tables = [createObjectTable('posts', { categoryId: fkField('categories') })]

      const result = service.buildGraph(tables)

      expect(result.edges).toHaveLength(0)
    })

    it('should calculate fieldsCount correctly', () => {
      const tables = [createObjectTable('users', { name: stringField(), email: stringField(), age: stringField() })]

      const result = service.buildGraph(tables)

      expect(result.nodes[0].fieldsCount).toBe(3)
    })

    it('should preserve rowsCount from table', () => {
      const tables = [createObjectTable('users', { name: stringField() }, 42)]

      const result = service.buildGraph(tables)

      expect(result.nodes[0].rowsCount).toBe(42)
    })

    it('should handle multiple FK fields to same table', () => {
      const tables = [
        createObjectTable('users', { name: stringField() }),
        createObjectTable('messages', {
          senderId: fkField('users'),
          receiverId: fkField('users'),
        }),
      ]

      const result = service.buildGraph(tables)

      expect(result.edges).toHaveLength(2)

      const usersNode = result.nodes.find((n) => n.id === 'users')
      expect(usersNode?.incomingEdges).toHaveLength(2)
    })

    it('should assign different curveOffset for multiple edges between same pair', () => {
      const tables = [
        createObjectTable('users', { name: stringField() }),
        createObjectTable('messages', {
          senderId: fkField('users'),
          receiverId: fkField('users'),
        }),
      ]

      const result = service.buildGraph(tables)

      const offsets = result.edges.map((e) => e.curveOffset)
      expect(offsets).toContain(0)
      expect(offsets).toContain(20)
    })

    it('should assign different curveOffset for bidirectional edges', () => {
      const tables = [createObjectTable('a', { bId: fkField('b') }), createObjectTable('b', { aId: fkField('a') })]

      const result = service.buildGraph(tables)

      expect(result.edges).toHaveLength(2)
      const offsets = result.edges.map((e) => e.curveOffset)
      expect(offsets).toContain(0)
      expect(offsets).toContain(20)
    })
  })

  describe('calculateLayout', () => {
    it('should return empty layout for empty graph', () => {
      const result = service.calculateLayout({ nodes: [], edges: [] })

      expect(result.nodes).toEqual([])
      expect(result.edges).toEqual([])
    })

    it('should assign coordinates to single node', () => {
      const graph = service.buildGraph([createObjectTable('users', { name: stringField() })])

      const result = service.calculateLayout(graph)

      expect(result.nodes).toHaveLength(1)
      expect(result.nodes[0].x).toBe(0)
      expect(result.nodes[0].y).toBe(0)
    })

    it('should place connected tables in different columns', () => {
      const tables = [
        createObjectTable('categories', { name: stringField() }),
        createObjectTable('products', { categoryId: fkField('categories') }),
      ]
      const graph = service.buildGraph(tables)

      const result = service.calculateLayout(graph)

      const categoriesNode = result.nodes.find((n) => n.id === 'categories')
      const productsNode = result.nodes.find((n) => n.id === 'products')

      expect(productsNode?.x).toBeLessThan(categoriesNode?.x ?? 0)
    })

    it('should place unconnected tables in same column', () => {
      const tables = [
        createObjectTable('users', { name: stringField() }),
        createObjectTable('posts', { title: stringField() }),
      ]
      const graph = service.buildGraph(tables)

      const result = service.calculateLayout(graph)

      const usersNode = result.nodes.find((n) => n.id === 'users')
      const postsNode = result.nodes.find((n) => n.id === 'posts')

      expect(usersNode?.x).toBe(postsNode?.x)
    })

    it('should place multiple tables in same column vertically', () => {
      const tables = [
        createObjectTable('users', { name: stringField() }),
        createObjectTable('posts', { title: stringField() }),
        createObjectTable('comments', { text: stringField() }),
      ]
      const graph = service.buildGraph(tables)

      const result = service.calculateLayout(graph)

      const yPositions = result.nodes.map((n) => n.y)
      expect(new Set(yPositions).size).toBe(3)
    })

    it('should handle chain of dependencies', () => {
      const tables = [
        createObjectTable('a', { name: stringField() }),
        createObjectTable('b', { aId: fkField('a') }),
        createObjectTable('c', { bId: fkField('b') }),
      ]
      const graph = service.buildGraph(tables)

      const result = service.calculateLayout(graph)

      const nodeA = result.nodes.find((n) => n.id === 'a')
      const nodeB = result.nodes.find((n) => n.id === 'b')
      const nodeC = result.nodes.find((n) => n.id === 'c')

      expect(nodeC?.x).toBeLessThan(nodeB?.x ?? 0)
      expect(nodeB?.x).toBeLessThan(nodeA?.x ?? 0)
    })
  })

  describe('non-object schemas', () => {
    it('should handle table with string schema (fieldsCount = 1)', () => {
      const tables = [createPrimitiveTable('const', { type: JsonSchemaTypeName.String, default: '' })]

      const result = service.buildGraph(tables)

      expect(result.nodes).toHaveLength(1)
      expect(result.nodes[0].fieldsCount).toBe(1)
      expect(result.nodes[0].id).toBe('const')
    })

    it('should handle table with number schema (fieldsCount = 1)', () => {
      const tables = [createPrimitiveTable('counter', { type: JsonSchemaTypeName.Number, default: 0 })]

      const result = service.buildGraph(tables)

      expect(result.nodes).toHaveLength(1)
      expect(result.nodes[0].fieldsCount).toBe(1)
    })

    it('should handle table with boolean schema (fieldsCount = 1)', () => {
      const tables = [createPrimitiveTable('flag', { type: JsonSchemaTypeName.Boolean, default: false })]

      const result = service.buildGraph(tables)

      expect(result.nodes).toHaveLength(1)
      expect(result.nodes[0].fieldsCount).toBe(1)
    })

    it('should handle table with $ref schema (fieldsCount = 1)', () => {
      const tables = [createPrimitiveTable('files', { $ref: 'File' })]

      const result = service.buildGraph(tables)

      expect(result.nodes).toHaveLength(1)
      expect(result.nodes[0].fieldsCount).toBe(1)
    })

    it('should handle table with array schema (fieldsCount = 1)', () => {
      const tables = [
        createPrimitiveTable('tags', {
          type: JsonSchemaTypeName.Array,
          items: { type: JsonSchemaTypeName.String, default: '' },
        }),
      ]

      const result = service.buildGraph(tables)

      expect(result.nodes).toHaveLength(1)
      expect(result.nodes[0].fieldsCount).toBe(1)
    })

    it('should handle mixed object and primitive tables', () => {
      const tables = [
        createObjectTable('users', { name: stringField(), email: stringField() }),
        createPrimitiveTable('const', { type: JsonSchemaTypeName.String, default: '' }),
        createObjectTable('posts', { title: stringField() }),
      ]

      const result = service.buildGraph(tables)

      expect(result.nodes).toHaveLength(3)
      expect(result.nodes.find((n) => n.id === 'users')?.fieldsCount).toBe(2)
      expect(result.nodes.find((n) => n.id === 'const')?.fieldsCount).toBe(1)
      expect(result.nodes.find((n) => n.id === 'posts')?.fieldsCount).toBe(1)
    })

    it('should create edge when object table references primitive table', () => {
      const tables = [
        createPrimitiveTable('const', { type: JsonSchemaTypeName.String, default: '' }),
        createObjectTable('main', { constRef: fkField('const') }),
      ]

      const result = service.buildGraph(tables)

      expect(result.edges).toHaveLength(1)
      expect(result.edges[0].sourceTableId).toBe('main')
      expect(result.edges[0].targetTableId).toBe('const')
    })

    it('should layout mixed tables correctly', () => {
      const tables = [
        createPrimitiveTable('const', { type: JsonSchemaTypeName.String, default: '' }),
        createObjectTable('main', { constRef: fkField('const') }),
      ]
      const graph = service.buildGraph(tables)

      const result = service.calculateLayout(graph)

      expect(result.nodes).toHaveLength(2)
      expect(result.nodes.every((n) => typeof n.x === 'number' && typeof n.y === 'number')).toBe(true)
    })
  })
})
