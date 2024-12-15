import { MeProjectsMstQuery, MeProjectsMstQueryVariables } from 'src/__generated__/graphql-request.ts'
import { container } from 'src/shared/lib'
import { ApiService } from 'src/shared/model'
import { IBackendStore } from 'src/shared/model/BackendStore'
import { ProjectMstFragment } from 'src/shared/model/BackendStore/api/fragments/__generated__/project.generated.ts'
import { addProjectFragmentToCache } from 'src/shared/model/BackendStore/utils/addProjectFragmentToCache.ts'
import { transformConnectionId } from 'src/shared/model/BackendStore/utils/transformConnection.ts'

export type QueryProjectsHandlerType = (variables: MeProjectsMstQueryVariables['data']) => Promise<void>

const apiService = container.get(ApiService)

export function getQueryMeProjectsHandler(self: IBackendStore) {
  return function* queryProjects(variables: MeProjectsMstQueryVariables['data']) {
    const result: MeProjectsMstQuery = yield apiService.client.meProjectsMst({ data: variables })
    const connectionSnapshot = transformConnectionId(result.meProjects)

    result.meProjects.edges.forEach(({ node }) => {
      self.cache.addProjectByVariables({ organizationId: node.organizationId, projectName: node.name }, node.id)
      addProjectFragmentToCache(self.cache, node as unknown as ProjectMstFragment) // TODO waiting for migration to graphql-requests
    })

    if (!variables.after) {
      self.cache.meProjectsConnection.reset()
    }

    self.cache.meProjectsConnection.onLoad({
      edges: connectionSnapshot.edges,
      hasNextPage: connectionSnapshot.pageInfo.hasNextPage,
      totalCount: connectionSnapshot.totalCount,
    })
  }
}
