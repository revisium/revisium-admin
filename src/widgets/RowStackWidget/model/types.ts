import { JsonValue } from 'src/entities/Schema/types/json.types.ts'

export interface TableData {
  id: string
  versionId: string
  createdId: string
  createdAt: string
  updatedAt: string
  readonly: boolean
  count: number
  schema: JsonValue
}

export interface RowData {
  id: string
  versionId: string
  createdId: string
  createdAt: string
  updatedAt: string
  readonly: boolean
  data: JsonValue
}

export interface TableWithRows {
  table: TableData
  rows: RowData[]
  totalCount: number
  hasNextPage: boolean
  endCursor: string | null
}

export interface MinimalTableData {
  id: string
  schema: JsonValue
  readonly: boolean
}
