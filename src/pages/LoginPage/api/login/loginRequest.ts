import { apolloClient } from 'src/shared/lib'
import { LoginDocument, LoginMutation, LoginMutationVariables } from './__generated__/login.generated.ts'

export const loginRequest = async (variables: LoginMutationVariables): Promise<LoginMutation> => {
  const result = await apolloClient.mutate<LoginMutation, LoginMutationVariables>({
    mutation: LoginDocument,
    variables,
  })

  if (!result.data) {
    throw result.errors
  }

  return result.data
}
