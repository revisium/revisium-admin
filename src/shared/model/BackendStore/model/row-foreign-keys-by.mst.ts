import { SnapshotOrInstance, types } from 'mobx-state-tree'

export const RowForeignKeysByModel = types
  .model('RowForeignKeysByModel', {
    id: types.identifier,
    countForeignKeysBy: types.optional(types.integer, 0),
  })
  .actions((self) => ({
    update(rowSnapshot: SnapshotOrInstance<typeof RowForeignKeysByModel>) {
      for (const [key, value] of Object.entries(rowSnapshot)) {
        self[key] = value
      }
    },
  }))

export type IRowForeignKeysByModelBase = {
  countForeignKeysBy: number
}

export type IRowForeignKeysByModel = IRowForeignKeysByModelBase & {
  update: (snapshot: Partial<IRowForeignKeysByModelBase>) => void
}

export type IRowForeignKeysByModelReferences = IRowForeignKeysByModelBase
