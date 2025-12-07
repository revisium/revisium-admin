import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store'
import { getFieldTypeFromSchema } from '../model/filterTypes'
import { AvailableField } from '../model/types'

export function extractAvailableFields(schemaStore: JsonSchemaStore): AvailableField[] {
  const fields: AvailableField[] = []
  traverseSchemaWithPath(schemaStore, [], fields)
  return fields
}

function traverseSchemaWithPath(store: JsonSchemaStore, currentPath: string[], fields: AvailableField[]): void {
  if (store.type === JsonSchemaTypeName.Object && !store.name) {
    const properties = Object.values(store.properties)
    for (const prop of properties) {
      traverseSchemaWithPath(prop, currentPath, fields)
    }
    return
  }

  const fieldPath = store.name ? [...currentPath, store.name] : currentPath
  const fieldType = getFieldTypeFromSchema(store)

  if (
    store.type === JsonSchemaTypeName.String ||
    store.type === JsonSchemaTypeName.Number ||
    store.type === JsonSchemaTypeName.Boolean
  ) {
    const displayName = fieldPath.length > 1 ? fieldPath.join('.') : store.name
    fields.push({
      nodeId: store.nodeId,
      name: displayName,
      path: fieldPath,
      fieldType,
      schemaStore: store,
    })
  } else if (store.type === JsonSchemaTypeName.Object) {
    if (store.$ref) {
      const displayName = fieldPath.length > 1 ? fieldPath.join('.') : store.name
      fields.push({
        nodeId: store.nodeId,
        name: displayName,
        path: fieldPath,
        fieldType,
        schemaStore: store,
      })
    } else {
      const properties = Object.values(store.properties)
      for (const prop of properties) {
        traverseSchemaWithPath(prop, fieldPath, fields)
      }
    }
  }
}
