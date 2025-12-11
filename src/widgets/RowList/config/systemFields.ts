import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { FilterFieldType, SystemFieldId } from '../model/filterTypes'

export interface SystemFieldConfig {
  id: SystemFieldId
  name: string
  fieldType: FilterFieldType
  schemaRef: string
}

export const SYSTEM_FIELDS_CONFIG: SystemFieldConfig[] = [
  {
    id: SystemFieldId.Id,
    name: 'id',
    fieldType: FilterFieldType.String,
    schemaRef: SystemSchemaIds.RowId,
  },
  {
    id: SystemFieldId.CreatedAt,
    name: 'createdAt',
    fieldType: FilterFieldType.DateTime,
    schemaRef: SystemSchemaIds.RowCreatedAt,
  },
  {
    id: SystemFieldId.UpdatedAt,
    name: 'updatedAt',
    fieldType: FilterFieldType.DateTime,
    schemaRef: SystemSchemaIds.RowUpdatedAt,
  },
  {
    id: SystemFieldId.PublishedAt,
    name: 'publishedAt',
    fieldType: FilterFieldType.DateTime,
    schemaRef: SystemSchemaIds.RowPublishedAt,
  },
  {
    id: SystemFieldId.VersionId,
    name: 'versionId',
    fieldType: FilterFieldType.String,
    schemaRef: SystemSchemaIds.RowVersionId,
  },
  {
    id: SystemFieldId.CreatedId,
    name: 'createdId',
    fieldType: FilterFieldType.String,
    schemaRef: SystemSchemaIds.RowCreatedId,
  },
]

const schemaRefToFieldMap = new Map<string, SystemFieldConfig>(
  SYSTEM_FIELDS_CONFIG.map((f) => [f.schemaRef, f]),
)

const systemFieldIdToConfigMap = new Map<SystemFieldId, SystemFieldConfig>(
  SYSTEM_FIELDS_CONFIG.map((f) => [f.id, f]),
)

export function getSystemFieldBySchemaRef(ref: string): SystemFieldConfig | undefined {
  return schemaRefToFieldMap.get(ref)
}

export function getSystemFieldConfigById(id: SystemFieldId): SystemFieldConfig | undefined {
  return systemFieldIdToConfigMap.get(id)
}

export function isSystemSchemaRef(ref: string): boolean {
  return schemaRefToFieldMap.has(ref)
}

export const ADDABLE_SYSTEM_FIELD_IDS: SystemFieldId[] = [
  SystemFieldId.CreatedAt,
  SystemFieldId.UpdatedAt,
  SystemFieldId.PublishedAt,
  SystemFieldId.VersionId,
  SystemFieldId.CreatedId,
]
