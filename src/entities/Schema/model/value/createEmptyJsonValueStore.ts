import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store.ts'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store.ts'
import { JsonBooleanValueStore } from 'src/entities/Schema/model/value/json-boolean-value.store.ts'
import { JsonNumberValueStore } from 'src/entities/Schema/model/value/json-number-value.store.ts'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'

export const createEmptyJsonValueStore = (schema: JsonSchemaStore): JsonValueStore => {
  switch (schema.type) {
    case JsonSchemaTypeName.Object:
      return new JsonObjectValueStore(schema)
    case JsonSchemaTypeName.Array:
      return new JsonArrayValueStore(schema)
    case JsonSchemaTypeName.String:
      return new JsonStringValueStore(schema)
    case JsonSchemaTypeName.Number:
      return new JsonNumberValueStore(schema)
    case JsonSchemaTypeName.Boolean:
      return new JsonBooleanValueStore(schema)
  }
}
