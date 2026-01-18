import { findTokenAtPosition, getTooltipData, getTooltipDataAtPosition } from '../getTooltipData'
import type { SchemaPath } from '../types'

describe('findTokenAtPosition', () => {
  describe('word tokens', () => {
    it('should find word at cursor position', () => {
      const text = 'round(price)'
      const result = findTokenAtPosition(text, 2)

      expect(result).toBe('round')
    })

    it('should find word when cursor at start', () => {
      const text = 'round(price)'
      const result = findTokenAtPosition(text, 0)

      expect(result).toBe('round')
    })

    it('should find word when cursor at end', () => {
      const text = 'round(price)'
      const result = findTokenAtPosition(text, 4)

      expect(result).toBe('round')
    })

    it('should find second word', () => {
      const text = 'round(price)'
      const result = findTokenAtPosition(text, 7)

      expect(result).toBe('price')
    })
  })

  describe('operators', () => {
    it('should find single character operator', () => {
      const text = 'a + b'
      const result = findTokenAtPosition(text, 2)

      expect(result).toBe('+')
    })

    it('should find double character operator ==', () => {
      const text = 'a == b'
      const result = findTokenAtPosition(text, 3)

      expect(result).toBe('==')
    })

    it('should find double character operator !=', () => {
      const text = 'a != b'
      const result = findTokenAtPosition(text, 3)

      expect(result).toBe('!=')
    })

    it('should find double character operator >=', () => {
      const text = 'a >= b'
      const result = findTokenAtPosition(text, 3)

      expect(result).toBe('>=')
    })

    it('should find double character operator &&', () => {
      const text = 'a && b'
      const result = findTokenAtPosition(text, 3)

      expect(result).toBe('&&')
    })

    it('should find double character operator ||', () => {
      const text = 'a || b'
      const result = findTokenAtPosition(text, 3)

      expect(result).toBe('||')
    })
  })

  describe('context tokens', () => {
    it('should find @prev token', () => {
      const text = '@prev.value'
      const result = findTokenAtPosition(text, 2)

      expect(result).toBe('@prev.value')
    })

    it('should find #index token', () => {
      const text = '#index + 1'
      const result = findTokenAtPosition(text, 2)

      expect(result).toBe('#index')
    })
  })

  describe('path tokens', () => {
    it('should find nested path', () => {
      const text = 'stats.damage'
      const result = findTokenAtPosition(text, 7)

      expect(result).toBe('stats.damage')
    })

    it('should find array wildcard path', () => {
      const text = 'items[*].price'
      const result = findTokenAtPosition(text, 10)

      expect(result).toBe('items[*].price')
    })
  })

  describe('edge cases', () => {
    it('should return empty string for empty text', () => {
      const result = findTokenAtPosition('', 0)

      expect(result).toBe('')
    })

    it('should return empty string for position out of bounds', () => {
      const result = findTokenAtPosition('abc', 10)

      expect(result).toBe('')
    })

    it('should return empty string for negative position', () => {
      const result = findTokenAtPosition('abc', -1)

      expect(result).toBe('')
    })
  })
})

