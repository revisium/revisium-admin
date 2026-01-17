import type { FunctionSpec } from '@revisium/formula/spec'

/** Target field type for formula */
export type FormulaTargetType = 'string' | 'number' | 'boolean'

/** Field type in schema (for paths) */
export type SchemaFieldType = 'string' | 'number' | 'boolean' | 'object' | 'array'

/** Path to field in schema with metadata */
export interface SchemaPath {
  /** Full path: "price", "stats.damage", "items[*].price" */
  path: string
  /** Value type */
  type: SchemaFieldType
  /** Description from schema (if any) */
  description?: string
  /** Is inside array (for @prev, #index context) */
  isArrayElement?: boolean
}

/** Completion item category */
export type CompletionCategory = 'field' | 'function' | 'operator' | 'keyword' | 'context'

/** Return type for completion items */
export type CompletionReturnType = 'string' | 'number' | 'boolean' | 'any'

/** Completion item for autocomplete */
export interface FormulaCompletionItem {
  /** Text to insert */
  label: string
  /** Category (for icon and grouping) */
  category: CompletionCategory
  /** Return type */
  returnType?: CompletionReturnType
  /** Function signature (for functions) */
  signature?: string
  /** Description */
  description: string
  /** Usage examples */
  examples?: string[]
  /** Sort priority (higher = higher in list) */
  boost?: number
  /** Is this field inside an array (for context awareness) */
  isArrayElement?: boolean
}

/** Parsed context for completion */
export interface ParsedCompletionContext {
  /** Current word being typed */
  currentWord: string
  /** Start position of current word */
  wordStart: number
  /** Is cursor right after a dot */
  isAfterDot: boolean
  /** Is typing context token (@prev, #index) */
  isContextToken: boolean
  /** Prefix before current segment (for nested paths) */
  pathPrefix: string
}

/** Input for getFormulaCompletions */
export interface CompletionInput {
  /** Full text in editor */
  text: string
  /** Cursor position */
  position: number
  /** Target field type */
  targetType: FormulaTargetType
  /** Available schema paths */
  schemaPaths: SchemaPath[]
}

/** Result of getFormulaCompletions */
export interface CompletionResult {
  /** Start position for replacement */
  from: number
  /** Completion items */
  items: FormulaCompletionItem[]
}

/** Re-export FunctionSpec for convenience */
export type { FunctionSpec }
