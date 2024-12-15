// @ts-ignore
import * as Types from '../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type SetUsernameMutationVariables = Types.Exact<{
  data: Types.SetUsernameInput
}>

export type SetUsernameMutation = { __typename?: 'Mutation'; setUsername: boolean }

export const SetUsernameDocument = gql`
  mutation setUsername($data: SetUsernameInput!) {
    setUsername(data: $data)
  }
`
export type SetUsernameMutationFn = Apollo.MutationFunction<SetUsernameMutation, SetUsernameMutationVariables>

/**
 * __useSetUsernameMutation__
 *
 * To run a mutation, you first call `useSetUsernameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetUsernameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setUsernameMutation, { data, loading, error }] = useSetUsernameMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useSetUsernameMutation(
  baseOptions?: Apollo.MutationHookOptions<SetUsernameMutation, SetUsernameMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<SetUsernameMutation, SetUsernameMutationVariables>(SetUsernameDocument, options)
}
export type SetUsernameMutationHookResult = ReturnType<typeof useSetUsernameMutation>
export type SetUsernameMutationResult = Apollo.MutationResult<SetUsernameMutation>
export type SetUsernameMutationOptions = Apollo.BaseMutationOptions<SetUsernameMutation, SetUsernameMutationVariables>
