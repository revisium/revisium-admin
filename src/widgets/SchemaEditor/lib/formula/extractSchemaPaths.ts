import type { SchemaPath } from './types'
import { ObjectNodeStore } from '../../model/ObjectNodeStore'
import { ArrayNodeStore } from '../../model/ArrayNodeStore'
import { StringNodeStore } from '../../model/StringNodeStore'
import { NumberNodeStore } from '../../model/NumberNodeStore'
import { BooleanNodeStore } from '../../model/BooleanNodeStore'
import type { SchemaNode } from '../../model/NodeStore'

/**
 * Extracts all available paths from ObjectNodeStore
 * Recursively traverses nested objects and arrays
 *
 * @param rootNode - root ObjectNodeStore (table)
 * @param excludeFieldId - ID of field for which formula is being written (exclude self)
 * @returns array of paths with types and descriptions
 */
export function extractSchemaPaths(rootNode: ObjectNodeStore, excludeFieldId: string): SchemaPath[] {
  const paths: SchemaPath[] = []

  collectPaths(rootNode.draftProperties, '', paths, excludeFieldId, false)

  return paths
}

function collectPaths(
  properties: SchemaNode[],
  prefix: string,
  paths: SchemaPath[],
  excludeFieldId: string,
  isArrayElement: boolean,
): void {
  for (const node of properties) {
    const fieldId = node.draftId

    if (!fieldId) {
      continue
    }

    // Exclude field for which formula is being written (only at root level)
    if (fieldId === excludeFieldId && !prefix) {
      continue
    }

    const path = prefix ? `${prefix}.${fieldId}` : fieldId
    const description = node.draftDescription || undefined

    if (node instanceof StringNodeStore) {
      // Skip foreign key fields - they cannot be used in formulas
      if (!node.draftForeignKey) {
        paths.push({
          path,
          type: 'string',
          description,
          isArrayElement,
        })
      }
    } else if (node instanceof NumberNodeStore) {
      paths.push({
        path,
        type: 'number',
        description,
        isArrayElement,
      })
    } else if (node instanceof BooleanNodeStore) {
      paths.push({
        path,
        type: 'boolean',
        description,
        isArrayElement,
      })
    } else if (node instanceof ObjectNodeStore) {
      // Add object itself
      paths.push({
        path,
        type: 'object',
        description,
        isArrayElement,
      })
      // Recursively add nested fields
      collectPaths(node.draftProperties, path, paths, excludeFieldId, isArrayElement)
    } else if (node instanceof ArrayNodeStore) {
      // Add array itself
      paths.push({
        path,
        type: 'array',
        description,
        isArrayElement,
      })

      // Add paths with [*] for wildcard access
      const items = node.draftItems
      const wildcardPath = `${path}[*]`

      if (items instanceof StringNodeStore && !items.draftForeignKey) {
        paths.push({
          path: wildcardPath,
          type: 'string',
          description: `All elements of ${fieldId}`,
          isArrayElement: true,
        })
      } else if (items instanceof NumberNodeStore) {
        paths.push({
          path: wildcardPath,
          type: 'number',
          description: `All elements of ${fieldId}`,
          isArrayElement: true,
        })
      } else if (items instanceof BooleanNodeStore) {
        paths.push({
          path: wildcardPath,
          type: 'boolean',
          description: `All elements of ${fieldId}`,
          isArrayElement: true,
        })
      } else if (items instanceof ObjectNodeStore) {
        paths.push({
          path: wildcardPath,
          type: 'object',
          description: `All elements of ${fieldId}`,
          isArrayElement: true,
        })
        // Recursively add fields of array elements
        collectPaths(items.draftProperties, wildcardPath, paths, excludeFieldId, true)
      } else if (items instanceof ArrayNodeStore) {
        // Nested array
        paths.push({
          path: wildcardPath,
          type: 'array',
          description: `All elements of ${fieldId}`,
          isArrayElement: true,
        })
      }
    }
  }
}

/**
 * Checks if schema has arrays (for context tokens availability)
 */
export function hasArraysInSchema(paths: SchemaPath[]): boolean {
  return paths.some((p) => p.type === 'array' || p.isArrayElement)
}
