import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store'
import { FilterFieldType } from './filterTypes'

export type ColumnType = {
  id: string
  title: string
  width: number
  fieldType: FilterFieldType | null
}

export interface AvailableField {
  nodeId: string
  name: string
  path: string[]
  fieldType: FilterFieldType | null
  schemaStore: JsonSchemaStore
}
