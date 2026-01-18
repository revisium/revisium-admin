import {
  buildFunctionCompletions,
  buildOperatorCompletions,
  buildKeywordCompletions,
  buildContextCompletions,
  getFunctionCompletions,
  getOperatorCompletions,
  getKeywordCompletions,
  getContextCompletions,
  getAllStaticCompletions,
} from '../completionItems'

describe('buildFunctionCompletions', () => {
  it('should return array of function completions', () => {
    const completions = buildFunctionCompletions()

    expect(Array.isArray(completions)).toBe(true)
    expect(completions.length).toBeGreaterThan(0)
  })

  it('should include common functions', () => {
    const completions = buildFunctionCompletions()
    const labels = completions.map((c) => c.label)

    expect(labels).toContain('round')
    expect(labels).toContain('if')
    expect(labels).toContain('concat')
    expect(labels).toContain('sum')
  })

  it('should have correct category for all items', () => {
    const completions = buildFunctionCompletions()

    completions.forEach((c) => {
      expect(c.category).toBe('function')
    })
  })

  it('should include signature and description', () => {
    const completions = buildFunctionCompletions()
    const round = completions.find((c) => c.label === 'round')

    expect(round).toBeDefined()
    expect(round?.signature).toBe('round(number, decimals?)')
    expect(round?.description).toBeTruthy()
  })

  it('should include return type', () => {
    const completions = buildFunctionCompletions()

    const round = completions.find((c) => c.label === 'round')
    expect(round?.returnType).toBe('number')

    const concat = completions.find((c) => c.label === 'concat')
    expect(concat?.returnType).toBe('string')

    const and = completions.find((c) => c.label === 'and')
    expect(and?.returnType).toBe('boolean')
  })

  it('should boost conditional functions', () => {
    const completions = buildFunctionCompletions()

    const ifFunc = completions.find((c) => c.label === 'if')
    const coalesce = completions.find((c) => c.label === 'coalesce')
    const round = completions.find((c) => c.label === 'round')

    expect(ifFunc?.boost).toBe(2)
    expect(coalesce?.boost).toBe(2)
    expect(round?.boost).toBe(0)
  })
})

describe('buildOperatorCompletions', () => {
  it('should return array of operator completions', () => {
    const completions = buildOperatorCompletions()

    expect(Array.isArray(completions)).toBe(true)
    expect(completions.length).toBeGreaterThan(0)
  })

  it('should include arithmetic operators', () => {
    const completions = buildOperatorCompletions()
    const labels = completions.map((c) => c.label)

    expect(labels).toContain('+')
    expect(labels).toContain('-')
    expect(labels).toContain('*')
    expect(labels).toContain('/')
    expect(labels).toContain('%')
  })

  it('should include comparison operators', () => {
    const completions = buildOperatorCompletions()
    const labels = completions.map((c) => c.label)

    expect(labels).toContain('==')
    expect(labels).toContain('!=')
    expect(labels).toContain('>')
    expect(labels).toContain('<')
    expect(labels).toContain('>=')
    expect(labels).toContain('<=')
  })

  it('should include logical operators', () => {
    const completions = buildOperatorCompletions()
    const labels = completions.map((c) => c.label)

    expect(labels).toContain('&&')
    expect(labels).toContain('||')
    expect(labels).toContain('!')
  })

  it('should have correct category', () => {
    const completions = buildOperatorCompletions()

    completions.forEach((c) => {
      expect(c.category).toBe('operator')
    })
  })

  it('should have descriptions', () => {
    const completions = buildOperatorCompletions()
    const plus = completions.find((c) => c.label === '+')

    expect(plus?.description).toBeTruthy()
  })
})

describe('buildKeywordCompletions', () => {
  it('should return true, false, null', () => {
    const completions = buildKeywordCompletions()
    const labels = completions.map((c) => c.label)

    expect(labels).toContain('true')
    expect(labels).toContain('false')
    expect(labels).toContain('null')
    expect(completions).toHaveLength(3)
  })

  it('should have correct category', () => {
    const completions = buildKeywordCompletions()

    completions.forEach((c) => {
      expect(c.category).toBe('keyword')
    })
  })

  it('should have correct return types', () => {
    const completions = buildKeywordCompletions()

    const trueKw = completions.find((c) => c.label === 'true')
    const falseKw = completions.find((c) => c.label === 'false')
    const nullKw = completions.find((c) => c.label === 'null')

    expect(trueKw?.returnType).toBe('boolean')
    expect(falseKw?.returnType).toBe('boolean')
    expect(nullKw?.returnType).toBe('any')
  })
})

describe('buildContextCompletions', () => {
  it('should return context tokens', () => {
    const completions = buildContextCompletions()
    const labels = completions.map((c) => c.label)

    expect(labels).toContain('@prev')
    expect(labels).toContain('@next')
    expect(labels).toContain('@current')
    expect(labels).toContain('#index')
    expect(labels).toContain('#length')
    expect(labels).toContain('#first')
    expect(labels).toContain('#last')
  })

  it('should have correct category', () => {
    const completions = buildContextCompletions()

    completions.forEach((c) => {
      expect(c.category).toBe('context')
    })
  })

  it('should have correct return types', () => {
    const completions = buildContextCompletions()

    const index = completions.find((c) => c.label === '#index')
    const first = completions.find((c) => c.label === '#first')
    const prev = completions.find((c) => c.label === '@prev')

    expect(index?.returnType).toBe('number')
    expect(first?.returnType).toBe('boolean')
    expect(prev?.returnType).toBe('any')
  })

  it('should have examples', () => {
    const completions = buildContextCompletions()

    completions.forEach((c) => {
      expect(c.examples).toBeDefined()
      expect(c.examples!.length).toBeGreaterThan(0)
    })
  })
})

describe('cached getters', () => {
  it('getFunctionCompletions should return same instance on multiple calls', () => {
    const first = getFunctionCompletions()
    const second = getFunctionCompletions()

    expect(first).toBe(second)
  })

  it('getOperatorCompletions should return same instance on multiple calls', () => {
    const first = getOperatorCompletions()
    const second = getOperatorCompletions()

    expect(first).toBe(second)
  })

  it('getKeywordCompletions should return same instance on multiple calls', () => {
    const first = getKeywordCompletions()
    const second = getKeywordCompletions()

    expect(first).toBe(second)
  })

  it('getContextCompletions should return same instance on multiple calls', () => {
    const first = getContextCompletions()
    const second = getContextCompletions()

    expect(first).toBe(second)
  })
})

describe('getAllStaticCompletions', () => {
  it('should include functions and keywords when includeContext is false', () => {
    const completions = getAllStaticCompletions(false)
    const categories = new Set(completions.map((c) => c.category))

    expect(categories.has('function')).toBe(true)
    expect(categories.has('keyword')).toBe(true)
    expect(categories.has('context')).toBe(false)
  })

  it('should include context tokens when includeContext is true', () => {
    const completions = getAllStaticCompletions(true)
    const categories = new Set(completions.map((c) => c.category))

    expect(categories.has('function')).toBe(true)
    expect(categories.has('keyword')).toBe(true)
    expect(categories.has('context')).toBe(true)
  })
})
