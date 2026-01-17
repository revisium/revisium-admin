import { formulaSpec } from '@revisium/formula/spec'
import type { FormulaCompletionItem, CompletionReturnType } from './types'

/**
 * Builds completion items for functions from formulaSpec
 */
export function buildFunctionCompletions(): FormulaCompletionItem[] {
  const items: FormulaCompletionItem[] = []

  const categories = Object.entries(formulaSpec.functions) as [
    string,
    (typeof formulaSpec.functions)[keyof typeof formulaSpec.functions],
  ][]

  for (const [category, functions] of categories) {
    for (const fn of functions) {
      items.push({
        label: fn.name,
        category: 'function',
        returnType: fn.returnType as CompletionReturnType,
        signature: fn.signature,
        description: fn.description,
        examples: fn.examples,
        boost: category === 'conditional' ? 2 : 0,
      })
    }
  }

  return items
}

/**
 * Builds completion items for operators from formulaSpec
 */
export function buildOperatorCompletions(): FormulaCompletionItem[] {
  const items: FormulaCompletionItem[] = []

  for (const op of formulaSpec.syntax.arithmeticOperators) {
    items.push({
      label: op.operator,
      category: 'operator',
      returnType: 'number',
      description: op.description,
    })
  }

  for (const op of formulaSpec.syntax.comparisonOperators) {
    items.push({
      label: op.operator,
      category: 'operator',
      returnType: 'boolean',
      description: op.description,
    })
  }

  for (const op of formulaSpec.syntax.logicalOperators) {
    items.push({
      label: op.operator,
      category: 'operator',
      returnType: 'boolean',
      description: op.description,
    })
  }

  return items
}

/**
 * Builds completion items for keywords
 */
export function buildKeywordCompletions(): FormulaCompletionItem[] {
  return [
    { label: 'true', category: 'keyword', returnType: 'boolean', description: 'Boolean true value' },
    { label: 'false', category: 'keyword', returnType: 'boolean', description: 'Boolean false value' },
    { label: 'null', category: 'keyword', returnType: 'any', description: 'Null value' },
  ]
}

/**
 * Builds completion items for context tokens (for arrays)
 */
export function buildContextCompletions(): FormulaCompletionItem[] {
  return [
    {
      label: '@prev',
      category: 'context',
      returnType: 'any',
      description: 'Previous array element (null if first)',
      examples: ['@prev.runningTotal + value'],
    },
    {
      label: '@next',
      category: 'context',
      returnType: 'any',
      description: 'Next array element (null if last)',
      examples: ['@next.value'],
    },
    {
      label: '@current',
      category: 'context',
      returnType: 'any',
      description: 'Current array element',
      examples: ['@current.price * @current.quantity'],
    },
    {
      label: '#index',
      category: 'context',
      returnType: 'number',
      description: 'Current array index (0-based)',
      examples: ['#index + 1'],
    },
    {
      label: '#length',
      category: 'context',
      returnType: 'number',
      description: 'Array length',
      examples: ['#index == #length - 1'],
    },
    {
      label: '#first',
      category: 'context',
      returnType: 'boolean',
      description: 'Is first element',
      examples: ['if(#first, value, @prev.total + value)'],
    },
    {
      label: '#last',
      category: 'context',
      returnType: 'boolean',
      description: 'Is last element',
      examples: ['if(#last, "End", "")'],
    },
  ]
}

// Cache for performance
let _functionCompletions: FormulaCompletionItem[] | null = null
let _operatorCompletions: FormulaCompletionItem[] | null = null
let _keywordCompletions: FormulaCompletionItem[] | null = null
let _contextCompletions: FormulaCompletionItem[] | null = null

export function getFunctionCompletions(): FormulaCompletionItem[] {
  if (!_functionCompletions) {
    _functionCompletions = buildFunctionCompletions()
  }
  return _functionCompletions
}

export function getOperatorCompletions(): FormulaCompletionItem[] {
  if (!_operatorCompletions) {
    _operatorCompletions = buildOperatorCompletions()
  }
  return _operatorCompletions
}

export function getKeywordCompletions(): FormulaCompletionItem[] {
  if (!_keywordCompletions) {
    _keywordCompletions = buildKeywordCompletions()
  }
  return _keywordCompletions
}

export function getContextCompletions(): FormulaCompletionItem[] {
  if (!_contextCompletions) {
    _contextCompletions = buildContextCompletions()
  }
  return _contextCompletions
}

/**
 * Get all static completions (functions + keywords + context)
 */
export function getAllStaticCompletions(includeContext: boolean): FormulaCompletionItem[] {
  const items = [...getFunctionCompletions(), ...getKeywordCompletions()]

  if (includeContext) {
    items.push(...getContextCompletions())
  }

  return items
}
