// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { BranchMstFragmentDoc } from '../../fragments/__generated__/branch.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type CreateBranchByRevisionIdMstMutationVariables = Types.Exact<{
  data: Types.CreateBranchByRevisionIdInput
}>

export type CreateBranchByRevisionIdMstMutation = {
  __typename?: 'Mutation'
  createBranchByRevisionId: {
    __typename?: 'BranchModel'
    id: string
    createdAt: string
    name: string
    touched: boolean
    projectId: string
    parent?: {
      __typename?: 'ParentBranchModel'
      branch: { __typename?: 'BranchModel'; id: string; name: string }
      revision: { __typename?: 'RevisionModel'; id: string }
    } | null
    start: {
      __typename?: 'RevisionModel'
      id: string
      createdAt: string
      comment: string
      child?: { __typename?: 'RevisionModel'; id: string } | null
      childBranches: Array<{
        __typename?: 'ChildBranchModel'
        branch: { __typename?: 'BranchModel'; id: string; name: string }
        revision: { __typename?: 'RevisionModel'; id: string }
      }>
      endpoints: Array<{ __typename?: 'EndpointModel'; id: string; type: Types.EndpointType; createdAt: string }>
    }
    head: {
      __typename?: 'RevisionModel'
      id: string
      createdAt: string
      comment: string
      parent?: { __typename?: 'RevisionModel'; id: string } | null
      child?: { __typename?: 'RevisionModel'; id: string } | null
      childBranches: Array<{
        __typename?: 'ChildBranchModel'
        branch: { __typename?: 'BranchModel'; id: string; name: string }
        revision: { __typename?: 'RevisionModel'; id: string }
      }>
      endpoints: Array<{ __typename?: 'EndpointModel'; id: string; type: Types.EndpointType; createdAt: string }>
    }
    draft: {
      __typename?: 'RevisionModel'
      id: string
      createdAt: string
      comment: string
      parent?: { __typename?: 'RevisionModel'; id: string } | null
      endpoints: Array<{ __typename?: 'EndpointModel'; id: string; type: Types.EndpointType; createdAt: string }>
    }
  }
}

export const CreateBranchByRevisionIdMstDocument = gql`
  mutation CreateBranchByRevisionIdMst($data: CreateBranchByRevisionIdInput!) {
    createBranchByRevisionId(data: $data) {
      ...BranchMst
    }
  }
  ${BranchMstFragmentDoc}
`
export type CreateBranchByRevisionIdMstMutationFn = Apollo.MutationFunction<
  CreateBranchByRevisionIdMstMutation,
  CreateBranchByRevisionIdMstMutationVariables
>

/**
 * __useCreateBranchByRevisionIdMstMutation__
 *
 * To run a mutation, you first call `useCreateBranchByRevisionIdMstMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBranchByRevisionIdMstMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBranchByRevisionIdMstMutation, { data, loading, error }] = useCreateBranchByRevisionIdMstMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateBranchByRevisionIdMstMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateBranchByRevisionIdMstMutation,
    CreateBranchByRevisionIdMstMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateBranchByRevisionIdMstMutation, CreateBranchByRevisionIdMstMutationVariables>(
    CreateBranchByRevisionIdMstDocument,
    options,
  )
}
export type CreateBranchByRevisionIdMstMutationHookResult = ReturnType<typeof useCreateBranchByRevisionIdMstMutation>
export type CreateBranchByRevisionIdMstMutationResult = Apollo.MutationResult<CreateBranchByRevisionIdMstMutation>
export type CreateBranchByRevisionIdMstMutationOptions = Apollo.BaseMutationOptions<
  CreateBranchByRevisionIdMstMutation,
  CreateBranchByRevisionIdMstMutationVariables
>
