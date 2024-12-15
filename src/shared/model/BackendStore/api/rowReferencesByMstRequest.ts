import { apolloClient } from 'src/shared/lib'
import {
  RowReferencesByDocument,
  RowReferencesByQuery,
  RowReferencesByQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/row-references-by.generated.ts'

export const rowReferencesByMstRequest = async (
  variables: RowReferencesByQueryVariables,
): Promise<RowReferencesByQuery> => {
  const result = await apolloClient.query<RowReferencesByQuery, RowReferencesByQueryVariables>({
    query: RowReferencesByDocument,
    variables,
    context: {},
  })
  return result.data
}
