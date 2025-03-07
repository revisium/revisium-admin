import { SnapshotOrInstance, types } from 'mobx-state-tree'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { IRowModel, ISODate, RowModel } from 'src/shared/model/BackendStore/index.ts'
import {
  createModelConnection,
  IConnection,
} from 'src/shared/model/BackendStore/model-connection/createModelConnection.ts'

export const TableRowsConnection = createModelConnection(
  'TableRowsConnection',
  types.late(() => RowModel),
)

export const foreignKeysByConnection = createModelConnection(
  'foreignKeysByConnection',
  types.late(() => TableModel),
)

export const TableModel = types
  .model('TableModel', {
    id: types.string,
    versionId: types.identifier,
    count: types.integer,
    readonly: types.boolean,
    createdAt: types.late(() => ISODate),
    schema: types.frozen({}),
    rowsConnection: types.optional(TableRowsConnection, {}),
    foreignKeysByConnection: types.optional(foreignKeysByConnection, {}),
  })
  .actions((self) => ({
    update(rowSnapshot: SnapshotOrInstance<typeof TableModel>) {
      for (const [key, value] of Object.entries(rowSnapshot)) {
        self[key] = value
      }
    },
  }))

export type ITableModelBase = Readonly<{
  id: string
  versionId: string
  count: number
  readonly: boolean
  createdAt: Date | string
  schema: JsonValue
}>

export type ITableModel = ITableModelBase &
  Readonly<{
    rowsConnection: IConnection<IRowModel>
    foreignKeysByConnection: IConnection<ITableModel>
  }> & {
    update: (snapshot: Partial<Omit<ITableModelBase, 'id' | 'versionId'>>) => void
  }

export type ITableModelReferences = ITableModelBase &
  Readonly<{
    rowsConnection: IConnection<string>
    foreignKeysByConnection: IConnection<string>
  }>
