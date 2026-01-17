// Types
export type {
  FormulaTargetType,
  SchemaFieldType,
  SchemaPath,
  CompletionCategory,
  CompletionReturnType,
  FormulaCompletionItem,
  ParsedCompletionContext,
  CompletionInput,
  CompletionResult,
  FunctionSpec,
} from './types'

// Schema path extraction
export { extractSchemaPaths, hasArraysInSchema } from './extractSchemaPaths'

// Completion items
export {
  buildFunctionCompletions,
  buildOperatorCompletions,
  buildKeywordCompletions,
  buildContextCompletions,
  getFunctionCompletions,
  getOperatorCompletions,
  getKeywordCompletions,
  getContextCompletions,
  getAllStaticCompletions,
} from './completionItems'

// Filtering and sorting
export { filterByTargetType, sortByRelevance, filterByPrefix } from './filterByTargetType'

// Main completions logic
export {
  getFormulaCompletions,
  buildFieldCompletions,
  getCompletionsByCategory,
  groupCompletionsByCategory,
} from './getFormulaCompletions'
export type { GetFormulaCompletionsParams, FormulaCompletionsResult } from './getFormulaCompletions'

// Tooltip
export { findTokenAtPosition, getTooltipData, getTooltipDataAtPosition } from './getTooltipData'
export type { TooltipData } from './getTooltipData'