describe('getTooltipData', () => {
  const schemaPaths: SchemaPath[] = [
    { path: 'price', type: 'number', description: 'Product price in USD' },
    { path: 'name', type: 'string' },
    { path: 'items[*].quantity', type: 'number', isArrayElement: true },
  ]

  describe('operators', () => {
    it('should return tooltip for + operator', () => {
      const result = getTooltipData('+', [])

      expect(result).not.toBeNull()
      expect(result?.category).toBe('operator')
      expect(result?.label).toBe('+')
      expect(result?.description).toBeTruthy()
    })

    it('should return tooltip for == operator', () => {
      const result = getTooltipData('==', [])

      expect(result).not.toBeNull()
      expect(result?.category).toBe('operator')
      expect(result?.label).toBe('==')
    })

    it('should return tooltip for && operator', () => {
      const result = getTooltipData('&&', [])

      expect(result).not.toBeNull()
      expect(result?.category).toBe('operator')
    })
  })

  describe('functions', () => {
    it('should return tooltip for round function', () => {
      const result = getTooltipData('round', [])

      expect(result).not.toBeNull()
      expect(result?.category).toBe('function')
      expect(result?.label).toBe('round')
      expect(result?.signature).toBe('round(number, decimals?)')
      expect(result?.description).toBeTruthy()
      expect(result?.returnType).toBe('number')
    })

    it('should return tooltip for if function', () => {
      const result = getTooltipData('if', [])

      expect(result).not.toBeNull()
      expect(result?.category).toBe('function')
      expect(result?.label).toBe('if')
    })

    it('should return tooltip for concat function', () => {
      const result = getTooltipData('concat', [])

      expect(result).not.toBeNull()
      expect(result?.category).toBe('function')
      expect(result?.returnType).toBe('string')
    })
  })

  describe('context tokens', () => {
    it('should return tooltip for @prev', () => {
      const result = getTooltipData('@prev', [])

      expect(result).not.toBeNull()
      expect(result?.category).toBe('context')
      expect(result?.label).toBe('@prev')
      expect(result?.description).toContain('Previous')
      expect(result?.examples).toBeDefined()
    })

    it('should return tooltip for #index', () => {
      const result = getTooltipData('#index', [])

      expect(result).not.toBeNull()
      expect(result?.category).toBe('context')
      expect(result?.label).toBe('#index')
      expect(result?.returnType).toBe('number')
    })

    it('should return tooltip for #first', () => {
      const result = getTooltipData('#first', [])

      expect(result).not.toBeNull()
      expect(result?.category).toBe('context')
      expect(result?.returnType).toBe('boolean')
    })
  })

  describe('schema fields', () => {
    it('should return tooltip for schema field with description', () => {
      const result = getTooltipData('price', schemaPaths)

      expect(result).not.toBeNull()
      expect(result?.category).toBe('field')
      expect(result?.label).toBe('price')
      expect(result?.description).toBe('Product price in USD')
      expect(result?.returnType).toBe('number')
    })

    it('should return tooltip for schema field without description', () => {
      const result = getTooltipData('name', schemaPaths)

      expect(result).not.toBeNull()
      expect(result?.category).toBe('field')
      expect(result?.description).toBe('Field name')
      expect(result?.returnType).toBe('string')
    })

    it('should return tooltip for array element field', () => {
      const result = getTooltipData('items[*].quantity', schemaPaths)

      expect(result).not.toBeNull()
      expect(result?.category).toBe('field')
      expect(result?.returnType).toBe('number')
    })
  })

  describe('keywords', () => {
    it('should return tooltip for true', () => {
      const result = getTooltipData('true', [])

      expect(result).not.toBeNull()
      expect(result?.category).toBe('keyword')
      expect(result?.label).toBe('true')
      expect(result?.returnType).toBe('boolean')
    })

    it('should return tooltip for false', () => {
      const result = getTooltipData('false', [])

      expect(result).not.toBeNull()
      expect(result?.category).toBe('keyword')
      expect(result?.label).toBe('false')
      expect(result?.returnType).toBe('boolean')
    })

    it('should return tooltip for null', () => {
      const result = getTooltipData('null', [])

      expect(result).not.toBeNull()
      expect(result?.category).toBe('keyword')
      expect(result?.label).toBe('null')
      expect(result?.returnType).toBe('any')
    })
  })

  describe('unknown tokens', () => {
    it('should return null for unknown token', () => {
      const result = getTooltipData('unknownFunction', [])

      expect(result).toBeNull()
    })

    it('should return null for empty token', () => {
      const result = getTooltipData('', [])

      expect(result).toBeNull()
    })

    it('should return null for number literals', () => {
      const result = getTooltipData('123', [])

      expect(result).toBeNull()
    })
  })
})

describe('getTooltipDataAtPosition', () => {
  const schemaPaths: SchemaPath[] = [{ path: 'price', type: 'number' }]

  it('should get tooltip data for function at position', () => {
    const text = 'round(price)'
    const result = getTooltipDataAtPosition(text, 2, schemaPaths)

    expect(result?.label).toBe('round')
    expect(result?.category).toBe('function')
  })

  it('should get tooltip data for field at position', () => {
    const text = 'round(price)'
    const result = getTooltipDataAtPosition(text, 7, schemaPaths)

    expect(result?.label).toBe('price')
    expect(result?.category).toBe('field')
  })

  it('should get tooltip data for operator at position', () => {
    const text = 'a + b'
    const result = getTooltipDataAtPosition(text, 2, [])

    expect(result?.label).toBe('+')
    expect(result?.category).toBe('operator')
  })

  it('should return null for positions on unknown tokens', () => {
    const text = 'unknownFunc(price)'
    const result = getTooltipDataAtPosition(text, 5, schemaPaths)

    expect(result).toBeNull()
  })
})
