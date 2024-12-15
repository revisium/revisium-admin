// @ts-ignore
import * as Types from '../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type ConfigurationQueryVariables = Types.Exact<{ [key: string]: never }>

export type ConfigurationQuery = {
  __typename?: 'Query'
  configuration: {
    __typename?: 'ConfigurationModel'
    availableEmailSignUp: boolean
    google: { __typename?: 'GoogleOauth'; available: boolean; clientId?: string | null }
    github: { __typename?: 'GithubOauth'; available: boolean; clientId?: string | null }
  }
}

export const ConfigurationDocument = gql`
  query configuration {
    configuration {
      availableEmailSignUp
      google {
        available
        clientId
      }
      github {
        available
        clientId
      }
    }
  }
`

/**
 * __useConfigurationQuery__
 *
 * To run a query within a React component, call `useConfigurationQuery` and pass it any options that fit your needs.
 * When your component renders, `useConfigurationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConfigurationQuery({
 *   variables: {
 *   },
 * });
 */
export function useConfigurationQuery(
  baseOptions?: Apollo.QueryHookOptions<ConfigurationQuery, ConfigurationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<ConfigurationQuery, ConfigurationQueryVariables>(ConfigurationDocument, options)
}
export function useConfigurationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<ConfigurationQuery, ConfigurationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<ConfigurationQuery, ConfigurationQueryVariables>(ConfigurationDocument, options)
}
export function useConfigurationSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<ConfigurationQuery, ConfigurationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<ConfigurationQuery, ConfigurationQueryVariables>(ConfigurationDocument, options)
}
export type ConfigurationQueryHookResult = ReturnType<typeof useConfigurationQuery>
export type ConfigurationLazyQueryHookResult = ReturnType<typeof useConfigurationLazyQuery>
export type ConfigurationSuspenseQueryHookResult = ReturnType<typeof useConfigurationSuspenseQuery>
export type ConfigurationQueryResult = Apollo.QueryResult<ConfigurationQuery, ConfigurationQueryVariables>
