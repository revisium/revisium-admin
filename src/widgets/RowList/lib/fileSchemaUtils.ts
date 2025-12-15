import { JsonSchemaTypeName } from 'src/entities/Schema'
import { fileSchema } from 'src/shared/schema/plugins/file-schema'
import { FilterFieldType } from '../model/filterTypes'

export interface FileNestedFieldInfo {
  nodeId: string
  name: string
  path: string[]
  fieldType: FilterFieldType | null
}

export function iterateFileSchemaProperties(
  parentNodeId: string,
  parentName: string,
  parentPath: string[],
): FileNestedFieldInfo[] {
  const result: FileNestedFieldInfo[] = []

  for (const [propName, propSchema] of Object.entries(fileSchema.properties)) {
    const path = [...parentPath, propName]
    const name = `${parentName}.${propName}`
    const nodeId = `${parentNodeId}:${propName}`

    let fieldType: FilterFieldType | null = null
    if ('type' in propSchema) {
      if (propSchema.type === JsonSchemaTypeName.String) {
        fieldType = FilterFieldType.String
      } else if (propSchema.type === JsonSchemaTypeName.Number) {
        fieldType = FilterFieldType.Number
      }
    }

    result.push({ nodeId, name, path, fieldType })
  }

  return result
}
