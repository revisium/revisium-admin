import { SnapshotOrInstance, types } from 'mobx-state-tree'
import { JsonValue } from 'src/entities/Schema/types/json.types.ts'
import { ISODate } from 'src/shared/model/BackendStore/index.ts'
import {
  createModelConnection,
  IConnection,
} from 'src/shared/model/BackendStore/model-connection/createModelConnection.ts'

export const RowReferencesByConnection = createModelConnection(
  'RowReferencesByConnection',
  types.late(() => RowModel),
)

export const RowModel = types
  .model('RowModel', {
    id: types.string,
    versionId: types.identifier,
    createdAt: types.late(() => ISODate),
    readonly: types.boolean,
    data: types.frozen({}),
    rowReferencesByConnection: types.map(types.optional(RowReferencesByConnection, {})),
  })
  .actions((self) => ({
    update(rowSnapshot: SnapshotOrInstance<typeof RowModel>) {
      for (const [key, value] of Object.entries(rowSnapshot)) {
        self[key] = value
      }
    },

    getOrCreateRowReferencesByConnection(referenceTableId: string) {
      if (!self.rowReferencesByConnection.has(referenceTableId)) {
        self.rowReferencesByConnection.set(referenceTableId, RowReferencesByConnection.create())
      }

      return self.rowReferencesByConnection.get(referenceTableId)
    },
  }))

export type IRowModelBase = {
  id: string
  versionId: string
  createdAt: Date | string
  readonly: boolean
  data: JsonValue
}

export type IRowModel = IRowModelBase &
  Readonly<{
    rowReferencesByConnection: Map<string, IConnection<IRowModel>>
  }> & {
    getOrCreateRowReferencesByConnection(referenceTableId: string): IConnection<IRowModel>
    update: (snapshot: Partial<Omit<IRowModelBase, 'id' | 'versionId'>>) => void
  }

export type IRowModelReferences = IRowModelBase &
  Readonly<{
    rowReferencesByConnection: Map<string, IConnection<IRowModel>>
  }>
