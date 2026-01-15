import { JsonSchemaTypeName } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store'
import { traverseStoreWithSkipping } from 'src/entities/Schema/lib/traverseStore'

export interface FileFieldInfo {
  fieldPath: string
  fieldName: string
  isArray: boolean
}

export const hasFileFields = (schema: JsonSchemaStore): boolean => {
  let hasFile = false

  traverseStoreWithSkipping(schema, (node) => {
    if (node.type === JsonSchemaTypeName.Object && node.$ref === SystemSchemaIds.File) {
      hasFile = true
      return true
    }
    return false
  })

  return hasFile
}

export const extractFileFields = (schema: JsonSchemaStore): FileFieldInfo[] => {
  const fileFields: FileFieldInfo[] = []

  const traverse = (node: JsonSchemaStore, path: string[], inArray: boolean): void => {
    if (node.type === JsonSchemaTypeName.Object) {
      if (node.$ref === SystemSchemaIds.File) {
        fileFields.push({
          fieldPath: path.join('.'),
          fieldName: path[path.length - 1] || 'root',
          isArray: inArray,
        })
        return
      }

      if (node.$ref) {
        return
      }

      Object.entries(node.properties).forEach(([key, prop]) => {
        traverse(prop, [...path, key], inArray)
      })
    } else if (node.type === JsonSchemaTypeName.Array) {
      traverse(node.items, path, true)
    }
  }

  traverse(schema, [], false)
  return fileFields
}

export const countFileFields = (schema: JsonSchemaStore): number => {
  return extractFileFields(schema).length
}
