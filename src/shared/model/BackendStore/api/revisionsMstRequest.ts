import { apolloClient } from 'src/shared/lib'
import {
  RevisionsMstDocument,
  RevisionsMstQuery,
  RevisionsMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/revisions.generated'

export const revisionsMstRequest = async (variables: RevisionsMstQueryVariables): Promise<RevisionsMstQuery> => {
  const result = await apolloClient.query<RevisionsMstQuery, RevisionsMstQueryVariables>({
    query: RevisionsMstDocument,
    variables,
  })
  return result.data
}
