import { apolloClient } from 'src/shared/lib'
import {
  GetRowCountForeignKeysToDocument,
  GetRowCountForeignKeysToQuery,
  GetRowCountForeignKeysToQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/get-row-count-foreign-keys-by.generated.ts'

export const getRowCountForeignKeysByMstRequest = async (
  variables: GetRowCountForeignKeysToQueryVariables,
): Promise<GetRowCountForeignKeysToQuery> => {
  const result = await apolloClient.query<GetRowCountForeignKeysToQuery, GetRowCountForeignKeysToQueryVariables>({
    query: GetRowCountForeignKeysToDocument,
    variables,
    context: {},
  })
  return result.data
}
