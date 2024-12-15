import { apolloClient } from 'src/shared/lib'
import {
  RowMstDocument,
  RowMstQuery,
  RowMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/row.generated'

export const rowMstRequest = async (variables: RowMstQueryVariables): Promise<RowMstQuery> => {
  const result = await apolloClient.query<RowMstQuery, RowMstQueryVariables>({
    query: RowMstDocument,
    variables,
    context: {},
  })
  return result.data
}
