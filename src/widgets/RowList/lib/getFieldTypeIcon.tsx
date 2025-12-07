import { ReactNode } from 'react'
import { PiFile } from 'react-icons/pi'
import { FilterFieldType } from '../model/filterTypes'

export const getFieldTypeIcon = (fieldType: FilterFieldType): ReactNode => {
  switch (fieldType) {
    case FilterFieldType.String:
      return 'Aa'
    case FilterFieldType.Number:
      return '#'
    case FilterFieldType.Boolean:
      return '?'
    case FilterFieldType.ForeignKey:
      return '->'
    case FilterFieldType.File:
      return <PiFile size={14} />
    default: {
      const _exhaustiveCheck: never = fieldType
      return _exhaustiveCheck
    }
  }
}
