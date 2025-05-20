import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'

export const traverseValue = (store: JsonValueStore, callback: (node: JsonValueStore) => void) => {
  callback(store)

  if (store.type === JsonSchemaTypeName.Object) {
    Object.values(store.value).forEach((item) => {
      traverseValue(item, callback)
    })
  } else if (store.type === JsonSchemaTypeName.Array) {
    store.value.forEach((itemValue) => {
      traverseValue(itemValue, callback)
    })
  }
}
