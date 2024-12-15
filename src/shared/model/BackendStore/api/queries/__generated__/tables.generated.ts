// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { PageInfoMstFragmentDoc } from '../../fragments/__generated__/page-info.generated'
import { TableMstFragmentDoc } from '../../fragments/__generated__/table.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type TablesMstQueryVariables = Types.Exact<{
  data: Types.GetTablesInput
}>

export type TablesMstQuery = {
  __typename?: 'Query'
  tables: {
    __typename?: 'TablesConnection'
    totalCount: number
    pageInfo: {
      __typename?: 'PageInfo'
      startCursor?: string | null
      endCursor?: string | null
      hasPreviousPage: boolean
      hasNextPage: boolean
    }
    edges: Array<{
      __typename?: 'TableModelEdge'
      cursor: string
      node: {
        __typename?: 'TableModel'
        id: string
        versionId: string
        createdAt: string
        readonly: boolean
        count: number
        schema: { [key: string]: any } | string | number | boolean | null
      }
    }>
  }
}

export const TablesMstDocument = gql`
  query TablesMst($data: GetTablesInput!) {
    tables(data: $data) {
      totalCount
      pageInfo {
        ...PageInfoMst
      }
      edges {
        cursor
        node {
          ...TableMst
        }
      }
    }
  }
  ${PageInfoMstFragmentDoc}
  ${TableMstFragmentDoc}
`

/**
 * __useTablesMstQuery__
 *
 * To run a query within a React component, call `useTablesMstQuery` and pass it any options that fit your needs.
 * When your component renders, `useTablesMstQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTablesMstQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useTablesMstQuery(
  baseOptions: Apollo.QueryHookOptions<TablesMstQuery, TablesMstQueryVariables> &
    ({ variables: TablesMstQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TablesMstQuery, TablesMstQueryVariables>(TablesMstDocument, options)
}
export function useTablesMstLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TablesMstQuery, TablesMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TablesMstQuery, TablesMstQueryVariables>(TablesMstDocument, options)
}
export function useTablesMstSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<TablesMstQuery, TablesMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<TablesMstQuery, TablesMstQueryVariables>(TablesMstDocument, options)
}
export type TablesMstQueryHookResult = ReturnType<typeof useTablesMstQuery>
export type TablesMstLazyQueryHookResult = ReturnType<typeof useTablesMstLazyQuery>
export type TablesMstSuspenseQueryHookResult = ReturnType<typeof useTablesMstSuspenseQuery>
export type TablesMstQueryResult = Apollo.QueryResult<TablesMstQuery, TablesMstQueryVariables>
