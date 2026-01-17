import type { FormulaCompletionItem, SchemaPath } from './types'
import { getFunctionCompletions, getOperatorCompletions, getContextCompletions } from './completionItems'

export interface TooltipData {
  label: string
  category: FormulaCompletionItem['category']
  description: string
  signature?: string
  examples?: string[]
  returnType?: string
}

/**
 * Finds a token at given position in text
 * Returns the word under or near the cursor
 */
export function findTokenAtPosition(text: string, position: number): string {
  if (position < 0 || position > text.length) {
    return ''
  }

  // Check for operators at position
  const operatorPatterns = ['==', '!=', '>=', '<=', '&&', '||', '>', '<', '+', '-', '*', '/', '%', '!']

  for (const op of operatorPatterns) {
    const start = position - op.length + 1
    if (start >= 0) {
      const slice = text.slice(Math.max(0, start), position + 1)
      if (slice.includes(op)) {
        return op
      }
    }
  }

  // Find word boundaries
  let start = position
  let end = position

  // Move start back to word boundary
  while (start > 0 && isWordChar(text[start - 1])) {
    start--
  }

  // Move end forward to word boundary
  while (end < text.length && isWordChar(text[end])) {
    end++
  }

  return text.slice(start, end)
}

function isWordChar(char: string): boolean {
  return /[\w@#.[\]*]/.test(char)
}

/**
 * Gets tooltip data for a token
 */
export function getTooltipData(token: string, schemaPaths: SchemaPath[]): TooltipData | null {
  if (!token) {
    return null
  }

  // Check operators first
  const operators = getOperatorCompletions()
  const operator = operators.find((op) => op.label === token)
  if (operator) {
    return {
      label: operator.label,
      category: 'operator',
      description: operator.description,
      returnType: operator.returnType,
    }
  }

  // Check functions
  const functions = getFunctionCompletions()
  const func = functions.find((f) => f.label === token)
  if (func) {
    return {
      label: func.label,
      category: 'function',
      description: func.description,
      signature: func.signature,
      examples: func.examples,
      returnType: func.returnType,
    }
  }

  // Check context tokens
  const contextTokens = getContextCompletions()
  const context = contextTokens.find((c) => c.label === token)
  if (context) {
    return {
      label: context.label,
      category: 'context',
      description: context.description,
      examples: context.examples,
      returnType: context.returnType,
    }
  }

  // Check schema paths (fields)
  const schemaPath = schemaPaths.find((p) => p.path === token)
  if (schemaPath) {
    return {
      label: schemaPath.path,
      category: 'field',
      description: schemaPath.description || `Field ${schemaPath.path}`,
      returnType: schemaPath.type,
    }
  }

  // Check keywords
  if (token === 'true' || token === 'false') {
    return {
      label: token,
      category: 'keyword',
      description: `Boolean ${token} value`,
      returnType: 'boolean',
    }
  }

  if (token === 'null') {
    return {
      label: 'null',
      category: 'keyword',
      description: 'Null value',
      returnType: 'any',
    }
  }

  return null
}

/**
 * Gets tooltip data at a specific position in text
 */
export function getTooltipDataAtPosition(
  text: string,
  position: number,
  schemaPaths: SchemaPath[],
): TooltipData | null {
  const token = findTokenAtPosition(text, position)
  return getTooltipData(token, schemaPaths)
}
