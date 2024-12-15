import { types } from 'mobx-state-tree'
import { PageInfoModel, TableModel } from 'src/shared/model/BackendStore'

export const TablesConnection = types.model({
  totalCount: 0,
  pageInfo: types.late(() => PageInfoModel),
  edges: types.array(
    types.model({
      cursor: types.string,
      node: types.reference(types.late(() => TableModel)),
    }),
  ),
})
