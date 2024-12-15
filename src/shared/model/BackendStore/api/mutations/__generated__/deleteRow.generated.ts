// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { BranchMstFragmentDoc } from '../../fragments/__generated__/branch.generated'
import { TableMstFragmentDoc } from '../../fragments/__generated__/table.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type DeleteRowMstMutationVariables = Types.Exact<{
  data: Types.RemoveRowInput
}>

export type DeleteRowMstMutation = {
  __typename?: 'Mutation'
  removeRow: {
    __typename?: 'RemoveRowResultModel'
    previousVersionTableId?: string | null
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
    table?: {
      __typename?: 'TableModel'
      id: string
      versionId: string
      createdAt: string
      readonly: boolean
      count: number
      schema: { [key: string]: any } | string | number | boolean | null
    } | null
  }
}

export const DeleteRowMstDocument = gql`
  mutation DeleteRowMst($data: RemoveRowInput!) {
    removeRow(data: $data) {
      branch {
        ...BranchMst
      }
      table {
        ...TableMst
      }
      previousVersionTableId
    }
  }
  ${BranchMstFragmentDoc}
  ${TableMstFragmentDoc}
`
export type DeleteRowMstMutationFn = Apollo.MutationFunction<DeleteRowMstMutation, DeleteRowMstMutationVariables>

/**
 * __useDeleteRowMstMutation__
 *
 * To run a mutation, you first call `useDeleteRowMstMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRowMstMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRowMstMutation, { data, loading, error }] = useDeleteRowMstMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDeleteRowMstMutation(
  baseOptions?: Apollo.MutationHookOptions<DeleteRowMstMutation, DeleteRowMstMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<DeleteRowMstMutation, DeleteRowMstMutationVariables>(DeleteRowMstDocument, options)
}
export type DeleteRowMstMutationHookResult = ReturnType<typeof useDeleteRowMstMutation>
export type DeleteRowMstMutationResult = Apollo.MutationResult<DeleteRowMstMutation>
export type DeleteRowMstMutationOptions = Apollo.BaseMutationOptions<
  DeleteRowMstMutation,
  DeleteRowMstMutationVariables
>
