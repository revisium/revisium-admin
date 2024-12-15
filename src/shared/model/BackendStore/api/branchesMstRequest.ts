import { apolloClient } from 'src/shared/lib'
import {
  BranchesMstDocument,
  BranchesMstQuery,
  BranchesMstQueryVariables,
} from 'src/shared/model/BackendStore/api/queries/__generated__/branches.generated.ts'

export const branchesMstRequest = async (variables: BranchesMstQueryVariables): Promise<BranchesMstQuery> => {
  const result = await apolloClient.query<BranchesMstQuery, BranchesMstQueryVariables>({
    query: BranchesMstDocument,
    variables,
  })
  return result.data
}
