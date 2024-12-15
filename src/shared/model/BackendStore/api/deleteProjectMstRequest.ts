import { apolloClient } from 'src/shared/lib'
import {
  DeleteProjectMstDocument,
  DeleteProjectMstMutation,
  DeleteProjectMstMutationVariables,
} from 'src/shared/model/BackendStore/api/mutations/__generated__/deleteProject.generated.ts'

export const deleteProjectMstRequest = async (
  variables: DeleteProjectMstMutationVariables,
): Promise<DeleteProjectMstMutation> => {
  const result = await apolloClient.mutate<DeleteProjectMstMutation, DeleteProjectMstMutationVariables>({
    mutation: DeleteProjectMstDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
