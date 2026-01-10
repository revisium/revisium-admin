import {
  JsonArraySchema,
  JsonObjectSchema,
  JsonRefSchema,
  JsonSchema,
  JsonSchemaTypeName,
  JsonStringSchema,
} from 'src/entities/Schema/types/schema.types.ts'
import { ForeignKeyInfo } from './types.ts'

function isRefSchema(schema: JsonSchema): schema is JsonRefSchema {
  return '$ref' in schema
}

function isStringSchema(schema: JsonSchema): schema is JsonStringSchema {
  return 'type' in schema && schema.type === JsonSchemaTypeName.String
}

function isObjectSchema(schema: JsonSchema): schema is JsonObjectSchema {
  return 'type' in schema && schema.type === JsonSchemaTypeName.Object
}

function isArraySchema(schema: JsonSchema): schema is JsonArraySchema {
  return 'type' in schema && schema.type === JsonSchemaTypeName.Array
}

function extractFromSchema(schema: JsonSchema, currentPath: string, result: ForeignKeyInfo[]): void {
  if (isRefSchema(schema)) {
    return
  }

  if (isStringSchema(schema) && schema.foreignKey) {
    result.push({
      fieldPath: currentPath,
      targetTableId: schema.foreignKey,
    })
    return
  }

  if (isObjectSchema(schema)) {
    for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
      const newPath = currentPath ? `${currentPath}.${fieldName}` : fieldName
      extractFromSchema(fieldSchema, newPath, result)
    }
    return
  }

  if (isArraySchema(schema)) {
    const newPath = `${currentPath}[*]`
    extractFromSchema(schema.items, newPath, result)
  }
}

export function extractForeignKeys(schema: JsonSchema): ForeignKeyInfo[] {
  const result: ForeignKeyInfo[] = []
  extractFromSchema(schema, '', result)
  return result
}
