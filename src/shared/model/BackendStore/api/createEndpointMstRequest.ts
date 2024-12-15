import { apolloClient } from 'src/shared/lib'
import {
  CreateEndpointMstDocument,
  CreateEndpointMstMutation,
  CreateEndpointMstMutationVariables,
} from 'src/shared/model/BackendStore/api/mutations/__generated__/createEndpoint.generated.ts'

export const createEndpointMstRequest = async (
  variables: CreateEndpointMstMutationVariables,
): Promise<CreateEndpointMstMutation> => {
  const result = await apolloClient.mutate<CreateEndpointMstMutation, CreateEndpointMstMutationVariables>({
    mutation: CreateEndpointMstDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
