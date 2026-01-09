import { nanoid } from 'nanoid'
import { SearchLanguage } from 'src/__generated__/globalTypes'
import { JsonSchemaTypeName } from 'src/entities/Schema'
import { SystemSchemaIds } from 'src/entities/Schema/config/consts'
import { JsonSchemaStore } from 'src/entities/Schema/model/json-schema.store'
import { FilterFieldType, SystemFieldId } from '../config/fieldTypes'

export { FilterFieldType, SystemFieldId } from '../config/fieldTypes'
export { getSystemFieldBySchemaRef, SYSTEM_FIELDS_CONFIG } from '../config/systemFields'
export { SearchLanguage } from 'src/__generated__/globalTypes'

export enum FilterOperator {
  Equals = 'equals',
  NotEquals = 'not_equals',
  Contains = 'contains',
  NotContains = 'not_contains',
  StartsWith = 'starts_with',
  EndsWith = 'ends_with',
  IsEmpty = 'is_empty',
  IsNotEmpty = 'is_not_empty',
  Search = 'search',

  Gt = 'gt',
  Gte = 'gte',
  Lt = 'lt',
  Lte = 'lte',

  IsTrue = 'is_true',
  IsFalse = 'is_false',
}

export enum SearchType {
  Plain = 'plain',
  Phrase = 'phrase',
  Prefix = 'prefix',
  Tsquery = 'tsquery',
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const SEARCH_LANGUAGES: readonly { value: SearchLanguage; label: string }[] = Object.values(SearchLanguage).map(
  (value) => ({
    value,
    label: value === SearchLanguage.SIMPLE ? 'Simple (no stemming)' : capitalize(value),
  }),
)

export interface OperatorInfo {
  operator: FilterOperator
  label: string
  requiresValue: boolean
}

export const OPERATORS_BY_TYPE: Record<FilterFieldType, OperatorInfo[]> = {
  [FilterFieldType.String]: [
    { operator: FilterOperator.Equals, label: 'equals', requiresValue: true },
    { operator: FilterOperator.NotEquals, label: 'not equals', requiresValue: true },
    { operator: FilterOperator.Contains, label: 'contains', requiresValue: true },
    { operator: FilterOperator.NotContains, label: 'not contains', requiresValue: true },
    { operator: FilterOperator.StartsWith, label: 'starts with', requiresValue: true },
    { operator: FilterOperator.EndsWith, label: 'ends with', requiresValue: true },
    { operator: FilterOperator.Search, label: 'search', requiresValue: true },
    { operator: FilterOperator.IsEmpty, label: 'is empty', requiresValue: false },
    { operator: FilterOperator.IsNotEmpty, label: 'is not empty', requiresValue: false },
  ],
  [FilterFieldType.Number]: [
    { operator: FilterOperator.Equals, label: '=', requiresValue: true },
    { operator: FilterOperator.NotEquals, label: '!=', requiresValue: true },
    { operator: FilterOperator.Gt, label: '>', requiresValue: true },
    { operator: FilterOperator.Gte, label: '>=', requiresValue: true },
    { operator: FilterOperator.Lt, label: '<', requiresValue: true },
    { operator: FilterOperator.Lte, label: '<=', requiresValue: true },
  ],
  [FilterFieldType.Boolean]: [
    { operator: FilterOperator.IsTrue, label: 'is true', requiresValue: false },
    { operator: FilterOperator.IsFalse, label: 'is false', requiresValue: false },
  ],
  [FilterFieldType.ForeignKey]: [
    { operator: FilterOperator.Equals, label: 'equals', requiresValue: true },
    { operator: FilterOperator.NotEquals, label: 'not equals', requiresValue: true },
    { operator: FilterOperator.IsEmpty, label: 'is empty', requiresValue: false },
    { operator: FilterOperator.IsNotEmpty, label: 'is not empty', requiresValue: false },
  ],
  [FilterFieldType.File]: [
    { operator: FilterOperator.IsEmpty, label: 'is empty', requiresValue: false },
    { operator: FilterOperator.IsNotEmpty, label: 'is not empty', requiresValue: false },
  ],
  [FilterFieldType.DateTime]: [
    { operator: FilterOperator.Equals, label: 'is', requiresValue: true },
    { operator: FilterOperator.NotEquals, label: 'is not', requiresValue: true },
    { operator: FilterOperator.Lt, label: 'before', requiresValue: true },
    { operator: FilterOperator.Gt, label: 'after', requiresValue: true },
    { operator: FilterOperator.Lte, label: 'on or before', requiresValue: true },
    { operator: FilterOperator.Gte, label: 'on or after', requiresValue: true },
  ],
}

export interface FilterCondition {
  id: string
  field: string
  fieldPath: string[]
  fieldType: FilterFieldType
  operator: FilterOperator
  value: string | number | boolean | null
  isSystemField?: boolean
  systemFieldId?: SystemFieldId
  searchLanguage?: SearchLanguage
  searchType?: SearchType
}

export interface FilterGroup {
  id: string
  logic: 'and' | 'or'
  conditions: FilterCondition[]
  groups: FilterGroup[]
}

export interface FilterableField {
  nodeId: string
  name: string
  path: string[]
  fieldType: FilterFieldType
  schemaStore?: JsonSchemaStore
  isSystemField?: boolean
  systemFieldId?: SystemFieldId
}

export function getFieldTypeFromSchema(schemaStore: JsonSchemaStore): FilterFieldType | null {
  switch (schemaStore.type) {
    case JsonSchemaTypeName.String:
      if ('foreignKey' in schemaStore && schemaStore.foreignKey) {
        return FilterFieldType.ForeignKey
      }
      return FilterFieldType.String
    case JsonSchemaTypeName.Number:
      return FilterFieldType.Number
    case JsonSchemaTypeName.Boolean:
      return FilterFieldType.Boolean
    case JsonSchemaTypeName.Object:
      if (schemaStore.$ref === SystemSchemaIds.File) {
        return FilterFieldType.File
      }
      return null
    default:
      return null
  }
}

export function getDefaultOperator(fieldType: FilterFieldType): FilterOperator {
  switch (fieldType) {
    case FilterFieldType.String:
    case FilterFieldType.ForeignKey:
      return FilterOperator.Contains
    case FilterFieldType.Number:
      return FilterOperator.Equals
    case FilterFieldType.Boolean:
      return FilterOperator.IsTrue
    case FilterFieldType.File:
      return FilterOperator.IsNotEmpty
    case FilterFieldType.DateTime:
      return FilterOperator.Gt
  }
}

export function getOperatorInfo(operator: FilterOperator, fieldType: FilterFieldType): OperatorInfo | undefined {
  return OPERATORS_BY_TYPE[fieldType].find((info) => info.operator === operator)
}

export function operatorRequiresValue(operator: FilterOperator, fieldType: FilterFieldType): boolean {
  const info = getOperatorInfo(operator, fieldType)
  return info?.requiresValue ?? true
}

export function generateFilterId(): string {
  return nanoid()
}

export function createEmptyCondition(field: FilterableField): FilterCondition {
  return {
    id: generateFilterId(),
    field: field.name,
    fieldPath: field.path,
    fieldType: field.fieldType,
    operator: getDefaultOperator(field.fieldType),
    value: field.fieldType === FilterFieldType.Boolean ? true : '',
    isSystemField: field.isSystemField,
    systemFieldId: field.systemFieldId,
    searchLanguage: SearchLanguage.SIMPLE,
    searchType: SearchType.Plain,
  }
}

export function createEmptyGroup(logic: 'and' | 'or' = 'and'): FilterGroup {
  return {
    id: generateFilterId(),
    logic,
    conditions: [],
    groups: [],
  }
}
