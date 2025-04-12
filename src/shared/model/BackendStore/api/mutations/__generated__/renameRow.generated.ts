// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { TableMstFragmentDoc } from '../../fragments/__generated__/table.generated'
import { RowMstFragmentDoc } from '../../fragments/__generated__/row.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type RenameRowMstMutationVariables = Types.Exact<{
  data: Types.RenameRowInput
}>

export type RenameRowMstMutation = {
  __typename?: 'Mutation'
  renameRow: {
    __typename?: 'RenameRowResultModel'
    previousVersionTableId: string
    previousVersionRowId: string
    table: {
      __typename?: 'TableModel'
      createdId: string
      id: string
      versionId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      count: number
      schema: { [key: string]: any } | string | number | boolean | null
    }
    row: {
      __typename?: 'RowModel'
      createdId: string
      id: string
      versionId: string
      createdAt: string
      updatedAt: string
      readonly: boolean
      data: { [key: string]: any } | string | number | boolean | null
    }
  }
}

export const RenameRowMstDocument = gql`
  mutation RenameRowMst($data: RenameRowInput!) {
    renameRow(data: $data) {
      table {
        ...TableMst
      }
      previousVersionTableId
      row {
        ...RowMst
      }
      previousVersionRowId
    }
  }
  ${TableMstFragmentDoc}
  ${RowMstFragmentDoc}
`
export type RenameRowMstMutationFn = Apollo.MutationFunction<RenameRowMstMutation, RenameRowMstMutationVariables>

/**
 * __useRenameRowMstMutation__
 *
 * To run a mutation, you first call `useRenameRowMstMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameRowMstMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameRowMstMutation, { data, loading, error }] = useRenameRowMstMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRenameRowMstMutation(
  baseOptions?: Apollo.MutationHookOptions<RenameRowMstMutation, RenameRowMstMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RenameRowMstMutation, RenameRowMstMutationVariables>(RenameRowMstDocument, options)
}
export type RenameRowMstMutationHookResult = ReturnType<typeof useRenameRowMstMutation>
export type RenameRowMstMutationResult = Apollo.MutationResult<RenameRowMstMutation>
export type RenameRowMstMutationOptions = Apollo.BaseMutationOptions<
  RenameRowMstMutation,
  RenameRowMstMutationVariables
>
