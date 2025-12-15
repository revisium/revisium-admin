import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store'
import { FilterFieldType, SystemFieldId } from './filterTypes'

export type ColumnType = {
  id: string
  name: string
  title: string
  fieldType: FilterFieldType | null
  isSystemField?: boolean
  systemFieldId?: SystemFieldId
  isSystemColumn?: boolean
  isFileObject?: boolean
}

export interface AvailableField {
  nodeId: string
  name: string
  path: string[]
  fieldType: FilterFieldType | null
  schemaStore?: JsonSchemaStore
  isSystemField?: boolean
  systemFieldId?: SystemFieldId
  isSystemColumn?: boolean
  children?: AvailableField[]
  isFileObject?: boolean
  isFileNestedField?: boolean
  parentFieldName?: string
}
