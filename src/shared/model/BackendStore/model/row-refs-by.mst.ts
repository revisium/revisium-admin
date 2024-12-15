import { SnapshotOrInstance, types } from 'mobx-state-tree'

export const RowRefsByModel = types
  .model('RowRefsByModel', {
    id: types.identifier,
    countReferencesBy: types.optional(types.integer, 0),
  })
  .actions((self) => ({
    update(rowSnapshot: SnapshotOrInstance<typeof RowRefsByModel>) {
      for (const [key, value] of Object.entries(rowSnapshot)) {
        self[key] = value
      }
    },
  }))

export type IRowRefsByModelBase = {
  countReferencesBy: number
}

export type IRowRefsByModel = IRowRefsByModelBase & {
  update: (snapshot: Partial<IRowRefsByModelBase>) => void
}

export type IRowRefsByModelReferences = IRowRefsByModelBase
