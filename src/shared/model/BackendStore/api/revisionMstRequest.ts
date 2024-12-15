import { apolloClient } from 'src/shared/lib'
import {
  RevisionMstDocument,
  RevisionMstQuery,
  RevisionMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/revision.generated'

export const revisionMstRequest = async (variables: RevisionMstQueryVariables): Promise<RevisionMstQuery> => {
  const result = await apolloClient.query<RevisionMstQuery, RevisionMstQueryVariables>({
    query: RevisionMstDocument,
    variables,
  })
  return result.data
}
