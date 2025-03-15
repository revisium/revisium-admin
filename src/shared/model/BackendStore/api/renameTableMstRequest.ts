import { apolloClient } from 'src/shared/lib'
import {
  RenameTableMstDocument,
  RenameTableMstMutation,
  RenameTableMstMutationVariables,
} from 'src/shared/model/BackendStore/api/mutations/__generated__/renameTable.generated.ts'

export const renameTableMstRequest = async (
  variables: RenameTableMstMutationVariables,
): Promise<RenameTableMstMutation> => {
  const result = await apolloClient.mutate<RenameTableMstMutation, RenameTableMstMutationVariables>({
    mutation: RenameTableMstDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
