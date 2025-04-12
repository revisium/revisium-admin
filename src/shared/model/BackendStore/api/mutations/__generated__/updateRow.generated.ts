// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { TableMstFragmentDoc } from '../../fragments/__generated__/table.generated'
import { RowMstFragmentDoc } from '../../fragments/__generated__/row.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type UpdateRowMstMutationVariables = Types.Exact<{
  data: Types.UpdateRowInput
}>

export type UpdateRowMstMutation = {
  __typename?: 'Mutation'
  updateRow: {
    __typename?: 'UpdateRowResultModel'
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

export const UpdateRowMstDocument = gql`
  mutation UpdateRowMst($data: UpdateRowInput!) {
    updateRow(data: $data) {
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
export type UpdateRowMstMutationFn = Apollo.MutationFunction<UpdateRowMstMutation, UpdateRowMstMutationVariables>

/**
 * __useUpdateRowMstMutation__
 *
 * To run a mutation, you first call `useUpdateRowMstMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRowMstMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRowMstMutation, { data, loading, error }] = useUpdateRowMstMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateRowMstMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateRowMstMutation, UpdateRowMstMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateRowMstMutation, UpdateRowMstMutationVariables>(UpdateRowMstDocument, options)
}
export type UpdateRowMstMutationHookResult = ReturnType<typeof useUpdateRowMstMutation>
export type UpdateRowMstMutationResult = Apollo.MutationResult<UpdateRowMstMutation>
export type UpdateRowMstMutationOptions = Apollo.BaseMutationOptions<
  UpdateRowMstMutation,
  UpdateRowMstMutationVariables
>
