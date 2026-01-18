import type { FormulaCompletionItem, FormulaTargetType, CompletionCategory } from './types'

/**
 * Filters completion items by compatibility with target type
 *
 * Rules:
 * - number field: functions returning number, any
 * - string field: functions returning string, any
 * - boolean field: functions returning boolean, any
 * - Fields, operators, keywords, context - always shown (can be part of expressions)
 */
export function filterByTargetType(
  items: FormulaCompletionItem[],
  targetType: FormulaTargetType,
): FormulaCompletionItem[] {
  return items.filter((item) => {
    // Fields, operators, keywords, context - always show
    if (item.category !== 'function') {
      return true
    }

    // Functions filter by return type
    if (!item.returnType || item.returnType === 'any') {
      return true
    }

    return item.returnType === targetType
  })
}

const CATEGORY_ORDER: Record<CompletionCategory, number> = {
  field: 0,
  function: 1,
  context: 2,
  keyword: 3,
  operator: 4,
}

/**
 * Sorts items: first by boost, then by type match, then by category, then alphabetically
 */
export function sortByRelevance(
  items: FormulaCompletionItem[],
  targetType: FormulaTargetType,
): FormulaCompletionItem[] {
  return [...items].sort((a, b) => {
    // First by boost (higher first)
    const boostDiff = (b.boost ?? 0) - (a.boost ?? 0)
    if (boostDiff !== 0) {
      return boostDiff
    }

    // Then by type match (matching types first)
    const aMatchesType = a.returnType === targetType || a.returnType === 'any'
    const bMatchesType = b.returnType === targetType || b.returnType === 'any'
    if (aMatchesType && !bMatchesType) {
      return -1
    }
    if (!aMatchesType && bMatchesType) {
      return 1
    }

    // Then by category (fields first)
    const catDiff = (CATEGORY_ORDER[a.category] ?? 5) - (CATEGORY_ORDER[b.category] ?? 5)
    if (catDiff !== 0) {
      return catDiff
    }

    // Finally alphabetically
    return a.label.localeCompare(b.label)
  })
}

/**
 * Filter items by prefix (what user is typing)
 */
export function filterByPrefix(items: FormulaCompletionItem[], prefix: string): FormulaCompletionItem[] {
  if (!prefix) {
    return items
  }

  const lowerPrefix = prefix.toLowerCase()

  return items.filter((item) => {
    const lowerLabel = item.label.toLowerCase()
    // Match if starts with prefix or contains prefix
    return lowerLabel.startsWith(lowerPrefix) || lowerLabel.includes(lowerPrefix)
  })
}
