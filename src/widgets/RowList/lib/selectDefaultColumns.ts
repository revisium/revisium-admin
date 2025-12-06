import { JsonSchemaTypeName } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store'

const SEMANTIC_NAME_PATTERNS = [
  /^title$/i,
  /^name$/i,
  /^label$/i,
  /^description$/i,
  /^text$/i,
  /^content$/i,
  /^summary$/i,
  /^body$/i,
  /^message$/i,
  /^subject$/i,
  /^caption$/i,
  /^headline$/i,
]

export const isSemanticName = (name: string): boolean => {
  return SEMANTIC_NAME_PATTERNS.some((pattern) => pattern.test(name))
}

export enum ColumnPriority {
  File = 1,
  SemanticString = 2,
  Primitive = 3,
  ForeignKey = 4,
}

interface ColumnCandidate {
  nodeId: string
  priority: ColumnPriority
  depth: number
  schema: JsonSchemaStore
}

const collectCandidates = (
  schema: JsonSchemaStore,
  depth: number,
  inArray: boolean,
  candidates: ColumnCandidate[],
): void => {
  if (inArray) {
    return
  }

  if (schema.type === JsonSchemaTypeName.Object) {
    if (schema.$ref === SystemSchemaIds.File) {
      candidates.push({
        nodeId: schema.nodeId,
        priority: ColumnPriority.File,
        depth,
        schema,
      })
      return
    }

    if (schema.$ref) {
      return
    }

    Object.values(schema.properties).forEach((prop) => {
      collectCandidates(prop, depth + 1, false, candidates)
    })
  } else if (schema.type === JsonSchemaTypeName.Array) {
    collectCandidates(schema.items, depth + 1, true, candidates)
  } else if (schema.type === JsonSchemaTypeName.String) {
    if (schema.foreignKey) {
      candidates.push({
        nodeId: schema.nodeId,
        priority: ColumnPriority.ForeignKey,
        depth,
        schema,
      })
    } else if (isSemanticName(schema.name)) {
      candidates.push({
        nodeId: schema.nodeId,
        priority: ColumnPriority.SemanticString,
        depth,
        schema,
      })
    } else {
      candidates.push({
        nodeId: schema.nodeId,
        priority: ColumnPriority.Primitive,
        depth,
        schema,
      })
    }
  } else if (schema.type === JsonSchemaTypeName.Number || schema.type === JsonSchemaTypeName.Boolean) {
    candidates.push({
      nodeId: schema.nodeId,
      priority: ColumnPriority.Primitive,
      depth,
      schema,
    })
  }
}

export const selectDefaultColumns = (schema: JsonSchemaStore, maxColumns: number = 3): JsonSchemaStore[] => {
  const candidates: ColumnCandidate[] = []

  collectCandidates(schema, 0, false, candidates)

  candidates.sort((a, b) => {
    if (a.priority !== b.priority) {
      return a.priority - b.priority
    }
    return a.depth - b.depth
  })

  const result: JsonSchemaStore[] = []
  let fileCount = 0

  for (const candidate of candidates) {
    if (result.length >= maxColumns) {
      break
    }

    if (candidate.priority === ColumnPriority.File) {
      if (fileCount >= 1) {
        continue
      }
      fileCount++
    }

    result.push(candidate.schema)
  }

  return result
}
