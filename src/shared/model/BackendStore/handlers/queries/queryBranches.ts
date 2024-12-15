import { IBackendStore } from 'src/shared/model/BackendStore'
import { branchesMstRequest } from 'src/shared/model/BackendStore/api/branchesMstRequest.ts'
import {
  BranchesMstQuery,
  BranchesMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/branches.generated.ts'
import { addBranchFragmentToCache } from 'src/shared/model/BackendStore/utils/addBranchFragmentToCache.ts'
import { transformConnectionId } from 'src/shared/model/BackendStore/utils/transformConnection.ts'

export type QueryBranchesHandlerType = (variables: BranchesMstQueryVariables['data']) => Promise<void>

export function getQueryBranchesHandler(self: IBackendStore) {
  return function* queryBranches(variables: BranchesMstQueryVariables['data']) {
    const result: BranchesMstQuery = yield branchesMstRequest({ data: variables })
    const connectionSnapshot = transformConnectionId(result.branches)

    result.branches.edges.forEach(({ node }) => {
      self.cache.addBranchByVariables(
        {
          organizationId: variables.organizationId,
          projectName: variables.projectName,
          branchName: node.name,
        },
        node.id,
      )
      addBranchFragmentToCache(self.cache, node)
    })

    const project = self.cache.getProjectByVariables({
      organizationId: variables.organizationId,
      projectName: variables.projectName,
    })

    if (!variables.after) {
      project?.branchesConnection.reset()
    }
    project?.branchesConnection.onLoad({
      edges: connectionSnapshot.edges,
      hasNextPage: connectionSnapshot.pageInfo.hasNextPage,
      totalCount: connectionSnapshot.totalCount,
    })
  }
}
