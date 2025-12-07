import { FilterFieldType } from '../model/filterTypes'

export const getFieldTypeIcon = (fieldType: FilterFieldType): string => {
  switch (fieldType) {
    case FilterFieldType.String:
      return 'Aa'
    case FilterFieldType.Number:
      return '#'
    case FilterFieldType.Boolean:
      return '?'
    case FilterFieldType.ForeignKey:
      return '->'
  }
}
