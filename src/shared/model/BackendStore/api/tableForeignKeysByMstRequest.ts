import { apolloClient } from 'src/shared/lib'
import {
  TableForeignKeysByDocument,
  TableForeignKeysByQuery,
  TableForeignKeysByQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/table-foreign-keys-by.generated.ts'

export const tableForeignKeysByMstRequest = async (
  variables: TableForeignKeysByQueryVariables,
): Promise<TableForeignKeysByQuery> => {
  const result = await apolloClient.query<TableForeignKeysByQuery, TableForeignKeysByQueryVariables>({
    query: TableForeignKeysByDocument,
    variables,
    context: {},
  })
  return result.data
}
