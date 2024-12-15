// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { PageInfoMstFragmentDoc } from '../../fragments/__generated__/page-info.generated'
import { RowMstFragmentDoc } from '../../fragments/__generated__/row.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type RowsMstQueryVariables = Types.Exact<{
  data: Types.GetRowsInput
}>

export type RowsMstQuery = {
  __typename?: 'Query'
  rows: {
    __typename?: 'RowsConnection'
    totalCount: number
    pageInfo: {
      __typename?: 'PageInfo'
      startCursor?: string | null
      endCursor?: string | null
      hasPreviousPage: boolean
      hasNextPage: boolean
    }
    edges: Array<{
      __typename?: 'RowModelEdge'
      cursor: string
      node: {
        __typename?: 'RowModel'
        id: string
        versionId: string
        createdAt: string
        readonly: boolean
        data: { [key: string]: any } | string | number | boolean | null
      }
    }>
  }
}

export const RowsMstDocument = gql`
  query RowsMst($data: GetRowsInput!) {
    rows(data: $data) {
      totalCount
      pageInfo {
        ...PageInfoMst
      }
      edges {
        cursor
        node {
          ...RowMst
        }
      }
    }
  }
  ${PageInfoMstFragmentDoc}
  ${RowMstFragmentDoc}
`

/**
 * __useRowsMstQuery__
 *
 * To run a query within a React component, call `useRowsMstQuery` and pass it any options that fit your needs.
 * When your component renders, `useRowsMstQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRowsMstQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRowsMstQuery(
  baseOptions: Apollo.QueryHookOptions<RowsMstQuery, RowsMstQueryVariables> &
    ({ variables: RowsMstQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<RowsMstQuery, RowsMstQueryVariables>(RowsMstDocument, options)
}
export function useRowsMstLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RowsMstQuery, RowsMstQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<RowsMstQuery, RowsMstQueryVariables>(RowsMstDocument, options)
}
export function useRowsMstSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<RowsMstQuery, RowsMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<RowsMstQuery, RowsMstQueryVariables>(RowsMstDocument, options)
}
export type RowsMstQueryHookResult = ReturnType<typeof useRowsMstQuery>
export type RowsMstLazyQueryHookResult = ReturnType<typeof useRowsMstLazyQuery>
export type RowsMstSuspenseQueryHookResult = ReturnType<typeof useRowsMstSuspenseQuery>
export type RowsMstQueryResult = Apollo.QueryResult<RowsMstQuery, RowsMstQueryVariables>
