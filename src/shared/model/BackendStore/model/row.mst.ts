import { SnapshotOrInstance, types } from 'mobx-state-tree'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { ISODate } from 'src/shared/model/BackendStore/index.ts'
import {
  createModelConnection,
  IConnection,
} from 'src/shared/model/BackendStore/model-connection/createModelConnection.ts'

export const RowForeignKeysByConnection = createModelConnection(
  'RowForeignKeysByConnection',
  types.late(() => RowModel),
)

export const RowModel = types
  .model('RowModel', {
    createdId: types.string,
    id: types.string,
    versionId: types.identifier,
    createdAt: types.late(() => ISODate),
    updatedAt: types.late(() => ISODate),
    readonly: types.boolean,
    data: types.frozen({}),
    rowForeignKeysByConnection: types.map(types.optional(RowForeignKeysByConnection, {})),
  })
  .actions((self) => ({
    update(rowSnapshot: SnapshotOrInstance<typeof RowModel>) {
      for (const [key, value] of Object.entries(rowSnapshot)) {
        self[key] = value
      }
    },

    getOrCreateRowForeignKeysByConnection(foreignKeyTableId: string) {
      if (!self.rowForeignKeysByConnection.has(foreignKeyTableId)) {
        self.rowForeignKeysByConnection.set(foreignKeyTableId, RowForeignKeysByConnection.create())
      }

      return self.rowForeignKeysByConnection.get(foreignKeyTableId)
    },
  }))

export type IRowModelBase = {
  createdId: string
  id: string
  versionId: string
  createdAt: Date | string
  updatedAt: Date | string
  readonly: boolean
  data: JsonValue
}

export type IRowModel = IRowModelBase &
  Readonly<{
    rowForeignKeysByConnection: Map<string, IConnection<IRowModel>>
  }> & {
    getOrCreateRowForeignKeysByConnection(foreignKeyTableId: string): IConnection<IRowModel>
    update: (snapshot: Partial<Omit<IRowModelBase, 'id' | 'versionId'>>) => void
  }

export type IRowModelReferences = IRowModelBase &
  Readonly<{
    rowForeignKeysByConnection: Map<string, IConnection<IRowModel>>
  }>
