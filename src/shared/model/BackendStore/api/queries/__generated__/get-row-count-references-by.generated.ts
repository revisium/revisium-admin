// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type GetRowCountReferencesToQueryVariables = Types.Exact<{
  data: Types.GetRowCountForeignKeysByInput
}>

export type GetRowCountReferencesToQuery = { __typename?: 'Query'; getRowCountForeignKeysTo: number }

export const GetRowCountReferencesToDocument = gql`
  query GetRowCountReferencesTo($data: GetRowCountForeignKeysByInput!) {
    getRowCountForeignKeysTo(data: $data)
  }
`

/**
 * __useGetRowCountReferencesToQuery__
 *
 * To run a query within a React component, call `useGetRowCountReferencesToQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRowCountReferencesToQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRowCountReferencesToQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useGetRowCountReferencesToQuery(
  baseOptions: Apollo.QueryHookOptions<GetRowCountReferencesToQuery, GetRowCountReferencesToQueryVariables> &
    ({ variables: GetRowCountReferencesToQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetRowCountReferencesToQuery, GetRowCountReferencesToQueryVariables>(
    GetRowCountReferencesToDocument,
    options,
  )
}
export function useGetRowCountReferencesToLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GetRowCountReferencesToQuery, GetRowCountReferencesToQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetRowCountReferencesToQuery, GetRowCountReferencesToQueryVariables>(
    GetRowCountReferencesToDocument,
    options,
  )
}
export function useGetRowCountReferencesToSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<GetRowCountReferencesToQuery, GetRowCountReferencesToQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<GetRowCountReferencesToQuery, GetRowCountReferencesToQueryVariables>(
    GetRowCountReferencesToDocument,
    options,
  )
}
export type GetRowCountReferencesToQueryHookResult = ReturnType<typeof useGetRowCountReferencesToQuery>
export type GetRowCountReferencesToLazyQueryHookResult = ReturnType<typeof useGetRowCountReferencesToLazyQuery>
export type GetRowCountReferencesToSuspenseQueryHookResult = ReturnType<typeof useGetRowCountReferencesToSuspenseQuery>
export type GetRowCountReferencesToQueryResult = Apollo.QueryResult<
  GetRowCountReferencesToQuery,
  GetRowCountReferencesToQueryVariables
>
