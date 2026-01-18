import {
  getFormulaCompletions,
  buildFieldCompletions,
  getCompletionsByCategory,
  groupCompletionsByCategory,
} from '../getFormulaCompletions'
import type { SchemaPath, FormulaCompletionItem } from '../types'

describe('buildFieldCompletions', () => {
  it('should convert schema paths to field completions', () => {
    const paths: SchemaPath[] = [
      { path: 'price', type: 'number', description: 'Product price' },
      { path: 'name', type: 'string' },
    ]

    const result = buildFieldCompletions(paths)

    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      label: 'price',
      category: 'field',
      returnType: 'number',
      description: 'Product price',
      isArrayElement: undefined,
    })
    expect(result[1]).toEqual({
      label: 'name',
      category: 'field',
      returnType: 'string',
      description: 'Field name',
      isArrayElement: undefined,
    })
  })

  it('should set returnType to any for object and array types', () => {
    const paths: SchemaPath[] = [
      { path: 'stats', type: 'object' },
      { path: 'items', type: 'array' },
    ]

    const result = buildFieldCompletions(paths)

    expect(result[0].returnType).toBe('any')
    expect(result[1].returnType).toBe('any')
  })

  it('should preserve isArrayElement flag', () => {
    const paths: SchemaPath[] = [{ path: 'items[*].price', type: 'number', isArrayElement: true }]

    const result = buildFieldCompletions(paths)

    expect(result[0].isArrayElement).toBe(true)
  })

  it('should handle empty paths', () => {
    const result = buildFieldCompletions([])

    expect(result).toEqual([])
  })
})

describe('getFormulaCompletions', () => {
  describe('basic functionality', () => {
    it('should return field completions from schema paths', () => {
      const result = getFormulaCompletions({
        schemaPaths: [
          { path: 'price', type: 'number' },
          { path: 'quantity', type: 'number' },
        ],
        targetType: 'number',
        prefix: '',
      })

      const fieldItems = result.items.filter((i) => i.category === 'field')
      expect(fieldItems.map((i) => i.label)).toContain('price')
      expect(fieldItems.map((i) => i.label)).toContain('quantity')
    })

    it('should return function completions', () => {
      const result = getFormulaCompletions({
        schemaPaths: [],
        targetType: 'number',
        prefix: '',
      })

      const functionItems = result.items.filter((i) => i.category === 'function')
      expect(functionItems.length).toBeGreaterThan(0)
      expect(functionItems.map((i) => i.label)).toContain('round')
    })

    it('should return keyword completions', () => {
      const result = getFormulaCompletions({
        schemaPaths: [],
        targetType: 'number',
        prefix: '',
      })

      const keywordItems = result.items.filter((i) => i.category === 'keyword')
      expect(keywordItems.map((i) => i.label)).toContain('true')
      expect(keywordItems.map((i) => i.label)).toContain('false')
      expect(keywordItems.map((i) => i.label)).toContain('null')
    })
  })

  describe('array context detection', () => {
    it('should include context tokens when schema has arrays', () => {
      const result = getFormulaCompletions({
        schemaPaths: [
          { path: 'items', type: 'array' },
          { path: 'items[*].price', type: 'number', isArrayElement: true },
        ],
        targetType: 'number',
        prefix: '',
      })

      expect(result.hasArrayContext).toBe(true)

      const contextItems = result.items.filter((i) => i.category === 'context')
      expect(contextItems.map((i) => i.label)).toContain('@prev')
      expect(contextItems.map((i) => i.label)).toContain('#index')
    })

    it('should not include context tokens when schema has no arrays', () => {
      const result = getFormulaCompletions({
        schemaPaths: [
          { path: 'price', type: 'number' },
          { path: 'name', type: 'string' },
        ],
        targetType: 'number',
        prefix: '',
      })

      expect(result.hasArrayContext).toBe(false)

      const contextItems = result.items.filter((i) => i.category === 'context')
      expect(contextItems).toHaveLength(0)
    })
  })

  describe('type filtering', () => {
    it('should filter functions by target type number', () => {
      const result = getFormulaCompletions({
        schemaPaths: [],
        targetType: 'number',
        prefix: '',
      })

      const functionItems = result.items.filter((i) => i.category === 'function')
      const labels = functionItems.map((i) => i.label)

      expect(labels).toContain('round')
      expect(labels).toContain('floor')
      expect(labels).toContain('if')
      expect(labels).not.toContain('concat')
    })

    it('should filter functions by target type string', () => {
      const result = getFormulaCompletions({
        schemaPaths: [],
        targetType: 'string',
        prefix: '',
      })

      const functionItems = result.items.filter((i) => i.category === 'function')
      const labels = functionItems.map((i) => i.label)

      expect(labels).toContain('concat')
      expect(labels).toContain('if')
      expect(labels).not.toContain('round')
    })

    it('should filter functions by target type boolean', () => {
      const result = getFormulaCompletions({
        schemaPaths: [],
        targetType: 'boolean',
        prefix: '',
      })

      const functionItems = result.items.filter((i) => i.category === 'function')
      const labels = functionItems.map((i) => i.label)

      expect(labels).toContain('and')
      expect(labels).toContain('or')
      expect(labels).toContain('if')
      expect(labels).not.toContain('round')
    })
  })

  describe('prefix filtering', () => {
    it('should filter by prefix', () => {
      const result = getFormulaCompletions({
        schemaPaths: [
          { path: 'price', type: 'number' },
          { path: 'quantity', type: 'number' },
        ],
        targetType: 'number',
        prefix: 'pri',
      })

      const fieldItems = result.items.filter((i) => i.category === 'field')
      expect(fieldItems.map((i) => i.label)).toContain('price')
      expect(fieldItems.map((i) => i.label)).not.toContain('quantity')
    })

    it('should filter functions by prefix', () => {
      const result = getFormulaCompletions({
        schemaPaths: [],
        targetType: 'number',
        prefix: 'ro',
      })

      const functionItems = result.items.filter((i) => i.category === 'function')
      expect(functionItems.map((i) => i.label)).toContain('round')
      expect(functionItems.map((i) => i.label)).not.toContain('floor')
    })

    it('should filter context tokens by prefix', () => {
      const result = getFormulaCompletions({
        schemaPaths: [{ path: 'items', type: 'array' }],
        targetType: 'number',
        prefix: '@',
      })

      const contextItems = result.items.filter((i) => i.category === 'context')
      expect(contextItems.map((i) => i.label)).toContain('@prev')
      expect(contextItems.map((i) => i.label)).toContain('@next')
      expect(contextItems.map((i) => i.label)).not.toContain('#index')
    })
  })

  describe('sorting', () => {
    it('should sort boosted items first', () => {
      const result = getFormulaCompletions({
        schemaPaths: [],
        targetType: 'number',
        prefix: '',
      })

      const functionItems = result.items.filter((i) => i.category === 'function')
      const ifIndex = functionItems.findIndex((i) => i.label === 'if')
      const roundIndex = functionItems.findIndex((i) => i.label === 'round')

      expect(ifIndex).toBeLessThan(roundIndex)
    })

    it('should sort fields before functions', () => {
      const result = getFormulaCompletions({
        schemaPaths: [{ path: 'price', type: 'number' }],
        targetType: 'number',
        prefix: '',
      })

      const priceIndex = result.items.findIndex((i) => i.label === 'price')
      const roundIndex = result.items.findIndex((i) => i.label === 'round')

      expect(priceIndex).toBeLessThan(roundIndex)
    })
  })

  describe('edge cases', () => {
    it('should handle empty schema paths', () => {
      const result = getFormulaCompletions({
        schemaPaths: [],
        targetType: 'number',
        prefix: '',
      })

      expect(result.items.length).toBeGreaterThan(0)
      expect(result.items.filter((i) => i.category === 'field')).toHaveLength(0)
    })

    it('should handle prefix that matches nothing', () => {
      const result = getFormulaCompletions({
        schemaPaths: [],
        targetType: 'number',
        prefix: 'xyznonexistent',
      })

      expect(result.items).toHaveLength(0)
    })
  })
})

