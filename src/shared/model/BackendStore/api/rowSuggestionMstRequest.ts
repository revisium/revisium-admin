import { apolloClient } from 'src/shared/lib'
import {
  RowSuggestionMstDocument,
  RowSuggestionMstQuery,
  RowSuggestionMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/rowSuggestion.generated.ts'

export const rowSuggestionMstRequest = async (
  variables: RowSuggestionMstQueryVariables,
): Promise<RowSuggestionMstQuery> => {
  const result = await apolloClient.query<RowSuggestionMstQuery, RowSuggestionMstQueryVariables>({
    query: RowSuggestionMstDocument,
    variables,
    context: {},
  })
  return result.data
}
