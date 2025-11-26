import { ChangeType } from 'src/__generated__/graphql-request'

type RowChangeBase = {
  changeType: ChangeType
}

type AddedRowChange = RowChangeBase & {
  changeType: ChangeType.Added
  row: { id: string }
  table: { id: string }
}

type RemovedRowChange = RowChangeBase & {
  changeType: ChangeType.Removed
  fromRow: { id: string }
  fromTable: { id: string }
}

type ModifiedRowChange = RowChangeBase & {
  changeType: ChangeType.Modified | ChangeType.Renamed | ChangeType.RenamedAndModified
  row: { id: string }
  fromRow: { id: string }
  table: { id: string }
  fromTable: { id: string }
}

export function isAddedRowChange<T extends RowChangeBase>(item: T): item is T & AddedRowChange {
  return item.changeType === ChangeType.Added
}

export function isRemovedRowChange<T extends RowChangeBase>(item: T): item is T & RemovedRowChange {
  return item.changeType === ChangeType.Removed
}

export function isModifiedRowChange<T extends RowChangeBase>(item: T): item is T & ModifiedRowChange {
  return (
    item.changeType === ChangeType.Modified ||
    item.changeType === ChangeType.Renamed ||
    item.changeType === ChangeType.RenamedAndModified
  )
}
