import { isDeprecated, isObject, isPrimitive } from 'src/entities/Schema'
import { JsonObjectValueStore } from 'src/entities/Schema/model/value/json-object-value.store.ts'

export const priorityObjectValueSorting = (object: JsonObjectValueStore) => {
  return Object.entries(object.value).sort(([aKey, aValue], [bKey, bValue]) => {
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
  })
}