describe('getCompletionsByCategory', () => {
  it('should filter items by category', () => {
    const items: FormulaCompletionItem[] = [
      { label: 'price', category: 'field', description: 'Field' },
      { label: 'round', category: 'function', description: 'Function' },
      { label: 'true', category: 'keyword', description: 'Keyword' },
    ]

    const result = getCompletionsByCategory(items, 'function')

    expect(result).toHaveLength(1)
    expect(result[0].label).toBe('round')
  })

  it('should return empty array when no matches', () => {
    const items: FormulaCompletionItem[] = [{ label: 'price', category: 'field', description: 'Field' }]

    const result = getCompletionsByCategory(items, 'function')

    expect(result).toEqual([])
  })
})

describe('groupCompletionsByCategory', () => {
  it('should group items by category', () => {
    const items: FormulaCompletionItem[] = [
      { label: 'price', category: 'field', description: 'Field' },
      { label: 'name', category: 'field', description: 'Field' },
      { label: 'round', category: 'function', description: 'Function' },
      { label: 'true', category: 'keyword', description: 'Keyword' },
    ]

    const result = groupCompletionsByCategory(items)

    expect(result.get('field')).toHaveLength(2)
    expect(result.get('function')).toHaveLength(1)
    expect(result.get('keyword')).toHaveLength(1)
  })

  it('should return empty map for empty items', () => {
    const result = groupCompletionsByCategory([])

    expect(result.size).toBe(0)
  })

  it('should preserve item order within groups', () => {
    const items: FormulaCompletionItem[] = [
      { label: 'a', category: 'field', description: 'Field' },
      { label: 'b', category: 'field', description: 'Field' },
      { label: 'c', category: 'field', description: 'Field' },
    ]

    const result = groupCompletionsByCategory(items)

    expect(result.get('field')?.map((i) => i.label)).toEqual(['a', 'b', 'c'])
  })
})
