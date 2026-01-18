import { extractSchemaPaths, hasArraysInSchema } from '../extractSchemaPaths'
import { ObjectNodeStore } from '../../../model/ObjectNodeStore'
import { StringNodeStore } from '../../../model/StringNodeStore'
import { NumberNodeStore } from '../../../model/NumberNodeStore'
import { BooleanNodeStore } from '../../../model/BooleanNodeStore'
import { ArrayNodeStore } from '../../../model/ArrayNodeStore'
import { StringForeignKeyNodeStore } from '../../../model/StringForeignKeyNodeStore'

function createNumberNode(id: string, description?: string): NumberNodeStore {
  const node = new NumberNodeStore()
  node.setId(id)
  if (description) {
    node.setDescription(description)
  }
  return node
}

function createStringNode(id: string, description?: string): StringNodeStore {
  const node = new StringNodeStore()
  node.setId(id)
  if (description) {
    node.setDescription(description)
  }
  return node
}

function createBooleanNode(id: string, description?: string): BooleanNodeStore {
  const node = new BooleanNodeStore()
  node.setId(id)
  if (description) {
    node.setDescription(description)
  }
  return node
}

function createObjectNode(id: string): ObjectNodeStore {
  const node = new ObjectNodeStore()
  node.setId(id)
  return node
}

