import { JsonSchemaTypeName } from 'src/entities/Schema'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store'
import { FilterableField, FilterFieldType, getFieldTypeFromSchema } from '../model/filterTypes'

export function extractFilterableFields(schemaStore: JsonSchemaStore): FilterableField[] {
  const fields: FilterableField[] = []

  traverseSchemaWithPath(schemaStore, [], fields)

  fields.sort((a, b) => {
    const levelDiff = a.path.length - b.path.length
    if (levelDiff !== 0) {
      return levelDiff
    }

    const typePriority = {
      [FilterFieldType.String]: 1,
      [FilterFieldType.Boolean]: 2,
      [FilterFieldType.Number]: 3,
      [FilterFieldType.ForeignKey]: 4,
    }
    const typeDiff = typePriority[a.fieldType] - typePriority[b.fieldType]
    if (typeDiff !== 0) return typeDiff

    return a.name.localeCompare(b.name)
  })

  return fields
}

function traverseSchemaWithPath(store: JsonSchemaStore, currentPath: string[], fields: FilterableField[]): void {
  if (store.type === JsonSchemaTypeName.Object && !store.name) {
    const properties = Object.values(store.properties)

    for (const prop of properties) {
      traverseSchemaWithPath(prop, currentPath, fields)
    }
    return
  }

  const fieldType = getFieldTypeFromSchema(store)
  const fieldPath = store.name ? [...currentPath, store.name] : currentPath

  if (fieldType !== null) {
    const displayName = fieldPath.length > 1 ? fieldPath.join('.') : store.name

    fields.push({
      nodeId: store.nodeId,
      name: displayName,
      path: fieldPath,
      fieldType,
      schemaStore: store,
    })
  }

  if (store.type === JsonSchemaTypeName.Object && !store.$ref) {
    const properties = Object.values(store.properties)
    for (const prop of properties) {
      traverseSchemaWithPath(prop, fieldPath, fields)
    }
  }
}
