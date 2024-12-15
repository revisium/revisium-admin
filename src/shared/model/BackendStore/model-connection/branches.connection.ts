import { types } from 'mobx-state-tree'
import { BranchModel, PageInfoModel } from 'src/shared/model/BackendStore'

export const BranchesConnection = types.model({
  totalCount: 0,
  pageInfo: PageInfoModel,
  edges: types.array(
    types.model({
      cursor: types.string,
      node: types.reference(types.late(() => BranchModel)),
    }),
  ),
})
