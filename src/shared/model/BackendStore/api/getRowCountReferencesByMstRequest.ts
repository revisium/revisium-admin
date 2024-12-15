import { apolloClient } from 'src/shared/lib'
import {
  GetRowCountReferencesToDocument,
  GetRowCountReferencesToQuery,
  GetRowCountReferencesToQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/get-row-count-references-by.generated.ts'

export const getRowCountReferencesByMstRequest = async (
  variables: GetRowCountReferencesToQueryVariables,
): Promise<GetRowCountReferencesToQuery> => {
  const result = await apolloClient.query<GetRowCountReferencesToQuery, GetRowCountReferencesToQueryVariables>({
    query: GetRowCountReferencesToDocument,
    variables,
    context: {},
  })
  return result.data
}
