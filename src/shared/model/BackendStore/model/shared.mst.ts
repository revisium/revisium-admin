import { types } from 'mobx-state-tree'

export const ISODate = types.custom<string, Date>({
  name: 'ISODate',
  fromSnapshot(value: string): Date {
    return new Date(value)
  },
  toSnapshot(value: Date): string {
    return value.toISOString()
  },
  isTargetType(value: unknown): boolean {
    return value instanceof Date
  },
  getValidationMessage(value: unknown): string {
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      return ''
    }
    return `'${value}' is not a valid ISO date string`
  },
})

export const JSONType = types.frozen()
