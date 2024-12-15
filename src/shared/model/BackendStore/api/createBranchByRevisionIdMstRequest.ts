import { apolloClient } from 'src/shared/lib'
import {
  CreateBranchByRevisionIdMstDocument,
  CreateBranchByRevisionIdMstMutation,
  CreateBranchByRevisionIdMstMutationVariables,
} from 'src/shared/model/BackendStore/api/mutations/__generated__/createBranchByRevisionId.generated'

export const createBranchByRevisionIdMstRequest = async (
  variables: CreateBranchByRevisionIdMstMutationVariables,
): Promise<CreateBranchByRevisionIdMstMutation> => {
  const result = await apolloClient.mutate<
    CreateBranchByRevisionIdMstMutation,
    CreateBranchByRevisionIdMstMutationVariables
  >({
    mutation: CreateBranchByRevisionIdMstDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
