export enum TableStackItemType {
  List = 'List',
  Creating = 'Creating',
  Updating = 'Updating',
}

export interface SelectForeignKeyPayload {
  resolve: (tableId: string | null) => void
}

export type SelectForeignKeyResult = string

export type TableListItemResult =
  | { type: 'toCreating' }
  | { type: 'toCloning'; tableId: string }
  | { type: 'toUpdating'; tableId: string }
  | { type: 'selectTable'; tableId: string }

export type TableCreatingItemResult =
  | { type: 'toList' }
  | { type: 'creatingToUpdating' }
  | { type: 'selectTable'; tableId: string }
  | { type: 'startForeignKeySelection'; resolve: (tableId: string | null) => void }
  | { type: 'cancelForeignKeySelection' }

export type TableUpdatingItemResult =
  | { type: 'toList' }
  | { type: 'startForeignKeySelection'; resolve: (tableId: string | null) => void }
  | { type: 'cancelForeignKeySelection' }

export type TableStackItemResult = TableListItemResult | TableCreatingItemResult | TableUpdatingItemResult
