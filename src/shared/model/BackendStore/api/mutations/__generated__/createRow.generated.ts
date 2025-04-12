// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { TableMstFragmentDoc } from '../../fragments/__generated__/table.generated'
import { RowMstFragmentDoc } from '../../fragments/__generated__/row.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type CreateRowMstMutationVariables = Types.Exact<{
  data: Types.CreateRowInput
}>

export type CreateRowMstMutation = {
  __typename?: 'Mutation'
  createRow: {
    __typename?: 'CreateRowResultModel'
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

export const CreateRowMstDocument = gql`
  mutation CreateRowMst($data: CreateRowInput!) {
    createRow(data: $data) {
      table {
        ...TableMst
      }
      previousVersionTableId
      row {
        ...RowMst
      }
    }
  }
  ${TableMstFragmentDoc}
  ${RowMstFragmentDoc}
`
export type CreateRowMstMutationFn = Apollo.MutationFunction<CreateRowMstMutation, CreateRowMstMutationVariables>

/**
 * __useCreateRowMstMutation__
 *
 * To run a mutation, you first call `useCreateRowMstMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRowMstMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRowMstMutation, { data, loading, error }] = useCreateRowMstMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateRowMstMutation(
  baseOptions?: Apollo.MutationHookOptions<CreateRowMstMutation, CreateRowMstMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateRowMstMutation, CreateRowMstMutationVariables>(CreateRowMstDocument, options)
}
export type CreateRowMstMutationHookResult = ReturnType<typeof useCreateRowMstMutation>
export type CreateRowMstMutationResult = Apollo.MutationResult<CreateRowMstMutation>
export type CreateRowMstMutationOptions = Apollo.BaseMutationOptions<
  CreateRowMstMutation,
  CreateRowMstMutationVariables
>
