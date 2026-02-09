import { JsonValue } from 'src/entities/Schema/types/json.types.ts'

export enum RowStackItemType {
  List = 'List',
  Creating = 'Creating',
  Updating = 'Updating',
}

export interface RowData {
  rowId: string
  data: JsonValue
  foreignKeysCount: number
}

export interface SelectForeignKeyRowPayload {
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
  | { type: 'startForeignKeySelection'; foreignTableId: string }
  | { type: 'startForeignKeyCreation'; foreignTableId: string }
  | { type: 'cancelForeignKeySelection' }

export type RowUpdatingItemResult =
  | { type: 'toList' }
  | { type: 'startForeignKeySelection'; foreignTableId: string }
  | { type: 'startForeignKeyCreation'; foreignTableId: string }
  | { type: 'cancelForeignKeySelection' }

export type RowStackItemResult = RowListItemResult | RowCreatingItemResult | RowUpdatingItemResult

export interface RowEditorNotifications {
  onCopySuccess: () => void
  onCopyError: () => void
  onUploadStart: () => string
  onUploadSuccess: (toastId: string) => void
  onUploadError: (toastId: string) => void
}

export interface RowEditorNavigation {
  navigateToRow: (tableId: string, rowId: string) => void
}
