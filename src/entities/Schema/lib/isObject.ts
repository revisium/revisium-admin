import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'

export const isObject = (value: JsonValueStore): boolean => {
  return value.type === JsonSchemaTypeName.Object
}
