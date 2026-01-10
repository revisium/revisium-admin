import { JsonSchemaTypeName } from 'src/entities/Schema/types/schema.types.ts'
import { TableRelationsLayoutService } from '../TableRelationsLayoutService.ts'
import { TableWithSchema } from '../types.ts'

const createTable = (id: string, properties: Record<string, unknown>, count = 0): TableWithSchema => ({
  id,
  count,
  schema: {
    type: JsonSchemaTypeName.Object,
    properties: properties as TableWithSchema['schema']['properties'],
    required: Object.keys(properties),
    additionalProperties: false,
  },
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
      const tables = [createTable('users', { name: stringField() }), createTable('posts', { title: stringField() })]

      const result = service.buildGraph(tables)

      expect(result.nodes).toHaveLength(2)
      expect(result.edges).toHaveLength(0)
      expect(result.nodes[0].incomingEdges).toHaveLength(0)
      expect(result.nodes[0].outgoingEdges).toHaveLength(0)
    })

    it('should create edge for simple foreign key', () => {
      const tables = [
        createTable('categories', { name: stringField() }),
        createTable('products', { name: stringField(), categoryId: fkField('categories') }),
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
        createTable('categories', { name: stringField() }),
        createTable('products', { name: stringField(), categoryId: fkField('categories') }),
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
        createTable('categories', { name: stringField() }),
        createTable('authors', { name: stringField() }),
        createTable('posts', {
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
        createTable('users', { name: stringField() }),
        createTable('posts', { authorId: fkField('users') }),
        createTable('comments', { authorId: fkField('users') }),
      ]

      const result = service.buildGraph(tables)

      expect(result.edges).toHaveLength(2)

      const usersNode = result.nodes.find((n) => n.id === 'users')
      expect(usersNode?.incomingEdges).toHaveLength(2)
    })

    it('should handle nested foreign keys', () => {
      const tables = [
        createTable('tags', { name: stringField() }),
        createTable('posts', {
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
        createTable('tags', { name: stringField() }),
        createTable('posts', {
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
      const tables = [createTable('posts', { categoryId: fkField('categories') })]

      const result = service.buildGraph(tables)

      expect(result.edges).toHaveLength(0)
    })

    it('should calculate fieldsCount correctly', () => {
      const tables = [createTable('users', { name: stringField(), email: stringField(), age: stringField() })]

      const result = service.buildGraph(tables)

      expect(result.nodes[0].fieldsCount).toBe(3)
    })

    it('should preserve rowsCount from table', () => {
      const tables = [createTable('users', { name: stringField() }, 42)]

      const result = service.buildGraph(tables)

      expect(result.nodes[0].rowsCount).toBe(42)
    })

    it('should handle multiple FK fields to same table', () => {
      const tables = [
        createTable('users', { name: stringField() }),
        createTable('messages', {
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
        createTable('users', { name: stringField() }),
        createTable('messages', {
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
      const tables = [createTable('a', { bId: fkField('b') }), createTable('b', { aId: fkField('a') })]

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
      expect(result.width).toBe(0)
      expect(result.height).toBe(0)
    })

    it('should assign coordinates to single node', () => {
      const graph = service.buildGraph([createTable('users', { name: stringField() })])

      const result = service.calculateLayout(graph)

      expect(result.nodes).toHaveLength(1)
      expect(result.nodes[0].x).toBe(0)
      expect(result.nodes[0].y).toBe(0)
      expect(result.nodes[0].column).toBe(0)
      expect(result.nodes[0].row).toBe(0)
    })

    it('should place connected tables in different columns', () => {
      const tables = [
        createTable('categories', { name: stringField() }),
        createTable('products', { categoryId: fkField('categories') }),
      ]
      const graph = service.buildGraph(tables)

      const result = service.calculateLayout(graph)

      const categoriesNode = result.nodes.find((n) => n.id === 'categories')
      const productsNode = result.nodes.find((n) => n.id === 'products')

      expect(productsNode?.column).toBeLessThan(categoriesNode?.column ?? 0)
    })

    it('should place unconnected tables in same column', () => {
      const tables = [createTable('users', { name: stringField() }), createTable('posts', { title: stringField() })]
      const graph = service.buildGraph(tables)

      const result = service.calculateLayout(graph)

      const usersNode = result.nodes.find((n) => n.id === 'users')
      const postsNode = result.nodes.find((n) => n.id === 'posts')

      expect(usersNode?.column).toBe(postsNode?.column)
    })

    it('should place multiple tables in same column vertically', () => {
      const tables = [
        createTable('users', { name: stringField() }),
        createTable('posts', { title: stringField() }),
        createTable('comments', { text: stringField() }),
      ]
      const graph = service.buildGraph(tables)

      const result = service.calculateLayout(graph)

      const rows = result.nodes.map((n) => n.row)
      expect(new Set(rows).size).toBe(3)
    })

    it('should calculate correct width and height', () => {
      const tables = [
        createTable('categories', { name: stringField() }),
        createTable('products', { categoryId: fkField('categories') }),
      ]
      const graph = service.buildGraph(tables)

      const result = service.calculateLayout(graph)

      expect(result.width).toBeGreaterThan(0)
      expect(result.height).toBeGreaterThan(0)
    })

    it('should handle chain of dependencies', () => {
      const tables = [
        createTable('a', { name: stringField() }),
        createTable('b', { aId: fkField('a') }),
        createTable('c', { bId: fkField('b') }),
      ]
      const graph = service.buildGraph(tables)

      const result = service.calculateLayout(graph)

      const nodeA = result.nodes.find((n) => n.id === 'a')
      const nodeB = result.nodes.find((n) => n.id === 'b')
      const nodeC = result.nodes.find((n) => n.id === 'c')

      expect(nodeC?.column).toBeLessThan(nodeB?.column ?? 0)
      expect(nodeB?.column).toBeLessThan(nodeA?.column ?? 0)
    })
  })
})
