import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store'
import { FilterFieldType } from './filterTypes'

export type ColumnType = {
  id: string
  name: string
  title: string
  fieldType: FilterFieldType | null
}

export interface AvailableField {
  nodeId: string
  name: string
  path: string[]
  fieldType: FilterFieldType | null
  schemaStore: JsonSchemaStore
}
