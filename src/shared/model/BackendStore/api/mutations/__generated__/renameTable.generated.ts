// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { TableMstFragmentDoc } from '../../fragments/__generated__/table.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type RenameTableMstMutationVariables = Types.Exact<{
  data: Types.RenameTableInput
}>

export type RenameTableMstMutation = {
  __typename?: 'Mutation'
  renameTable: {
    __typename?: 'RenameTableResultModel'
    previousVersionTableId: string
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

export const RenameTableMstDocument = gql`
  mutation RenameTableMst($data: RenameTableInput!) {
    renameTable(data: $data) {
      table {
        ...TableMst
      }
      previousVersionTableId
    }
  }
  ${TableMstFragmentDoc}
`
export type RenameTableMstMutationFn = Apollo.MutationFunction<RenameTableMstMutation, RenameTableMstMutationVariables>

/**
 * __useRenameTableMstMutation__
 *
 * To run a mutation, you first call `useRenameTableMstMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameTableMstMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameTableMstMutation, { data, loading, error }] = useRenameTableMstMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRenameTableMstMutation(
  baseOptions?: Apollo.MutationHookOptions<RenameTableMstMutation, RenameTableMstMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<RenameTableMstMutation, RenameTableMstMutationVariables>(RenameTableMstDocument, options)
}
export type RenameTableMstMutationHookResult = ReturnType<typeof useRenameTableMstMutation>
export type RenameTableMstMutationResult = Apollo.MutationResult<RenameTableMstMutation>
export type RenameTableMstMutationOptions = Apollo.BaseMutationOptions<
  RenameTableMstMutation,
  RenameTableMstMutationVariables
>
