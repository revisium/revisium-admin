import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'

const primitives = new Set([JsonSchemaTypeName.String, JsonSchemaTypeName.Number, JsonSchemaTypeName.Boolean])

export const isPrimitive = (value: JsonValueStore | JsonSchemaStore): boolean => {
  return primitives.has(value.type)
}
