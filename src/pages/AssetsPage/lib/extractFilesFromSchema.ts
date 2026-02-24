import { JsonSchema, JsonSchemaTypeName } from 'src/entities/Schema'

const FILE_SCHEMA_REF = 'urn:jsonschema:io:revisium:file-schema:1.0.0'

export interface FileFieldInfo {
  fieldPath: string
  fieldName: string
  isArray: boolean
}

const isRefSchema = (schema: JsonSchema): schema is { $ref: string } => {
  return '$ref' in schema
}

export const hasFileFields = (schema: JsonSchema): boolean => {
  if (isRefSchema(schema)) {
    return schema.$ref === FILE_SCHEMA_REF
  }

  if (schema.type === JsonSchemaTypeName.Object) {
    return Object.values(schema.properties).some((prop) => hasFileFields(prop))
  }

  if (schema.type === JsonSchemaTypeName.Array) {
    return hasFileFields(schema.items)
  }

  return false
}

export const extractFileFields = (schema: JsonSchema): FileFieldInfo[] => {
  const fileFields: FileFieldInfo[] = []

  const traverse = (node: JsonSchema, path: string[], inArray: boolean): void => {
    if (isRefSchema(node)) {
      if (node.$ref === FILE_SCHEMA_REF) {
        fileFields.push({
          fieldPath: path.join('.'),
          fieldName: path[path.length - 1] || 'root',
          isArray: inArray,
        })
      }
      return
    }

    if (node.type === JsonSchemaTypeName.Object) {
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

export const countFileFields = (schema: JsonSchema): number => {
  return extractFileFields(schema).length
}
