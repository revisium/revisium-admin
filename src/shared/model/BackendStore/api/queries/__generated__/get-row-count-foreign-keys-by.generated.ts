// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type GetRowCountForeignKeysToQueryVariables = Types.Exact<{
  data: Types.GetRowCountForeignKeysByInput
}>

export type GetRowCountForeignKeysToQuery = { __typename?: 'Query'; getRowCountForeignKeysTo: number }

export const GetRowCountForeignKeysToDocument = gql`
  query GetRowCountForeignKeysTo($data: GetRowCountForeignKeysByInput!) {
    getRowCountForeignKeysTo(data: $data)
  }
`

/**
 * __useGetRowCountForeignKeysToQuery__
 *
 * To run a query within a React component, call `useGetRowCountForeignKeysToQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRowCountForeignKeysToQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRowCountForeignKeysToQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetRowCountForeignKeysToQuery(
  baseOptions: Apollo.QueryHookOptions<GetRowCountForeignKeysToQuery, GetRowCountForeignKeysToQueryVariables> &
    ({ variables: GetRowCountForeignKeysToQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetRowCountForeignKeysToQuery, GetRowCountForeignKeysToQueryVariables>(
    GetRowCountForeignKeysToDocument,
    options,
  )
}
export function useGetRowCountForeignKeysToLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetRowCountForeignKeysToQuery, GetRowCountForeignKeysToQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetRowCountForeignKeysToQuery, GetRowCountForeignKeysToQueryVariables>(
    GetRowCountForeignKeysToDocument,
    options,
  )
}
export function useGetRowCountForeignKeysToSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetRowCountForeignKeysToQuery, GetRowCountForeignKeysToQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<GetRowCountForeignKeysToQuery, GetRowCountForeignKeysToQueryVariables>(
    GetRowCountForeignKeysToDocument,
    options,
  )
}
export type GetRowCountForeignKeysToQueryHookResult = ReturnType<typeof useGetRowCountForeignKeysToQuery>
export type GetRowCountForeignKeysToLazyQueryHookResult = ReturnType<typeof useGetRowCountForeignKeysToLazyQuery>
export type GetRowCountForeignKeysToSuspenseQueryHookResult = ReturnType<
  typeof useGetRowCountForeignKeysToSuspenseQuery
>
export type GetRowCountForeignKeysToQueryResult = Apollo.QueryResult<
  GetRowCountForeignKeysToQuery,
  GetRowCountForeignKeysToQueryVariables
>
