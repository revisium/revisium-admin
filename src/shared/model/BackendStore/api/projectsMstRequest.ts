import { apolloClient } from 'src/shared/lib'
import {
  ProjectsMstDocument,
  ProjectsMstQuery,
  ProjectsMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/projects.generated.ts'

export const projectsMstRequest = async (variables: ProjectsMstQueryVariables): Promise<ProjectsMstQuery> => {
  const result = await apolloClient.query<ProjectsMstQuery, ProjectsMstQueryVariables>({
    query: ProjectsMstDocument,
    variables,
  })
  return result.data
}
