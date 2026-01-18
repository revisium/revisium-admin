import type { FormulaCompletionItem, FormulaTargetType, SchemaPath } from './types'
import { getAllStaticCompletions } from './completionItems'
import { filterByTargetType, sortByRelevance, filterByPrefix } from './filterByTargetType'
import { hasArraysInSchema } from './extractSchemaPaths'

/**
 * Builds field completions from schema paths
 */
export function buildFieldCompletions(paths: SchemaPath[]): FormulaCompletionItem[] {
  return paths.map((path) => ({
    label: path.path,
    category: 'field' as const,
    returnType: path.type === 'object' || path.type === 'array' ? 'any' : path.type,
    description: path.description || `Field ${path.path}`,
    isArrayElement: path.isArrayElement,
  }))
}

export interface GetFormulaCompletionsParams {
  schemaPaths: SchemaPath[]
  targetType: FormulaTargetType
  prefix: string
}

export interface FormulaCompletionsResult {
  items: FormulaCompletionItem[]
  hasArrayContext: boolean
}

/**
 * Main function to get formula completions
 *
 * Process:
 * 1. Build field completions from schema paths
 * 2. Get static completions (functions, keywords, optionally context)
 * 3. Filter by target type (for functions)
 * 4. Filter by prefix (what user is typing)
 * 5. Sort by relevance
 */
export function getFormulaCompletions(params: GetFormulaCompletionsParams): FormulaCompletionsResult {
  const { schemaPaths, targetType, prefix } = params

  const hasArrayContext = hasArraysInSchema(schemaPaths)

  // Build field completions from schema
  const fieldCompletions = buildFieldCompletions(schemaPaths)

  // Get static completions (functions, keywords, context if arrays present)
  const staticCompletions = getAllStaticCompletions(hasArrayContext)

  // Combine all completions
  const allCompletions = [...fieldCompletions, ...staticCompletions]

  // Filter by target type (affects only functions)
  const typeFiltered = filterByTargetType(allCompletions, targetType)

  // Filter by prefix
  const prefixFiltered = filterByPrefix(typeFiltered, prefix)

  // Sort by relevance
  const sorted = sortByRelevance(prefixFiltered, targetType)

  return {
    items: sorted,
    hasArrayContext,
  }
}

/**
 * Get completions for a specific category only
 */
export function getCompletionsByCategory(
  items: FormulaCompletionItem[],
  category: FormulaCompletionItem['category'],
): FormulaCompletionItem[] {
  return items.filter((item) => item.category === category)
}

/**
 * Group completions by category for UI display
 */
export function groupCompletionsByCategory(
  items: FormulaCompletionItem[],
): Map<FormulaCompletionItem['category'], FormulaCompletionItem[]> {
  const groups = new Map<FormulaCompletionItem['category'], FormulaCompletionItem[]>()

  for (const item of items) {
    const existing = groups.get(item.category)
    if (existing) {
      existing.push(item)
    } else {
      groups.set(item.category, [item])
    }
  }

  return groups
}
