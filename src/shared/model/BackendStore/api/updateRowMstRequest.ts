import { apolloClient } from 'src/shared/lib'
import {
  UpdateRowMstDocument,
  UpdateRowMstMutation,
  UpdateRowMstMutationVariables,
} from 'src/shared/model/BackendStore/api/mutations/__generated__/updateRow.generated.ts'

export const updateRowMstRequest = async (variables: UpdateRowMstMutationVariables): Promise<UpdateRowMstMutation> => {
  const result = await apolloClient.mutate<UpdateRowMstMutation, UpdateRowMstMutationVariables>({
    mutation: UpdateRowMstDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
