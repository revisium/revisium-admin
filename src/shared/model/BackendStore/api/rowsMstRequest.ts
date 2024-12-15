import { apolloClient } from 'src/shared/lib'
import {
  RowsMstDocument,
  RowsMstQuery,
  RowsMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/rows.generated.ts'

export const rowsMstRequest = async (variables: RowsMstQueryVariables): Promise<RowsMstQuery> => {
  const result = await apolloClient.query<RowsMstQuery, RowsMstQueryVariables>({
    query: RowsMstDocument,
    variables,
  })
  return result.data
}
