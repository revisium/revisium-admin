import { LoginMutation } from 'src/__generated__/graphql-request.ts'
import { client } from 'src/shared/model/ApiService.ts'

export const loginRequest = async (variables: {
  data: { emailOrUsername: string; password: string }
}): Promise<LoginMutation> => {
  return client.login(variables)
}
