import { apolloClient } from 'src/shared/lib'
import {
  TablesMstDocument,
  TablesMstQuery,
  TablesMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/tables.generated.ts'

export const tablesMstRequest = async (variables: TablesMstQueryVariables): Promise<TablesMstQuery> => {
  const result = await apolloClient.query<TablesMstQuery, TablesMstQueryVariables>({
    query: TablesMstDocument,
    variables,
  })
  return result.data
}
