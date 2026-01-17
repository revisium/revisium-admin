import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonArrayStore } from 'src/entities/Schema/model/json-array.store.ts'
import { JsonObjectStore } from 'src/entities/Schema/model/json-object.store.ts'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store.ts'
import { JsonBooleanValueStore } from 'src/entities/Schema/model/value/json-boolean-value.store.ts'
import { JsonNumberValueStore } from 'src/entities/Schema/model/value/json-number-value.store.ts'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store.ts'
import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'
import { JsonValueStore, JsonValueStorePrimitives } from 'src/entities/Schema/model/value/json-value.store.ts'
import { JsonSchemaStore, JsonSchemaStorePrimitives } from '../json-schema.store'
import { JsonArray, JsonObject, JsonPrimitives, JsonValue } from '../../types/json.types'

export const createJsonValueStore = (schema: JsonSchemaStore, rowId: string, rawValue: JsonValue): JsonValueStore => {
  if (schema.type === JsonSchemaTypeName.Object) {
    return createJsonObjectValueStore(schema, rowId, rawValue as JsonObject)
  } else if (schema.type === JsonSchemaTypeName.Array) {
    return createJsonArrayValueStore(schema, rowId, rawValue as JsonArray)
  } else {
    return createPrimitiveValueStore(schema, rowId, rawValue as JsonPrimitives)
  }
}

export const createJsonObjectValueStore = (
  schema: JsonObjectStore,
  rowId: string,
  rawValue: JsonObject,
): JsonObjectValueStore => {
  const value = createJsonObjectRecord(schema, rowId, rawValue)
  const store = new JsonObjectValueStore(schema, rowId, value)
  setParentForChildren(store)
  return store
}

export const createJsonObjectRecord = (schema: JsonObjectStore, rowId: string, rawValue: JsonObject) => {
  return Object.entries(rawValue).reduce<Record<string, JsonValueStore>>((reduceValue, [key, itemValue]) => {
    const itemSchema = schema.getProperty(key)

    if (itemSchema === undefined || itemValue === undefined) {
      throw new Error('Invalid item')
    }

    const childStore = createJsonValueStore(itemSchema, rowId, itemValue)
    childStore.id = key
    reduceValue[key] = childStore

    return reduceValue
  }, {})
}

export const createJsonArrayValueStore = (
  schema: JsonArrayStore,
  rowId: string,
  rawValue: JsonArray,
): JsonArrayValueStore => {
  const value = createJsonArrayValueItems(schema, rowId, rawValue)
  const store = new JsonArrayValueStore(schema, rowId, value)
  setParentForChildren(store)
  return store
}

export const createJsonArrayValueItems = (
  schema: JsonArrayStore,
  rowId: string,
  rawValue: JsonArray,
): JsonValueStore[] => {
  return rawValue.map((value, index) => {
    const childStore = createJsonValueStore(schema.items, rowId, value)
    childStore.id = String(index)
    return childStore
  })
}

const setParentForChildren = (store: JsonValueStore): void => {
  if (store.type === JsonSchemaTypeName.Object) {
    for (const child of Object.values(store.value)) {
      child.parent = store
    }
  } else if (store.type === JsonSchemaTypeName.Array) {
    for (const child of store.value) {
      child.parent = store
    }
  }
}

export const createPrimitiveValueStore = (
  schema: JsonSchemaStorePrimitives,
  rowId: string,
  rawValue: JsonPrimitives,
): JsonValueStorePrimitives => {
  if (schema.type === JsonSchemaTypeName.String) {
    return new JsonStringValueStore(schema, rowId, rawValue as string)
  } else if (schema.type === JsonSchemaTypeName.Number) {
    return new JsonNumberValueStore(schema, rowId, rawValue as number)
  } else if (schema.type === JsonSchemaTypeName.Boolean) {
    return new JsonBooleanValueStore(schema, rowId, rawValue as boolean)
  } else {
    throw new Error('this type is not allowed')
  }
}
