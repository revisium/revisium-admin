import { isArray, isDeprecated, isObject, isPrimitive } from 'src/entities/Schema'
import { JsonArrayValueStore } from 'src/entities/Schema/model/value/json-array-value.store.ts'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store.ts'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'

export const prioritySortComparator = (
  [aKey, aValue]: [string, JsonValueStore],
  [bKey, bValue]: [string, JsonValueStore],
) => {
  if (!isDeprecated(aValue) && isDeprecated(bValue)) {
    return -1
  } else if (isDeprecated(aValue) && !isDeprecated(bValue)) {
    return 1
  } else if (isPrimitive(aValue) && !isPrimitive(bValue)) {
    return -1
  } else if (!isPrimitive(aValue) && isPrimitive(bValue)) {
    return 1
  } else if (isObject(aValue) && !isObject(bValue)) {
    return -1
  } else if (!isObject(aValue) && isObject(bValue)) {
    return 1
  } else {
    return aKey.localeCompare(bKey)
  }
}

export const jsonValueStoreSorting = (object: JsonObjectValueStore) => {
  return Object.entries(object.value).sort(prioritySortComparator)
}

export const toSortedJsonValue = (store: JsonValueStore): JsonValue => {
  if (isObject(store)) {
    const objectStore = store as JsonObjectValueStore
    const sortedEntries = Object.entries(objectStore.value).sort(prioritySortComparator)
    const result: Record<string, JsonValue> = {}

    for (const [key, valueStore] of sortedEntries) {
      result[key] = toSortedJsonValue(valueStore)
    }

    return result
  }

  if (isArray(store)) {
    const arrayStore = store as JsonArrayValueStore
    return arrayStore.value.map((item) => toSortedJsonValue(item))
  }

  return store.getPlainValue()
}
