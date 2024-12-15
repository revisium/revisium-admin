import { apolloClient } from 'src/shared/lib'
import {
  DeleteTableMstDocument,
  DeleteTableMstMutation,
  DeleteTableMstMutationVariables,
} from 'src/shared/model/BackendStore/api/mutations/__generated__/deleteTable.generated.ts'

export const deleteTableMstRequest = async (
  variables: DeleteTableMstMutationVariables,
): Promise<DeleteTableMstMutation> => {
  const result = await apolloClient.mutate<DeleteTableMstMutation, DeleteTableMstMutationVariables>({
    mutation: DeleteTableMstDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
