// @ts-ignore
import * as Types from '../../../../../../__generated__/globalTypes'

import { gql } from '@apollo/client'
import { RevisionMstFragmentDoc } from '../../fragments/__generated__/revision.generated'
import { EndpointMstFragmentDoc } from '../../fragments/__generated__/endpoint.generated'
import { PageInfoMstFragmentDoc } from '../../fragments/__generated__/page-info.generated'
import * as Apollo from '@apollo/client'
const defaultOptions = {} as const
export type BranchRevisionMstFragment = {
  __typename?: 'RevisionModel'
  id: string
  createdAt: string
  comment: string
  endpoints: Array<{ __typename?: 'EndpointModel'; id: string; type: Types.EndpointType; createdAt: string }>
  parent?: { __typename?: 'RevisionModel'; id: string } | null
  child?: { __typename?: 'RevisionModel'; id: string } | null
  childBranches: Array<{
    __typename?: 'ChildBranchModel'
    branch: { __typename?: 'BranchModel'; id: string; name: string }
    revision: { __typename?: 'RevisionModel'; id: string }
  }>
}

export type RevisionsMstQueryVariables = Types.Exact<{
  branch: Types.GetBranchInput
  revisions: Types.GetBranchRevisionsInput
}>

export type RevisionsMstQuery = {
  __typename?: 'Query'
  branch: {
    __typename?: 'BranchModel'
    id: string
    revisions: {
      __typename?: 'RevisionConnection'
      totalCount: number
      pageInfo: {
        __typename?: 'PageInfo'
        startCursor?: string | null
        endCursor?: string | null
        hasPreviousPage: boolean
        hasNextPage: boolean
      }
      edges: Array<{
        __typename?: 'RevisionModelEdge'
        cursor: string
        node: {
          __typename?: 'RevisionModel'
          id: string
          createdAt: string
          comment: string
          endpoints: Array<{ __typename?: 'EndpointModel'; id: string; type: Types.EndpointType; createdAt: string }>
          parent?: { __typename?: 'RevisionModel'; id: string } | null
          child?: { __typename?: 'RevisionModel'; id: string } | null
          childBranches: Array<{
            __typename?: 'ChildBranchModel'
            branch: { __typename?: 'BranchModel'; id: string; name: string }
            revision: { __typename?: 'RevisionModel'; id: string }
          }>
        }
      }>
    }
  }
}

export const BranchRevisionMstFragmentDoc = gql`
  fragment BranchRevisionMst on RevisionModel {
    ...RevisionMst
    endpoints {
      ...EndpointMst
    }
  }
  ${RevisionMstFragmentDoc}
  ${EndpointMstFragmentDoc}
`
export const RevisionsMstDocument = gql`
  query RevisionsMst($branch: GetBranchInput!, $revisions: GetBranchRevisionsInput!) {
    branch(data: $branch) {
      id
      revisions(data: $revisions) {
        totalCount
        pageInfo {
          ...PageInfoMst
        }
        edges {
          cursor
          node {
            ...BranchRevisionMst
          }
        }
      }
    }
  }
  ${PageInfoMstFragmentDoc}
  ${BranchRevisionMstFragmentDoc}
`

/**
 * __useRevisionsMstQuery__
 *
 * To run a query within a React component, call `useRevisionsMstQuery` and pass it any options that fit your needs.
 * When your component renders, `useRevisionsMstQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRevisionsMstQuery({
 *   variables: {
 *      branch: // value for 'branch'
 *      revisions: // value for 'revisions'
 *   },
 * });
 */
export function useRevisionsMstQuery(
  baseOptions: Apollo.QueryHookOptions<RevisionsMstQuery, RevisionsMstQueryVariables> &
    ({ variables: RevisionsMstQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<RevisionsMstQuery, RevisionsMstQueryVariables>(RevisionsMstDocument, options)
}
export function useRevisionsMstLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<RevisionsMstQuery, RevisionsMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<RevisionsMstQuery, RevisionsMstQueryVariables>(RevisionsMstDocument, options)
}
export function useRevisionsMstSuspenseQuery(
  baseOptions?: Apollo.SuspenseQueryHookOptions<RevisionsMstQuery, RevisionsMstQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useSuspenseQuery<RevisionsMstQuery, RevisionsMstQueryVariables>(RevisionsMstDocument, options)
}
export type RevisionsMstQueryHookResult = ReturnType<typeof useRevisionsMstQuery>
export type RevisionsMstLazyQueryHookResult = ReturnType<typeof useRevisionsMstLazyQuery>
export type RevisionsMstSuspenseQueryHookResult = ReturnType<typeof useRevisionsMstSuspenseQuery>
export type RevisionsMstQueryResult = Apollo.QueryResult<RevisionsMstQuery, RevisionsMstQueryVariables>
