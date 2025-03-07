import { apolloClient } from 'src/shared/lib'
import {
  RowForeignKeysByDocument,
  RowForeignKeysByQuery,
  RowForeignKeysByQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/row-foreign-keys-by.generated.ts'

export const rowForeignKeysByMstRequest = async (
  variables: RowForeignKeysByQueryVariables,
): Promise<RowForeignKeysByQuery> => {
  const result = await apolloClient.query<RowForeignKeysByQuery, RowForeignKeysByQueryVariables>({
    query: RowForeignKeysByDocument,
    variables,
    context: {},
  })
  return result.data
}