describe('extractSchemaPaths', () => {
  describe('simple fields', () => {
    it('should extract number field', () => {
      const root = new ObjectNodeStore()
      root.addProperty(createNumberNode('price'))
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      expect(paths).toContainEqual(
        expect.objectContaining({
          path: 'price',
          type: 'number',
        }),
      )
    })

    it('should extract string field', () => {
      const root = new ObjectNodeStore()
      root.addProperty(createStringNode('name'))
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      expect(paths).toContainEqual(
        expect.objectContaining({
          path: 'name',
          type: 'string',
        }),
      )
    })

    it('should extract boolean field', () => {
      const root = new ObjectNodeStore()
      root.addProperty(createBooleanNode('isActive'))
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      expect(paths).toContainEqual(
        expect.objectContaining({
          path: 'isActive',
          type: 'boolean',
        }),
      )
    })

    it('should extract multiple fields', () => {
      const root = new ObjectNodeStore()
      root.addProperty(createNumberNode('price'))
      root.addProperty(createNumberNode('quantity'))
      root.addProperty(createStringNode('name'))
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      expect(paths).toHaveLength(3)
      expect(paths.map((p) => p.path)).toEqual(expect.arrayContaining(['price', 'quantity', 'name']))
    })

    it('should include description when present', () => {
      const root = new ObjectNodeStore()
      root.addProperty(createNumberNode('price', 'Product price in USD'))
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      expect(paths).toContainEqual(
        expect.objectContaining({
          path: 'price',
          description: 'Product price in USD',
        }),
      )
    })
  })

  describe('field exclusion', () => {
    it('should exclude field for which formula is being written', () => {
      const root = new ObjectNodeStore()
      root.addProperty(createNumberNode('price'))
      root.addProperty(createNumberNode('total'))
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      expect(paths.map((p) => p.path)).toContain('price')
      expect(paths.map((p) => p.path)).not.toContain('total')
    })

    it('should not exclude nested field with same name', () => {
      const root = new ObjectNodeStore()
      const statsNode = createObjectNode('stats')
      statsNode.addProperty(createNumberNode('total'))
      root.addProperty(statsNode)
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      expect(paths.map((p) => p.path)).toContain('stats.total')
    })
  })

  describe('foreign key fields', () => {
    it('should exclude foreign key fields', () => {
      const root = new ObjectNodeStore()
      const fkNode = new StringNodeStore()
      fkNode.setId('categoryId')
      fkNode.setForeignKey(new StringForeignKeyNodeStore())
      root.addProperty(fkNode)
      root.addProperty(createStringNode('name'))
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      expect(paths.map((p) => p.path)).not.toContain('categoryId')
      expect(paths.map((p) => p.path)).toContain('name')
    })
  })

  describe('nested objects', () => {
    it('should extract nested object paths', () => {
      const root = new ObjectNodeStore()
      const statsNode = createObjectNode('stats')
      statsNode.addProperty(createNumberNode('damage'))
      statsNode.addProperty(createNumberNode('defense'))
      root.addProperty(statsNode)
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      expect(paths).toContainEqual(expect.objectContaining({ path: 'stats', type: 'object' }))
      expect(paths).toContainEqual(expect.objectContaining({ path: 'stats.damage', type: 'number' }))
      expect(paths).toContainEqual(expect.objectContaining({ path: 'stats.defense', type: 'number' }))
    })

    it('should extract deeply nested paths', () => {
      const root = new ObjectNodeStore()
      const userNode = createObjectNode('user')
      const profileNode = createObjectNode('profile')
      profileNode.addProperty(createStringNode('name'))
      userNode.addProperty(profileNode)
      root.addProperty(userNode)
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      expect(paths).toContainEqual(expect.objectContaining({ path: 'user', type: 'object' }))
      expect(paths).toContainEqual(expect.objectContaining({ path: 'user.profile', type: 'object' }))
      expect(paths).toContainEqual(expect.objectContaining({ path: 'user.profile.name', type: 'string' }))
    })
  })

  describe('arrays', () => {
    it('should extract array of primitives with wildcard', () => {
      const root = new ObjectNodeStore()
      const tagsNode = new ArrayNodeStore(createStringNode(''))
      tagsNode.setId('tags')
      root.addProperty(tagsNode)
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      expect(paths).toContainEqual(expect.objectContaining({ path: 'tags', type: 'array' }))
      expect(paths).toContainEqual(
        expect.objectContaining({
          path: 'tags[*]',
          type: 'string',
          isArrayElement: true,
        }),
      )
    })

    it('should extract array of objects with nested fields', () => {
      const root = new ObjectNodeStore()
      const itemsObjectNode = new ObjectNodeStore()
      itemsObjectNode.addProperty(createNumberNode('price'))
      itemsObjectNode.addProperty(createNumberNode('quantity'))
      const itemsNode = new ArrayNodeStore(itemsObjectNode)
      itemsNode.setId('items')
      root.addProperty(itemsNode)
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      expect(paths).toContainEqual(expect.objectContaining({ path: 'items', type: 'array' }))
      expect(paths).toContainEqual(
        expect.objectContaining({
          path: 'items[*]',
          type: 'object',
          isArrayElement: true,
        }),
      )
      expect(paths).toContainEqual(
        expect.objectContaining({
          path: 'items[*].price',
          type: 'number',
          isArrayElement: true,
        }),
      )
      expect(paths).toContainEqual(
        expect.objectContaining({
          path: 'items[*].quantity',
          type: 'number',
          isArrayElement: true,
        }),
      )
    })

    it('should mark array element fields with isArrayElement', () => {
      const root = new ObjectNodeStore()
      const itemsObjectNode = new ObjectNodeStore()
      itemsObjectNode.addProperty(createNumberNode('price'))
      const itemsNode = new ArrayNodeStore(itemsObjectNode)
      itemsNode.setId('items')
      root.addProperty(itemsNode)
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      const pricePath = paths.find((p) => p.path === 'items[*].price')
      expect(pricePath?.isArrayElement).toBe(true)
    })

    it('should not mark root level fields as array elements', () => {
      const root = new ObjectNodeStore()
      root.addProperty(createNumberNode('price'))
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      const pricePath = paths.find((p) => p.path === 'price')
      expect(pricePath?.isArrayElement).toBeFalsy()
    })
  })

  describe('edge cases', () => {
    it('should handle empty schema', () => {
      const root = new ObjectNodeStore()
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      expect(paths).toHaveLength(0)
    })

    it('should skip fields without id', () => {
      const root = new ObjectNodeStore()
      const nodeWithoutId = new NumberNodeStore()
      root.addProperty(nodeWithoutId)
      root.addProperty(createNumberNode('price'))
      root.submitChanges()

      const paths = extractSchemaPaths(root, 'total')

      expect(paths).toHaveLength(1)
      expect(paths[0].path).toBe('price')
    })
  })
})

describe('hasArraysInSchema', () => {
  it('should return true when schema has array type', () => {
    const paths = [
      { path: 'items', type: 'array' as const },
      { path: 'name', type: 'string' as const },
    ]

    expect(hasArraysInSchema(paths)).toBe(true)
  })

  it('should return true when schema has array element paths', () => {
    const paths = [
      { path: 'items[*].price', type: 'number' as const, isArrayElement: true },
      { path: 'name', type: 'string' as const },
    ]

    expect(hasArraysInSchema(paths)).toBe(true)
  })

  it('should return false when schema has no arrays', () => {
    const paths = [
      { path: 'price', type: 'number' as const },
      { path: 'name', type: 'string' as const },
      { path: 'isActive', type: 'boolean' as const },
    ]

    expect(hasArraysInSchema(paths)).toBe(false)
  })

  it('should return false for empty paths', () => {
    expect(hasArraysInSchema([])).toBe(false)
  })
})
