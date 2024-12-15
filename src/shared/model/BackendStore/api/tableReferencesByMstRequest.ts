import { apolloClient } from 'src/shared/lib'
import {
  TableReferencesByDocument,
  TableReferencesByQuery,
  TableReferencesByQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/table-references-by.generated.ts'

export const tableReferencesByMstRequest = async (
  variables: TableReferencesByQueryVariables,
): Promise<TableReferencesByQuery> => {
  const result = await apolloClient.query<TableReferencesByQuery, TableReferencesByQueryVariables>({
    query: TableReferencesByDocument,
    variables,
    context: {},
  })
  return result.data
}
