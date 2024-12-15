import { apolloClient } from 'src/shared/lib'
import {
  DeleteEndpointMstDocument,
  DeleteEndpointMstMutation,
  DeleteEndpointMstMutationVariables,
} from 'src/shared/model/BackendStore/api/mutations/__generated__/deleteEndpoint.generated.ts'

export const deleteEndpointMstRequest = async (
  variables: DeleteEndpointMstMutationVariables,
): Promise<DeleteEndpointMstMutation> => {
  const result = await apolloClient.mutate<DeleteEndpointMstMutation, DeleteEndpointMstMutationVariables>({
    mutation: DeleteEndpointMstDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
