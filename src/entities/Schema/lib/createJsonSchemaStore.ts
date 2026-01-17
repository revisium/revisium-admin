import {
  JsonObjectSchema,
  JsonSchema,
  JsonSchemaPrimitives,
  JsonSchemaTypeName,
  schemaRefsMapper,
} from 'src/entities/Schema'
import { JsonArrayStore } from 'src/entities/Schema/model/json-array.store.ts'
import { JsonBooleanStore } from 'src/entities/Schema/model/json-boolean.store.ts'
import { JsonNumberStore } from 'src/entities/Schema/model/json-number.store.ts'
import { JsonObjectStore } from 'src/entities/Schema/model/json-object.store.ts'
import { JsonStringStore } from 'src/entities/Schema/model/json-string.store.ts'
import { JsonSchemaStore, JsonSchemaStorePrimitives } from 'src/entities/Schema/model/json-schema.store.ts'

export const createJsonSchemaStore = (schema: JsonSchema): JsonSchemaStore => {
  if ('$ref' in schema) {
    const refSchema = schemaRefsMapper[schema.$ref] as JsonSchema | undefined

    if (!refSchema) {
      throw new Error(`Schema refs must be defined ref$=${schema.$ref}`)
    }

    const store = createJsonSchemaStore(refSchema)
    saveSharedFields(store, schema)
    store.$ref = schema.$ref
    return store
  } else if (schema.type === JsonSchemaTypeName.Object) {
    const objectStore = createJsonObjectSchemaStore(schema)
    saveSharedFields(objectStore, schema)

    return objectStore
  } else if (schema.type === JsonSchemaTypeName.Array) {
    const itemsStore = createJsonSchemaStore(schema.items)
    const arrayStore = new JsonArrayStore(itemsStore)
    saveSharedFields(arrayStore, schema)

    return arrayStore
  } else {
    const primitivesStore = createPrimitiveStoreBySchema(schema)
    saveSharedFields(primitivesStore, schema)

    return primitivesStore
  }
}

export const createJsonObjectSchemaStore = (value: JsonObjectSchema): JsonObjectStore => {
  const store = new JsonObjectStore()

  Object.entries(value.properties).forEach(([name, item]) => {
    store.addPropertyWithStore(name, createJsonSchemaStore(item))
  })

  return store
}

export const createPrimitiveStoreBySchema = (schema: JsonSchemaPrimitives): JsonSchemaStorePrimitives => {
  if (schema.type === JsonSchemaTypeName.String) {
    const stringStore = new JsonStringStore()
    stringStore.foreignKey = schema.foreignKey
    stringStore.contentMediaType = schema.contentMediaType
    stringStore.readOnly = schema.readOnly
    stringStore['x-formula'] = schema['x-formula']
    return stringStore
  } else if (schema.type === JsonSchemaTypeName.Number) {
    const numberStore = new JsonNumberStore()
    numberStore.readOnly = schema.readOnly
    numberStore['x-formula'] = schema['x-formula']
    return numberStore
  } else if (schema.type === JsonSchemaTypeName.Boolean) {
    const booleanStore = new JsonBooleanStore()
    booleanStore.readOnly = schema.readOnly
    booleanStore['x-formula'] = schema['x-formula']
    return booleanStore
  } else {
    throw new Error('this type is not allowed')
  }
}

export const saveSharedFields = (store: JsonSchemaStore, schema: JsonSchema) => {
  store.title = schema.title
  store.description = schema.description
  store.deprecated = schema.deprecated
}
