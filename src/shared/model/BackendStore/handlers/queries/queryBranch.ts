import { IBackendStore, IBranchModel } from 'src/shared/model/BackendStore'
import { branchMstRequest } from 'src/shared/model/BackendStore/api/branchMstRequest.ts'
import {
  BranchMstQuery,
  BranchMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/branch.generated.ts'
import { addBranchFragmentToCache } from 'src/shared/model/BackendStore/utils/addBranchFragmentToCache.ts'

export type QueryBranchHandlerType = (variables: BranchMstQueryVariables['data']) => Promise<IBranchModel>

export function getQueryBranchHandler(self: IBackendStore) {
  return function* queryBranch(variables: BranchMstQueryVariables['data']) {
    const { branch: branchFragment }: BranchMstQuery = yield branchMstRequest({ data: variables })

    self.cache.addBranchByVariables(variables, branchFragment.id)
    return addBranchFragmentToCache(self.cache, branchFragment)
  }
}
