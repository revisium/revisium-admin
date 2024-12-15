// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { RowMstFragmentDoc } from '../../fragments/__generated__/row.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type RowMstQueryVariables = Types.Exact<{
  data: Types.GetRowInput
}>

export type RowMstQuery = {
  __typename?: 'Query'
  row?: {
    __typename?: 'RowModel'
    id: string
    versionId: string
    createdAt: string
    readonly: boolean
    data: { [key: string]: any } | string | number | boolean | null
  } | null
}

export const RowMstDocument = gql`
  query RowMst($data: GetRowInput!) {
    row(data: $data) {
      ...RowMst
    }
  }
  ${RowMstFragmentDoc}
`

/**
 * __useRowMstQuery__
 *
 * To run a query within a React component, call `useRowMstQuery` and pass it any options that fit your needs.
 * When your component renders, `useRowMstQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRowMstQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRowMstQuery(
  baseOptions: Apollo.QueryHookOptions<RowMstQuery, RowMstQueryVariables> &
    ({ variables: RowMstQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<RowMstQuery, RowMstQueryVariables>(RowMstDocument, options)
}
export function useRowMstLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RowMstQuery, RowMstQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<RowMstQuery, RowMstQueryVariables>(RowMstDocument, options)
}
export function useRowMstSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<RowMstQuery, RowMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<RowMstQuery, RowMstQueryVariables>(RowMstDocument, options)
}
export type RowMstQueryHookResult = ReturnType<typeof useRowMstQuery>
export type RowMstLazyQueryHookResult = ReturnType<typeof useRowMstLazyQuery>
export type RowMstSuspenseQueryHookResult = ReturnType<typeof useRowMstSuspenseQuery>
export type RowMstQueryResult = Apollo.QueryResult<RowMstQuery, RowMstQueryVariables>
