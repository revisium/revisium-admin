import { filterByTargetType, sortByRelevance, filterByPrefix } from '../filterByTargetType'
import type { FormulaCompletionItem } from '../types'

function createItem(
  label: string,
  category: FormulaCompletionItem['category'],
  returnType?: FormulaCompletionItem['returnType'],
  boost?: number,
): FormulaCompletionItem {
  return {
    label,
    category,
    returnType,
    description: `${label} description`,
    boost,
  }
}

describe('filterByTargetType', () => {
  describe('function filtering', () => {
    it('should include functions with matching return type', () => {
      const items: FormulaCompletionItem[] = [
        createItem('round', 'function', 'number'),
        createItem('concat', 'function', 'string'),
        createItem('and', 'function', 'boolean'),
      ]

      const result = filterByTargetType(items, 'number')

      expect(result.map((i) => i.label)).toContain('round')
      expect(result.map((i) => i.label)).not.toContain('concat')
      expect(result.map((i) => i.label)).not.toContain('and')
    })

    it('should include functions with any return type', () => {
      const items: FormulaCompletionItem[] = [
        createItem('round', 'function', 'number'),
        createItem('coalesce', 'function', 'any'),
      ]

      const result = filterByTargetType(items, 'string')

      expect(result.map((i) => i.label)).toContain('coalesce')
      expect(result.map((i) => i.label)).not.toContain('round')
    })

    it('should include functions without return type', () => {
      const items: FormulaCompletionItem[] = [
        createItem('round', 'function', 'number'),
        createItem('unknown', 'function', undefined),
      ]

      const result = filterByTargetType(items, 'string')

      expect(result.map((i) => i.label)).toContain('unknown')
    })

    it('should filter for string target type', () => {
      const items: FormulaCompletionItem[] = [
        createItem('concat', 'function', 'string'),
        createItem('round', 'function', 'number'),
        createItem('if', 'function', 'any'),
      ]

      const result = filterByTargetType(items, 'string')

      expect(result.map((i) => i.label)).toEqual(['concat', 'if'])
    })

    it('should filter for boolean target type', () => {
      const items: FormulaCompletionItem[] = [
        createItem('and', 'function', 'boolean'),
        createItem('or', 'function', 'boolean'),
        createItem('round', 'function', 'number'),
        createItem('if', 'function', 'any'),
      ]

      const result = filterByTargetType(items, 'boolean')

      expect(result.map((i) => i.label)).toEqual(['and', 'or', 'if'])
    })
  })

  describe('non-function items', () => {
    it('should always include fields', () => {
      const items: FormulaCompletionItem[] = [
        createItem('price', 'field', 'number'),
        createItem('name', 'field', 'string'),
      ]

      const result = filterByTargetType(items, 'boolean')

      expect(result).toHaveLength(2)
    })

    it('should always include operators', () => {
      const items: FormulaCompletionItem[] = [
        createItem('+', 'operator', 'number'),
        createItem('==', 'operator', 'boolean'),
      ]

      const result = filterByTargetType(items, 'string')

      expect(result).toHaveLength(2)
    })

    it('should always include keywords', () => {
      const items: FormulaCompletionItem[] = [
        createItem('true', 'keyword', 'boolean'),
        createItem('false', 'keyword', 'boolean'),
        createItem('null', 'keyword', 'any'),
      ]

      const result = filterByTargetType(items, 'number')

      expect(result).toHaveLength(3)
    })

    it('should always include context tokens', () => {
      const items: FormulaCompletionItem[] = [
        createItem('#index', 'context', 'number'),
        createItem('#first', 'context', 'boolean'),
        createItem('@prev', 'context', 'any'),
      ]

      const result = filterByTargetType(items, 'string')

      expect(result).toHaveLength(3)
    })
  })

  describe('mixed items', () => {
    it('should filter only functions in mixed list', () => {
      const items: FormulaCompletionItem[] = [
        createItem('price', 'field', 'number'),
        createItem('round', 'function', 'number'),
        createItem('concat', 'function', 'string'),
        createItem('+', 'operator', 'number'),
        createItem('true', 'keyword', 'boolean'),
      ]

      const result = filterByTargetType(items, 'number')

      expect(result.map((i) => i.label)).toEqual(['price', 'round', '+', 'true'])
    })
  })

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const result = filterByTargetType([], 'number')

      expect(result).toEqual([])
    })

    it('should handle all items filtered out', () => {
      const items: FormulaCompletionItem[] = [
        createItem('round', 'function', 'number'),
        createItem('floor', 'function', 'number'),
      ]

      const result = filterByTargetType(items, 'string')

      expect(result).toEqual([])
    })
  })
})

