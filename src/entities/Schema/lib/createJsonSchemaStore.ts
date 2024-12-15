import { JsonObjectSchema, JsonSchema, JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonArrayStore } from 'src/entities/Schema/model/json-array.store.ts'
import { JsonBooleanStore } from 'src/entities/Schema/model/json-boolean.store.ts'
import { JsonNumberStore } from 'src/entities/Schema/model/json-number.store.ts'
import { JsonObjectStore } from 'src/entities/Schema/model/json-object.store.ts'
import { JsonStringStore } from 'src/entities/Schema/model/json-string.store.ts'
import { JsonSchemaStore, JsonSchemaStorePrimitives } from 'src/entities/Schema/model/json-schema.store.ts'

export const createJsonSchemaStore = (schema: JsonSchema): JsonSchemaStore => {
  if (schema.type === JsonSchemaTypeName.Object) {
    return createJsonObjectSchemaStore(schema)
  } else if (schema.type === JsonSchemaTypeName.Array) {
    return new JsonArrayStore(createJsonSchemaStore(schema.items))
  } else {
    return createPrimitiveStoreBySchema(schema)
  }
}

export const createJsonObjectSchemaStore = (value: JsonObjectSchema): JsonObjectStore => {
  const store = new JsonObjectStore()

  Object.entries(value.properties).forEach(([name, item]) => {
    store.addPropertyWithStore(name, createJsonSchemaStore(item))
  })

  return store
}

export const createPrimitiveStoreBySchema = (schema: JsonSchema): JsonSchemaStorePrimitives => {
  if (schema.type === JsonSchemaTypeName.String) {
    const stringStore = new JsonStringStore()
    stringStore.reference = schema.reference
    return stringStore
  } else if (schema.type === JsonSchemaTypeName.Number) {
    return new JsonNumberStore()
  } else if (schema.type === JsonSchemaTypeName.Boolean) {
    return new JsonBooleanStore()
  } else {
    throw new Error('this type is not allowed')
  }
}