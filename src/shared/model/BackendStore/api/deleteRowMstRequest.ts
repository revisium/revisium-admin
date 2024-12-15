import { apolloClient } from 'src/shared/lib'
import {
  DeleteRowMstDocument,
  DeleteRowMstMutation,
  DeleteRowMstMutationVariables,
} from 'src/shared/model/BackendStore/api/mutations/__generated__/deleteRow.generated.ts'

export const deleteRowMstRequest = async (variables: DeleteRowMstMutationVariables): Promise<DeleteRowMstMutation> => {
  const result = await apolloClient.mutate<DeleteRowMstMutation, DeleteRowMstMutationVariables>({
    mutation: DeleteRowMstDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
