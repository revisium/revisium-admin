// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { TableMstFragmentDoc } from '../../fragments/__generated__/table.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type TableMstQueryVariables = Types.Exact<{
  data: Types.GetTableInput
}>

export type TableMstQuery = {
  __typename?: 'Query'
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

export const TableMstDocument = gql`
  query TableMst($data: GetTableInput!) {
    table(data: $data) {
      ...TableMst
    }
  }
  ${TableMstFragmentDoc}
`

/**
 * __useTableMstQuery__
 *
 * To run a query within a React component, call `useTableMstQuery` and pass it any options that fit your needs.
 * When your component renders, `useTableMstQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTableMstQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useTableMstQuery(
  baseOptions: Apollo.QueryHookOptions<TableMstQuery, TableMstQueryVariables> &
    ({ variables: TableMstQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TableMstQuery, TableMstQueryVariables>(TableMstDocument, options)
}
export function useTableMstLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TableMstQuery, TableMstQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TableMstQuery, TableMstQueryVariables>(TableMstDocument, options)
}
export function useTableMstSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<TableMstQuery, TableMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<TableMstQuery, TableMstQueryVariables>(TableMstDocument, options)
}
export type TableMstQueryHookResult = ReturnType<typeof useTableMstQuery>
export type TableMstLazyQueryHookResult = ReturnType<typeof useTableMstLazyQuery>
export type TableMstSuspenseQueryHookResult = ReturnType<typeof useTableMstSuspenseQuery>
export type TableMstQueryResult = Apollo.QueryResult<TableMstQuery, TableMstQueryVariables>
