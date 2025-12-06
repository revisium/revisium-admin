import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store'

export type ColumnType = {
  id: string
  title: string
  width: number
}

export interface AvailableField {
  nodeId: string
  name: string
  schemaStore: JsonSchemaStore
}
