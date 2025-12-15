import { JsonSchemaTypeName } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store'
import { getSystemFieldBySchemaRef } from '../config/systemFields'
import { FilterableField, FilterFieldType, getFieldTypeFromSchema, SystemFieldId } from '../model/filterTypes'
import { iterateFileSchemaProperties } from './fileSchemaUtils'

interface ExtractResult {
  dataFields: FilterableField[]
  usedSystemFieldIds: Set<SystemFieldId>
}

export function extractFilterableFields(schemaStore: JsonSchemaStore): ExtractResult {
  const fields: FilterableField[] = []
  const usedSystemFieldIds = new Set<SystemFieldId>()

  traverseSchemaWithPath(schemaStore, [], fields, usedSystemFieldIds)

  fields.sort((a, b) => {
    const levelDiff = a.path.length - b.path.length
    if (levelDiff !== 0) {
      return levelDiff
    }

    const typePriority: Partial<Record<FilterFieldType, number>> = {
      [FilterFieldType.String]: 1,
      [FilterFieldType.Boolean]: 2,
      [FilterFieldType.Number]: 3,
      [FilterFieldType.ForeignKey]: 4,
      [FilterFieldType.DateTime]: 5,
    }
    const typeDiff = (typePriority[a.fieldType] ?? 6) - (typePriority[b.fieldType] ?? 6)
    if (typeDiff !== 0) return typeDiff

    return a.name.localeCompare(b.name)
  })

  return { dataFields: fields, usedSystemFieldIds }
}

function traverseSchemaWithPath(
  store: JsonSchemaStore,
  currentPath: string[],
  fields: FilterableField[],
  usedSystemFieldIds: Set<SystemFieldId>,
): void {
  if (store.type === JsonSchemaTypeName.Object && !store.name) {
    const properties = Object.values(store.properties)

    for (const prop of properties) {
      traverseSchemaWithPath(prop, currentPath, fields, usedSystemFieldIds)
    }
    return
  }

  const systemFieldConfig = store.$ref ? getSystemFieldBySchemaRef(store.$ref) : undefined
  if (systemFieldConfig) {
    usedSystemFieldIds.add(systemFieldConfig.id)
    const fieldPath = store.name ? [...currentPath, store.name] : currentPath
    const displayName = fieldPath.length > 1 ? fieldPath.join('.') : store.name
    fields.push({
      nodeId: store.nodeId,
      name: displayName,
      path: fieldPath,
      fieldType: systemFieldConfig.fieldType,
      schemaStore: store,
      isSystemField: true,
      systemFieldId: systemFieldConfig.id,
    })
    return
  }

  const fieldPath = store.name ? [...currentPath, store.name] : currentPath

  if (store.type === JsonSchemaTypeName.Object && store.$ref === SystemSchemaIds.File) {
    const displayName = fieldPath.length > 1 ? fieldPath.join('.') : store.name
    addFileNestedFields(store.nodeId, displayName, fieldPath, fields)
    return
  }

  const fieldType = getFieldTypeFromSchema(store)

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
      traverseSchemaWithPath(prop, fieldPath, fields, usedSystemFieldIds)
    }
  }
}

function addFileNestedFields(
  parentNodeId: string,
  parentName: string,
  parentPath: string[],
  fields: FilterableField[],
): void {
  for (const info of iterateFileSchemaProperties(parentNodeId, parentName, parentPath)) {
    if (info.fieldType !== null) {
      fields.push({
        nodeId: info.nodeId,
        name: info.name,
        path: info.path,
        fieldType: info.fieldType,
      })
    }
  }
}
