import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'

export const isArray = (value: JsonValueStore | JsonSchemaStore): boolean => {
  return value.type === JsonSchemaTypeName.Array
}
