import { apolloClient } from 'src/shared/lib'
import {
  RenameRowMstDocument,
  RenameRowMstMutation,
  RenameRowMstMutationVariables,
} from 'src/shared/model/BackendStore/api/mutations/__generated__/renameRow.generated.ts'

export const renameRowMstRequest = async (variables: RenameRowMstMutationVariables): Promise<RenameRowMstMutation> => {
  const result = await apolloClient.mutate<RenameRowMstMutation, RenameRowMstMutationVariables>({
    mutation: RenameRowMstDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
