import { JsonStringValueStore } from 'src/entities/Schema/model/value/json-string-value.store.ts'

export enum RowStackItemType {
  List = 'List',
  Creating = 'Creating',
  Updating = 'Updating',
}

export interface SelectForeignKeyRowPayload {
  foreignKeyNode: JsonStringValueStore
  foreignTableId: string
}

export type SelectForeignKeyRowResult = string

export type RowListItemResult =
  | { type: 'toCreating' }
  | { type: 'toCloning'; rowId: string }
  | { type: 'toUpdating'; rowId: string }
  | { type: 'selectForeignKeyRow'; rowId: string }

export type RowCreatingItemResult =
  | { type: 'toList' }
  | { type: 'creatingToUpdating' }
  | { type: 'selectForeignKeyRow'; rowId: string }
  | { type: 'startForeignKeySelection'; foreignKeyNode: JsonStringValueStore; foreignTableId: string }
  | { type: 'startForeignKeyCreation'; foreignKeyNode: JsonStringValueStore; foreignTableId: string }
  | { type: 'cancelForeignKeySelection' }

export type RowUpdatingItemResult =
  | { type: 'toList' }
  | { type: 'startForeignKeySelection'; foreignKeyNode: JsonStringValueStore; foreignTableId: string }
  | { type: 'startForeignKeyCreation'; foreignKeyNode: JsonStringValueStore; foreignTableId: string }
  | { type: 'cancelForeignKeySelection' }

export type RowStackItemResult = RowListItemResult | RowCreatingItemResult | RowUpdatingItemResult
