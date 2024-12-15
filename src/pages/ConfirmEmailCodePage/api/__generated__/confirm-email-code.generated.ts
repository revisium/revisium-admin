// @ts-ignore
import * as Types from '../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type ConfirmEmailCodeMutationVariables = Types.Exact<{
  data: Types.ConfirmEmailCodeInput
}>

export type ConfirmEmailCodeMutation = {
  __typename?: 'Mutation'
  confirmEmailCode: { __typename?: 'LoginModel'; accessToken: string }
}

export const ConfirmEmailCodeDocument = gql`
  mutation confirmEmailCode($data: ConfirmEmailCodeInput!) {
    confirmEmailCode(data: $data) {
      accessToken
    }
  }
`
export type ConfirmEmailCodeMutationFn = Apollo.MutationFunction<
  ConfirmEmailCodeMutation,
  ConfirmEmailCodeMutationVariables
>

/**
 * __useConfirmEmailCodeMutation__
 *
 * To run a mutation, you first call `useConfirmEmailCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmEmailCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmEmailCodeMutation, { data, loading, error }] = useConfirmEmailCodeMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useConfirmEmailCodeMutation(
  baseOptions?: Apollo.MutationHookOptions<ConfirmEmailCodeMutation, ConfirmEmailCodeMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ConfirmEmailCodeMutation, ConfirmEmailCodeMutationVariables>(
    ConfirmEmailCodeDocument,
    options,
  )
}
export type ConfirmEmailCodeMutationHookResult = ReturnType<typeof useConfirmEmailCodeMutation>
export type ConfirmEmailCodeMutationResult = Apollo.MutationResult<ConfirmEmailCodeMutation>
export type ConfirmEmailCodeMutationOptions = Apollo.BaseMutationOptions<
  ConfirmEmailCodeMutation,
  ConfirmEmailCodeMutationVariables
>
