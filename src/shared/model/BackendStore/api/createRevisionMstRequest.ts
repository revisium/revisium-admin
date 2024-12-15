import { apolloClient } from 'src/shared/lib'
import {
  CreateRevisionMstDocument,
  CreateRevisionMstMutation,
  CreateRevisionMstMutationVariables,
} from 'src/shared/model/BackendStore/api/mutations/__generated__/createRevision.generated.ts'

export const createRevisionMstRequest = async (
  variables: CreateRevisionMstMutationVariables,
): Promise<CreateRevisionMstMutation> => {
  const result = await apolloClient.mutate<CreateRevisionMstMutation, CreateRevisionMstMutationVariables>({
    mutation: CreateRevisionMstDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