describe('sortByRelevance', () => {
  describe('boost sorting', () => {
    it('should sort by boost (higher first)', () => {
      const items: FormulaCompletionItem[] = [
        createItem('round', 'function', 'number', 0),
        createItem('if', 'function', 'any', 2),
        createItem('floor', 'function', 'number', 1),
      ]

      const result = sortByRelevance(items, 'number')

      expect(result.map((i) => i.label)).toEqual(['if', 'floor', 'round'])
    })

    it('should treat undefined boost as 0', () => {
      const items: FormulaCompletionItem[] = [
        createItem('round', 'function', 'number', undefined),
        createItem('if', 'function', 'any', 1),
      ]

      const result = sortByRelevance(items, 'number')

      expect(result.map((i) => i.label)).toEqual(['if', 'round'])
    })
  })

  describe('type match sorting', () => {
    it('should prioritize matching return types after boost', () => {
      const items: FormulaCompletionItem[] = [
        createItem('concat', 'function', 'string', 0),
        createItem('round', 'function', 'number', 0),
        createItem('floor', 'function', 'number', 0),
      ]

      const result = sortByRelevance(items, 'number')

      // floor comes before round alphabetically
      expect(result.map((i) => i.label)).toEqual(['floor', 'round', 'concat'])
    })

    it('should treat any as type match', () => {
      const items: FormulaCompletionItem[] = [
        createItem('concat', 'function', 'string', 0),
        createItem('if', 'function', 'any', 0),
        createItem('round', 'function', 'number', 0),
      ]

      const result = sortByRelevance(items, 'number')

      expect(result[0].label).toBe('if')
      expect(result[1].label).toBe('round')
      expect(result[2].label).toBe('concat')
    })
  })

  describe('category sorting', () => {
    it('should sort by category order after type match', () => {
      const items: FormulaCompletionItem[] = [
        createItem('true', 'keyword', 'boolean', 0),
        createItem('+', 'operator', 'number', 0),
        createItem('#index', 'context', 'number', 0),
        createItem('price', 'field', 'number', 0),
        createItem('round', 'function', 'number', 0),
      ]

      const result = sortByRelevance(items, 'number')

      // Type matching happens first: +, #index, price, round match number
      // true (boolean) doesn't match, goes last
      // Within matching types: field(0) < function(1) < context(2) < operator(4)
      // Within non-matching: keyword(3)
      expect(result.map((i) => i.category)).toEqual(['field', 'function', 'context', 'operator', 'keyword'])
    })
  })

  describe('alphabetical sorting', () => {
    it('should sort alphabetically within same category and type', () => {
      const items: FormulaCompletionItem[] = [
        createItem('zebra', 'function', 'number', 0),
        createItem('alpha', 'function', 'number', 0),
        createItem('beta', 'function', 'number', 0),
      ]

      const result = sortByRelevance(items, 'number')

      expect(result.map((i) => i.label)).toEqual(['alpha', 'beta', 'zebra'])
    })
  })

  describe('combined sorting', () => {
    it('should apply all sorting rules in correct order', () => {
      const items: FormulaCompletionItem[] = [
        createItem('concat', 'function', 'string', 0),
        createItem('if', 'function', 'any', 2),
        createItem('round', 'function', 'number', 0),
        createItem('price', 'field', 'number', 0),
        createItem('coalesce', 'function', 'any', 2),
      ]

      const result = sortByRelevance(items, 'number')

      expect(result.map((i) => i.label)).toEqual(['coalesce', 'if', 'price', 'round', 'concat'])
    })
  })

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const result = sortByRelevance([], 'number')

      expect(result).toEqual([])
    })

    it('should not mutate original array', () => {
      const items: FormulaCompletionItem[] = [
        createItem('b', 'function', 'number', 0),
        createItem('a', 'function', 'number', 0),
      ]
      const originalOrder = [...items]

      sortByRelevance(items, 'number')

      expect(items.map((i) => i.label)).toEqual(originalOrder.map((i) => i.label))
    })
  })
})

