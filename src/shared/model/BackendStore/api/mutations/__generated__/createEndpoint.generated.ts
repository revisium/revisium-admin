// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { EndpointMstFragmentDoc } from '../../fragments/__generated__/endpoint.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type CreateEndpointMstMutationVariables = Types.Exact<{
  data: Types.CreateEndpointInput
}>

export type CreateEndpointMstMutation = {
  __typename?: 'Mutation'
  createEndpoint: { __typename?: 'EndpointModel'; id: string; type: Types.EndpointType; createdAt: string }
}

export const CreateEndpointMstDocument = gql`
  mutation CreateEndpointMst($data: CreateEndpointInput!) {
    createEndpoint(data: $data) {
      ...EndpointMst
    }
  }
  ${EndpointMstFragmentDoc}
`
export type CreateEndpointMstMutationFn = Apollo.MutationFunction<
  CreateEndpointMstMutation,
  CreateEndpointMstMutationVariables
>

/**
 * __useCreateEndpointMstMutation__
 *
 * To run a mutation, you first call `useCreateEndpointMstMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEndpointMstMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEndpointMstMutation, { data, loading, error }] = useCreateEndpointMstMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateEndpointMstMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateEndpointMstMutation, CreateEndpointMstMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateEndpointMstMutation, CreateEndpointMstMutationVariables>(
    CreateEndpointMstDocument,
    options,
  )
}
export type CreateEndpointMstMutationHookResult = ReturnType<typeof useCreateEndpointMstMutation>
export type CreateEndpointMstMutationResult = Apollo.MutationResult<CreateEndpointMstMutation>
export type CreateEndpointMstMutationOptions = Apollo.BaseMutationOptions<
  CreateEndpointMstMutation,
  CreateEndpointMstMutationVariables
>
