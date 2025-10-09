import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'

const primitives = [JsonSchemaTypeName.String, JsonSchemaTypeName.Number, JsonSchemaTypeName.Boolean]

export const isPrimitive = (value: JsonValueStore | JsonSchemaStore): boolean => {
  return primitives.includes(value.type)
}
