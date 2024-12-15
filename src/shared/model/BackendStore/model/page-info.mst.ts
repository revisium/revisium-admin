import { types } from 'mobx-state-tree'

export const PageInfoModel = types.model({
  startCursor: types.maybeNull(types.string),
  endCursor: types.maybeNull(types.string),
  hasNextPage: false,
  hasPreviousPage: false,
})

export type IPageInfoModel = Readonly<{
  startCursor: string | null
  endCursor: string | null
  hasNextPage: boolean
  hasPreviousPage: boolean
}>
