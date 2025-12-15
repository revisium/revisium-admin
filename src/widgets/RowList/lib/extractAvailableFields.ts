import { JsonSchemaTypeName } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store'
import { getSystemFieldBySchemaRef } from '../config/systemFields'
import { getFieldTypeFromSchema, SystemFieldId } from '../model/filterTypes'
import { AvailableField } from '../model/types'
import { iterateFileSchemaProperties } from './fileSchemaUtils'

export interface ExtractAvailableFieldsResult {
  fields: AvailableField[]
  usedSystemFieldIds: Set<SystemFieldId>
}

export function extractAvailableFields(schemaStore: JsonSchemaStore): ExtractAvailableFieldsResult {
  const fields: AvailableField[] = []
  const usedSystemFieldIds = new Set<SystemFieldId>()
  traverseSchemaWithPath(schemaStore, [], fields, usedSystemFieldIds)
  return { fields, usedSystemFieldIds }
}

function traverseSchemaWithPath(
  store: JsonSchemaStore,
  currentPath: string[],
  fields: AvailableField[],
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
  const systemFieldId = systemFieldConfig?.id

  if (systemFieldId) {
    usedSystemFieldIds.add(systemFieldId)
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
      isSystemField: systemFieldId !== undefined,
      systemFieldId,
    })
  } else if (store.type === JsonSchemaTypeName.Object) {
    if (store.$ref) {
      const displayName = fieldPath.length > 1 ? fieldPath.join('.') : store.name
      const isFileRef = store.$ref === SystemSchemaIds.File

      const field: AvailableField = {
        nodeId: store.nodeId,
        name: displayName,
        path: fieldPath,
        fieldType,
        schemaStore: store,
        isSystemField: systemFieldId !== undefined,
        systemFieldId,
        isFileObject: isFileRef,
      }

      if (isFileRef) {
        field.children = extractFileNestedFields(store.nodeId, displayName, fieldPath)
      }

      fields.push(field)
    } else {
      const properties = Object.values(store.properties)
      for (const prop of properties) {
        traverseSchemaWithPath(prop, fieldPath, fields, usedSystemFieldIds)
      }
    }
  }
}

function extractFileNestedFields(parentNodeId: string, parentName: string, parentPath: string[]): AvailableField[] {
  return iterateFileSchemaProperties(parentNodeId, parentName, parentPath).map((info) => ({
    ...info,
    isFileNestedField: true,
    parentFieldName: parentName,
  }))
}
