// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type RowSuggestionMstQueryVariables = Types.Exact<{
  data: Types.GetRowSuggestionInput
}>

export type RowSuggestionMstQuery = {
  __typename?: 'Query'
  rowSuggestion: {
    __typename?: 'RowSuggestionResultModel'
    data: { [key: string]: any } | string | number | boolean | null
    patches: Array<{ [key: string]: any } | string | number | boolean | null>
  }
}

export const RowSuggestionMstDocument = gql`
  query RowSuggestionMst($data: GetRowSuggestionInput!) {
    rowSuggestion(data: $data) {
      data
      patches
    }
  }
`

/**
 * __useRowSuggestionMstQuery__
 *
 * To run a query within a React component, call `useRowSuggestionMstQuery` and pass it any options that fit your needs.
 * When your component renders, `useRowSuggestionMstQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRowSuggestionMstQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRowSuggestionMstQuery(
  baseOptions: Apollo.QueryHookOptions<RowSuggestionMstQuery, RowSuggestionMstQueryVariables> &
    ({ variables: RowSuggestionMstQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<RowSuggestionMstQuery, RowSuggestionMstQueryVariables>(RowSuggestionMstDocument, options)
}
export function useRowSuggestionMstLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RowSuggestionMstQuery, RowSuggestionMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<RowSuggestionMstQuery, RowSuggestionMstQueryVariables>(RowSuggestionMstDocument, options)
}
export function useRowSuggestionMstSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<RowSuggestionMstQuery, RowSuggestionMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<RowSuggestionMstQuery, RowSuggestionMstQueryVariables>(
    RowSuggestionMstDocument,
    options,
  )
}
export type RowSuggestionMstQueryHookResult = ReturnType<typeof useRowSuggestionMstQuery>
export type RowSuggestionMstLazyQueryHookResult = ReturnType<typeof useRowSuggestionMstLazyQuery>
export type RowSuggestionMstSuspenseQueryHookResult = ReturnType<typeof useRowSuggestionMstSuspenseQuery>
export type RowSuggestionMstQueryResult = Apollo.QueryResult<RowSuggestionMstQuery, RowSuggestionMstQueryVariables>
