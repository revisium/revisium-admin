import { FilterCondition, FilterFieldType, FilterGroup, FilterOperator, SystemFieldId } from '../model/filterTypes'

export function buildGraphQLWhere(group: FilterGroup): object | undefined {
  return groupToGraphQL(group)
}

const SYSTEM_FIELD_TO_WHERE_KEY: Record<SystemFieldId, string> = {
  [SystemFieldId.Id]: 'id',
  [SystemFieldId.CreatedAt]: 'createdAt',
  [SystemFieldId.UpdatedAt]: 'updatedAt',
  [SystemFieldId.PublishedAt]: 'publishedAt',
  [SystemFieldId.VersionId]: 'versionId',
  [SystemFieldId.CreatedId]: 'createdId',
}

function groupToGraphQL(group: FilterGroup): object | undefined {
  const conditions: object[] = []

  for (const condition of group.conditions) {
    const graphqlCondition = conditionToGraphQL(condition)
    if (graphqlCondition) {
      conditions.push(graphqlCondition)
    }
  }

  for (const subGroup of group.groups) {
    const graphqlGroup = groupToGraphQL(subGroup)
    if (graphqlGroup) {
      conditions.push(graphqlGroup)
    }
  }

  if (conditions.length === 0) {
    return undefined
  }
  if (conditions.length === 1) {
    return conditions[0]
  }

  return group.logic === 'and' ? { AND: conditions } : { OR: conditions }
}

function conditionToGraphQL(condition: FilterCondition): object | undefined {
  const { fieldPath, fieldType, operator, value, isSystemField, systemFieldId } = condition

  if (isSystemField && systemFieldId) {
    return buildSystemFieldFilter(systemFieldId, fieldType, operator, value)
  }

  switch (operator) {
    case FilterOperator.Equals:
      return buildDataFilter(fieldPath, { equals: normalizeValue(value, fieldType) })

    case FilterOperator.NotEquals:
      return {
        NOT: [buildDataFilter(fieldPath, { equals: normalizeValue(value, fieldType) })],
      }

    case FilterOperator.Contains:
      return buildDataFilter(fieldPath, { string_contains: String(value) })

    case FilterOperator.NotContains:
      return {
        NOT: [buildDataFilter(fieldPath, { string_contains: String(value) })],
      }

    case FilterOperator.StartsWith:
      return buildDataFilter(fieldPath, { string_starts_with: String(value) })

    case FilterOperator.EndsWith:
      return buildDataFilter(fieldPath, { string_ends_with: String(value) })

    case FilterOperator.IsEmpty:
      return buildDataFilter(fieldPath, { equals: '' })

    case FilterOperator.IsNotEmpty:
      return {
        NOT: [buildDataFilter(fieldPath, { equals: '' })],
      }

    case FilterOperator.Gt:
      return buildDataFilter(fieldPath, {
        gt: fieldType === FilterFieldType.Number ? Number(value) : String(value),
      })

    case FilterOperator.Gte:
      return buildDataFilter(fieldPath, {
        gte: fieldType === FilterFieldType.Number ? Number(value) : String(value),
      })

    case FilterOperator.Lt:
      return buildDataFilter(fieldPath, {
        lt: fieldType === FilterFieldType.Number ? Number(value) : String(value),
      })

    case FilterOperator.Lte:
      return buildDataFilter(fieldPath, {
        lte: fieldType === FilterFieldType.Number ? Number(value) : String(value),
      })

    case FilterOperator.IsTrue:
      return buildDataFilter(fieldPath, { equals: true })

    case FilterOperator.IsFalse:
      return buildDataFilter(fieldPath, { equals: false })

    default:
      return undefined
  }
}

function buildSystemFieldFilter(
  systemFieldId: SystemFieldId,
  fieldType: FilterFieldType,
  operator: FilterOperator,
  value: string | number | boolean | null,
): object | undefined {
  const whereKey = SYSTEM_FIELD_TO_WHERE_KEY[systemFieldId]
  if (!whereKey) return undefined

  const filterValue = buildSystemFieldFilterValue(fieldType, operator, value)
  if (!filterValue) return undefined

  return { [whereKey]: filterValue }
}

function buildSystemFieldFilterValue(
  fieldType: FilterFieldType,
  operator: FilterOperator,
  value: string | number | boolean | null,
): object | undefined {
  switch (operator) {
    case FilterOperator.Equals:
      return { equals: normalizeValue(value, fieldType) }

    case FilterOperator.NotEquals:
      return { not: normalizeValue(value, fieldType) }

    case FilterOperator.Contains:
      return { contains: String(value) }

    case FilterOperator.NotContains:
      return { not: { contains: String(value) } }

    case FilterOperator.StartsWith:
      return { startsWith: String(value) }

    case FilterOperator.EndsWith:
      return { endsWith: String(value) }

    case FilterOperator.IsEmpty:
      return { equals: '' }

    case FilterOperator.IsNotEmpty:
      return { not: '' }

    case FilterOperator.Gt:
      return { gt: fieldType === FilterFieldType.Number ? Number(value) : String(value) }

    case FilterOperator.Gte:
      return { gte: fieldType === FilterFieldType.Number ? Number(value) : String(value) }

    case FilterOperator.Lt:
      return { lt: fieldType === FilterFieldType.Number ? Number(value) : String(value) }

    case FilterOperator.Lte:
      return { lte: fieldType === FilterFieldType.Number ? Number(value) : String(value) }

    default:
      return undefined
  }
}

function buildDataFilter(path: string[], filter: object): object {
  return {
    data: {
      path,
      ...filter,
    },
  }
}

function normalizeValue(value: string | number | boolean | null, fieldType: FilterFieldType): unknown {
  if (value === null) return null

  switch (fieldType) {
    case FilterFieldType.Number:
      return Number(value)
    case FilterFieldType.Boolean:
      return Boolean(value)
    default:
      return String(value)
  }
}
