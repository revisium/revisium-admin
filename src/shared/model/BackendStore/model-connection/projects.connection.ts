import { types } from 'mobx-state-tree'
import { PageInfoModel, ProjectModel } from 'src/shared/model/BackendStore'

export const ProjectsConnection = types.model({
  totalCount: 0,
  pageInfo: PageInfoModel,
  edges: types.array(
    types.model({
      cursor: types.string,
      node: types.reference(types.late(() => ProjectModel)),
    }),
  ),
})
