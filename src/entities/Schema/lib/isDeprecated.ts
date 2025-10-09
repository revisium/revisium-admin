import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'

export const isDeprecated = (value: JsonValueStore | JsonSchemaStore): boolean => {
  return Boolean(value.deprecated)
}
