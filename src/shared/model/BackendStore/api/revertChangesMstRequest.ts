import { apolloClient } from 'src/shared/lib'
import {
  RevertChangesMstDocument,
  RevertChangesMstMutation,
  RevertChangesMstMutationVariables,
} from 'src/shared/model/BackendStore/api/mutations/__generated__/revertChanges.generated'

export const revertChangesMstRequest = async (
  variables: RevertChangesMstMutationVariables,
): Promise<RevertChangesMstMutation> => {
  const result = await apolloClient.mutate<RevertChangesMstMutation, RevertChangesMstMutationVariables>({
    mutation: RevertChangesMstDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
