import { apolloClient } from 'src/shared/lib'
import {
  CreateTableMstDocument,
  CreateTableMstMutation,
  CreateTableMstMutationVariables,
} from 'src/shared/model/BackendStore/api/mutations/__generated__/createTable.generated.ts'

export const createTableMstRequest = async (
  variables: CreateTableMstMutationVariables,
): Promise<CreateTableMstMutation> => {
  const result = await apolloClient.mutate<CreateTableMstMutation, CreateTableMstMutationVariables>({
    mutation: CreateTableMstDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
