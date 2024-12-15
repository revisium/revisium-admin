// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { BranchMstFragmentDoc } from '../../fragments/__generated__/branch.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type DeleteTableMstMutationVariables = Types.Exact<{
  data: Types.RemoveTableInput
}>

export type DeleteTableMstMutation = {
  __typename?: 'Mutation'
  removeTable: {
    __typename?: 'RemoveTableResultModel'
    branch: {
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
}

export const DeleteTableMstDocument = gql`
  mutation DeleteTableMst($data: RemoveTableInput!) {
    removeTable(data: $data) {
      branch {
        ...BranchMst
      }
    }
  }
  ${BranchMstFragmentDoc}
`
export type DeleteTableMstMutationFn = Apollo.MutationFunction<DeleteTableMstMutation, DeleteTableMstMutationVariables>

/**
 * __useDeleteTableMstMutation__
 *
 * To run a mutation, you first call `useDeleteTableMstMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTableMstMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTableMstMutation, { data, loading, error }] = useDeleteTableMstMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDeleteTableMstMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteTableMstMutation, DeleteTableMstMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteTableMstMutation, DeleteTableMstMutationVariables>(DeleteTableMstDocument, options)
}
export type DeleteTableMstMutationHookResult = ReturnType<typeof useDeleteTableMstMutation>
export type DeleteTableMstMutationResult = Apollo.MutationResult<DeleteTableMstMutation>
export type DeleteTableMstMutationOptions = Apollo.BaseMutationOptions<
  DeleteTableMstMutation,
  DeleteTableMstMutationVariables
>
