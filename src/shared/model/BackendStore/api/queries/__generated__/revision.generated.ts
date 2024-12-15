// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { RevisionMstFragmentDoc } from '../../fragments/__generated__/revision.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type RevisionMstQueryVariables = Types.Exact<{
  data: Types.GetRevisionInput
}>

export type RevisionMstQuery = {
  __typename?: 'Query'
  revision: {
    __typename?: 'RevisionModel'
    id: string
    createdAt: string
    comment: string
    branch: { __typename?: 'BranchModel'; id: string }
    parent?: { __typename?: 'RevisionModel'; id: string } | null
    child?: { __typename?: 'RevisionModel'; id: string } | null
    childBranches: Array<{
      __typename?: 'ChildBranchModel'
      branch: { __typename?: 'BranchModel'; id: string; name: string }
      revision: { __typename?: 'RevisionModel'; id: string }
    }>
    endpoints: Array<{ __typename?: 'EndpointModel'; id: string; type: Types.EndpointType; createdAt: string }>
  }
}

export const RevisionMstDocument = gql`
  query RevisionMst($data: GetRevisionInput!) {
    revision(data: $data) {
      ...RevisionMst
      branch {
        id
      }
    }
  }
  ${RevisionMstFragmentDoc}
`

/**
 * __useRevisionMstQuery__
 *
 * To run a query within a React component, call `useRevisionMstQuery` and pass it any options that fit your needs.
 * When your component renders, `useRevisionMstQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRevisionMstQuery({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRevisionMstQuery(
  baseOptions: Apollo.QueryHookOptions<RevisionMstQuery, RevisionMstQueryVariables> &
    ({ variables: RevisionMstQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<RevisionMstQuery, RevisionMstQueryVariables>(RevisionMstDocument, options)
}
export function useRevisionMstLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RevisionMstQuery, RevisionMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<RevisionMstQuery, RevisionMstQueryVariables>(RevisionMstDocument, options)
}
export function useRevisionMstSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<RevisionMstQuery, RevisionMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<RevisionMstQuery, RevisionMstQueryVariables>(RevisionMstDocument, options)
}
export type RevisionMstQueryHookResult = ReturnType<typeof useRevisionMstQuery>
export type RevisionMstLazyQueryHookResult = ReturnType<typeof useRevisionMstLazyQuery>
export type RevisionMstSuspenseQueryHookResult = ReturnType<typeof useRevisionMstSuspenseQuery>
export type RevisionMstQueryResult = Apollo.QueryResult<RevisionMstQuery, RevisionMstQueryVariables>
