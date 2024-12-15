// @ts-ignore
import * as Types from '../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type LoginGoogleMutationVariables = Types.Exact<{
  data: Types.LoginGoogleInput
}>

export type LoginGoogleMutation = {
  __typename?: 'Mutation'
  loginGoogle: { __typename?: 'LoginModel'; accessToken: string }
}

export const LoginGoogleDocument = gql`
  mutation loginGoogle($data: LoginGoogleInput!) {
    loginGoogle(data: $data) {
      accessToken
    }
  }
`
export type LoginGoogleMutationFn = Apollo.MutationFunction<LoginGoogleMutation, LoginGoogleMutationVariables>

/**
 * __useLoginGoogleMutation__
 *
 * To run a mutation, you first call `useLoginGoogleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginGoogleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginGoogleMutation, { data, loading, error }] = useLoginGoogleMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginGoogleMutation(
  baseOptions?: Apollo.MutationHookOptions<LoginGoogleMutation, LoginGoogleMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<LoginGoogleMutation, LoginGoogleMutationVariables>(LoginGoogleDocument, options)
}
export type LoginGoogleMutationHookResult = ReturnType<typeof useLoginGoogleMutation>
export type LoginGoogleMutationResult = Apollo.MutationResult<LoginGoogleMutation>
export type LoginGoogleMutationOptions = Apollo.BaseMutationOptions<LoginGoogleMutation, LoginGoogleMutationVariables>
