import { RootNodeStore, StringForeignKeyNodeStore } from 'src/widgets/SchemaEditor'

export enum TableStackStateType {
  List = 'List',
  Creating = 'Creating',
  Updating = 'Updating',
}

export interface TableStackStateList {
  type: TableStackStateType.List
}

export interface TableStackStateCreating {
  type: TableStackStateType.Creating
  store: RootNodeStore
}

export interface TableStackStateUpdating {
  type: TableStackStateType.Updating
  store: RootNodeStore
}

export type TableStackState = TableStackStateList | TableStackStateCreating | TableStackStateUpdating

export interface SelectForeignKeyPayload {
  foreignKeyNode: StringForeignKeyNodeStore
}

export type SelectForeignKeyResult = string
