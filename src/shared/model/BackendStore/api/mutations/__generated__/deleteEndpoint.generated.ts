// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type DeleteEndpointMstMutationVariables = Types.Exact<{
  data: Types.DeleteEndpointInput
}>

export type DeleteEndpointMstMutation = { __typename?: 'Mutation'; deleteEndpoint: boolean }

export const DeleteEndpointMstDocument = gql`
  mutation DeleteEndpointMst($data: DeleteEndpointInput!) {
    deleteEndpoint(data: $data)
  }
`
export type DeleteEndpointMstMutationFn = Apollo.MutationFunction<
  DeleteEndpointMstMutation,
  DeleteEndpointMstMutationVariables
>

/**
 * __useDeleteEndpointMstMutation__
 *
 * To run a mutation, you first call `useDeleteEndpointMstMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEndpointMstMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEndpointMstMutation, { data, loading, error }] = useDeleteEndpointMstMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDeleteEndpointMstMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteEndpointMstMutation, DeleteEndpointMstMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteEndpointMstMutation, DeleteEndpointMstMutationVariables>(
    DeleteEndpointMstDocument,
    options,
  )
}
export type DeleteEndpointMstMutationHookResult = ReturnType<typeof useDeleteEndpointMstMutation>
export type DeleteEndpointMstMutationResult = Apollo.MutationResult<DeleteEndpointMstMutation>
export type DeleteEndpointMstMutationOptions = Apollo.BaseMutationOptions<
  DeleteEndpointMstMutation,
  DeleteEndpointMstMutationVariables
>
