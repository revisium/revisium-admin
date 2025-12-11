import { FilterFieldType, SystemFieldId } from '../model/filterTypes'

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  id: string
  field: string
  fieldPath: string[]
  fieldType: FilterFieldType
  direction: SortDirection
  isSystemField?: boolean
  systemFieldId?: SystemFieldId
}

export interface SortableField {
  nodeId: string
  name: string
  path: string[]
  fieldType: FilterFieldType
  isSystemField?: boolean
  systemFieldId?: SystemFieldId
}
