import { apolloClient } from 'src/shared/lib'
import {
  UpdateTableMstDocument,
  UpdateTableMstMutation,
  UpdateTableMstMutationVariables,
} from 'src/shared/model/BackendStore/api/mutations/__generated__/updateTable.generated.ts'

export const updateTableMstRequest = async (
  variables: UpdateTableMstMutationVariables,
): Promise<UpdateTableMstMutation> => {
  const result = await apolloClient.mutate<UpdateTableMstMutation, UpdateTableMstMutationVariables>({
    mutation: UpdateTableMstDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
