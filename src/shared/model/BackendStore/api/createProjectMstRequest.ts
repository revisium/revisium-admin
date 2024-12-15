import { apolloClient } from 'src/shared/lib'
import {
  CreateProjectMstDocument,
  CreateProjectMstMutation,
  CreateProjectMstMutationVariables,
} from 'src/shared/model/BackendStore/api/mutations/__generated__/createProject.generated.ts'

export const createProjectMstRequest = async (
  variables: CreateProjectMstMutationVariables,
): Promise<CreateProjectMstMutation> => {
  const result = await apolloClient.mutate<CreateProjectMstMutation, CreateProjectMstMutationVariables>({
    mutation: CreateProjectMstDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
