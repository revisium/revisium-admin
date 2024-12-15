import { apolloClient } from 'src/shared/lib'
import {
  ProjectMstDocument,
  ProjectMstQuery,
  ProjectMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/project.generated.ts'

export const projectMstRequest = async (variables: ProjectMstQueryVariables): Promise<ProjectMstQuery> => {
  const result = await apolloClient.query<ProjectMstQuery, ProjectMstQueryVariables>({
    query: ProjectMstDocument,
    variables,
  })
  return result.data
}
