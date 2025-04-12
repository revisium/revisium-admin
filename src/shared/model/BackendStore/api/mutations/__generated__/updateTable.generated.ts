// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { TableMstFragmentDoc } from '../../fragments/__generated__/table.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type UpdateTableMstMutationVariables = Types.Exact<{
  data: Types.UpdateTableInput
}>

export type UpdateTableMstMutation = {
  __typename?: 'Mutation'
  updateTable: {
    __typename?: 'UpdateTableResultModel'
    previousVersionTableId: string
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
  }
}

export const UpdateTableMstDocument = gql`
  mutation UpdateTableMst($data: UpdateTableInput!) {
    updateTable(data: $data) {
      table {
        ...TableMst
      }
      previousVersionTableId
    }
  }
  ${TableMstFragmentDoc}
`
export type UpdateTableMstMutationFn = Apollo.MutationFunction<UpdateTableMstMutation, UpdateTableMstMutationVariables>

/**
 * __useUpdateTableMstMutation__
 *
 * To run a mutation, you first call `useUpdateTableMstMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTableMstMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTableMstMutation, { data, loading, error }] = useUpdateTableMstMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateTableMstMutation(
  baseOptions?: Apollo.MutationHookOptions<UpdateTableMstMutation, UpdateTableMstMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<UpdateTableMstMutation, UpdateTableMstMutationVariables>(UpdateTableMstDocument, options)
}
export type UpdateTableMstMutationHookResult = ReturnType<typeof useUpdateTableMstMutation>
export type UpdateTableMstMutationResult = Apollo.MutationResult<UpdateTableMstMutation>
export type UpdateTableMstMutationOptions = Apollo.BaseMutationOptions<
  UpdateTableMstMutation,
  UpdateTableMstMutationVariables
>
