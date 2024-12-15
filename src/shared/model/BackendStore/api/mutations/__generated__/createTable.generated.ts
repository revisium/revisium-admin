// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { BranchMstFragmentDoc } from '../../fragments/__generated__/branch.generated'
import { TableMstFragmentDoc } from '../../fragments/__generated__/table.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type CreateTableMstMutationVariables = Types.Exact<{
  data: Types.CreateTableInput
}>

export type CreateTableMstMutation = {
  __typename?: 'Mutation'
  createTable: {
    __typename?: 'CreateTableResultModel'
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
    table: {
      __typename?: 'TableModel'
      id: string
      versionId: string
      createdAt: string
      readonly: boolean
      count: number
      schema: { [key: string]: any } | string | number | boolean | null
    }
  }
}

export const CreateTableMstDocument = gql`
  mutation CreateTableMst($data: CreateTableInput!) {
    createTable(data: $data) {
      branch {
        ...BranchMst
      }
      table {
        ...TableMst
      }
    }
  }
  ${BranchMstFragmentDoc}
  ${TableMstFragmentDoc}
`
export type CreateTableMstMutationFn = Apollo.MutationFunction<CreateTableMstMutation, CreateTableMstMutationVariables>

/**
 * __useCreateTableMstMutation__
 *
 * To run a mutation, you first call `useCreateTableMstMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTableMstMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTableMstMutation, { data, loading, error }] = useCreateTableMstMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateTableMstMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateTableMstMutation, CreateTableMstMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateTableMstMutation, CreateTableMstMutationVariables>(CreateTableMstDocument, options)
}
export type CreateTableMstMutationHookResult = ReturnType<typeof useCreateTableMstMutation>
export type CreateTableMstMutationResult = Apollo.MutationResult<CreateTableMstMutation>
export type CreateTableMstMutationOptions = Apollo.BaseMutationOptions<
  CreateTableMstMutation,
  CreateTableMstMutationVariables
>