describe('filterByPrefix', () => {
  describe('basic filtering', () => {
    it('should filter items starting with prefix', () => {
      const items: FormulaCompletionItem[] = [
        createItem('round', 'function', 'number'),
        createItem('floor', 'function', 'number'),
        createItem('random', 'function', 'number'),
      ]

      const result = filterByPrefix(items, 'ro')

      expect(result.map((i) => i.label)).toEqual(['round'])
    })

    it('should filter items containing prefix', () => {
      const items: FormulaCompletionItem[] = [
        createItem('toUpperCase', 'function', 'string'),
        createItem('toLowerCase', 'function', 'string'),
        createItem('concat', 'function', 'string'),
      ]

      const result = filterByPrefix(items, 'case')

      expect(result.map((i) => i.label)).toEqual(['toUpperCase', 'toLowerCase'])
    })

    it('should be case insensitive', () => {
      const items: FormulaCompletionItem[] = [
        createItem('Round', 'function', 'number'),
        createItem('FLOOR', 'function', 'number'),
      ]

      const result = filterByPrefix(items, 'ro')

      expect(result.map((i) => i.label)).toEqual(['Round'])
    })

    it('should handle uppercase prefix', () => {
      const items: FormulaCompletionItem[] = [
        createItem('round', 'function', 'number'),
        createItem('floor', 'function', 'number'),
      ]

      const result = filterByPrefix(items, 'RO')

      expect(result.map((i) => i.label)).toEqual(['round'])
    })
  })

  describe('empty prefix', () => {
    it('should return all items for empty prefix', () => {
      const items: FormulaCompletionItem[] = [
        createItem('round', 'function', 'number'),
        createItem('floor', 'function', 'number'),
      ]

      const result = filterByPrefix(items, '')

      expect(result).toEqual(items)
    })
  })

  describe('special characters', () => {
    it('should filter operators', () => {
      const items: FormulaCompletionItem[] = [
        createItem('+', 'operator', 'number'),
        createItem('++', 'operator', 'number'),
        createItem('-', 'operator', 'number'),
      ]

      const result = filterByPrefix(items, '+')

      expect(result.map((i) => i.label)).toEqual(['+', '++'])
    })

    it('should filter context tokens starting with @', () => {
      const items: FormulaCompletionItem[] = [
        createItem('@prev', 'context', 'any'),
        createItem('@next', 'context', 'any'),
        createItem('#index', 'context', 'number'),
      ]

      const result = filterByPrefix(items, '@')

      expect(result.map((i) => i.label)).toEqual(['@prev', '@next'])
    })

    it('should filter context tokens starting with #', () => {
      const items: FormulaCompletionItem[] = [
        createItem('@prev', 'context', 'any'),
        createItem('#index', 'context', 'number'),
        createItem('#length', 'context', 'number'),
      ]

      const result = filterByPrefix(items, '#')

      expect(result.map((i) => i.label)).toEqual(['#index', '#length'])
    })
  })

  describe('edge cases', () => {
    it('should handle empty array', () => {
      const result = filterByPrefix([], 'ro')

      expect(result).toEqual([])
    })

    it('should return empty array when no matches', () => {
      const items: FormulaCompletionItem[] = [
        createItem('round', 'function', 'number'),
        createItem('floor', 'function', 'number'),
      ]

      const result = filterByPrefix(items, 'xyz')

      expect(result).toEqual([])
    })
  })
})
