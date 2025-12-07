import { FilterFieldType } from '../model/filterTypes'

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  id: string
  field: string
  fieldPath: string[]
  fieldType: FilterFieldType
  direction: SortDirection
}

export interface SortableField {
  nodeId: string
  name: string
  path: string[]
  fieldType: FilterFieldType
}
