import { apolloClient } from 'src/shared/lib'
import {
  BranchMstDocument,
  BranchMstQuery,
  BranchMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/branch.generated.ts'

export const branchMstRequest = async (variables: BranchMstQueryVariables): Promise<BranchMstQuery> => {
  const result = await apolloClient.query<BranchMstQuery, BranchMstQueryVariables>({
    query: BranchMstDocument,
    variables,
  })
  return result.data
}
