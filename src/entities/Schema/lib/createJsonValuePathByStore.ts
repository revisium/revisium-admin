import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonValueStore } from 'src/entities/Schema/model/value/json-value.store.ts'

export const createJsonValuePathByStore = (store: JsonValueStore): string => {
  let node = store

  let path = ''

  while (node.parent) {
    if (node.parent.type === JsonSchemaTypeName.Object) {
      if (node.type === JsonSchemaTypeName.Array) {
        path = `${node.id}${path}`
      } else if (path) {
        path = `${node.id}.${path}`
      } else {
        path = node.id
      }
    } else if (node.parent.type === JsonSchemaTypeName.Array) {
      if (path && node.type === JsonSchemaTypeName.Array) {
        path = `[${node.id}]${path}`
      } else if (path) {
        path = `[${node.id}].${path}`
      } else {
        path = `[${node.id}]`
      }
    }

    node = node.parent
  }

  if (!path) {
    return ''
  }

  return `${path}`
}
