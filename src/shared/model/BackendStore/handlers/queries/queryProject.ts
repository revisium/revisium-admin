import { IBackendStore, IProjectModel } from 'src/shared/model/BackendStore'
import { projectMstRequest } from 'src/shared/model/BackendStore/api/projectMstRequest.ts'
import {
  ProjectMstQuery,
  ProjectMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/project.generated.ts'
import { addProjectFragmentToCache } from 'src/shared/model/BackendStore/utils/addProjectFragmentToCache.ts'

export type QueryProjectHandlerType = (variables: ProjectMstQueryVariables['data']) => Promise<IProjectModel>

export function getQueryProjectHandler(self: IBackendStore) {
  return function* queryProject(variables: ProjectMstQueryVariables['data']) {
    const { project: projectFragment }: ProjectMstQuery = yield projectMstRequest({ data: variables })

    self.cache.addProjectByVariables(variables, projectFragment.id)
    return addProjectFragmentToCache(self.cache, projectFragment)
  }
}
