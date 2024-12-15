// @ts-ignore
import * as Types from '../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type LoginGithubMutationVariables = Types.Exact<{
  data: Types.LoginGithubInput
}>

export type LoginGithubMutation = {
  __typename?: 'Mutation'
  loginGithub: { __typename?: 'LoginModel'; accessToken: string }
}

export const LoginGithubDocument = gql`
  mutation loginGithub($data: LoginGithubInput!) {
    loginGithub(data: $data) {
      accessToken
    }
  }
`
export type LoginGithubMutationFn = Apollo.MutationFunction<LoginGithubMutation, LoginGithubMutationVariables>

/**
 * __useLoginGithubMutation__
 *
 * To run a mutation, you first call `useLoginGithubMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginGithubMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginGithubMutation, { data, loading, error }] = useLoginGithubMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginGithubMutation(
  baseOptions?: Apollo.MutationHookOptions<LoginGithubMutation, LoginGithubMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<LoginGithubMutation, LoginGithubMutationVariables>(LoginGithubDocument, options)
}
export type LoginGithubMutationHookResult = ReturnType<typeof useLoginGithubMutation>
export type LoginGithubMutationResult = Apollo.MutationResult<LoginGithubMutation>
export type LoginGithubMutationOptions = Apollo.BaseMutationOptions<LoginGithubMutation, LoginGithubMutationVariables>
