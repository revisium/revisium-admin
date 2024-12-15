import { apolloClient } from 'src/shared/lib'
import {
  CreateRowMstDocument,
  CreateRowMstMutation,
  CreateRowMstMutationVariables,
} from 'src/shared/model/BackendStore/api/mutations/__generated__/createRow.generated.ts'

export const createRowMstRequest = async (variables: CreateRowMstMutationVariables): Promise<CreateRowMstMutation> => {
  const result = await apolloClient.mutate<CreateRowMstMutation, CreateRowMstMutationVariables>({
    mutation: CreateRowMstDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
