import { SystemSchemaIds } from '@revisium/schema-toolkit-ui'

export interface FileFieldInfo {
  fieldPath: string
  fieldName: string
  isArray: boolean
}

interface SchemaLike {
  type?: string
  $ref?: string
  properties?: Record<string, SchemaLike>
  items?: SchemaLike
}

export const hasFileFields = (schema: SchemaLike): boolean => {
  if (schema.$ref === SystemSchemaIds.File) {
    return true
  }

  if (schema.type === 'object' && schema.properties) {
    return Object.values(schema.properties).some(hasFileFields)
  }

  if (schema.type === 'array' && schema.items) {
    return hasFileFields(schema.items)
  }

  return false
}

export const extractFileFields = (schema: SchemaLike): FileFieldInfo[] => {
  const fileFields: FileFieldInfo[] = []

  const traverse = (node: SchemaLike, path: string[], inArray: boolean): void => {
    if (node.$ref === SystemSchemaIds.File) {
      fileFields.push({
        fieldPath: path.join('.'),
        fieldName: path[path.length - 1] || 'root',
        isArray: inArray,
      })
      return
    }

    if (node.type === 'object' && node.properties) {
      Object.entries(node.properties).forEach(([key, prop]) => {
        traverse(prop, [...path, key], inArray)
      })
    } else if (node.type === 'array' && node.items) {
      traverse(node.items, path, true)
    }
  }

  traverse(schema, [], false)
  return fileFields
}

export const countFileFields = (schema: SchemaLike): number => {
  return extractFileFields(schema).length
}
