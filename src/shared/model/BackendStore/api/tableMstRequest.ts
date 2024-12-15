import { apolloClient } from 'src/shared/lib'
import {
  TableMstDocument,
  TableMstQuery,
  TableMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/table.generated'

export const tableMstRequest = async (variables: TableMstQueryVariables): Promise<TableMstQuery> => {
  const result = await apolloClient.query<TableMstQuery, TableMstQueryVariables>({
    query: TableMstDocument,
    variables,
    context: {},
  })
  return result.data
}
