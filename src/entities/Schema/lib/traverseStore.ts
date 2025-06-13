import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store.ts'

export const traverseStore = (store: JsonSchemaStore, callback: (node: JsonSchemaStore) => void) => {
  callback(store)

  if (store.type === JsonSchemaTypeName.Object) {
    Object.values(store.properties).forEach((item) => {
      traverseStore(item, callback)
    })
  } else if (store.type === JsonSchemaTypeName.Array) {
    traverseStore(store.items, callback)
  }
}

export const traverseStoreWithSkipping = (
  store: JsonSchemaStore,
  callback: (node: JsonSchemaStore) => boolean | void,
) => {
  const needToSkip = callback(store)

  if (!needToSkip) {
    if (store.type === JsonSchemaTypeName.Object) {
      Object.values(store.properties).forEach((item) => {
        traverseStore(item, callback)
      })
    } else if (store.type === JsonSchemaTypeName.Array) {
      traverseStore(store.items, callback)
    }
  }
}
