import { FilterFieldType } from '../model/filterTypes'
import { AvailableField } from '../model/types'

const TYPE_PRIORITY: Record<FilterFieldType, number> = {
  [FilterFieldType.File]: 1,
  [FilterFieldType.String]: 2,
  [FilterFieldType.Number]: 3,
  [FilterFieldType.Boolean]: 4,
  [FilterFieldType.ForeignKey]: 5,
}

export function sortFieldsByPriority(fields: AvailableField[]): AvailableField[] {
  return [...fields].sort((a, b) => {
    const levelDiff = a.path.length - b.path.length
    if (levelDiff !== 0) {
      return levelDiff
    }

    const priorityA = a.fieldType !== null ? TYPE_PRIORITY[a.fieldType] : 5
    const priorityB = b.fieldType !== null ? TYPE_PRIORITY[b.fieldType] : 5
    const typeDiff = priorityA - priorityB
    if (typeDiff !== 0) {
      return typeDiff
    }

    return a.name.localeCompare(b.name)
  })
}
