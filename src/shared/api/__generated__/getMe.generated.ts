// @ts-ignore
import * as Types from '../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type UserFragment = {
  __typename?: 'UserModel'
  id: string
  username?: string | null
  email?: string | null
  organizationId?: string | null
}

export type GetMeQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetMeQuery = {
  __typename?: 'Query'
  me: {
    __typename?: 'UserModel'
    id: string
    username?: string | null
    email?: string | null
    organizationId?: string | null
  }
}

export const UserFragmentDoc = gql`
  fragment User on UserModel {
    id
    username
    email
    organizationId
  }
`
export const GetMeDocument = gql`
  query getMe {
    me {
      ...User
    }
  }
  ${UserFragmentDoc}
`

/**
 * __useGetMeQuery__
 *
 * To run a query within a React component, call `useGetMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMeQuery(baseOptions?: Apollo.QueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options)
}
export function useGetMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options)
}
export function useGetMeSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetMeQuery, GetMeQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<GetMeQuery, GetMeQueryVariables>(GetMeDocument, options)
}
export type GetMeQueryHookResult = ReturnType<typeof useGetMeQuery>
export type GetMeLazyQueryHookResult = ReturnType<typeof useGetMeLazyQuery>
export type GetMeSuspenseQueryHookResult = ReturnType<typeof useGetMeSuspenseQuery>
export type GetMeQueryResult = Apollo.QueryResult<GetMeQuery, GetMeQueryVariables>
